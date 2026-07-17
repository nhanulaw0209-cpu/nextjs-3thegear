import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Public read: bank/QR info shown on the booking payment screen.
export async function GET() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: "singleton" } });
  return NextResponse.json(settings, { headers: { "Cache-Control": "no-store" } });
}
