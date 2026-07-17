"use client";

import Link from "next/link";
import { useLang } from "@/lib/lang-context";

export default function Hero() {
  const { t } = useLang();

  return (
    <section
      className="relative h-[88vh] min-h-[560px] overflow-hidden bg-ink bg-cover bg-[center_20%] bg-[url('/3thegear-photos/img/photo-hero-band-mobile.jpg')] md:bg-[url('/3thegear-photos/img/photo-hero-band.jpg')]"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/20 to-black/85" />
      <div className="relative z-10 max-w-[1280px] mx-auto h-full px-6 pb-16 flex flex-col justify-end text-white">
        <p className="text-base tracking-[0.3em] uppercase text-[#d8c493] mb-[18px]">{t("heroEyebrow")}</p>
        <h1 className="font-jost text-[clamp(2.4rem,6vw,4.2rem)] font-bold leading-[1.05] uppercase max-w-3xl">
          {t("heroTitle")}
        </h1>
        <div className="mt-[30px] flex gap-3 flex-wrap">
          <Link
            href="/dich-vu"
            className="inline-block px-6 py-[13px] text-base font-bold uppercase tracking-[0.12em] bg-red text-white border border-red rounded-full transition-all duration-300 hover:bg-red-dark hover:border-red-dark hover:scale-105"
          >
            {t("navServices")}
          </Link>
          <a
            href="tel:0965528281"
            className="inline-block px-6 py-3 text-lg font-bold uppercase tracking-[0.1em] bg-transparent border border-white/40 text-white rounded-full transition-colors duration-300 hover:bg-white/10 hover:border-white"
          >
            {t("navContact")}
          </a>
        </div>
      </div>
    </section>
  );
}
