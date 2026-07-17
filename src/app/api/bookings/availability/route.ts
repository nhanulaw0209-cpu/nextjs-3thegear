import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateShowSlots } from "@/lib/timeSlots";

export const dynamic = "force-dynamic";

const BLOCKING_STATUSES = ["booked", "pending"];

// GET /api/bookings/availability?date=YYYY-MM-DD
// Returns which of the fixed daily show slots are still free, band-wide
// (the band can only play one show per slot, regardless of service category).
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");
  if (!date) {
    return NextResponse.json({ error: "date is required" }, { status: 400 });
  }

  const takenSlots = await prisma.showSchedule.findMany({
    where: { date, status: { in: BLOCKING_STATUSES }, startTime: { not: null } },
    select: { startTime: true },
  });
  const taken = new Set(takenSlots.map((s) => s.startTime));

  const slots = generateShowSlots().map((time) => ({ time, available: !taken.has(time) }));

  return NextResponse.json({ date, slots }, { headers: { "Cache-Control": "no-store" } });
}
