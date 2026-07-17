import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const { name, description, price, sortOrder } = await req.json();

  if (!name || price == null) {
    return NextResponse.json({ error: "name and price are required" }, { status: 400 });
  }

  const item = await prisma.eventListBuyItem.create({
    data: {
      eventId: params.id,
      name,
      description: description || null,
      price,
      sortOrder: sortOrder ?? 0,
    },
  });
  return NextResponse.json(item, { status: 201 });
}
