import { prisma } from "@/lib/prisma";
import AboutPageClient from "./AboutPageClient";

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: "singleton" } });
  const ownerPhotoUrl = settings?.ownerPhotoUrl ?? null;

  const galleryPhotos = await prisma.galleryItem.findMany({
    where: { category: "portrait", eventId: null },
    orderBy: { sortOrder: "asc" },
    take: 4,
  });

  return <AboutPageClient ownerPhotoUrl={ownerPhotoUrl} galleryPhotos={galleryPhotos} />;
}
