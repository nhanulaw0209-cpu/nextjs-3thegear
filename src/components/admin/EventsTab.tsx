"use client";

import { useEffect, useState, useCallback } from "react";
import { Event, EventListBuyItem, SetlistItem } from "@/types/admin";
import ImageUploadField from "./ImageUploadField";

type EventWithItems = Event & { listBuyItems: EventListBuyItem[]; setlistItems: SetlistItem[] };

const EMPTY_EVENT_FORM = { slug: "", title: "", summary: "", description: "", heroImageUrl: "", showDuration: "", isPublished: true };
const EMPTY_ITEM_FORM = { name: "", description: "", price: "" };
const EMPTY_SONG_FORM = { title: "", artist: "" };

function formatVnd(n: number) {
  return n.toLocaleString("vi-VN") + "đ";
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function EventsTab() {
  const [events, setEvents] = useState<EventWithItems[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createForm, setCreateForm] = useState(EMPTY_EVENT_FORM);

  const fetchEvents = useCallback(async () => {
    const res = await fetch("/api/admin/events", { cache: "no-store" });
    if (res.ok) setEvents(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const selected = events.find((e) => e.id === selectedId) ?? null;

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(createForm),
    });
    if (res.ok) {
      setShowCreateForm(false);
      setCreateForm(EMPTY_EVENT_FORM);
      fetchEvents();
    } else {
      const data = await res.json();
      alert(data.error || "Không thể tạo dịch vụ");
    }
  }

  async function toggleGlobalPublish(ev: EventWithItems) {
    await fetch(`/api/admin/events/${ev.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPublished: !ev.isPublished }),
    });
    fetchEvents();
  }

  async function handleDeleteEvent(id: string) {
    if (!confirm("Xoá dịch vụ này?")) return;
    const res = await fetch(`/api/admin/events/${id}`, { method: "DELETE" });
    if (res.ok) {
      if (selectedId === id) setSelectedId(null);
      fetchEvents();
    } else {
      const data = await res.json();
      alert(data.error || "Không thể xoá dịch vụ");
    }
  }

  if (loading) return <p className="text-sm text-text">Đang tải...</p>;

  if (selected) {
    return <EventDetail event={selected} onBack={() => setSelectedId(null)} onChanged={fetchEvents} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-jost text-2xl font-bold text-ink">Dịch Vụ</h1>
        <button
          onClick={() => setShowCreateForm((v) => !v)}
          className="px-4 py-2 text-xs font-bold uppercase tracking-wide bg-ink text-white hover:bg-red transition-colors"
        >
          + Thêm dịch vụ
        </button>
      </div>

      {showCreateForm && (
        <form onSubmit={handleCreate} className="bg-white border border-border p-5 space-y-4 max-w-lg">
          <Field label="Tên dịch vụ">
            <input
              value={createForm.title}
              onChange={(e) =>
                setCreateForm((f) => ({
                  ...f,
                  title: e.target.value,
                  slug: f.slug === slugify(f.title) || f.slug === "" ? slugify(e.target.value) : f.slug,
                }))
              }
              required
              className={inputClass}
            />
          </Field>
          <Field label="Slug (URL)">
            <input
              value={createForm.slug}
              onChange={(e) => setCreateForm({ ...createForm, slug: slugify(e.target.value) })}
              required
              className={inputClass}
            />
          </Field>
          <Field label="Mô tả ngắn">
            <input
              value={createForm.summary}
              onChange={(e) => setCreateForm({ ...createForm, summary: e.target.value })}
              className={inputClass}
            />
          </Field>
          <Field label="Mô tả đầy đủ">
            <textarea
              value={createForm.description}
              onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
              className={`${inputClass} min-h-[100px]`}
            />
          </Field>
          <Field label="Thời lượng show (vd: 90 phút, 19:00 - 20:30)">
            <input
              value={createForm.showDuration}
              onChange={(e) => setCreateForm({ ...createForm, showDuration: e.target.value })}
              className={inputClass}
            />
          </Field>
          <ImageUploadField
            label="Ảnh bìa"
            value={createForm.heroImageUrl}
            category="events"
            onChange={(url) => setCreateForm({ ...createForm, heroImageUrl: url })}
          />
          <div className="flex gap-3">
            <button type="submit" className="px-4 py-2 text-xs font-bold uppercase tracking-wide bg-ink text-white hover:bg-red transition-colors">
              Tạo dịch vụ
            </button>
            <button
              type="button"
              onClick={() => setShowCreateForm(false)}
              className="px-4 py-2 text-xs font-bold uppercase tracking-wide border border-border text-text hover:border-red hover:text-red transition-colors"
            >
              Huỷ
            </button>
          </div>
        </form>
      )}

      <div className="bg-white border border-border divide-y divide-border">
        {events.length === 0 && <p className="p-4 text-sm text-text">Chưa có dịch vụ nào.</p>}
        {events.map((ev) => (
          <div key={ev.id} className="flex items-center gap-4 p-4">
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-ink text-sm">{ev.title}</div>
              <div className="text-xs text-text">/events/{ev.slug} · {ev.listBuyItems.length} gói dịch vụ</div>
            </div>
            <button
              onClick={() => toggleGlobalPublish(ev)}
              className={`text-xs px-2 py-1 rounded-full font-semibold ${
                ev.isPublished ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
              }`}
            >
              {ev.isPublished ? "Đang hiển thị" : "Ẩn"}
            </button>
            <button onClick={() => setSelectedId(ev.id)} className="text-xs text-red hover:underline">
              Quản lý
            </button>
            <button onClick={() => handleDeleteEvent(ev.id)} className="text-xs text-red-600 hover:underline">
              Xoá
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function EventDetail({
  event,
  onBack,
  onChanged,
}: {
  event: EventWithItems;
  onBack: () => void;
  onChanged: () => void;
}) {
  const [form, setForm] = useState({
    title: event.title,
    summary: event.summary ?? "",
    description: event.description ?? "",
    heroImageUrl: event.heroImageUrl ?? "",
    showDuration: event.showDuration ?? "",
  });
  const [itemForm, setItemForm] = useState(EMPTY_ITEM_FORM);
  const [songForm, setSongForm] = useState(EMPTY_SONG_FORM);
  const [savingEvent, setSavingEvent] = useState(false);

  async function saveEvent(e: React.FormEvent) {
    e.preventDefault();
    setSavingEvent(true);
    await fetch(`/api/admin/events/${event.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSavingEvent(false);
    onChanged();
  }

  async function addItem(e: React.FormEvent) {
    e.preventDefault();
    if (!itemForm.name || !itemForm.price) return;
    await fetch(`/api/admin/events/${event.id}/listbuy`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: itemForm.name,
        description: itemForm.description || null,
        price: Number(itemForm.price),
        sortOrder: event.listBuyItems.length,
      }),
    });
    setItemForm(EMPTY_ITEM_FORM);
    onChanged();
  }

  async function toggleItemActive(item: EventListBuyItem) {
    await fetch(`/api/admin/events/${event.id}/listbuy/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !item.isActive }),
    });
    onChanged();
  }

  async function deleteItem(item: EventListBuyItem) {
    if (!confirm(`Xoá gói "${item.name}"?`)) return;
    const res = await fetch(`/api/admin/events/${event.id}/listbuy/${item.id}`, { method: "DELETE" });
    if (res.ok) {
      onChanged();
    } else {
      const data = await res.json();
      alert(data.error || "Không thể xoá");
    }
  }

  async function addSong(e: React.FormEvent) {
    e.preventDefault();
    if (!songForm.title) return;
    await fetch(`/api/admin/events/${event.id}/setlist`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: songForm.title,
        artist: songForm.artist || null,
        sortOrder: event.setlistItems.length,
      }),
    });
    setSongForm(EMPTY_SONG_FORM);
    onChanged();
  }

  async function deleteSong(item: SetlistItem) {
    if (!confirm(`Xoá bài "${item.title}"?`)) return;
    await fetch(`/api/admin/events/${event.id}/setlist/${item.id}`, { method: "DELETE" });
    onChanged();
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="text-sm text-red hover:underline">
          ← Quay lại
        </button>
        <h1 className="font-jost text-2xl font-bold text-ink">{event.title}</h1>
      </div>

      <form onSubmit={saveEvent} className="bg-white border border-border p-5 space-y-4 max-w-lg">
        <h2 className="font-jost text-sm font-bold uppercase tracking-wide text-red">Thông tin dịch vụ</h2>
        <Field label="Tên dịch vụ">
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputClass} />
        </Field>
        <Field label="Mô tả ngắn">
          <input value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} className={inputClass} />
        </Field>
        <Field label="Mô tả đầy đủ">
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className={`${inputClass} min-h-[100px]`}
          />
        </Field>
        <Field label="Thời lượng show (vd: 90 phút, 19:00 - 20:30)">
          <input
            value={form.showDuration}
            onChange={(e) => setForm({ ...form, showDuration: e.target.value })}
            className={inputClass}
          />
        </Field>
        <ImageUploadField
          label="Ảnh bìa"
          value={form.heroImageUrl}
          category="events"
          onChange={(url) => setForm({ ...form, heroImageUrl: url })}
        />
        <button
          type="submit"
          disabled={savingEvent}
          className="px-4 py-2 text-xs font-bold uppercase tracking-wide bg-ink text-white hover:bg-red transition-colors disabled:opacity-60"
        >
          {savingEvent ? "Đang lưu..." : "Lưu thay đổi"}
        </button>
      </form>

      <div className="space-y-4 max-w-2xl">
        <h2 className="font-jost text-sm font-bold uppercase tracking-wide text-red">ListBuy - Gói dịch vụ</h2>

        <div className="bg-white border border-border divide-y divide-border">
          {event.listBuyItems.length === 0 && <p className="p-4 text-sm text-text">Chưa có gói dịch vụ nào.</p>}
          {event.listBuyItems.map((item) => (
            <div key={item.id} className="flex items-center gap-4 p-4">
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-ink text-sm">{item.name}</div>
                {item.description && <div className="text-xs text-text">{item.description}</div>}
              </div>
              <div className="text-sm font-bold text-ink">{formatVnd(item.price)}</div>
              <button
                onClick={() => toggleItemActive(item)}
                className={`text-xs px-2 py-1 rounded-full font-semibold ${
                  item.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                }`}
              >
                {item.isActive ? "Hiển thị" : "Ẩn"}
              </button>
              <button onClick={() => deleteItem(item)} className="text-xs text-red-600 hover:underline">
                Xoá
              </button>
            </div>
          ))}
        </div>

        <form onSubmit={addItem} className="bg-white border border-border p-5 space-y-4">
          <div className="grid sm:grid-cols-[2fr_1fr] gap-4">
            <Field label="Tên gói">
              <input value={itemForm.name} onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })} className={inputClass} />
            </Field>
            <Field label="Giá (VND)">
              <input
                type="number"
                value={itemForm.price}
                onChange={(e) => setItemForm({ ...itemForm, price: e.target.value })}
                className={inputClass}
              />
            </Field>
          </div>
          <Field label="Mô tả">
            <input
              value={itemForm.description}
              onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
              className={inputClass}
            />
          </Field>
          <button type="submit" className="px-4 py-2 text-xs font-bold uppercase tracking-wide bg-ink text-white hover:bg-red transition-colors">
            + Thêm gói
          </button>
        </form>
      </div>

      <div className="space-y-4 max-w-2xl">
        <h2 className="font-jost text-sm font-bold uppercase tracking-wide text-red">Danh Sách Bài Hát (Setlist)</h2>

        <div className="bg-white border border-border divide-y divide-border">
          {event.setlistItems.length === 0 && <p className="p-4 text-sm text-text">Chưa có bài hát nào.</p>}
          {event.setlistItems.map((item, i) => (
            <div key={item.id} className="flex items-center gap-4 p-4">
              <span className="font-jost text-xs text-red font-bold w-6 flex-none">{String(i + 1).padStart(2, "0")}</span>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-ink text-sm">{item.title}</div>
                {item.artist && <div className="text-xs text-text">{item.artist}</div>}
              </div>
              <button onClick={() => deleteSong(item)} className="text-xs text-red-600 hover:underline">
                Xoá
              </button>
            </div>
          ))}
        </div>

        <form onSubmit={addSong} className="bg-white border border-border p-5 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Tên bài hát">
              <input value={songForm.title} onChange={(e) => setSongForm({ ...songForm, title: e.target.value })} className={inputClass} />
            </Field>
            <Field label="Ca sĩ / Thể hiện (tuỳ chọn)">
              <input value={songForm.artist} onChange={(e) => setSongForm({ ...songForm, artist: e.target.value })} className={inputClass} />
            </Field>
          </div>
          <button type="submit" className="px-4 py-2 text-xs font-bold uppercase tracking-wide bg-ink text-white hover:bg-red transition-colors">
            + Thêm bài hát
          </button>
        </form>
      </div>
    </div>
  );
}

const inputClass = "border border-border rounded-md px-3 py-2 text-sm w-full";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-bold uppercase tracking-wide text-ink">{label}</label>
      {children}
    </div>
  );
}
