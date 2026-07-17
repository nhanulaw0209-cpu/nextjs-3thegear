import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Public read: active partners only, for the homepage grid.
export async function GET() {
  const partners = await prisma.partner.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });
  return NextResponse.json(partners, { headers: { "Cache-Control": "no-store" } });
}
