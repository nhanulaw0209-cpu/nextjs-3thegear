"use client";

import Link from "next/link";
import { useLang } from "@/lib/lang-context";
import BookingPaymentClient from "./BookingPaymentClient";

function formatVnd(n: number) {
  return n.toLocaleString("vi-VN") + "đ";
}

interface BookingDetail {
  id: string;
  bookingNumber: string | number;
  eventDate: string;
  eventTime: string;
  total: number;
  status: string;
  event: { title: string; slug: string };
  lineItems: { id: string; name: string; quantity: number; price: number }[];
}

interface Settings {
  qrImageUrl: string | null;
  bankName: string | null;
  accountNumber: string | null;
  accountName: string | null;
  branch: string | null;
}

export default function BookingDetailClient({ booking, settings }: { booking: BookingDetail; settings: Settings | null }) {
  const { t } = useLang();

  return (
    <main className="min-h-screen bg-cream">
      <div className="max-w-[700px] mx-auto px-6 py-12">
        <Link href={`/events/${booking.event.slug}`} className="text-base text-red uppercase tracking-wide font-bold hover:underline">
          {t("backToEvent")}
        </Link>

        <h1 className="font-jost text-2xl font-bold text-ink mt-4 mb-1">Booking #{booking.bookingNumber}</h1>
        <p className="text-lg text-text mb-8">{booking.event.title} · {booking.eventDate} {booking.eventTime}</p>

        <div className="bg-white border border-border rounded-2xl p-5 space-y-2 mb-6">
          {booking.lineItems.map((li) => (
            <div key={li.id} className="flex justify-between text-lg text-ink">
              <span>{li.name} × {li.quantity}</span>
              <span>{formatVnd(li.price * li.quantity)}</span>
            </div>
          ))}
          <div className="flex justify-between text-lg font-bold text-ink pt-2 border-t border-border">
            <span>{t("totalLabel")}</span>
            <span className="text-red">{formatVnd(booking.total)}</span>
          </div>
        </div>

        {(booking.status === "pending_payment" || booking.status === "payment_submitted") && (
          <div className="bg-ink text-white rounded-2xl p-6 mb-6">
            <h2 className="font-jost text-lg font-bold uppercase tracking-wide text-red mb-4">{t("transferInfoHeading")}</h2>
            <div className="grid sm:grid-cols-[160px_1fr] gap-6 items-center">
              <div className="w-40 h-40 rounded-2xl bg-white p-2 mx-auto sm:mx-0 flex items-center justify-center">
                {settings?.qrImageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={settings.qrImageUrl} alt="QR" className="w-full h-full object-contain" />
                ) : (
                  <span className="text-base text-text text-center">{t("qrNotUpdated")}</span>
                )}
              </div>
              <div className="space-y-1.5 text-lg text-white/90">
                <div><strong className="text-white">{t("bankLabel")}</strong> {settings?.bankName || t("notUpdatedYet")}</div>
                <div><strong className="text-white">{t("accountNumberLabel")}</strong> {settings?.accountNumber || t("notUpdatedYet")}</div>
                <div><strong className="text-white">{t("accountNameLabel")}</strong> {settings?.accountName || t("notUpdatedYet")}</div>
                {settings?.branch && <div><strong className="text-white">{t("branchLabel")}</strong> {settings.branch}</div>}
                <div className="pt-1 text-white/60 text-base">{t("transferContentLabel")} Booking #{booking.bookingNumber}</div>
              </div>
            </div>
          </div>
        )}

        <BookingPaymentClient bookingId={booking.id} initialStatus={booking.status} />
      </div>
    </main>
  );
}
