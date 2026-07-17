import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const events = await prisma.event.findMany({
    include: {
      listBuyItems: { orderBy: { sortOrder: "asc" } },
      setlistItems: { orderBy: { sortOrder: "asc" } },
    },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(events, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(req: Request) {
  const { slug, title, summary, description, heroImageUrl, showDuration, isPublished } = await req.json();

  if (!slug || !title) {
    return NextResponse.json({ error: "slug and title are required" }, { status: 400 });
  }

  const existing = await prisma.event.findUnique({ where: { slug } });
  if (existing) {
    return NextResponse.json({ error: "Slug already in use" }, { status: 409 });
  }

  const event = await prisma.event.create({
    data: {
      slug,
      title,
      summary: summary || null,
      description: description || null,
      heroImageUrl: heroImageUrl || null,
      showDuration: showDuration || null,
      isPublished: isPublished ?? true,
    },
  });
  return NextResponse.json(event, { status: 201 });
}
