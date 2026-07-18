"use client";

import { useEffect, useState } from "react";
import { useLang } from "@/lib/lang-context";
import { SERVICE_PAGES } from "@/data/services-content";
import { generateShowSlots } from "@/lib/timeSlots";

const inputClass = "border border-border rounded-md px-3.5 py-3 text-lg text-ink bg-white focus:outline-none focus:border-red w-full";
const MAX_SERVICE_ROWS = 3;

const BAND_GROUP = SERVICE_PAGES.find((p) => p.slug === "band")!;
const SOUND_LIGHTING_GROUP = SERVICE_PAGES.find((p) => p.slug === "sound-lighting")!;
const PRODUCTION_GROUP = SERVICE_PAGES.find((p) => p.slug === "production")!;

interface EventOption {
  id: string;
  title: string;
}

// General-inquiry fallback for requests not tied to a specific event/date —
// forwards to the office by email. For a specific date/event, customers should
// use the real booking form on that event's page instead (linked from the
// calendar above when a slot is available).
export default function QuickInquiryForm() {
  const { lang, t } = useLang();
  const [events, setEvents] = useState<EventOption[]>([]);
  const [serviceRows, setServiceRows] = useState<string[]>([""]);
  // Show slot times — admin-configurable via SiteSettings, fetched instead of hardcoded.
  const [showSlots, setShowSlots] = useState<string[]>([]);

  // Event sub-services come from the live Event table (not hardcoded) so a
  // new admin-created event automatically shows up here.
  useEffect(() => {
    fetch("/api/events")
      .then((r) => (r.ok ? r.json() : []))
      .then((data: EventOption[]) => setEvents(data))
      .catch(() => setEvents([]));
  }, []);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { showSlotStart: string; showSlotEnd: string; showSlotStepMinutes: number } | null) => {
        if (data) setShowSlots(generateShowSlots(data.showSlotStart, data.showSlotEnd, data.showSlotStepMinutes));
      })
      .catch(() => {});
  }, []);

  function updateServiceRow(i: number, value: string) {
    setServiceRows((rows) => rows.map((r, idx) => (idx === i ? value : r)));
  }

  function addServiceRow() {
    setServiceRows((rows) => (rows.length < MAX_SERVICE_ROWS ? [...rows, ""] : rows));
  }

  function removeServiceRow(i: number) {
    setServiceRows((rows) => rows.filter((_, idx) => idx !== i));
  }

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const selectedServices = serviceRows.filter((v) => v);
    const lines = [
      `Họ tên: ${form.get("name")}`,
      `Số điện thoại: ${form.get("phone")}`,
      `Email: ${form.get("email") || "-"}`,
      `Loại dịch vụ: ${selectedServices.length > 0 ? selectedServices.join(", ") : "-"}`,
      `Ngày đặt show: ${form.get("date") || "-"}`,
      `Khung giờ: ${form.get("time") || "-"}`,
      `Ghi chú: ${form.get("notes") || "-"}`,
    ];
    const subject = encodeURIComponent(`Yêu cầu đặt lịch - ${form.get("name")}`);
    const body = encodeURIComponent(lines.join("\n"));
    window.location.href = `mailto:3thegear.pt@gmail.com?subject=${subject}&body=${body}`;
  }

  return (
    <div className="bg-cream rounded-2xl p-6 md:p-8">
      <h2 className="font-jost text-lg font-bold text-ink mb-1">{t("quickInquiryHeading")}</h2>
      <p className="text-lg text-text mb-6">{t("contactSubtitle")}</p>
      <div className="grid md:grid-cols-[1fr_1.2fr] gap-10">
        <div className="space-y-3 text-lg text-text leading-relaxed">
          <div><strong className="text-ink">{t("hotlineLabel")}:</strong> <a href="tel:0965528281" className="hover:text-red">0965 528 281</a></div>
          <div><strong className="text-ink">Email:</strong> <a href="mailto:3thegear.pt@gmail.com" className="hover:text-red">3thegear.pt@gmail.com</a></div>
          <div><strong className="text-ink">{t("areaLabel")}</strong> {t("areaValue")}</div>
        </div>
        <form onSubmit={submit} className="flex flex-col gap-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label={t("formName")}><input name="name" type="text" required className={inputClass} /></Field>
            <Field label={t("formPhone")}><input name="phone" type="tel" required className={inputClass} /></Field>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label={t("emailLabel")}><input name="email" type="email" className={inputClass} /></Field>
            <Field label={t("showDateLabel")}><input name="date" type="date" className={inputClass} /></Field>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label={t("eventTimeLabel")}>
              <select name="time" className={inputClass} defaultValue="">
                <option value="">{t("eventTimeOptionSelect")}</option>
                {showSlots.map((time) => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </Field>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-base font-bold uppercase tracking-wide text-ink">{t("formEventType")}</label>
            <div className="flex flex-col gap-2">
              {serviceRows.map((value, i) => (
                <div key={i} className="flex items-center gap-2">
                  <select value={value} onChange={(e) => updateServiceRow(i, e.target.value)} className={inputClass}>
                    <option value="">{t("eventTypeOptionSelect")}</option>
                    <optgroup label={t("serviceTypeBand")}>
                      {BAND_GROUP.subServices.map((s) => (
                        <option key={s.vi} value={`${t("serviceTypeBand")} - ${s[lang]}`}>
                          {s[lang]}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label={t("serviceTypeSoundLighting")}>
                      {SOUND_LIGHTING_GROUP.subServices.map((s) => (
                        <option key={s.vi} value={`${t("serviceTypeSoundLighting")} - ${s[lang]}`}>
                          {s[lang]}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label={t("serviceTypeProduction")}>
                      {PRODUCTION_GROUP.subServices.map((s) => (
                        <option key={s.vi} value={`${t("serviceTypeProduction")} - ${s[lang]}`}>
                          {s[lang]}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label={t("serviceTypeEvent")}>
                      {events.length > 0 ? (
                        events.map((ev) => (
                          <option key={ev.id} value={`${t("serviceTypeEvent")} - ${ev.title}`}>
                            {ev.title}
                          </option>
                        ))
                      ) : (
                        <option value={t("serviceTypeEvent")}>{t("serviceTypeEvent")}</option>
                      )}
                    </optgroup>
                  </select>
                  {serviceRows.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeServiceRow(i)}
                      aria-label={t("removeServiceLabel")}
                      className="flex-none px-2 text-lg text-text hover:text-red transition-colors"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
            {serviceRows.length < MAX_SERVICE_ROWS && (
              <button
                type="button"
                onClick={addServiceRow}
                className="self-start text-base font-bold text-red hover:underline"
              >
                {t("addServiceLabel")}
              </button>
            )}
          </div>

          <Field label={t("formNotes")}><textarea name="notes" className={`${inputClass} min-h-[100px] resize-y`} /></Field>
          <button type="submit" className="self-start px-6 py-3 text-base font-bold uppercase tracking-[0.12em] bg-ink text-white rounded-full hover:bg-red transition-colors">
            {t("formSubmit")}
          </button>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-base font-bold uppercase tracking-wide text-ink">{label}</label>
      {children}
    </div>
  );
}
