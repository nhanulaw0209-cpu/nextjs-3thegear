"use client";

import { ReactNode } from "react";
import { LangProvider } from "@/lib/lang-context";
import Header from "./Header";
import Footer from "./Footer";
import AIChatWidget from "./AIChatWidget";

export default function SiteChrome({ children }: { children: ReactNode }) {
  return (
    <LangProvider>
      <Header />
      {children}
      <Footer />
      <AIChatWidget />
    </LangProvider>
  );
}
