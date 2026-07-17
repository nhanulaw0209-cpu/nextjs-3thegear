"use client";

import Link from "next/link";
import { useLang } from "@/lib/lang-context";
import { SERVICE_PAGES, EVENT_GROUP } from "@/data/services-content";

const GROUP_CARDS = [...SERVICE_PAGES, EVENT_GROUP];

export default function ServiceGroupCards() {
  const { lang } = useLang();

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {GROUP_CARDS.map((group) => (
        <Link key={group.slug} href={`/dich-vu/${group.slug}`} className="group block">
          <div className="relative w-full aspect-[4/5] overflow-hidden rounded-2xl bg-cream">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={group.heroImage}
              alt={group.label}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
            />
            <div className="absolute inset-x-0 bottom-0 p-5 backdrop-blur-md bg-white/75">
              <div className="text-[0.65rem] tracking-[0.2em] uppercase text-red font-bold mb-1.5">{group.tagline[lang]}</div>
              <div className="font-jost text-lg font-bold text-ink leading-tight">{group.label}</div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
