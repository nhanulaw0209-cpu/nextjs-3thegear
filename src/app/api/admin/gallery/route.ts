import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const items = await prisma.galleryItem.findMany({
    include: { event: { select: { id: true, title: true } } },
    orderBy: [{ eventId: "asc" }, { sortOrder: "asc" }],
  });
  return NextResponse.json(items, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(req: Request) {
  const { type, url, caption, category, eventId, sortOrder } = await req.json();

  if (!type || !url) {
    return NextResponse.json({ error: "type and url are required" }, { status: 400 });
  }

  const item = await prisma.galleryItem.create({
    data: {
      type,
      url,
      caption: caption || null,
      category: category || "performance",
      eventId: eventId || null,
      sortOrder: sortOrder ?? 0,
    },
  });
  return NextResponse.json(item, { status: 201 });
}
