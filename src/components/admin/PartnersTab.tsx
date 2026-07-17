"use client";

import { useEffect, useState, useCallback } from "react";
import { Partner } from "@/types/admin";
import ImageUploadField from "./ImageUploadField";

const EMPTY_FORM = { name: "", logoUrl: "", linkUrl: "", sinceYear: "", sortOrder: 0 };

export default function PartnersTab() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [showForm, setShowForm] = useState(false);

  const fetchPartners = useCallback(async () => {
    const res = await fetch("/api/admin/partners", { cache: "no-store" });
    if (res.ok) setPartners(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchPartners();
  }, [fetchPartners]);

  function startCreate() {
    setEditingId(null);
    setForm({ ...EMPTY_FORM, sortOrder: partners.length });
    setShowForm(true);
  }

  function startEdit(p: Partner) {
    setEditingId(p.id);
    setForm({ name: p.name, logoUrl: p.logoUrl, linkUrl: p.linkUrl ?? "", sinceYear: p.sinceYear ? String(p.sinceYear) : "", sortOrder: p.sortOrder });
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.logoUrl) return;

    const payload = { ...form, sinceYear: form.sinceYear ? Number(form.sinceYear) : null };

    if (editingId) {
      await fetch("/api/admin/partners", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingId, ...payload }),
      });
    } else {
      await fetch("/api/admin/partners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }
    setShowForm(false);
    fetchPartners();
  }

  async function handleDelete(id: string) {
    if (!confirm("Xoá đối tác này?")) return;
    await fetch("/api/admin/partners", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchPartners();
  }

  async function toggleActive(p: Partner) {
    await fetch("/api/admin/partners", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: p.id, isActive: !p.isActive }),
    });
    fetchPartners();
  }

  if (loading) return <p className="text-sm text-text">Đang tải...</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-jost text-2xl font-bold text-ink">Đối Tác</h1>
        <button
          onClick={startCreate}
          className="px-4 py-2 text-xs font-bold uppercase tracking-wide bg-ink text-white hover:bg-red transition-colors"
        >
          + Thêm đối tác
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border border-border p-5 space-y-4 max-w-lg">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-wide text-ink">Tên đối tác</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="border border-border px-3 py-2 text-sm"
            />
          </div>
          <ImageUploadField
            label="Logo"
            value={form.logoUrl}
            category="partners"
            onChange={(url) => setForm({ ...form, logoUrl: url })}
          />
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-wide text-ink">Link (tuỳ chọn)</label>
            <input
              value={form.linkUrl}
              onChange={(e) => setForm({ ...form, linkUrl: e.target.value })}
              placeholder="https://..."
              className="border border-border px-3 py-2 text-sm"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-wide text-ink">Hợp tác từ năm (tuỳ chọn)</label>
            <input
              value={form.sinceYear}
              onChange={(e) => setForm({ ...form, sinceYear: e.target.value })}
              placeholder="2020"
              type="number"
              className="border border-border px-3 py-2 text-sm"
            />
          </div>
          <div className="flex gap-3">
            <button type="submit" className="px-4 py-2 text-xs font-bold uppercase tracking-wide bg-ink text-white hover:bg-red transition-colors">
              Lưu
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 text-xs font-bold uppercase tracking-wide border border-border text-text hover:border-red hover:text-red transition-colors"
            >
              Huỷ
            </button>
          </div>
        </form>
      )}

      <div className="bg-white border border-border divide-y divide-border">
        {partners.length === 0 && <p className="p-4 text-sm text-text">Chưa có đối tác nào.</p>}
        {partners.map((p) => (
          <div key={p.id} className="flex items-center gap-4 p-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.logoUrl} alt={p.name} className="w-14 h-14 rounded-lg object-contain bg-cream" />
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-ink text-sm">{p.name}{p.sinceYear && <span className="text-text font-normal"> · từ {p.sinceYear}</span>}</div>
              {p.linkUrl && <div className="text-xs text-text truncate">{p.linkUrl}</div>}
            </div>
            <button
              onClick={() => toggleActive(p)}
              className={`text-xs px-2 py-1 rounded-full font-semibold ${
                p.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
              }`}
            >
              {p.isActive ? "Hiển thị" : "Ẩn"}
            </button>
            <button onClick={() => startEdit(p)} className="text-xs text-red hover:underline">
              Sửa
            </button>
            <button onClick={() => handleDelete(p.id)} className="text-xs text-red-600 hover:underline">
              Xoá
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
