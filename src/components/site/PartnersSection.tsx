"use client";

import { useEffect, useState } from "react";
import { useLang } from "@/lib/lang-context";
import { PARTNER_LOGOS } from "@/data/home-content";
import { BracketHead } from "./BracketHead";

interface DbPartner {
  id: string;
  name: string;
  logoUrl: string;
  linkUrl: string | null;
  sinceYear: number | null;
}

export default function PartnersSection() {
  const { t } = useLang();
  const [partners, setPartners] = useState<DbPartner[] | null>(null);

  useEffect(() => {
    fetch("/api/partners")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => setPartners(Array.isArray(data) && data.length > 0 ? data : null))
      .catch(() => setPartners(null));
  }, []);

  // Falls back to the hardcoded launch-time logos until the admin adds real partners.
  const items = partners ?? PARTNER_LOGOS.map((p, i) => ({ id: String(i), name: p.name, logoUrl: p.logo, linkUrl: null, sinceYear: null }));

  // Duplicated so the track can loop seamlessly: at -50% translateX it's back
  // to the start of the (identical) second copy, with no visible seam.
  const track = [...items, ...items];

  return (
    <div className="bg-ink">
      <div className="max-w-[1280px] mx-auto px-6 pt-36 pb-16 sm:pt-24">
        <BracketHead title={t("partnersTitle")} subtitle={t("partnersSubtitle")} dark />
        <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
          <div className="flex w-max gap-10 animate-marquee">
            {track.map((p, i) => {
              const logo = (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={p.logoUrl}
                  alt={`${p.name} logo`}
                  className="max-w-[68%] max-h-[68%] object-contain transition-transform duration-500 group-hover:scale-110"
                />
              );
              return (
                <div key={`${p.id}-${i}`} className="group flex flex-col items-center gap-3 flex-none">
                  <div className="w-44 h-44 sm:w-56 sm:h-56 rounded-full bg-white flex items-center justify-center overflow-hidden shadow-[0_0_0_1px_rgba(255,255,255,0.08)] transition-shadow duration-300 hover:shadow-[0_0_0_3px_rgba(200,16,46,0.4)]">
                    {p.linkUrl ? (
                      <a href={p.linkUrl} target="_blank" rel="noopener noreferrer" className="w-full h-full flex items-center justify-center">
                        {logo}
                      </a>
                    ) : (
                      logo
                    )}
                  </div>
                  {p.sinceYear && (
                    <div className="text-[0.68rem] tracking-[0.12em] uppercase text-red font-bold">Từ {p.sinceYear}</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
