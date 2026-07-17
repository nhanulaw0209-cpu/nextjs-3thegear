import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function getSettings() {
  const existing = await prisma.siteSettings.findUnique({ where: { id: "singleton" } });
  if (existing) return existing;
  return prisma.siteSettings.create({ data: { id: "singleton" } });
}

export async function GET() {
  const settings = await getSettings();
  return NextResponse.json(settings, { headers: { "Cache-Control": "no-store" } });
}

export async function PATCH(req: Request) {
  const data = await req.json();
  await getSettings();
  const settings = await prisma.siteSettings.update({ where: { id: "singleton" }, data });
  return NextResponse.json(settings);
}
