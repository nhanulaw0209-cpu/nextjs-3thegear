import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import BookingDetailClient from "./BookingDetailClient";

export default async function BookingPage({ params }: { params: { id: string } }) {
  const booking = await prisma.booking.findUnique({
    where: { id: params.id },
    include: { event: { select: { title: true, slug: true } }, lineItems: true },
  });

  if (!booking) notFound();

  const settings = await prisma.siteSettings.findUnique({ where: { id: "singleton" } });

  return <BookingDetailClient booking={booking} settings={settings} />;
}
