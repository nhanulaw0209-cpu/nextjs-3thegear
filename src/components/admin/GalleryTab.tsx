"use client";

import { useEffect, useState, useCallback } from "react";
import { GalleryItem, GalleryCategory, Event } from "@/types/admin";
import MediaUploadField from "./MediaUploadField";

type GalleryItemWithEvent = GalleryItem & { event: { id: string; title: string } | null };

const CATEGORY_LABEL: Record<GalleryCategory, string> = {
  poster: "Poster",
  portrait: "Chân dung / thành viên",
  performance: "Biểu diễn sân khấu",
  video: "Video",
};

const EMPTY_FORM = { type: "photo" as "photo" | "video", url: "", caption: "", category: "performance" as GalleryCategory, eventId: "" };

export default function GalleryTab() {
  const [items, setItems] = useState<GalleryItemWithEvent[]>([]);
  const [events, setEvents] = useState<Pick<Event, "id" | "title">[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_FORM);

  const fetchAll = useCallback(async () => {
    const [galleryRes, eventsRes] = await Promise.all([
      fetch("/api/admin/gallery", { cache: "no-store" }),
      fetch("/api/admin/events", { cache: "no-store" }),
    ]);
    if (galleryRes.ok) setItems(await galleryRes.json());
    if (eventsRes.ok) setEvents(await eventsRes.json());
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.url) return;
    await fetch("/api/admin/gallery", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, eventId: form.eventId || null }),
    });
    setForm(EMPTY_FORM);
    fetchAll();
  }

  async function handleDelete(id: string) {
    if (!confirm("Xoá mục này khỏi gallery?")) return;
    await fetch(`/api/admin/gallery/${id}`, { method: "DELETE" });
    fetchAll();
  }

  async function handleCategoryChange(id: string, category: GalleryCategory) {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, category } : it)));
    await fetch(`/api/admin/gallery/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category }),
    });
  }

  if (loading) return <p className="text-sm text-text">Đang tải...</p>;

  return (
    <div className="space-y-6">
      <h1 className="font-jost text-2xl font-bold text-ink">Gallery</h1>

      <form onSubmit={handleSubmit} className="bg-white border border-border p-5 space-y-4 max-w-lg">
        <div className="flex gap-4">
          {(["photo", "video"] as const).map((t) => (
            <label key={t} className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                checked={form.type === t}
                onChange={() => setForm({ ...form, type: t, url: "" })}
              />
              {t === "photo" ? "Ảnh" : "Video"}
            </label>
          ))}
        </div>

        <MediaUploadField
          label={form.type === "photo" ? "Ảnh" : "Video"}
          value={form.url}
          mediaType={form.type}
          category="gallery"
          onChange={(url) => setForm({ ...form, url })}
        />

        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold uppercase tracking-wide text-ink">Loại ảnh</label>
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value as GalleryCategory })}
            className="border border-border px-3 py-2 text-sm"
          >
            {(Object.keys(CATEGORY_LABEL) as GalleryCategory[]).map((c) => (
              <option key={c} value={c}>
                {CATEGORY_LABEL[c]}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold uppercase tracking-wide text-ink">Chú thích (tuỳ chọn)</label>
          <input
            value={form.caption}
            onChange={(e) => setForm({ ...form, caption: e.target.value })}
            className="border border-border px-3 py-2 text-sm"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold uppercase tracking-wide text-ink">Thuộc dịch vụ (tuỳ chọn)</label>
          <select
            value={form.eventId}
            onChange={(e) => setForm({ ...form, eventId: e.target.value })}
            className="border border-border px-3 py-2 text-sm"
          >
            <option value="">Gallery chung (không gắn dịch vụ)</option>
            {events.map((ev) => (
              <option key={ev.id} value={ev.id}>
                {ev.title}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="px-4 py-2 text-xs font-bold uppercase tracking-wide bg-ink text-white hover:bg-red transition-colors"
        >
          + Thêm vào Gallery
        </button>
      </form>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {items.length === 0 && <p className="col-span-full text-sm text-text">Chưa có ảnh/video nào.</p>}
        {items.map((item) => (
          <div key={item.id} className="relative group border border-border rounded-xl overflow-hidden bg-white">
            {item.type === "video" ? (
              <video src={item.url} className="w-full aspect-square object-cover" muted />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={item.url} alt={item.caption ?? ""} className="w-full aspect-square object-cover" />
            )}
            <div className="p-2 space-y-1.5">
              <div className="text-xs text-ink truncate">{item.caption || "-"}</div>
              <div className="text-[10px] text-red font-semibold uppercase truncate">
                {item.event ? item.event.title : "Gallery chung"}
              </div>
              <select
                value={item.category}
                onChange={(e) => handleCategoryChange(item.id, e.target.value as GalleryCategory)}
                className="w-full border border-border rounded px-1.5 py-1 text-[11px]"
              >
                {(Object.keys(CATEGORY_LABEL) as GalleryCategory[]).map((c) => (
                  <option key={c} value={c}>
                    {CATEGORY_LABEL[c]}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={() => handleDelete(item.id)}
              className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/60 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
