import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Public read: global gallery items (not scoped to a specific event), shown
// alongside Featured Events on the homepage. Event-specific media lives on
// that event's own page instead.
export async function GET() {
  const items = await prisma.galleryItem.findMany({
    where: { eventId: null },
    orderBy: { sortOrder: "asc" },
  });
  return NextResponse.json(items, { headers: { "Cache-Control": "no-store" } });
}
