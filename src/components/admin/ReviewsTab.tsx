"use client";

import { useEffect, useState, useCallback } from "react";
import { Star } from "lucide-react";
import { Review } from "@/types/admin";
import ImageUploadField from "./ImageUploadField";

const EMPTY_FORM = { customerName: "", quote: "", rating: 5, eventType: "", avatarUrl: "", sortOrder: 0 };

export default function ReviewsTab() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [showForm, setShowForm] = useState(false);

  const fetchReviews = useCallback(async () => {
    const res = await fetch("/api/admin/reviews", { cache: "no-store" });
    if (res.ok) setReviews(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  function startCreate() {
    setEditingId(null);
    setForm({ ...EMPTY_FORM, sortOrder: reviews.length });
    setShowForm(true);
  }

  function startEdit(r: Review) {
    setEditingId(r.id);
    setForm({
      customerName: r.customerName,
      quote: r.quote,
      rating: r.rating,
      eventType: r.eventType ?? "",
      avatarUrl: r.avatarUrl ?? "",
      sortOrder: r.sortOrder,
    });
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.customerName || !form.quote) return;

    const payload = { ...form, eventType: form.eventType || null, avatarUrl: form.avatarUrl || null };

    if (editingId) {
      await fetch("/api/admin/reviews", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingId, ...payload }),
      });
    } else {
      await fetch("/api/admin/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }
    setShowForm(false);
    fetchReviews();
  }

  async function handleDelete(id: string) {
    if (!confirm("Xoá đánh giá này?")) return;
    await fetch("/api/admin/reviews", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchReviews();
  }

  async function toggleActive(r: Review) {
    await fetch("/api/admin/reviews", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: r.id, isActive: !r.isActive }),
    });
    fetchReviews();
  }

  if (loading) return <p className="text-sm text-text">Đang tải...</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-jost text-2xl font-bold text-ink">Đánh Giá Khách Hàng</h1>
        <button
          onClick={startCreate}
          className="px-4 py-2 text-xs font-bold uppercase tracking-wide bg-ink text-white hover:bg-red transition-colors"
        >
          + Thêm đánh giá
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border border-border p-5 space-y-4 max-w-lg">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-wide text-ink">Tên khách hàng</label>
            <input
              value={form.customerName}
              onChange={(e) => setForm({ ...form, customerName: e.target.value })}
              required
              className="border border-border px-3 py-2 text-sm"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-wide text-ink">Nội dung đánh giá</label>
            <textarea
              value={form.quote}
              onChange={(e) => setForm({ ...form, quote: e.target.value })}
              required
              rows={4}
              className="border border-border px-3 py-2 text-sm"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-wide text-ink">Số sao</label>
            <select
              value={form.rating}
              onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
              className="border border-border px-3 py-2 text-sm"
            >
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>
                  {n} sao
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-wide text-ink">Loại sự kiện (tuỳ chọn)</label>
            <input
              value={form.eventType}
              onChange={(e) => setForm({ ...form, eventType: e.target.value })}
              placeholder="Tiệc cưới, sự kiện doanh nghiệp..."
              className="border border-border px-3 py-2 text-sm"
            />
          </div>
          <ImageUploadField
            label="Ảnh đại diện (tuỳ chọn)"
            value={form.avatarUrl}
            category="reviews"
            onChange={(url) => setForm({ ...form, avatarUrl: url })}
          />
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
        {reviews.length === 0 && <p className="p-4 text-sm text-text">Chưa có đánh giá nào.</p>}
        {reviews.map((r) => (
          <div key={r.id} className="flex items-center gap-4 p-4">
            {r.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={r.avatarUrl} alt={r.customerName} className="w-14 h-14 rounded-full object-cover bg-cream flex-none" />
            ) : (
              <div className="w-14 h-14 rounded-full bg-cream flex items-center justify-center text-text font-bold flex-none">
                {r.customerName.charAt(0)}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-ink text-sm flex items-center gap-2">
                {r.customerName}
                {r.eventType && <span className="text-text font-normal text-xs">· {r.eventType}</span>}
              </div>
              <div className="flex items-center gap-0.5 mt-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={13} className={i < r.rating ? "fill-red text-red" : "text-border"} />
                ))}
              </div>
              <p className="text-xs text-text truncate mt-0.5">{r.quote}</p>
            </div>
            <button
              onClick={() => toggleActive(r)}
              className={`text-xs px-2 py-1 rounded-full font-semibold flex-none ${
                r.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
              }`}
            >
              {r.isActive ? "Hiển thị" : "Ẩn"}
            </button>
            <button onClick={() => startEdit(r)} className="text-xs text-red hover:underline flex-none">
              Sửa
            </button>
            <button onClick={() => handleDelete(r.id)} className="text-xs text-red-600 hover:underline flex-none">
              Xoá
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
