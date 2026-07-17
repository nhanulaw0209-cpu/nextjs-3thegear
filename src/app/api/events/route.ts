import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Public read: published events only, for the homepage "Sự Kiện Nổi Bật" section.
export async function GET() {
  const events = await prisma.event.findMany({
    where: { isPublished: true },
    select: { id: true, slug: true, title: true, summary: true, heroImageUrl: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(events, { headers: { "Cache-Control": "no-store" } });
}
