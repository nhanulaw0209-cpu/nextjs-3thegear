import { prisma } from "@/lib/prisma";
import HomeClient from "@/components/site/HomeClient";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: "singleton" } });
  return <HomeClient qrImageUrl={settings?.qrImageUrl ?? null} />;
}
