import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const data = await req.json();
  const slot = await prisma.showSchedule.update({ where: { id: params.id }, data });
  return NextResponse.json(slot);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  await prisma.showSchedule.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
