import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const { status } = await req.json();

  if (!["confirmed", "cancelled"].includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const booking = await prisma.booking.findUnique({
    where: { id: params.id },
    include: { scheduleSlot: true },
  });
  if (!booking) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const updated = await prisma.$transaction(async (tx) => {
    const b = await tx.booking.update({ where: { id: params.id }, data: { status } });

    if (booking.scheduleSlot) {
      if (status === "confirmed") {
        await tx.showSchedule.update({ where: { id: booking.scheduleSlot.id }, data: { status: "booked" } });
      } else {
        // Cancelling frees the slot back up for other bookings.
        await tx.showSchedule.update({
          where: { id: booking.scheduleSlot.id },
          data: { status: "available", bookingId: null },
        });
      }
    }

    return b;
  });

  return NextResponse.json(updated);
}
