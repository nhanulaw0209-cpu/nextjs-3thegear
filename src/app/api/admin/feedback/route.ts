import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const feedback = await prisma.negativeFeedback.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(feedback, { headers: { "Cache-Control": "no-store" } });
}

export async function PATCH(req: Request) {
  const { id, resolved } = await req.json();
  if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });

  const feedback = await prisma.negativeFeedback.update({ where: { id }, data: { resolved } });
  return NextResponse.json(feedback);
}

export async function DELETE(req: Request) {
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });

  await prisma.negativeFeedback.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
