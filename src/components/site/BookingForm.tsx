"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useLang } from "@/lib/lang-context";
import { generateShowSlots } from "@/lib/timeSlots";

interface ListBuyItem {
  id: string;
  name: string;
  price: number;
}

interface FormValues {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  eventDate: string;
  eventTime: string;
  guestCount: string;
  notes: string;
}

const SHOW_SLOTS = generateShowSlots();

function formatVnd(n: number) {
  return n.toLocaleString("vi-VN") + "đ";
}

export default function BookingForm({ eventId, listBuyItems }: { eventId: string; listBuyItems: ListBuyItem[] }) {
  const router = useRouter();
  const { t } = useLang();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  // Slot availability for the selected date ("09:00" -> true/false).
  const [slotAvailability, setSlotAvailability] = useState<Record<string, boolean>>({});

  const selectedItems = listBuyItems.filter((li) => (quantities[li.id] ?? 0) > 0);
  const total = selectedItems.reduce((sum, li) => sum + li.price * (quantities[li.id] ?? 0), 0);

  function toggleItem(id: string, checked: boolean) {
    setQuantities((q) => ({ ...q, [id]: checked ? 1 : 0 }));
  }

  function setQuantity(id: string, qty: number) {
    setQuantities((q) => ({ ...q, [id]: Math.max(1, qty) }));
  }

  async function fetchAvailability(date: string) {
    if (!date) {
      setSlotAvailability({});
      return;
    }
    try {
      const res = await fetch(`/api/bookings/availability?date=${date}`);
      if (!res.ok) return;
      const data: { slots: { time: string; available: boolean }[] } = await res.json();
      setSlotAvailability(Object.fromEntries(data.slots.map((s) => [s.time, s.available])));
    } catch {
      setSlotAvailability({});
    }
  }

  async function onSubmit(values: FormValues) {
    setError("");
    if (selectedItems.length === 0) {
      setError(t("selectAtLeastOneError"));
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId,
          customerName: values.customerName,
          customerPhone: values.customerPhone,
          customerEmail: values.customerEmail || undefined,
          eventDate: values.eventDate,
          eventTime: values.eventTime,
          guestCount: values.guestCount ? Number(values.guestCount) : undefined,
          notes: values.notes || undefined,
          items: selectedItems.map((li) => ({ listBuyItemId: li.id, quantity: quantities[li.id] })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || t("bookingFailedError"));
        return;
      }
      router.push(`/booking/${data.id}`);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 border border-border rounded-2xl p-6 bg-cream">
      <div>
        <h3 className="font-jost text-lg font-bold uppercase tracking-wide text-red mb-3">{t("selectPackageHeading")}</h3>
        <div className="space-y-2">
          {listBuyItems.map((li) => (
            <div key={li.id} className="flex items-start gap-3 bg-white border border-border rounded-xl p-3">
              <input
                type="checkbox"
                checked={(quantities[li.id] ?? 0) > 0}
                onChange={(e) => toggleItem(li.id, e.target.checked)}
                className="mt-1.5 flex-none"
              />
              <div className="flex-1 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
                <span className="text-lg text-ink">{li.name}</span>
                <span className="text-lg font-bold text-red whitespace-nowrap">{formatVnd(li.price)}</span>
              </div>
              {(quantities[li.id] ?? 0) > 0 && (
                <input
                  type="number"
                  min={1}
                  value={quantities[li.id]}
                  onChange={(e) => setQuantity(li.id, Number(e.target.value))}
                  className="w-16 border border-border rounded-md px-2 py-1 text-lg flex-none"
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Field label={t("formName")} error={errors.customerName}>
          <input {...register("customerName", { required: true })} className={inputClass} />
        </Field>
        <Field label={t("formPhone")} error={errors.customerPhone}>
          <input {...register("customerPhone", { required: true })} className={inputClass} />
        </Field>
        <Field label={t("emailLabel")}>
          <input type="email" {...register("customerEmail")} className={inputClass} />
        </Field>
        <Field label={t("eventDateLabel")} error={errors.eventDate}>
          <input
            type="date"
            {...register("eventDate", { required: true, onChange: (e) => fetchAvailability(e.target.value) })}
            className={inputClass}
          />
        </Field>
        <Field label={t("eventTimeLabel")} error={errors.eventTime}>
          <select {...register("eventTime", { required: true })} className={inputClass} defaultValue="">
            <option value="" disabled>{t("eventTimeOptionSelect")}</option>
            {SHOW_SLOTS.map((time) => {
              const available = slotAvailability[time];
              const full = available === false;
              return (
                <option key={time} value={time} disabled={full}>
                  {time}
                  {full ? ` — ${t("eventTimeSlotFull")}` : ""}
                </option>
              );
            })}
          </select>
        </Field>
        <Field label={t("guestCountLabel")}>
          <input type="number" min={1} {...register("guestCount")} className={inputClass} />
        </Field>
      </div>

      <Field label={t("notesLabel")}>
        <textarea {...register("notes")} className={`${inputClass} min-h-[80px]`} />
      </Field>

      <div className="flex items-center justify-between border-t border-border pt-4">
        <span className="text-lg font-bold text-ink">{t("totalLabel")}: {formatVnd(total)}</span>
        <button
          type="submit"
          disabled={submitting}
          className="px-6 py-3 text-base font-bold uppercase tracking-[0.12em] bg-ink text-white rounded-full hover:bg-red transition-colors disabled:opacity-60"
        >
          {submitting ? t("sendingLabel") : t("bookNow")}
        </button>
      </div>

      {error && <p className="text-lg text-red-600">{error}</p>}
    </form>
  );
}

const inputClass = "border border-border rounded-md px-3 py-2 text-lg w-full bg-white";

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: { message?: string };
  children: React.ReactNode;
}) {
  const { t } = useLang();
  return (
    <div className="flex flex-col gap-2">
      <label className="text-base font-bold uppercase tracking-wide text-ink">{label}</label>
      {children}
      {error && <span className="text-base text-red-600">{t("requiredLabel")}</span>}
    </div>
  );
}
