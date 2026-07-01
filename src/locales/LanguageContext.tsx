"use client";

import React, { createContext, useContext } from "react";
import { dictionaries, Locale } from "./dictionaries";

interface LanguageContextProps {
  lang: Locale;
  dict: typeof dictionaries.ar;
  otherLang: Locale;
  dir: "rtl" | "ltr";
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export function LanguageProvider({
  lang,
  children,
}: {
  lang: Locale;
  children: React.ReactNode;
}) {
  const dict = dictionaries[lang];
  const otherLang = lang === "ar" ? "en" : "ar";
  const dir = lang === "ar" ? "rtl" : "ltr";

  return (
    <LanguageContext.Provider value={{ lang, dict, otherLang, dir }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
