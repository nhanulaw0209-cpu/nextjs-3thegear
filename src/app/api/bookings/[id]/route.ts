import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const booking = await prisma.booking.findUnique({
    where: { id: params.id },
    include: { event: { select: { title: true, slug: true } }, lineItems: true },
  });
  if (!booking) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(booking, { headers: { "Cache-Control": "no-store" } });
}

// Customer-facing action: mark that they've made the bank transfer.
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const { action } = await req.json();

  if (action !== "mark_transferred") {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  const booking = await prisma.booking.findUnique({ where: { id: params.id } });
  if (!booking) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (booking.status !== "pending_payment") {
    return NextResponse.json({ error: "Booking đã được xử lý" }, { status: 409 });
  }

  const updated = await prisma.booking.update({
    where: { id: params.id },
    data: { status: "payment_submitted" },
  });
  return NextResponse.json(updated);
}
