"use client";

import { useLang } from "@/lib/lang-context";
import GalleryGrid from "@/components/site/GalleryGrid";
import BookingForm from "@/components/site/BookingForm";

interface EventDetail {
  id: string;
  title: string;
  summary: string | null;
  description: string | null;
  showDuration: string | null;
  heroImageUrl: string | null;
  listBuyItems: { id: string; name: string; price: number; description: string | null }[];
  setlistItems: { id: string; title: string; artist: string | null }[];
  galleryItems: { id: string; type: string; url: string; caption: string | null; category?: string }[];
}

export default function EventDetailClient({ event }: { event: EventDetail }) {
  const { t } = useLang();

  return (
    <main className="min-h-screen bg-white">
      {event.heroImageUrl && (
        <div
          className="relative h-[46vh] min-h-[320px] rounded-b-3xl overflow-hidden bg-ink bg-cover bg-center"
          style={{ backgroundImage: `url('${event.heroImageUrl}')` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/10" />
          <div className="relative z-10 max-w-[1000px] mx-auto h-full px-6 flex items-end pb-10">
            <h1 className="font-jost text-3xl md:text-4xl font-bold text-white">{event.title}</h1>
          </div>
        </div>
      )}

      <div className="max-w-[1000px] mx-auto px-6 py-12">
        {!event.heroImageUrl && <h1 className="font-jost text-3xl font-bold text-ink">{event.title}</h1>}

        {event.summary && <p className="text-xl text-text mt-6">{event.summary}</p>}
        {event.description && <p className="text-lg leading-relaxed text-text mt-4 whitespace-pre-line">{event.description}</p>}
        {event.showDuration && (
          <p className="text-lg text-ink mt-4">
            <strong className="text-red">{t("showDurationLabel")}</strong> {event.showDuration}
          </p>
        )}

        {event.listBuyItems.length > 0 && (
          <section className="mt-12">
            <h2 className="font-jost text-xl font-bold text-ink mb-5">
              {t("listBuyHeading")}
            </h2>
            <div className="border border-border divide-y divide-border rounded-2xl overflow-hidden">
              {event.listBuyItems.map((item) => (
                <div key={item.id} className="p-4">
                  <div className="font-semibold text-ink text-lg">{item.name}</div>
                  {item.description && <div className="text-base text-text mt-1">{item.description}</div>}
                </div>
              ))}
            </div>
          </section>
        )}

        {event.setlistItems.length > 0 && (
          <section className="mt-12">
            <h2 className="font-jost text-xl font-bold text-ink mb-5">
              {t("setlistHeading")}
            </h2>
            <div className="border border-border divide-y divide-border rounded-2xl overflow-hidden">
              {event.setlistItems.map((item, i) => (
                <div key={item.id} className="flex items-center gap-4 p-4">
                  <span className="font-jost text-base text-red font-bold w-6 flex-none">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <div className="font-semibold text-ink text-lg">{item.title}</div>
                    {item.artist && <div className="text-base text-text mt-0.5">{item.artist}</div>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {event.galleryItems.length > 0 && (
          <section className="mt-12">
            <h2 className="font-jost text-xl font-bold text-ink mb-5">
              {t("imagesHeading")}
            </h2>
            <GalleryGrid items={event.galleryItems} />
          </section>
        )}

        {event.listBuyItems.length > 0 ? (
          <section className="mt-12">
            <h2 className="font-jost text-xl font-bold text-ink mb-5">
              {t("bookingHeading")}
            </h2>
            <BookingForm eventId={event.id} listBuyItems={event.listBuyItems} />
          </section>
        ) : (
          <div className="mt-12 text-center">
            <a
              href="tel:0965528281"
              className="inline-block px-8 py-4 text-base font-bold uppercase tracking-[0.12em] bg-ink text-white rounded-full hover:bg-red transition-colors"
            >
              {t("contactToBook")}
            </a>
          </div>
        )}
      </div>
    </main>
  );
}
