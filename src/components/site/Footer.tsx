"use client";

import Image from "next/image";
import Link from "next/link";
import { useLang } from "@/lib/lang-context";
import { NAV_ORDER } from "./Header";

export default function Footer() {
  const { t } = useLang();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-border pt-12 pb-8 px-6">
      <div className="max-w-[1280px] mx-auto">
        <div className="flex flex-wrap justify-between gap-10">
          <div className="max-w-sm">
            <div className="flex items-center gap-2 font-jost text-lg font-bold text-ink">
              <Image src="/logo/3tg-mark-red.png" alt="3TG" width={25} height={21} className="h-6 w-auto" />
              ProStage - Event
            </div>
            <p className="mt-3 text-base text-text leading-relaxed">{t("footerTagline")}</p>
          </div>

          <nav className="flex flex-col gap-2.5">
            {NAV_ORDER.map((item) => (
              <Link key={item.href} href={item.href} className="text-base text-text hover:text-red transition-colors">
                {t(item.key)}
              </Link>
            ))}
          </nav>

          <div>
            <div className="text-xs font-bold uppercase tracking-wide text-ink mb-3">{t("footerConnect")}</div>
            <a
              href="https://www.facebook.com/phien.p.phuc"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="flex items-center justify-center w-10 h-10 rounded-full border border-border text-text hover:border-red hover:text-red transition-colors"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.51 1.49-3.9 3.77-3.9 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.89h2.78l-.44 2.91h-2.34V22c4.78-.76 8.44-4.92 8.44-9.94Z" />
              </svg>
            </a>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border flex flex-wrap items-center justify-between gap-2 text-xs text-text/70">
          <span>
            © {year} 3TG Event. {t("footerRights")}
          </span>
          <span>
            {t("footerDesignedBy")}{" "}
            <a
              href="https://chartena.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-red transition-colors"
            >
              Chartena.com
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
