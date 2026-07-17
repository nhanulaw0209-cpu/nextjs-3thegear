import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Public read-only calendar feed. Excludes internal notes.
export async function GET() {
  const slots = await prisma.showSchedule.findMany({
    include: { event: { select: { id: true, title: true, slug: true } } },
    orderBy: { date: "asc" },
  });

  const publicSlots = slots.map((s) => ({
    id: s.id,
    date: s.date,
    startTime: s.startTime,
    endTime: s.endTime,
    status: s.status,
    location: s.location,
    event: s.event,
  }));

  return NextResponse.json(publicSlots, { headers: { "Cache-Control": "no-store" } });
}
