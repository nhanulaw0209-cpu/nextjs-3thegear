import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { SERVICE_PAGES } from "@/data/services-content";
import ServiceDetailClient from "./ServiceDetailClient";

export const dynamic = "force-dynamic";

// Event slugs that redirect into a SERVICE_PAGES group page instead of
// getting their own card in the "3TG Event" listing below — see
// `bookableEventSlug` / `mergedEventSlugs` on the matching ServicePage in
// services-content.ts.
const MERGED_EVENT_SLUGS = SERVICE_PAGES.flatMap((p) => [p.bookableEventSlug, ...(p.mergedEventSlugs ?? [])]).filter(
  (s): s is string => !!s
);

export default async function ServiceGroupPage({ params }: { params: { slug: string } }) {
  if (params.slug === "event") {
    const events = await prisma.event.findMany({
      where: { isPublished: true, slug: { notIn: MERGED_EVENT_SLUGS } },
      select: { id: true, slug: true, title: true, summary: true, heroImageUrl: true },
      orderBy: { createdAt: "asc" },
    });

    return <ServiceDetailClient variant="event" events={events} />;
  }

  const page = SERVICE_PAGES.find((p) => p.slug === params.slug);
  if (!page) notFound();

  const bookableEvent = page.bookableEventSlug
    ? await prisma.event.findUnique({
        where: { slug: page.bookableEventSlug },
        select: {
          id: true,
          description: true,
          listBuyItems: { where: { isActive: true }, orderBy: { sortOrder: "asc" }, select: { id: true, name: true, price: true } },
          setlistItems: { orderBy: { sortOrder: "asc" }, select: { title: true, artist: true } },
        },
      })
    : null;

  const mergedEvents = page.mergedEventSlugs?.length
    ? await prisma.event.findMany({
        where: { slug: { in: page.mergedEventSlugs } },
        select: { description: true },
      })
    : [];
  const extraDescriptions = mergedEvents.map((e) => e.description).filter((d): d is string => !!d);

  return <ServiceDetailClient variant="service" page={page} bookableEvent={bookableEvent} extraDescriptions={extraDescriptions} />;
}
