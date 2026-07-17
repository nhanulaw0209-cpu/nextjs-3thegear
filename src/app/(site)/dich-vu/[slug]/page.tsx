import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { SERVICE_PAGES } from "@/data/services-content";
import ServiceDetailClient from "./ServiceDetailClient";

export const dynamic = "force-dynamic";

export default async function ServiceGroupPage({ params }: { params: { slug: string } }) {
  if (params.slug === "event") {
    const events = await prisma.event.findMany({
      where: { isPublished: true },
      select: { id: true, slug: true, title: true, summary: true, heroImageUrl: true },
      orderBy: { createdAt: "asc" },
    });

    return <ServiceDetailClient variant="event" events={events} />;
  }

  const page = SERVICE_PAGES.find((p) => p.slug === params.slug);
  if (!page) notFound();

  return <ServiceDetailClient variant="service" page={page} />;
}
