"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface LightboxItem {
  src: string;
  alt: string;
  type: "image" | "video";
}

interface LightboxValue {
  open: (src: string, alt: string, type?: "image" | "video") => void;
}

const LightboxContext = createContext<LightboxValue | null>(null);

export function LightboxProvider({ children }: { children: ReactNode }) {
  const [item, setItem] = useState<LightboxItem | null>(null);

  return (
    <LightboxContext.Provider value={{ open: (src, alt, type = "image") => setItem({ src, alt, type }) }}>
      {children}
      {item && (
        <div
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/90 p-6 sm:p-10"
          onClick={() => setItem(null)}
        >
          <button
            type="button"
            aria-label="Close"
            onClick={() => setItem(null)}
            className="absolute top-6 right-6 flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-white/10 text-xl text-white hover:bg-white/20"
          >
            ✕
          </button>
          {item.type === "video" ? (
            <video
              src={item.src}
              controls
              autoPlay
              className="max-h-full max-w-full rounded-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.src}
              alt={item.alt}
              className="max-h-full max-w-full rounded-2xl object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          )}
        </div>
      )}
    </LightboxContext.Provider>
  );
}

export function useLightbox() {
  const ctx = useContext(LightboxContext);
  if (!ctx) throw new Error("useLightbox must be used within LightboxProvider");
  return ctx;
}
