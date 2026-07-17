import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const partners = await prisma.partner.findMany({ orderBy: { sortOrder: "asc" } });
  return NextResponse.json(partners, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(req: Request) {
  const { name, logoUrl, linkUrl, sinceYear, sortOrder } = await req.json();

  if (!name || !logoUrl) {
    return NextResponse.json({ error: "name and logoUrl are required" }, { status: 400 });
  }

  const partner = await prisma.partner.create({
    data: { name, logoUrl, linkUrl: linkUrl || null, sinceYear: sinceYear || null, sortOrder: sortOrder ?? 0 },
  });
  return NextResponse.json(partner, { status: 201 });
}

export async function PATCH(req: Request) {
  const { id, ...data } = await req.json();
  if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });

  const partner = await prisma.partner.update({ where: { id }, data });
  return NextResponse.json(partner);
}

export async function DELETE(req: Request) {
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });

  await prisma.partner.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
