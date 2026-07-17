"use client";

import Link from "next/link";
import { useLang } from "@/lib/lang-context";
import ServiceGroupCards from "@/components/site/ServiceGroupCards";

export default function ServicesIndexPage() {
  const { t } = useLang();

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-[1280px] mx-auto px-6 py-12">
        <h1 className="font-jost text-3xl font-bold text-ink mb-10">
          {t("servicesHeading")}
        </h1>

        <ServiceGroupCards />

        <div className="text-center mt-12">
          <Link
            href="/calendar"
            className="inline-block px-8 py-4 text-base font-bold uppercase tracking-[0.12em] bg-ink text-white rounded-full hover:bg-red transition-colors"
          >
            {t("bookNow")}
          </Link>
        </div>
      </div>
    </main>
  );
}
