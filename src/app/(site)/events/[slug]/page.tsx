import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { SERVICE_PAGES } from "@/data/services-content";
import EventDetailClient from "./EventDetailClient";

export default async function EventPage({ params }: { params: { slug: string } }) {
  // Events that now live inside their SERVICE_PAGES group page directly
  // (see bookableEventSlug / mergedEventSlugs in services-content.ts)
  // redirect there instead of rendering a separate, duplicate /events/[slug] page.
  const servicePage = SERVICE_PAGES.find(
    (p) => p.bookableEventSlug === params.slug || p.mergedEventSlugs?.includes(params.slug)
  );
  if (servicePage) redirect(`/dich-vu/${servicePage.slug}`);

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
