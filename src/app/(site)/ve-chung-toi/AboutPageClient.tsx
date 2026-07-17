"use client";

import Link from "next/link";
import { useLang } from "@/lib/lang-context";

interface Props {
  ownerPhotoUrl: string | null;
  galleryPhotos: { id: string; url: string }[];
}

export default function AboutPageClient({ ownerPhotoUrl, galleryPhotos }: Props) {
  const { t } = useLang();

  const STATS = [
    { num: "10+", label: t("statYears") },
    { num: "30+", label: t("statPartners") },
    { num: "5.6K", label: t("statFollowers") },
    { num: "100%", label: t("statSouth") },
  ];

  const BASIC_INFO = [
    { label: t("aboutInfoUs"), value: "3TG Event" },
    { label: t("aboutInfoArea"), value: t("areaValue") },
    { label: t("hotlineLabel"), value: "0965 528 281" },
  ];

  const BAND_MEMBERS = [
    { name: "Lam Phiên", role: "Guitarist - Leader" },
    { name: "David C", role: "Bassist" },
    { name: "Zahrah Châu Huyên", role: "Vocalist" },
    { name: "Jason Ngô", role: "Drummer" },
    { name: "Mr. Út", role: "Piano man" },
    { name: "Minh Huy", role: "Keyboard man" },
  ];

  return (
    <main className="min-h-screen bg-cream">
      <div className="max-w-[1100px] mx-auto px-6 py-12">
        <div className="grid md:grid-cols-[1fr_1.3fr] gap-14 items-start">
          <div className="group w-full aspect-[3/4] overflow-hidden rounded-3xl border-2 border-red">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/3thegear-photos/img/photo-about-band-group.jpg"
              alt={t("aboutEyebrow")}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
            />
          </div>

          <div>
            <div className="text-base tracking-[0.26em] uppercase text-red font-bold mb-4">{t("aboutEyebrow")}</div>
            <h1 className="font-jost text-3xl md:text-4xl font-bold text-ink leading-tight mb-6">{t("aboutTitle")}</h1>
            <p className="text-lg leading-[1.85] text-text mb-4">{t("aboutP1")}</p>
            <p className="text-lg leading-[1.85] text-text mb-4">{t("aboutP2")}</p>
            <p className="text-lg leading-[1.85] text-text mb-8">{t("aboutP3")}</p>

            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-3 mb-8">
              {BASIC_INFO.map((info) => (
                <div key={info.label} className="text-lg">
                  <span className="text-red font-bold uppercase tracking-wide text-base">{info.label}: </span>
                  <span className="text-ink">{info.value}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-px bg-border border border-border rounded-2xl overflow-hidden">
              {STATS.map((s) => (
                <div key={s.label} className="bg-white px-6 py-[26px]">
                  <div className="font-jost text-[2.1rem] font-bold text-ink leading-none">{s.num}</div>
                  <div className="text-base uppercase tracking-wide text-red font-bold mt-2">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="mt-10">
              <Link
                href="/calendar"
                className="inline-block px-8 py-4 text-base font-bold uppercase tracking-[0.12em] bg-ink text-white rounded-full hover:bg-red transition-colors"
              >
                {t("bookNow")}
              </Link>
            </div>
          </div>
        </div>

        <section className="mt-14">
          <h2 className="font-jost text-2xl font-bold text-ink mb-3">{t("aboutBandHeading")}</h2>
          <p className="text-lg leading-[1.85] text-text mb-6 max-w-3xl">{t("aboutBandIntro")}</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {BAND_MEMBERS.map((m) => (
              <div key={m.name} className="bg-cream rounded-xl px-4 py-3.5 text-center">
                <div className="font-jost text-lg font-bold text-ink">{m.name}</div>
                <div className="text-base text-red font-semibold uppercase tracking-wide mt-1">{m.role}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10 bg-ink rounded-2xl p-8">
          <div className={ownerPhotoUrl ? "grid sm:grid-cols-[auto_1fr] gap-6 items-start" : ""}>
            {ownerPhotoUrl && (
              <div className="w-32 h-32 sm:w-40 sm:h-40 flex-none overflow-hidden rounded-2xl border-2 border-red">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={ownerPhotoUrl} alt={t("leaderHeading")} className="w-full h-full object-cover" />
              </div>
            )}
            <div>
              <h2 className="font-jost text-xl font-bold text-white mb-3">{t("leaderHeading")}</h2>
              <p className="text-lg leading-[1.85] text-white/85">{t("leaderBio")}</p>
            </div>
          </div>
        </section>

        {galleryPhotos.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-14">
            {galleryPhotos.map((p) => (
              <div key={p.id} className="group w-full aspect-square overflow-hidden rounded-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.url}
                  alt=""
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
