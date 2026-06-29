"use client";

import { Palette, Hammer, LayoutList, Wrench } from "lucide-react";
import { dictionaries, Locale } from "@/locales/dictionaries";

interface ServicesProps {
  lang: Locale;
}

export default function Services({ lang }: ServicesProps) {
  const dict = dictionaries[lang];

  // Dynamic lucide-react icons list for services
  const icons = [
    <Palette key="0" className="w-8 h-8 text-pink-500" />,
    <Hammer key="1" className="w-8 h-8 text-pink-500" />,
    <LayoutList key="2" className="w-8 h-8 text-pink-500" />,
    <Wrench key="3" className="w-8 h-8 text-pink-500" />,
  ];

  return (
    <section id="services" className="py-20 sm:py-28 bg-white border-t border-slate-100 relative overflow-hidden">
      {/* Visual lighting accents */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-24">
          <span className="text-pink-500 font-semibold tracking-wider text-xs sm:text-sm uppercase mb-2 block">
            {dict.services.title}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
            {dict.services.subtitle}
          </h2>
          <div className="w-16 h-1 bg-pink-600 mx-auto rounded-full mt-4" />
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {dict.services.items.map((item, index) => (
            <div
              key={index}
              className="glass-card p-8 rounded-2xl flex flex-col justify-between group cursor-default transition-all duration-300"
            >
              <div>
                {/* Icon Container with glowing hover */}
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl w-fit mb-6 group-hover:border-pink-500/40 group-hover:bg-pink-500/5 transition-all duration-300">
                  {icons[index]}
                </div>

                {/* Service Title */}
                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-pink-600 transition-colors">
                  {item.title}
                </h3>

                {/* Service Description */}
                <p className="text-slate-500 text-sm leading-relaxed mb-6">
                  {item.desc}
                </p>
              </div>

              {/* Read more or decorative indicator */}
              <div className="text-xs font-semibold text-pink-500/60 group-hover:text-pink-500 flex items-center gap-1 mt-auto">
                <span>{lang === "ar" ? "خدمة متميزة" : "Premium Service"}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-pulse" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
