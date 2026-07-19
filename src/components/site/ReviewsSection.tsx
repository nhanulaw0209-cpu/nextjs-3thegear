"use client";

import { useEffect, useState } from "react";
import { Star, Quote } from "lucide-react";
import { useLang } from "@/lib/lang-context";
import { DEMO_REVIEWS } from "@/data/home-content";
import { BracketHead } from "./BracketHead";
import WriteReviewGate from "./WriteReviewGate";

interface DbReview {
  id: string;
  customerName: string;
  quote: string;
  rating: number;
  eventType: string | null;
  avatarUrl: string | null;
}

export default function ReviewsSection() {
  const { t } = useLang();
  const [reviews, setReviews] = useState<DbReview[] | null>(null);
  const [showGate, setShowGate] = useState(false);

  useEffect(() => {
    fetch("/api/reviews")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => setReviews(Array.isArray(data) && data.length > 0 ? data : null))
      .catch(() => setReviews(null));
  }, []);

  // Falls back to hardcoded demo reviews until the admin adds real ones.
  const items =
    reviews ??
    DEMO_REVIEWS.map((r, i) => ({ id: String(i), customerName: r.customerName, quote: r.quote, rating: r.rating, eventType: r.eventType, avatarUrl: null }));

  return (
    <div className="bg-cream">
      <div className="max-w-[1280px] mx-auto px-6 pt-36 pb-24 sm:pt-24">
        <BracketHead title={t("reviewsTitle")} subtitle={t("reviewsSubtitle")} />

        {items.length === 0 ? (
          <p className="text-center text-text">{t("reviewsEmptyLabel")}</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((r, i) => (
              <div
                key={r.id}
                style={{ animationDelay: `${i * 90}ms` }}
                className="group relative overflow-hidden opacity-0 animate-fade-in-up bg-white rounded-2xl p-7 flex flex-col shadow-[0_0_0_1px_rgba(22,22,26,0.06)] transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-[0_0_0_1px_rgba(200,16,46,0.15),0_20px_36px_-16px_rgba(200,16,46,0.35)]"
              >
                <Quote
                  size={64}
                  className="absolute -top-2 -right-2 text-red/[0.06] rotate-6 transition-transform duration-300 group-hover:rotate-0 group-hover:scale-110"
                />
                <div className="relative flex items-center gap-0.5 mb-4">
                  {Array.from({ length: 5 }).map((_, si) => (
                    <Star
                      key={si}
                      size={16}
                      className={`transition-transform duration-300 ${si < r.rating ? "fill-red text-red" : "text-border"}`}
                      style={{ transitionDelay: `${si * 40}ms` }}
                    />
                  ))}
                </div>
                <p className="relative text-ink leading-relaxed flex-1">&ldquo;{r.quote}&rdquo;</p>
                <div className="relative flex items-center gap-3 mt-6">
                  {r.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={r.avatarUrl} alt={r.customerName} className="w-11 h-11 rounded-full object-cover flex-none" />
                  ) : (
                    <div className="w-11 h-11 rounded-full bg-ink text-white flex items-center justify-center font-bold flex-none transition-colors duration-300 group-hover:bg-red">
                      {r.customerName.charAt(0)}
                    </div>
                  )}
                  <div>
                    <div className="font-jost font-bold text-ink text-sm">{r.customerName}</div>
                    {r.eventType && <div className="text-xs text-text">{r.eventType}</div>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-16 flex flex-col items-center">
          {!showGate ? (
            <button
              onClick={() => setShowGate(true)}
              className="px-7 py-3.5 text-xs font-bold uppercase tracking-[0.12em] bg-ink text-white rounded-full hover:bg-red transition-colors"
            >
              {t("writeReviewCta")}
            </button>
          ) : (
            <div className="w-full animate-fade-in-up">
              <WriteReviewGate onDone={() => setShowGate(false)} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
