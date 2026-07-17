import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request, { params }: { params: { itemId: string } }) {
  const data = await req.json();
  const item = await prisma.eventListBuyItem.update({ where: { id: params.itemId }, data });
  return NextResponse.json(item);
}

export async function DELETE(_req: Request, { params }: { params: { itemId: string } }) {
  try {
    await prisma.eventListBuyItem.delete({ where: { id: params.itemId } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Không thể xoá: gói này đã có trong một booking. Hãy chuyển sang 'Ẩn' thay vì xoá." },
      { status: 409 }
    );
  }
}
