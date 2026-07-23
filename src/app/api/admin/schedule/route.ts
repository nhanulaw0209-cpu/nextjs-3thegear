import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cleanServices } from "@/lib/schedule-helpers";

export const dynamic = "force-dynamic";

const SLOT_INCLUDE = {
  event: { select: { id: true, title: true } },
  services: {
    include: { event: { select: { id: true, title: true } } },
    orderBy: { sortOrder: "asc" as const },
  },
};

export async function GET() {
  const slots = await prisma.showSchedule.findMany({
    include: SLOT_INCLUDE,
    orderBy: { date: "asc" },
  });
  // Làm phẳng services -> { id, title, price, note } để calendar dùng trực tiếp.
  const mapped = slots.map((s) => ({
    ...s,
    services: s.services.map((x) => ({ id: x.id, title: x.event.title, price: x.price, note: x.note })),
  }));
  return NextResponse.json(mapped, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(req: Request) {
  const { date, startTime, endTime, status, eventId, location, notes, services } = await req.json();

  if (!date) return NextResponse.json({ error: "date is required" }, { status: 400 });

  const svc = cleanServices(services);
  // "Dịch vụ chính" = eventId truyền vào, hoặc dịch vụ đầu tiên trong danh sách.
  const primaryEventId = eventId || svc[0]?.eventId || null;

  const slot = await prisma.showSchedule.create({
    data: {
      date,
      startTime: startTime || null,
      endTime: endTime || null,
      status: status || "available",
      eventId: primaryEventId,
      location: location || null,
      notes: notes || null,
      services: { create: svc },
    },
    include: SLOT_INCLUDE,
  });
  return NextResponse.json(slot, { status: 201 });
}
