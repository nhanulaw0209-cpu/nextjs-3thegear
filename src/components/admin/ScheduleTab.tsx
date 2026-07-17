"use client";

import { useEffect, useState, useCallback } from "react";
import ShowCalendar, { CalendarSlot } from "@/components/ShowCalendar";
import ScheduleImportPanel from "./ScheduleImportPanel";
import { Event } from "@/types/admin";

const EMPTY_FORM = { date: "", startTime: "", status: "available", eventId: "", location: "", notes: "" };

const STATUS_OPTIONS = [
  { value: "available", label: "Còn trống" },
  { value: "pending", label: "Đang chờ" },
  { value: "booked", label: "Đã đặt" },
  { value: "cancelled", label: "Đã huỷ" },
];

export default function ScheduleTab() {
  const [slots, setSlots] = useState<CalendarSlot[]>([]);
  const [events, setEvents] = useState<Pick<Event, "id" | "title">[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editing, setEditing] = useState<CalendarSlot | null>(null);

  const fetchAll = useCallback(async () => {
    const [scheduleRes, eventsRes] = await Promise.all([
      fetch("/api/admin/schedule", { cache: "no-store" }),
      fetch("/api/admin/events", { cache: "no-store" }),
    ]);
    if (scheduleRes.ok) setSlots(await scheduleRes.json());
    if (eventsRes.ok) setEvents(await eventsRes.json());
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!form.date) return;
    await fetch("/api/admin/schedule", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, eventId: form.eventId || null, startTime: form.startTime || null }),
    });
    setForm(EMPTY_FORM);
    fetchAll();
  }

  async function updateStatus(id: string, status: string) {
    await fetch(`/api/admin/schedule/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setEditing(null);
    fetchAll();
  }

  async function deleteSlot(id: string) {
    if (!confirm("Xoá lịch show này?")) return;
    await fetch(`/api/admin/schedule/${id}`, { method: "DELETE" });
    setEditing(null);
    fetchAll();
  }

  if (loading) return <p className="text-sm text-text">Đang tải...</p>;

  return (
    <div className="space-y-6">
      <h1 className="font-jost text-2xl font-bold text-ink">Lịch Show</h1>

      <form onSubmit={handleCreate} className="bg-white border border-border p-5 space-y-4 max-w-2xl">
        <h2 className="font-jost text-sm font-bold uppercase tracking-wide text-red">Thêm lịch show</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Ngày">
            <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required className={inputClass} />
          </Field>
          <Field label="Giờ (tuỳ chọn)">
            <input type="time" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} className={inputClass} />
          </Field>
          <Field label="Dịch vụ">
            <select value={form.eventId} onChange={(e) => setForm({ ...form, eventId: e.target.value })} className={inputClass}>
              <option value="">- Chưa gán -</option>
              {events.map((ev) => (
                <option key={ev.id} value={ev.id}>{ev.title}</option>
              ))}
            </select>
          </Field>
          <Field label="Trạng thái">
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className={inputClass}>
              {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </Field>
          <Field label="Địa điểm">
            <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className={inputClass} />
          </Field>
          <Field label="Ghi chú">
            <input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className={inputClass} />
          </Field>
        </div>
        <button type="submit" className="px-4 py-2 text-xs font-bold uppercase tracking-wide bg-ink text-white hover:bg-red transition-colors">
          + Thêm vào lịch
        </button>
      </form>

      <ScheduleImportPanel onImported={fetchAll} />

      <ShowCalendar slots={slots} onSelectSlot={setEditing} />

      {editing && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40" onClick={() => setEditing(null)}>
          <div className="bg-white border border-border w-full max-w-sm shadow-xl p-5 space-y-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-jost text-sm font-bold text-ink">{editing.event?.title ?? "Chưa gán dịch vụ"} · {editing.date}</h3>
            <div className="flex flex-wrap gap-2">
              {STATUS_OPTIONS.map((o) => (
                <button
                  key={o.value}
                  onClick={() => updateStatus(editing.id, o.value)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded ${editing.status === o.value ? "bg-ink text-white" : "border border-border text-text hover:border-red hover:text-red"}`}
                >
                  {o.label}
                </button>
              ))}
            </div>
            <div className="flex justify-between pt-2">
              <button onClick={() => deleteSlot(editing.id)} className="text-xs text-red-600 hover:underline">Xoá lịch này</button>
              <button onClick={() => setEditing(null)} className="text-xs text-text hover:underline">Đóng</button>
            </div>
          </div>
        </div>
      )}
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
