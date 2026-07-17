import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const { title, artist, sortOrder } = await req.json();

  if (!title) {
    return NextResponse.json({ error: "title is required" }, { status: 400 });
  }

  const item = await prisma.setlistItem.create({
    data: {
      eventId: params.id,
      title,
      artist: artist || null,
      sortOrder: sortOrder ?? 0,
    },
  });
  return NextResponse.json(item, { status: 201 });
}
