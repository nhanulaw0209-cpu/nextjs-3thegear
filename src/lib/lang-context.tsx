"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { UI_STRINGS } from "./i18n";

export type Lang = "vi" | "en" | "ru" | "zh" | "ko";

const VALID_LANGS: Lang[] = ["vi", "en", "ru", "zh", "ko"];

interface LangContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: keyof typeof UI_STRINGS) => string;
}

const LangContext = createContext<LangContextValue | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("vi");

  useEffect(() => {
    const saved = localStorage.getItem("3tg-lang");
    if (saved && VALID_LANGS.includes(saved as Lang)) setLangState(saved as Lang);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-lang", lang);
  }, [lang]);

  const setLang = (next: Lang) => {
    setLangState(next);
    localStorage.setItem("3tg-lang", next);
  };

  const t = (key: keyof typeof UI_STRINGS) => UI_STRINGS[key][lang];

  return <LangContext.Provider value={{ lang, setLang, t }}>{children}</LangContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used within LangProvider");
  return ctx;
}
