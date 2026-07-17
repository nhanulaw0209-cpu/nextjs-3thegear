import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const bookings = await prisma.booking.findMany({
    include: { event: { select: { title: true, slug: true } }, lineItems: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(bookings, { headers: { "Cache-Control": "no-store" } });
}
