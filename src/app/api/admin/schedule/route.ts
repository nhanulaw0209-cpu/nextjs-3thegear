import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const slots = await prisma.showSchedule.findMany({
    include: { event: { select: { id: true, title: true } } },
    orderBy: { date: "asc" },
  });
  return NextResponse.json(slots, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(req: Request) {
  const { date, startTime, endTime, status, eventId, location, notes } = await req.json();

  if (!date) return NextResponse.json({ error: "date is required" }, { status: 400 });

  const slot = await prisma.showSchedule.create({
    data: {
      date,
      startTime: startTime || null,
      endTime: endTime || null,
      status: status || "available",
      eventId: eventId || null,
      location: location || null,
      notes: notes || null,
    },
  });
  return NextResponse.json(slot, { status: 201 });
}
