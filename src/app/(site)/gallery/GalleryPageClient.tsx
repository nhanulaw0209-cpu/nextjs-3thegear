"use client";

import { useLang } from "@/lib/lang-context";
import GalleryGrid, { GalleryGridItem } from "@/components/site/GalleryGrid";

export default function GalleryPageClient({ items }: { items: GalleryGridItem[] }) {
  const { t } = useLang();

  return (
    <main className="min-h-screen bg-ink">
      <div className="max-w-[1280px] mx-auto px-6 pt-36 pb-12 sm:pt-24">
        <h1 className="font-jost text-3xl font-bold text-white mb-8">
          {t("navGallery")}
        </h1>
        {items.length === 0 ? (
          <p className="text-lg text-white/70">{t("galleryEmptyLabel")}</p>
        ) : (
          <GalleryGrid items={items} grouped />
        )}
      </div>
    </main>
  );
}
