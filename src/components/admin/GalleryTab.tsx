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

// `webkitdirectory` enables folder selection in the file picker but isn't part
// of React's input prop types, so it's applied via a typed prop bag instead of `any`.
const folderInputProps: Record<string, string> = { webkitdirectory: "", directory: "" };

export default function GalleryTab() {
  const [items, setItems] = useState<GalleryItemWithEvent[]>([]);
  const [events, setEvents] = useState<Pick<Event, "id" | "title">[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_FORM);
  const [batchUploading, setBatchUploading] = useState(false);
  const [batchError, setBatchError] = useState("");

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

  // Uploads several photos/videos at once (same category/event as picked in
  // the form above), one gallery item per file — for events where a whole
  // batch of media from one shoot needs adding together instead of one at a
  // time. Also used for whole-folder selection, which can't be filtered by
  // the file picker's `accept` attribute, so non-media files are filtered here.
  async function handleBatchUpload(fileList: FileList) {
    setBatchUploading(true);
    setBatchError("");
    const errors: string[] = [];
    try {
      const files = Array.from(fileList);
      const mediaFiles = files.filter((f) => f.type.startsWith("image/") || f.type.startsWith("video/"));
      const skipped = files.length - mediaFiles.length;
      if (skipped > 0) errors.push(`Đã bỏ qua ${skipped} file không phải ảnh/video`);

      for (const file of mediaFiles) {
        const isVideo = file.type.startsWith("video/");
        const formData = new FormData();
        formData.append("file", file);
        formData.append("category", "gallery");
        const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) {
          errors.push(`${file.name}: ${uploadData.error || "Upload thất bại"}`);
          continue;
        }
        await fetch("/api/admin/gallery", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: isVideo ? "video" : "photo",
            url: uploadData.url,
            category: form.category,
            eventId: form.eventId || null,
          }),
        });
      }
    } finally {
      setBatchUploading(false);
      if (errors.length > 0) setBatchError(errors.join(" · "));
      fetchAll();
    }
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

  function handleCaptionInput(id: string, caption: string) {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, caption } : it)));
  }

  async function handleCaptionBlur(id: string, caption: string) {
    await fetch(`/api/admin/gallery/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ caption: caption || null }),
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

      <div className="bg-white border border-border p-5 space-y-3 max-w-lg">
        <label className="text-xs font-bold uppercase tracking-wide text-ink">
          Upload nhiều ảnh cùng lúc
        </label>
        <p className="text-xs text-text">
          Dùng &ldquo;Loại ảnh&rdquo; và &ldquo;Thuộc dịch vụ&rdquo; đã chọn ở form phía trên cho tất cả ảnh chọn ở đây.
        </p>

        <div className="space-y-1">
          <p className="text-xs text-text">Chọn nhiều ảnh/video lẻ:</p>
          <input
            type="file"
            accept="image/*,video/*"
            multiple
            disabled={batchUploading}
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) handleBatchUpload(e.target.files);
              e.target.value = "";
            }}
            className="text-sm"
          />
        </div>

        <div className="space-y-1">
          <p className="text-xs text-text">Hoặc chọn cả một thư mục ảnh/video:</p>
          <input
            type="file"
            multiple
            disabled={batchUploading}
            {...folderInputProps}
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) handleBatchUpload(e.target.files);
              e.target.value = "";
            }}
            className="text-sm"
          />
        </div>

        {batchUploading && <span className="text-xs text-text block">Đang tải lên...</span>}
        {batchError && <p className="text-xs text-red-600">{batchError}</p>}
      </div>

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
              <input
                value={item.caption ?? ""}
                onChange={(e) => handleCaptionInput(item.id, e.target.value)}
                onBlur={(e) => handleCaptionBlur(item.id, e.target.value)}
                placeholder="Chú thích..."
                className="w-full border border-border rounded px-1.5 py-1 text-[11px] text-ink"
              />
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
