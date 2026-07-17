import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const event = await prisma.event.findUnique({
    where: { id: params.id },
    include: {
      listBuyItems: { orderBy: { sortOrder: "asc" } },
      setlistItems: { orderBy: { sortOrder: "asc" } },
      galleryItems: true,
    },
  });
  if (!event) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(event, { headers: { "Cache-Control": "no-store" } });
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const data = await req.json();
  const event = await prisma.event.update({ where: { id: params.id }, data });
  return NextResponse.json(event);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.event.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Không thể xoá: sự kiện này còn ListBuy, lịch show hoặc booking liên quan. Hãy xoá các mục đó trước, hoặc chuyển sang 'Ẩn' thay vì xoá." },
      { status: 409 }
    );
  }
}
