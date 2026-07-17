import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const [eventCount, pendingBookingCount, scheduleCount] = await Promise.all([
    prisma.event.count(),
    prisma.booking.count({ where: { status: { in: ["pending_payment", "payment_submitted"] } } }),
    prisma.showSchedule.count(),
  ]);

  return NextResponse.json(
    { eventCount, pendingBookingCount, scheduleCount },
    { headers: { "Cache-Control": "no-store" } }
  );
}
