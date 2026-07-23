"use client";

import Link from "next/link";
import { useLang } from "@/lib/lang-context";
import { SERVICE_PAGES, EVENT_GROUP, ServicePage } from "@/data/services-content";
import BookingForm from "@/components/site/BookingForm";

function formatVnd(n: number) {
  return n.toLocaleString("vi-VN") + "đ";
}

interface BookableEvent {
  id: string;
  description: string | null;
  listBuyItems: { id: string; name: string; description: string | null; price: number }[];
  setlistItems: { title: string; artist: string | null }[];
}

const GROUP_ORDER = [...SERVICE_PAGES, EVENT_GROUP].map((g) => ({ slug: g.slug, label: g.label }));

function Hero({ image, label, tagline }: { image: string; label: string; tagline: string }) {
  return (
    <div
      className="relative h-[42vh] min-h-[300px] rounded-b-3xl overflow-hidden bg-ink bg-cover bg-center"
      style={{ backgroundImage: `url('${image}')` }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      <div className="relative z-10 max-w-[1000px] mx-auto h-full px-6 flex flex-col items-start justify-end pb-10">
        <div className="backdrop-blur-md bg-white/75 rounded-2xl px-5 py-4 -mx-5">
          <p className="text-base tracking-[0.3em] uppercase text-red font-bold mb-2">{tagline}</p>
          <h1 className="font-jost text-3xl md:text-4xl font-bold text-ink">{label}</h1>
        </div>
      </div>
    </div>
  );
}

function ServiceNav({ slug }: { slug: string }) {
  const i = GROUP_ORDER.findIndex((g) => g.slug === slug);
  const prev = GROUP_ORDER[(i - 1 + GROUP_ORDER.length) % GROUP_ORDER.length];
  const next = GROUP_ORDER[(i + 1) % GROUP_ORDER.length];

  return (
    <div className="flex justify-between gap-4 flex-wrap mt-12 pt-6 border-t border-border">
      <Link href={`/dich-vu/${prev.slug}`} className="text-lg text-text hover:text-red transition-colors">
        ← {prev.label}
      </Link>
      <Link href={`/dich-vu/${next.slug}`} className="text-lg text-text hover:text-red transition-colors">
        {next.label} →
      </Link>
    </div>
  );
}

interface EventSummary {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  heroImageUrl: string | null;
}

type Props =
  | { variant: "event"; events: EventSummary[] }
  | { variant: "service"; page: ServicePage; bookableEvent: BookableEvent | null; extraDescriptions: string[] };

export default function ServiceDetailClient(props: Props) {
  const { lang, t } = useLang();

  if (props.variant === "event") {
    const { events } = props;
    return (
      <main className="min-h-screen bg-white">
        <Hero image={EVENT_GROUP.heroImage} label={EVENT_GROUP.label} tagline={EVENT_GROUP.tagline[lang]} />
        <div className="max-w-[1000px] mx-auto px-6 py-12">
          <Link href="/dich-vu" className="text-base text-red uppercase tracking-wide font-bold hover:underline">
            {t("backToServices")}
          </Link>
          <p className="text-xl text-text mt-6 max-w-2xl">{EVENT_GROUP.intro[lang]}</p>

          {events.length > 0 ? (
            <section className="mt-12 grid sm:grid-cols-2 gap-6">
              {events.map((ev) => (
                <Link key={ev.id} href={`/events/${ev.slug}`} className="group block rounded-2xl overflow-hidden border border-border">
                  <div className="relative aspect-[4/3] bg-cream overflow-hidden">
                    {ev.heroImageUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={ev.heroImageUrl} alt={ev.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.06]" />
                    )}
                  </div>
                  <div className="p-4">
                    <div className="font-jost text-lg font-semibold text-ink group-hover:text-red transition-colors">{ev.title}</div>
                    {ev.summary && <div className="text-lg text-text mt-1.5">{ev.summary}</div>}
                  </div>
                </Link>
              ))}
            </section>
          ) : (
            <p className="text-lg text-text italic mt-12">{t("pricingComingSoon")}</p>
          )}

          <div className="mt-12 text-center">
            <Link
              href="/calendar"
              className="inline-block px-8 py-4 text-base font-bold uppercase tracking-[0.12em] bg-ink text-white rounded-full hover:bg-red transition-colors"
            >
              {t("bookNow")}
            </Link>
          </div>

          <ServiceNav slug="event" />
        </div>
      </main>
    );
  }

  const { page, bookableEvent, extraDescriptions } = props;

  return (
    <main className="min-h-screen bg-white">
      <Hero image={page.heroImage} label={page.label} tagline={page.tagline[lang]} />
      <div className="max-w-[1000px] mx-auto px-6 py-12">
        <Link href="/dich-vu" className="text-base text-red uppercase tracking-wide font-bold hover:underline">
          {t("backToServices")}
        </Link>
        <p className="text-xl text-text mt-6 max-w-2xl">{page.intro[lang]}</p>
        {bookableEvent?.description && (
          <p className="text-lg leading-relaxed text-text mt-4 whitespace-pre-line">{bookableEvent.description}</p>
        )}
        {extraDescriptions.map((desc) => (
          <p key={desc} className="text-lg leading-relaxed text-text mt-4 whitespace-pre-line">{desc}</p>
        ))}

        {page.sections.map((section) => (
          <section key={section.heading.vi} className="mt-12">
            <h2 className="font-jost text-xl font-bold text-ink mb-5">
              {section.heading[lang]}
            </h2>
            {section.body && <p className="text-lg leading-relaxed text-text">{section.body[lang]}</p>}
            {section.items && (
              <div className="grid sm:grid-cols-2 gap-3">
                {section.items[lang].map((item) => (
                  <div key={item} className="flex items-start gap-3 bg-cream rounded-xl px-4 py-3.5 text-lg text-ink">
                    <span className="text-red font-bold flex-none">›</span>
                    {item}
                  </div>
                ))}
              </div>
            )}
            {section.packages && (
              <div className="grid sm:grid-cols-2 gap-5">
                {section.packages.map((pkg) => (
                  <div key={pkg.name.vi} className="rounded-2xl border-2 border-red bg-cream p-6 sm:p-7">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 mb-4">
                      <h3 className="font-jost text-xl font-bold text-ink">{pkg.name[lang]}</h3>
                      <div className="font-jost text-2xl font-bold text-red whitespace-nowrap">{pkg.price[lang]}</div>
                    </div>
                    <ul className="space-y-2 mb-4">
                      {pkg.includes[lang].map((inc) => (
                        <li key={inc} className="flex items-start gap-2.5 text-lg text-ink">
                          <span className="text-red font-bold flex-none mt-0.5">✓</span>
                          {inc}
                        </li>
                      ))}
                    </ul>
                    <p className="text-base text-text italic">{pkg.suited[lang]}</p>
                  </div>
                ))}
              </div>
            )}
            {section.priceList && (
              <div className="border border-border divide-y divide-border rounded-2xl overflow-hidden">
                {section.priceList.map((row) => (
                  <div key={row.label.vi} className="flex items-center justify-between gap-4 p-4">
                    <span className="text-lg text-ink">{row.label[lang]}</span>
                    <span className="font-jost text-lg font-bold text-red whitespace-nowrap">{row.price[lang]}</span>
                  </div>
                ))}
              </div>
            )}
            {section.note && <p className="mt-4 text-base text-text">{section.note[lang]}</p>}
          </section>
        ))}

        {page.bookableEventSlug && (
          <section className="mt-12">
            <h2 className="font-jost text-xl font-bold text-ink mb-5">{t("listBuyHeading")}</h2>
            {bookableEvent && bookableEvent.listBuyItems.length > 0 ? (
              <div className="border border-border divide-y divide-border rounded-2xl overflow-hidden">
                {bookableEvent.listBuyItems.map((item) => (
                  <div key={item.id} className="p-4">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-lg text-ink font-semibold">{item.name}</span>
                      <span className="font-jost text-lg font-bold text-red whitespace-nowrap">{formatVnd(item.price)}</span>
                    </div>
                    {item.description && <div className="text-base text-text mt-1 whitespace-pre-line">{item.description}</div>}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-lg text-text italic">{t("pricingComingSoon")}</p>
            )}
          </section>
        )}

        {bookableEvent && bookableEvent.setlistItems.length > 0 && (
          <section className="mt-12">
            <h2 className="font-jost text-xl font-bold text-ink mb-5">{t("equipmentHeading")}</h2>
            <div className="border border-border divide-y divide-border rounded-2xl overflow-hidden">
              {bookableEvent.setlistItems.map((item) => (
                <div key={item.title} className="flex items-center justify-between gap-4 p-4">
                  <span className="text-lg text-ink">{item.title}</span>
                  {item.artist && <span className="text-base text-text whitespace-nowrap">{item.artist}</span>}
                </div>
              ))}
            </div>
          </section>
        )}

        {bookableEvent && bookableEvent.listBuyItems.length > 0 && (
          <section className="mt-12">
            <h2 className="font-jost text-xl font-bold text-ink mb-5">{t("bookingHeading")}</h2>
            <BookingForm eventId={bookableEvent.id} listBuyItems={bookableEvent.listBuyItems} />
          </section>
        )}

        {page.testimonial && (
          <section className="mt-12 bg-ink rounded-2xl p-8 text-center">
            <p className="text-white text-xl leading-relaxed italic">&ldquo;{page.testimonial.quote[lang]}&rdquo;</p>
            <p className="text-red text-base uppercase tracking-wide font-bold mt-4">{page.testimonial.author[lang]}</p>
          </section>
        )}

        {!(bookableEvent && bookableEvent.listBuyItems.length > 0) && (
          <div className="mt-12 text-center">
            <Link
              href="/calendar"
              className="inline-block px-8 py-4 text-base font-bold uppercase tracking-[0.12em] bg-ink text-white rounded-full hover:bg-red transition-colors"
            >
              {t("bookNow")}
            </Link>
          </div>
        )}

        <ServiceNav slug={page.slug} />
      </div>
    </main>
  );
}
