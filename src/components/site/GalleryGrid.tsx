"use client";

import { useState } from "react";
import { LightboxProvider, useLightbox } from "@/lib/lightbox-context";
import { useLang } from "@/lib/lang-context";

export interface GalleryGridItem {
  id: string;
  type: string;
  url: string;
  caption: string | null;
  category?: string;
}

function useCategoryColumns(): { key: "poster" | "portrait" | "performance" | "video"; label: string }[] {
  const { t } = useLang();
  return [
    { key: "poster", label: "Poster" },
    { key: "portrait", label: "Band" },
    { key: "performance", label: t("categoryStage") },
    { key: "video", label: "Video" },
  ];
}

// Video thumbnails are pre-extracted as a same-name .jpg next to the .mp4
// (see scripts run during upload) — far more reliable than relying on the
// browser to paint a <video> frame at preload="metadata".
function videoThumb(url: string) {
  return url.replace(/\.mp4$/i, ".jpg");
}

export default function GalleryGrid({ items, grouped = false }: { items: GalleryGridItem[]; grouped?: boolean }) {
  if (items.length === 0) return null;

  if (grouped) return <GroupedGallery items={items} />;

  return (
    <LightboxProvider>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {items.map((item) => (
          <GalleryTile key={item.id} item={item} />
        ))}
      </div>
    </LightboxProvider>
  );
}

function GroupedGallery({ items }: { items: GalleryGridItem[] }) {
  const { t } = useLang();
  const CATEGORY_COLUMNS = useCategoryColumns();
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const activeCol = CATEGORY_COLUMNS.find((c) => c.key === openCategory);
  const activeItems = activeCol ? items.filter((it) => (it.category ?? "performance") === activeCol.key) : [];

  return (
    <LightboxProvider>
      <div className="grid grid-cols-2 gap-4 max-w-[840px] mx-auto">
        {CATEGORY_COLUMNS.map((col) => {
          const colItems = items.filter((it) => (it.category ?? "performance") === col.key);
          if (colItems.length === 0) return null;
          const cover = colItems[0];
          return (
            <button
              key={col.key}
              type="button"
              onClick={() => setOpenCategory(col.key)}
              className="group relative w-full aspect-square overflow-hidden rounded-2xl bg-cream text-left"
            >
              {cover.type === "video" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={videoThumb(cover.url)}
                  alt={col.label}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={cover.url}
                  alt={col.label}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <div className="font-jost text-lg font-bold text-white leading-tight">{col.label}</div>
                <div className="text-base text-white/70 mt-0.5">{colItems.length} {t("itemsUnit")}</div>
              </div>
            </button>
          );
        })}
      </div>

      {activeCol && (
        <div
          className="fixed inset-0 z-[900] bg-black/95 overflow-y-auto p-6 sm:p-10"
          onClick={() => setOpenCategory(null)}
        >
          <div className="max-w-[1100px] mx-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-jost text-2xl font-bold text-white">
                {activeCol.label}
              </h2>
              <button
                type="button"
                aria-label={t("closeLabel")}
                onClick={() => setOpenCategory(null)}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-white/10 text-xl text-white hover:bg-white/20"
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {activeItems.map((item) => (
                <GalleryTile key={item.id} item={item} />
              ))}
            </div>
          </div>
        </div>
      )}
    </LightboxProvider>
  );
}

function GalleryTile({ item }: { item: GalleryGridItem }) {
  const { open } = useLightbox();

  if (item.type === "video") {
    return (
      <button
        type="button"
        onClick={() => open(item.url, item.caption ?? "", "video")}
        className="group relative w-full aspect-square overflow-hidden rounded-2xl bg-black cursor-pointer"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={videoThumb(item.url)}
          alt={item.caption ?? ""}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/25 group-hover:bg-black/40 transition-colors">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-ink text-xl">▶</span>
        </div>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => open(item.url, item.caption ?? "")}
      className="group relative w-full aspect-square overflow-hidden rounded-2xl bg-cream cursor-zoom-in"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={item.url}
        alt={item.caption ?? ""}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
      />
    </button>
  );
}
