"use client";

import React from "react";
import { useLanguage } from "@/locales/LanguageContext";
import ContactInfo from "./contact/ContactInfo";
import ContactForm from "./contact/ContactForm";
import ContactMap from "./contact/ContactMap";

export default function Contact() {
  const { dict } = useLanguage();

  return (
    <section id="contact" className="py-20 sm:py-28 bg-white border-t border-slate-100 relative overflow-hidden">
      {/* Decorative glows */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-pink-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-fuchsia-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-24">
          <span className="text-pink-500 font-semibold tracking-wider text-xs sm:text-sm uppercase mb-2 block">
            {dict.contact.title}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
            {dict.contact.subtitle}
          </h2>
          <div className="w-16 h-1 bg-pink-600 mx-auto rounded-full mt-4" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-stretch">
          <ContactInfo />
          <ContactForm />
        </div>

        <ContactMap />
      </div>
    </section>
  );
}
