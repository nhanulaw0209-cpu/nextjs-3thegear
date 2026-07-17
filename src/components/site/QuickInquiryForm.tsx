"use client";

import { useLang } from "@/lib/lang-context";

const inputClass = "border border-border rounded-md px-3.5 py-3 text-lg text-ink bg-white focus:outline-none focus:border-red w-full";

// General-inquiry fallback for requests not tied to a specific event/date —
// forwards to the office by email. For a specific date/event, customers should
// use the real booking form on that event's page instead (linked from the
// calendar above when a slot is available).
export default function QuickInquiryForm() {
  const { t } = useLang();

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const lines = [
      `Họ tên: ${form.get("name")}`,
      `Số điện thoại: ${form.get("phone")}`,
      `Email: ${form.get("email") || "-"}`,
      `Loại dịch vụ: ${form.get("eventType") || "-"}`,
      `Ngày đặt show: ${form.get("date") || "-"}`,
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
            <Field label={t("formEventType")}>
              <select name="eventType" className={inputClass}>
                <option value="">{t("eventTypeOptionSelect")}</option>
                <option value={t("serviceTypeBand")}>{t("serviceTypeBand")}</option>
                <option value={t("serviceTypeSoundLighting")}>{t("serviceTypeSoundLighting")}</option>
                <option value={t("serviceTypeProduction")}>{t("serviceTypeProduction")}</option>
                <option value={t("serviceTypeEvent")}>{t("serviceTypeEvent")}</option>
              </select>
            </Field>
          </div>
          <Field label={t("showDateLabel")}><input name="date" type="date" className={inputClass} /></Field>
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
