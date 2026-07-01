"use client";

import Image from "next/image";
import { LayoutGrid, Layers, Settings, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/locales/LanguageContext";

export default function About() {
  const { lang, dict } = useLanguage();
  
  // Map icons dynamically
  const featureIcons = [
    <LayoutGrid key="0" className="text-pink-500 w-6 h-6" />,
    <Layers key="1" className="text-pink-500 w-6 h-6" />,
    <Settings key="2" className="text-pink-500 w-6 h-6" />,
    <ShieldCheck key="3" className="text-pink-500 w-6 h-6" />,
  ];

  return (
    <section id="about" className="py-20 sm:py-28 bg-white relative overflow-hidden">
      {/* Decorative ambient light spheres */}
      <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-pink-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-fuchsia-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Text Content */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Tagline */}
            <span className="text-pink-500 font-semibold tracking-wider text-xs sm:text-sm uppercase mb-2">
              {dict.about.title}
            </span>
            
            {/* Section Main Title */}
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-6 leading-tight">
              {dict.about.subtitle}
            </h2>

            {/* Narrative Paragraphs */}
            <div className="space-y-4 text-slate-600 text-sm sm:text-base leading-relaxed">
              <p>{dict.about.p1}</p>
              <p>{dict.about.p2}</p>
              <p>{dict.about.p3}</p>
            </div>
          </div>

          {/* Showroom Image Showcase */}
          <div className="lg:col-span-5 relative w-full aspect-[4/5] sm:aspect-square lg:aspect-[4/5] max-w-md mx-auto">
            {/* Background glowing frame */}
            <div className="absolute -inset-3 bg-gradient-to-tr from-pink-500 to-fuchsia-600 rounded-2xl blur-xl opacity-10 group-hover:opacity-20 transition duration-500" />
            
            {/* Main Image wrapper */}
            <div className="relative w-full h-full rounded-2xl overflow-hidden border border-slate-100 shadow-2xl">
              <Image
                src="/images/showroom.jpg"
                alt="Marwa Tawfik Showroom Storefront"
                fill
                className="object-cover"
                sizes="(max-w-768px) 100vw, 33vw"
              />
              {/* Inner glass overlay at bottom */}
              <div className="absolute bottom-0 left-0 right-0 bg-black/75 backdrop-blur-md border-t border-zinc-800 p-4 flex justify-between items-center text-xs">
                <div>
                  <span className="font-semibold text-white block">Trust Company (TSM)</span>
                  <span className="text-zinc-400">Eng. Marwa Tawfik Showroom</span>
                </div>
                <span className="text-pink-500 font-bold px-2 py-1 rounded bg-pink-500/10 border border-pink-500/20">
                  {lang === "ar" ? "معرض القاهرة" : "Cairo Showroom"}
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Feature pillars grid at bottom */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-16 sm:mt-24">
          {dict.about.features.map((feature, index) => (
            <div
              key={index}
              className="glass-card p-6 rounded-xl flex flex-col items-start"
            >
              {/* Icon Container */}
              <div className="p-3 bg-pink-500/10 border border-pink-500/25 rounded-lg mb-4">
                {featureIcons[index]}
              </div>
              
              {/* Feature Title */}
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                {feature.title}
              </h3>
              
              {/* Feature Description */}
              <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
