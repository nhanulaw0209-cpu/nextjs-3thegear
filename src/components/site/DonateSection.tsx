"use client";

import { useLang } from "@/lib/lang-context";
import { BracketHead } from "./BracketHead";

export default function DonateSection({ qrImageUrl }: { qrImageUrl: string | null }) {
  const { t } = useLang();

  return (
    <div id="donate" className="bg-ink">
      <div className="max-w-[1280px] mx-auto px-6 py-16">
        <BracketHead title={t("donateTitle")} subtitle={t("donateSubtitle")} dark />
        <div className="grid sm:grid-cols-[220px_1fr] gap-14 items-center justify-items-center sm:justify-items-start text-center sm:text-left">
          <div>
            <div className="w-[200px] h-[200px] rounded-2xl bg-white border border-white/15 p-3 mx-auto flex items-center justify-center">
              {qrImageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={qrImageUrl} alt="QR chuyển khoản" className="w-full h-full object-contain" />
              ) : (
                <span className="text-base text-text">QR Demo</span>
              )}
            </div>
            <div className="text-center text-[0.68rem] tracking-[0.12em] uppercase text-red font-bold mt-3.5">
              {t(qrImageUrl ? "donateQrLabelReal" : "donateQrLabel")}
            </div>
          </div>
          <div>
            <div className="flex gap-3.5 flex-wrap justify-center sm:justify-start">
              <a
                href="tel:0965528281"
                className="inline-block px-9 py-4 text-lg font-extrabold uppercase tracking-[0.12em] bg-red text-white rounded-full hover:bg-red-dark transition-colors"
              >
                {t("donateButton")}
              </a>
            </div>
            {!qrImageUrl && <p className="text-base text-[#9a9a9e] mt-4">{t("donateNote")}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
