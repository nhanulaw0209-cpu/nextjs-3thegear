"use client";

import { useState } from "react";
import { useLang } from "@/lib/lang-context";

interface Props {
  bookingId: string;
  initialStatus: string;
}

export default function BookingPaymentClient({ bookingId, initialStatus }: Props) {
  const { t } = useLang();
  const [status, setStatus] = useState(initialStatus);
  const [submitting, setSubmitting] = useState(false);

  const STATUS_LABEL: Record<string, string> = {
    pending_payment: t("bookingStatusPendingPayment"),
    payment_submitted: t("bookingStatusSubmitted"),
    confirmed: t("bookingStatusConfirmed"),
    cancelled: t("statusCancelled"),
  };

  async function markTransferred() {
    setSubmitting(true);
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "mark_transferred" }),
      });
      if (res.ok) setStatus("payment_submitted");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="inline-block px-3 py-1.5 text-base font-bold uppercase tracking-wide bg-ink text-white rounded-full">
        {STATUS_LABEL[status] ?? status}
      </div>

      {status === "pending_payment" && (
        <div>
          <button
            onClick={markTransferred}
            disabled={submitting}
            className="px-6 py-3 text-base font-bold uppercase tracking-[0.12em] bg-red text-white rounded-full hover:bg-red-dark transition-colors disabled:opacity-60"
          >
            {submitting ? t("sendingLabel") : t("markTransferredBtn")}
          </button>
          <p className="text-base text-text mt-2">{t("transferHelpText")}</p>
        </div>
      )}

      {status === "payment_submitted" && (
        <p className="text-lg text-text">{t("thankYouText")}</p>
      )}
    </div>
  );
}
