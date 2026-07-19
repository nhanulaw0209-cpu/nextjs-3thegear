"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { CheckCircle, Circle, Trash2, Star } from "lucide-react";
import { NegativeFeedback } from "@/types/admin";

function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={13} className={i < rating ? "fill-red text-red" : "text-border"} />
      ))}
    </span>
  );
}

const FILTERS = ["open", "resolved", "all"] as const;
type Filter = (typeof FILTERS)[number];
const FILTER_LABELS: Record<Filter, string> = { open: "Chưa xử lý", resolved: "Đã xử lý", all: "Tất cả" };

export default function FeedbackTab() {
  const [feedback, setFeedback] = useState<NegativeFeedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("open");

  const fetchFeedback = useCallback(async () => {
    const res = await fetch("/api/admin/feedback", { cache: "no-store" });
    if (res.ok) setFeedback(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchFeedback();
  }, [fetchFeedback]);

  const filtered = useMemo(() => {
    if (filter === "open") return feedback.filter((f) => !f.resolved);
    if (filter === "resolved") return feedback.filter((f) => f.resolved);
    return feedback;
  }, [feedback, filter]);

  const openCount = feedback.filter((f) => !f.resolved).length;

  async function toggleResolved(f: NegativeFeedback) {
    await fetch("/api/admin/feedback", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: f.id, resolved: !f.resolved }),
    });
    fetchFeedback();
  }

  async function handleDelete(id: string) {
    if (!confirm("Xoá góp ý này?")) return;
    await fetch("/api/admin/feedback", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchFeedback();
  }

  if (loading) return <p className="text-sm text-text">Đang tải...</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-jost text-2xl font-bold text-ink">Góp Ý Riêng (1-3 Sao)</h1>
          <p className="text-xs text-text mt-1">
            Khách chọn 1-3 sao trên gate /danh-gia được giữ lại đây, không hiển thị công khai, đã được chuyển sang Zalo để xử lý trực tiếp.
          </p>
          {openCount > 0 && <p className="text-xs text-red font-semibold mt-1">{openCount} chưa xử lý</p>}
        </div>
      </div>

      <div className="flex border border-border overflow-hidden w-fit rounded-full">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wide transition-colors ${
              filter === f ? "bg-ink text-white" : "bg-white text-text hover:bg-cream"
            }`}
          >
            {FILTER_LABELS[f]}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-text py-8 text-center">
          {filter === "open" ? "Không có góp ý nào chưa xử lý." : "Chưa có dữ liệu."}
        </p>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => (
            <div
              key={item.id}
              className={`border rounded-xl p-4 ${item.resolved ? "bg-white border-border opacity-70" : "bg-red-50 border-red-200"}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap mb-1">
                    <span className="font-semibold text-ink text-sm">{item.customerName}</span>
                    <Stars rating={item.rating} />
                    {item.eventType && <span className="text-xs text-text">· {item.eventType}</span>}
                    <span
                      className={`text-[0.65rem] px-2 py-0.5 font-bold uppercase rounded-full ${
                        item.resolved ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}
                    >
                      {item.resolved ? "Đã xử lý" : "Chưa xử lý"}
                    </span>
                  </div>
                  <p className="text-sm text-ink leading-relaxed mt-2">{item.comment}</p>
                  <p className="text-xs text-text mt-2">
                    {new Date(item.createdAt).toLocaleDateString("vi-VN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>

                <div className="flex gap-2 flex-none">
                  <button
                    onClick={() => toggleResolved(item)}
                    title={item.resolved ? "Đánh dấu chưa xử lý" : "Đánh dấu đã xử lý"}
                    className={`p-2 rounded-lg transition-colors ${
                      item.resolved ? "bg-amber-100 text-amber-700 hover:bg-amber-200" : "bg-green-100 text-green-700 hover:bg-green-200"
                    }`}
                  >
                    {item.resolved ? <Circle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    title="Xoá"
                    className="p-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
