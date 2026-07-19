"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { useLang } from "@/lib/lang-context";

const GOOGLE_REVIEW_URL = process.env.NEXT_PUBLIC_GOOGLE_REVIEW_URL || "https://g.page/r/PLACEHOLDER/review";
// Zalo profile deep link format: zalo.me/<phone in international format, no +>.
const ZALO_URL = "https://zalo.me/84965528281";

const inputClass = "border border-border rounded-md px-3.5 py-2.5 text-sm text-ink bg-white focus:outline-none focus:border-red w-full";

type Step = "rate" | "positiveForm" | "negativeForm" | "thanksPositive" | "thanksNegative";

interface Props {
  onDone?: () => void;
}

export default function WriteReviewGate({ onDone }: Props) {
  const { t } = useLang();
  const [step, setStep] = useState<Step>("rate");
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [customerName, setCustomerName] = useState("");
  const [eventType, setEventType] = useState("");
  const [quote, setQuote] = useState("");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function pickRating(n: number) {
    setRating(n);
    setStep(n >= 4 ? "positiveForm" : "negativeForm");
  }

  async function submitPositive(e: React.FormEvent) {
    e.preventDefault();
    if (!customerName.trim() || !quote.trim()) return;
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerName, quote, rating, eventType: eventType || null }),
      });
      if (!res.ok) throw new Error();
      setStep("thanksPositive");
    } catch {
      setError(t("writeReviewErrorMsg"));
    } finally {
      setSubmitting(false);
    }
  }

  async function submitNegative(e: React.FormEvent) {
    e.preventDefault();
    if (comment.trim().length < 5) return;
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerName: customerName || null, rating, comment }),
      });
      if (!res.ok) throw new Error();
      setStep("thanksNegative");
    } catch {
      setError(t("writeReviewErrorMsg"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl p-7 md:p-9 max-w-xl mx-auto shadow-[0_0_0_1px_rgba(22,22,26,0.06)]">
      {step === "rate" && (
        <div className="text-center">
          <h3 className="font-jost text-lg font-bold text-ink mb-6">{t("writeReviewRateHeading")}</h3>
          <div className="flex items-center justify-center gap-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => pickRating(n)}
                onMouseEnter={() => setHovered(n)}
                onMouseLeave={() => setHovered(0)}
                aria-label={`${n} sao`}
                className="p-1 transition-transform hover:scale-110"
              >
                <Star size={40} className={n <= hovered ? "fill-red text-red" : "text-border"} />
              </button>
            ))}
          </div>
        </div>
      )}

      {step === "positiveForm" && (
        <form onSubmit={submitPositive} className="space-y-4">
          <h3 className="font-jost text-lg font-bold text-ink">{t("writeReviewFormTitle")}</h3>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wide text-ink">{t("formName")}</label>
            <input value={customerName} onChange={(e) => setCustomerName(e.target.value)} required className={inputClass} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wide text-ink">{t("writeReviewEventTypeLabel")}</label>
            <input value={eventType} onChange={(e) => setEventType(e.target.value)} className={inputClass} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wide text-ink">{t("writeReviewQuoteLabel")}</label>
            <textarea value={quote} onChange={(e) => setQuote(e.target.value)} required rows={4} className={inputClass} />
          </div>
          {error && <p className="text-xs text-red-600">{error}</p>}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 text-xs font-bold uppercase tracking-wide bg-ink text-white rounded-full hover:bg-red transition-colors disabled:opacity-60"
            >
              {submitting ? t("sendingLabel") : t("writeReviewSubmitBtn")}
            </button>
            <button
              type="button"
              onClick={() => setStep("rate")}
              className="px-5 py-2.5 text-xs font-bold uppercase tracking-wide border border-border text-text rounded-full hover:border-red hover:text-red transition-colors"
            >
              {t("writeReviewCancelBtn")}
            </button>
          </div>
        </form>
      )}

      {step === "negativeForm" && (
        <form onSubmit={submitNegative} className="space-y-4">
          <p className="text-sm text-text leading-relaxed">{t("writeReviewNegativeIntro")}</p>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wide text-ink">{t("writeReviewNegativeCommentLabel")}</label>
            <textarea value={comment} onChange={(e) => setComment(e.target.value)} required minLength={5} rows={4} className={inputClass} />
          </div>
          {error && <p className="text-xs text-red-600">{error}</p>}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 text-xs font-bold uppercase tracking-wide bg-ink text-white rounded-full hover:bg-red transition-colors disabled:opacity-60"
            >
              {submitting ? t("sendingLabel") : t("writeReviewNegativeSubmitBtn")}
            </button>
            <button
              type="button"
              onClick={() => setStep("rate")}
              className="px-5 py-2.5 text-xs font-bold uppercase tracking-wide border border-border text-text rounded-full hover:border-red hover:text-red transition-colors"
            >
              {t("writeReviewCancelBtn")}
            </button>
          </div>
        </form>
      )}

      {step === "thanksPositive" && (
        <div className="text-center space-y-4">
          <h3 className="font-jost text-lg font-bold text-ink">{t("writeReviewThanksTitle")}</h3>
          <p className="text-sm text-text leading-relaxed">{t("writeReviewThanksBody")}</p>
          <a
            href={GOOGLE_REVIEW_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 text-xs font-bold uppercase tracking-wide bg-red text-white rounded-full hover:bg-ink transition-colors"
          >
            {t("writeReviewGoogleCta")}
          </a>
          <button onClick={onDone} className="block mx-auto text-xs text-text hover:text-red underline mt-2">
            {t("closeLabel")}
          </button>
        </div>
      )}

      {step === "thanksNegative" && (
        <div className="text-center space-y-4">
          <h3 className="font-jost text-lg font-bold text-ink">{t("writeReviewThanksTitle")}</h3>
          <p className="text-sm text-text leading-relaxed">{t("writeReviewNegativeThanksBody")}</p>
          <a
            href={ZALO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 text-xs font-bold uppercase tracking-wide bg-red text-white rounded-full hover:bg-ink transition-colors"
          >
            {t("writeReviewZaloCta")}
          </a>
          <button onClick={onDone} className="block mx-auto text-xs text-text hover:text-red underline mt-2">
            {t("closeLabel")}
          </button>
        </div>
      )}
    </div>
  );
}
