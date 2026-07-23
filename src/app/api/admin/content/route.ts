import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const rows = await prisma.contentOverride.findMany();
  return NextResponse.json(rows, { headers: { "Cache-Control": "no-store" } });
}
