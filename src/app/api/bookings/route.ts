import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isValidShowSlot, timeToMinutes, minutesToTime, SHOW_SLOT_STEP_MINUTES } from "@/lib/timeSlots";
import { getMailer, FROM_EMAIL, NOTIFY_EMAIL } from "@/lib/mailer";
import { bookingNotificationEmailHtml } from "@/lib/emailTemplates";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const BLOCKING_STATUSES = ["booked", "pending"];

export async function POST(req: Request) {
  const body = await req.json();
  const {
    eventId,
    customerName,
    customerPhone,
    customerEmail,
    eventDate,
    eventTime,
    guestCount,
    notes,
    items,
  }: {
    eventId: string;
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    eventDate: string;
    eventTime: string;
    guestCount?: number;
    notes?: string;
    items: { listBuyItemId: string; quantity: number }[];
  } = body;

  if (!eventId || !customerName || !customerPhone || !eventDate || !DATE_RE.test(eventDate)) {
    return NextResponse.json({ error: "Thiếu thông tin bắt buộc hoặc ngày không hợp lệ" }, { status: 400 });
  }
  if (!eventTime || !isValidShowSlot(eventTime)) {
    return NextResponse.json({ error: "Vui lòng chọn khung giờ hợp lệ" }, { status: 400 });
  }
  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: "Vui lòng chọn ít nhất một gói dịch vụ" }, { status: 400 });
  }

  const event = await prisma.event.findUnique({ where: { id: eventId } });
  if (!event || !event.isPublished) {
    return NextResponse.json({ error: "Sự kiện không tồn tại" }, { status: 404 });
  }

  const listBuyItems = await prisma.eventListBuyItem.findMany({
    where: { id: { in: items.map((i) => i.listBuyItemId) }, eventId, isActive: true },
  });
  if (listBuyItems.length !== items.length) {
    return NextResponse.json({ error: "Một hoặc nhiều gói dịch vụ không hợp lệ" }, { status: 400 });
  }

  // Band-wide check: the band can only play one show per date+time slot, regardless
  // of which service category (event) it's booked under. A slot with no startTime
  // represents the whole day blocked (e.g. an admin-created hold), which also conflicts.
  const conflict = await prisma.showSchedule.findFirst({
    where: {
      date: eventDate,
      status: { in: BLOCKING_STATUSES },
      OR: [{ startTime: eventTime }, { startTime: null }],
    },
  });
  if (conflict) {
    return NextResponse.json({ error: "Khung giờ này đã được đặt hoặc đang chờ xác nhận" }, { status: 409 });
  }

  const existingSlot = await prisma.showSchedule.findFirst({ where: { date: eventDate, startTime: eventTime } });
  const endTime = minutesToTime(timeToMinutes(eventTime) + SHOW_SLOT_STEP_MINUTES);

  const lineItemsData = items.map((i) => {
    const item = listBuyItems.find((li) => li.id === i.listBuyItemId)!;
    const quantity = Math.max(1, i.quantity || 1);
    return {
      listBuyItemId: item.id,
      name: item.name,
      price: item.price,
      quantity,
      subtotal: item.price * quantity,
    };
  });
  const total = lineItemsData.reduce((sum, li) => sum + li.subtotal, 0);

  const booking = await prisma.$transaction(async (tx) => {
    const bookingNumber = (await tx.booking.count()) + 1;

    const created = await tx.booking.create({
      data: {
        bookingNumber,
        eventId,
        customerName,
        customerPhone,
        customerEmail: customerEmail || null,
        eventDate,
        eventTime,
        guestCount: guestCount || null,
        notes: notes || null,
        total,
        lineItems: {
          create: lineItemsData.map(({ listBuyItemId, name, price, quantity }) => ({
            listBuyItemId,
            name,
            price,
            quantity,
          })),
        },
      },
    });

    if (existingSlot) {
      await tx.showSchedule.update({
        where: { id: existingSlot.id },
        data: { status: "pending", bookingId: created.id, eventId, endTime },
      });
    } else {
      await tx.showSchedule.create({
        data: { date: eventDate, startTime: eventTime, endTime, status: "pending", eventId, bookingId: created.id },
      });
    }

    return created;
  });

  try {
    await getMailer().sendMail({
      from: FROM_EMAIL,
      to: NOTIFY_EMAIL,
      subject: `Booking mới #${booking.bookingNumber} — ${event.title}`,
      html: bookingNotificationEmailHtml({
        bookingNumber: booking.bookingNumber,
        eventTitle: event.title,
        customerName,
        customerPhone,
        customerEmail,
        eventDate,
        eventTime,
        guestCount,
        notes,
        total,
        lineItems: lineItemsData,
      }),
    });
  } catch (err) {
    console.error("Booking notification email failed:", err);
  }

  return NextResponse.json({ id: booking.id }, { status: 201 });
}
