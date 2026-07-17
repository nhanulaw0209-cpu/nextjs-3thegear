import { prisma } from "@/lib/prisma";
import GalleryPageClient from "./GalleryPageClient";

export const dynamic = "force-dynamic";

// Pure media wall — all photos/videos regardless of event, no grouping or booking links.
export default async function GalleryPage() {
  const items = await prisma.galleryItem.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });

  return <GalleryPageClient items={items} />;
}
