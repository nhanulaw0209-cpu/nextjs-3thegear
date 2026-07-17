"use client";

import { useEffect, useState } from "react";
import ShowCalendar, { CalendarSlot } from "@/components/ShowCalendar";
import QuickInquiryForm from "@/components/site/QuickInquiryForm";
import { useLang } from "@/lib/lang-context";
import { MONTHS_BY_LANG, DAYS_BY_LANG } from "@/lib/i18n";

const DATE_LOCALE: Record<string, string> = { vi: "vi-VN", en: "en-US", ru: "ru-RU", zh: "zh-CN", ko: "ko-KR" };

export default function CalendarPage() {
  const { lang, t } = useLang();
  const [slots, setSlots] = useState<CalendarSlot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/schedule")
      .then((r) => (r.ok ? r.json() : []))
      .then(setSlots)
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-[1280px] mx-auto px-6 py-12">
        <h1 className="font-jost text-3xl font-bold text-ink mb-2">
          {t("navBook")}
        </h1>
        <p className="text-lg text-text mb-8">{t("calendarSubtitle")}</p>

        {loading ? (
          <p className="text-lg text-text">{t("loadingLabel")}</p>
        ) : (
          <ShowCalendar
            slots={slots}
            hideCancelled
            bookable
            labels={{
              statusAvailable: t("slotAvailable"),
              statusBooked: t("slotBooked"),
              statusPending: t("slotPending"),
              statusCancelled: t("statusCancelled"),
              months: MONTHS_BY_LANG[lang],
              days: DAYS_BY_LANG[lang],
              viewYear: t("viewYear"),
              viewMonth: t("viewMonth"),
              viewWeek: t("viewWeek"),
              unassignedSlot: t("unassignedSlot"),
              bookThisDate: t("bookThisDateLabel"),
              dateLocale: DATE_LOCALE[lang],
            }}
          />
        )}

        <div className="mt-16">
          <QuickInquiryForm />
        </div>
      </div>
    </main>
  );
}
