import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const LANGS = ["vi", "en", "ru", "zh", "ko"] as const;

export async function PATCH(req: Request, { params }: { params: { key: string } }) {
  const body = await req.json();
  const data: Record<string, string | null> = {};
  for (const lang of LANGS) {
    if (lang in body) data[lang] = body[lang] || null;
  }

  const row = await prisma.contentOverride.upsert({
    where: { key: params.key },
    create: { key: params.key, ...data },
    update: data,
  });
  return NextResponse.json(row);
}

export async function DELETE(_req: Request, { params }: { params: { key: string } }) {
  await prisma.contentOverride.deleteMany({ where: { key: params.key } });
  return NextResponse.json({ ok: true });
}
