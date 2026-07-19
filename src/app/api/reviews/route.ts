import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Public read: active reviews only, for the reviews page.
export async function GET() {
  const reviews = await prisma.review.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });
  return NextResponse.json(reviews, { headers: { "Cache-Control": "no-store" } });
}

// Public write: customers submit their own review from the site. Created
// inactive so it stays hidden until an admin approves it via Admin → Đánh Giá
// (same moderation pattern as booking payment confirmation).
export async function POST(req: Request) {
  const { customerName, quote, rating, eventType } = await req.json();

  if (!customerName || !quote) {
    return NextResponse.json({ error: "customerName and quote are required" }, { status: 400 });
  }
  if (customerName.length > 100 || quote.length > 1000 || (eventType && eventType.length > 100)) {
    return NextResponse.json({ error: "Field too long" }, { status: 400 });
  }

  const safeRating = Math.min(5, Math.max(1, Math.round(Number(rating) || 5)));

  const review = await prisma.review.create({
    data: {
      customerName: customerName.trim(),
      quote: quote.trim(),
      rating: safeRating,
      eventType: eventType?.trim() || null,
      isActive: false,
    },
  });
  return NextResponse.json(review, { status: 201 });
}
