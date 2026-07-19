"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLang, Lang } from "@/lib/lang-context";

export const NAV_ORDER = [
  { href: "/ve-chung-toi", key: "navAbout" as const },
  { href: "/dich-vu", key: "navServices" as const },
  { href: "/doi-tac", key: "navPartners" as const },
  { href: "/gallery", key: "navGallery" as const },
  { href: "/danh-gia", key: "navReviews" as const },
  { href: "/calendar", key: "navBook" as const },
];

const LANG_OPTIONS: { code: Lang; label: string }[] = [
  { code: "vi", label: "VI" },
  { code: "en", label: "EN" },
  { code: "ru", label: "RU" },
  { code: "zh", label: "中文" },
  { code: "ko", label: "KO" },
];

function LangSwitch({ lang, setLang, className = "" }: { lang: Lang; setLang: (l: Lang) => void; className?: string }) {
  return (
    <div className={`flex items-center gap-1.5 font-jost flex-wrap ${className}`}>
      {LANG_OPTIONS.map((opt, i) => (
        <span key={opt.code} className="flex items-center gap-1.5">
          {i > 0 && <span className="text-border text-xs">/</span>}
          <button
            onClick={() => setLang(opt.code)}
            className={`text-xs font-bold px-0.5 ${lang === opt.code ? "text-ink" : "text-gray-300"}`}
          >
            {opt.label}
          </button>
        </span>
      ))}
    </div>
  );
}

export default function Header() {
  const { lang, setLang, t } = useLang();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinkClass = (href: string) =>
    `text-xs font-semibold uppercase tracking-[0.14em] pb-1 border-b transition-colors ${
      pathname === href ? "text-red border-red" : "text-ink border-transparent hover:text-red hover:border-red"
    }`;

  return (
    <header className="sticky top-0 z-[100] bg-white border-b border-border">
      <div className="max-w-[1280px] mx-auto flex items-center justify-between px-6 py-[22px]">
        <Link href="/" className="flex items-center gap-2 font-jost text-xl font-bold text-ink">
          <Image src="/logo/3tg-mark-red.png" alt="3TG" width={58} height={50} className="h-14 w-auto" priority />
          ProStage - Event
        </Link>

        <nav className="hidden lg:flex gap-9">
          {NAV_ORDER.map((item) => (
            <Link key={item.href} href={item.href} className={navLinkClass(item.href)}>
              {t(item.key)}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center">
          <a
            href="tel:0965528281"
            className="inline-block px-6 py-3 text-sm font-bold uppercase tracking-[0.1em] border border-ink text-ink rounded-full hover:bg-ink hover:text-white transition-colors"
          >
            {t("navContact")}
          </a>
          <LangSwitch lang={lang} setLang={setLang} className="ml-[22px]" />
        </div>

        <button
          className="flex lg:hidden flex-col justify-center gap-[5px] w-8 h-8"
          aria-label="Menu"
          onClick={() => setMobileOpen((v) => !v)}
        >
          <span className={`block h-0.5 w-full bg-ink transition-transform ${mobileOpen ? "translate-y-[7px] rotate-45" : ""}`} />
          <span className={`block h-0.5 w-full bg-ink transition-opacity ${mobileOpen ? "opacity-0" : ""}`} />
          <span className={`block h-0.5 w-full bg-ink transition-transform ${mobileOpen ? "-translate-y-[7px] -rotate-45" : ""}`} />
        </button>
      </div>

      {mobileOpen && (
        <nav className="flex lg:hidden flex-col bg-white border-b border-border">
          {NAV_ORDER.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="px-6 py-4 text-sm font-semibold uppercase tracking-wide text-ink border-b border-border text-center"
            >
              {t(item.key)}
            </Link>
          ))}
          <a href="tel:0965528281" className="px-6 py-4 text-sm font-semibold uppercase tracking-wide text-ink border-b border-border text-center">
            {t("navContact")}
          </a>
          <LangSwitch lang={lang} setLang={setLang} className="px-6 py-4 justify-center" />
        </nav>
      )}
    </header>
  );
}
