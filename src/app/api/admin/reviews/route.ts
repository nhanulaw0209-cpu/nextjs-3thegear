import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const reviews = await prisma.review.findMany({ orderBy: { sortOrder: "asc" } });
  return NextResponse.json(reviews, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(req: Request) {
  const { customerName, quote, rating, eventType, avatarUrl, sortOrder } = await req.json();

  if (!customerName || !quote) {
    return NextResponse.json({ error: "customerName and quote are required" }, { status: 400 });
  }

  const review = await prisma.review.create({
    data: {
      customerName,
      quote,
      rating: rating ?? 5,
      eventType: eventType || null,
      avatarUrl: avatarUrl || null,
      sortOrder: sortOrder ?? 0,
    },
  });
  return NextResponse.json(review, { status: 201 });
}

export async function PATCH(req: Request) {
  const { id, ...data } = await req.json();
  if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });

  const review = await prisma.review.update({ where: { id }, data });
  return NextResponse.json(review);
}

export async function DELETE(req: Request) {
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });

  await prisma.review.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
