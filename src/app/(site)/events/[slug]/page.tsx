import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import EventDetailClient from "./EventDetailClient";

export default async function EventPage({ params }: { params: { slug: string } }) {
  const event = await prisma.event.findUnique({
    where: { slug: params.slug },
    include: {
      listBuyItems: { where: { isActive: true }, orderBy: { sortOrder: "asc" } },
      setlistItems: { orderBy: { sortOrder: "asc" } },
      galleryItems: { orderBy: { sortOrder: "asc" } },
    },
  });

  if (!event || !event.isPublished) notFound();

  return <EventDetailClient event={event} />;
}
