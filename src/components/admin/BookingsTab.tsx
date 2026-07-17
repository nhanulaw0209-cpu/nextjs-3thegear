"use client";

import { useEffect, useState, useCallback } from "react";
import { Booking } from "@/types/admin";

interface LineItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

type BookingWithDetails = Booking & {
  event: { title: string; slug: string };
  lineItems: LineItem[];
};

const STATUS_LABEL: Record<string, string> = {
  pending_payment: "Chờ thanh toán",
  payment_submitted: "Đã chuyển khoản - chờ xác nhận",
  confirmed: "Đã xác nhận",
  cancelled: "Đã huỷ",
};

const STATUS_COLOR: Record<string, string> = {
  pending_payment: "bg-gray-100 text-gray-600",
  payment_submitted: "bg-amber-100 text-amber-700",
  confirmed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

function formatVnd(n: number) {
  return n.toLocaleString("vi-VN") + "đ";
}

export default function BookingsTab() {
  const [bookings, setBookings] = useState<BookingWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = useCallback(async () => {
    const res = await fetch("/api/admin/bookings", { cache: "no-store" });
    if (res.ok) setBookings(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  async function updateStatus(id: string, status: "confirmed" | "cancelled") {
    await fetch(`/api/admin/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    fetchBookings();
  }

  if (loading) return <p className="text-sm text-text">Đang tải...</p>;

  return (
    <div className="space-y-6">
      <h1 className="font-jost text-2xl font-bold text-ink">Đặt Lịch</h1>

      <div className="bg-white border border-border divide-y divide-border">
        {bookings.length === 0 && <p className="p-4 text-sm text-text">Chưa có booking nào.</p>}
        {bookings.map((b) => (
          <div key={b.id} className="p-4 space-y-3">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <div className="font-semibold text-ink text-sm">
                  #{b.bookingNumber} · {b.customerName} · {b.event.title}
                </div>
                <div className="text-xs text-text mt-0.5">
                  {b.eventDate} {b.eventTime} · {b.customerPhone}
                  {b.customerEmail ? ` · ${b.customerEmail}` : ""}
                  {b.guestCount ? ` · ${b.guestCount} khách` : ""}
                </div>
                {b.notes && <div className="text-xs text-text mt-0.5 italic">&ldquo;{b.notes}&rdquo;</div>}
              </div>
              <span className={`text-xs px-2 py-1 rounded-full font-semibold whitespace-nowrap ${STATUS_COLOR[b.status]}`}>
                {STATUS_LABEL[b.status] ?? b.status}
              </span>
            </div>

            <div className="text-xs text-text space-y-1">
              {b.lineItems.map((li) => (
                <div key={li.id} className="flex justify-between max-w-sm">
                  <span>{li.name} × {li.quantity}</span>
                  <span>{formatVnd(li.price * li.quantity)}</span>
                </div>
              ))}
              <div className="flex justify-between max-w-sm font-bold text-ink pt-1 border-t border-border">
                <span>Tổng</span>
                <span>{formatVnd(b.total)}</span>
              </div>
            </div>

            {(b.status === "pending_payment" || b.status === "payment_submitted") && (
              <div className="flex gap-3">
                <button
                  onClick={() => updateStatus(b.id, "confirmed")}
                  className="px-3 py-1.5 text-xs font-bold uppercase tracking-wide bg-ink text-white hover:bg-red transition-colors"
                >
                  Xác nhận đã nhận tiền
                </button>
                <button
                  onClick={() => updateStatus(b.id, "cancelled")}
                  className="px-3 py-1.5 text-xs font-bold uppercase tracking-wide border border-border text-red-600 hover:border-red-600 transition-colors"
                >
                  Huỷ booking
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
