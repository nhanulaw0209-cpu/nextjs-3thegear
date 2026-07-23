"use client";

import { useEffect, useState, useCallback } from "react";
import ShowCalendar, { CalendarSlot, slotLabel } from "@/components/ShowCalendar";
import ScheduleImportPanel from "./ScheduleImportPanel";
import { Event } from "@/types/admin";

type ServiceRow = { eventId: string; price: string; note: string };
const EMPTY_SERVICE: ServiceRow = { eventId: "", price: "", note: "" };
const EMPTY_FORM = {
  date: "",
  startTime: "",
  status: "available",
  location: "",
  notes: "",
  services: [{ ...EMPTY_SERVICE }] as ServiceRow[],
};

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

  // ---- Quản lý danh sách dịch vụ ----
  const addService = () => setForm((f) => ({ ...f, services: [...f.services, { ...EMPTY_SERVICE }] }));
  const removeService = (i: number) =>
    setForm((f) => ({ ...f, services: f.services.filter((_, j) => j !== i) }));
  const updateService = (i: number, key: keyof ServiceRow, val: string) =>
    setForm((f) => ({ ...f, services: f.services.map((s, j) => (j === i ? { ...s, [key]: val } : s)) }));

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!form.date) return;
    await fetch("/api/admin/schedule", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        startTime: form.startTime || null,
        services: form.services.filter((s) => s.eventId),
      }),
    });
    setForm({ ...EMPTY_FORM, services: [{ ...EMPTY_SERVICE }] });
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

  const totalPrice = form.services.reduce((sum, s) => sum + (Number(s.price) || 0), 0);

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
          <Field label="Trạng thái">
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className={inputClass}>
              {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </Field>
          <Field label="Địa điểm">
            <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className={inputClass} />
          </Field>
        </div>

        {/* Danh sách dịch vụ (1 buổi show có thể gồm nhiều: Band + Âm thanh...) */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wide text-ink">Dịch vụ (có thể thêm nhiều)</label>
          {form.services.map((s, i) => (
            <div key={i} className="flex gap-2 items-center">
              <select value={s.eventId} onChange={(e) => updateService(i, "eventId", e.target.value)} className={`${inputClass} flex-1`}>
                <option value="">- Chọn dịch vụ -</option>
                {events.map((ev) => <option key={ev.id} value={ev.id}>{ev.title}</option>)}
              </select>
              <input type="number" min="0" placeholder="Giá (đ)" value={s.price} onChange={(e) => updateService(i, "price", e.target.value)} className={`${inputClass} w-32`} />
              <input placeholder="Ghi chú" value={s.note} onChange={(e) => updateService(i, "note", e.target.value)} className={`${inputClass} w-32`} />
              <button
                type="button"
                onClick={() => removeService(i)}
                disabled={form.services.length === 1}
                className="text-red text-xl px-1.5 disabled:opacity-30"
                aria-label="Xoá dịch vụ"
              >
                ×
              </button>
            </div>
          ))}
          <div className="flex items-center justify-between">
            <button type="button" onClick={addService} className="text-xs font-bold text-red hover:underline">
              + Thêm dịch vụ
            </button>
            {totalPrice > 0 && (
              <span className="text-xs text-text">Tổng: <b className="text-ink">{totalPrice.toLocaleString("vi-VN")}đ</b></span>
            )}
          </div>
        </div>

        <Field label="Ghi chú chung">
          <input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className={inputClass} />
        </Field>

        <button type="submit" className="px-4 py-2 text-xs font-bold uppercase tracking-wide bg-ink text-white hover:bg-red transition-colors">
          + Thêm vào lịch
        </button>
      </form>

      <ScheduleImportPanel onImported={fetchAll} />

      <ShowCalendar slots={slots} onSelectSlot={setEditing} />

      {editing && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40" onClick={() => setEditing(null)}>
          <div className="bg-white border border-border w-full max-w-sm shadow-xl p-5 space-y-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-jost text-sm font-bold text-ink">{slotLabel(editing)} · {editing.date}</h3>
            {editing.services && editing.services.length > 1 && (
              <div className="flex flex-wrap gap-1">
                {editing.services.map((sv) => (
                  <span key={sv.id} className="text-xs bg-ink/5 text-ink rounded-full px-2 py-0.5">{sv.title}</span>
                ))}
              </div>
            )}
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
