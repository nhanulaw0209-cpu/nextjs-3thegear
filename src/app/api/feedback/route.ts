import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// 1-3 star branch of the /danh-gia review gate. Never surfaced publicly —
// admin sees it in Admin → Góp Ý and follows up with the customer directly.
export async function POST(req: Request) {
  const { customerName, rating, comment, eventType } = await req.json();

  if (!rating || !comment) {
    return NextResponse.json({ error: "rating and comment are required" }, { status: 400 });
  }
  if (rating < 1 || rating > 3) {
    return NextResponse.json({ error: "Invalid rating for feedback" }, { status: 400 });
  }
  if (comment.trim().length < 5) {
    return NextResponse.json({ error: "Comment too short" }, { status: 400 });
  }
  if (comment.length > 1000 || (eventType && eventType.length > 100)) {
    return NextResponse.json({ error: "Field too long" }, { status: 400 });
  }

  const feedback = await prisma.negativeFeedback.create({
    data: {
      customerName: customerName?.trim() || "Khách",
      rating: Number(rating),
      comment: comment.trim(),
      eventType: eventType?.trim() || null,
    },
  });

  return NextResponse.json(feedback, { status: 201 });
}
