"use client";

import React, { useState } from "react";
import { X, Maximize2, ExternalLink } from "lucide-react";
import { useLanguage } from "@/locales/LanguageContext";
import { trackGAEvent, trackPixelEvent } from "@/utils/analytics";

interface ReelItem {
  id: string;
  videoUrl: string;
  titleAr: string;
  titleEn: string;
}

const reelsData: ReelItem[] = [
  {
    id: "DZ3Tqgwol3j",
    videoUrl: "https://www.instagram.com/reel/DZ3Tqgwol3j/",
    titleAr: "جولة كاملة في مطبخ بولي لاك فخم ومقاوم للمياه",
    titleEn: "Bespoke Poly-lac Luxury Kitchen Video Tour"
  },
  {
    id: "DZzdNdjoCMM",
    videoUrl: "https://www.instagram.com/p/DZzdNdjoCMM/",
    titleAr: "تفاصيل مطبخ خشب طبيعي أرو كلاسيك عريق",
    titleEn: "Classic Natural Oak Kitchen Craftsmanship"
  },
  {
    id: "DYWyhWTo_VW",
    videoUrl: "https://www.instagram.com/p/DYWyhWTo_VW/",
    titleAr: "شاهد استغلال المساحة في دريسنج روم متكامل",
    titleEn: "Smart Spaces inside a Bespoke Dressing Closet"
  }
];

export default function ReelsSection() {
  const { lang } = useLanguage();
  const [activeLightboxId, setActiveLightboxId] = useState<string | null>(null);
  const instagramProfileUrl = "https://www.instagram.com/trust.marwa/";

  const handleProfileClick = () => {
    trackGAEvent("insta_reel_click", "engagement", "instagram_profile_reels");
    trackPixelEvent("Contact", { method: "instagram_profile_reels" });
  };

  const handleOpenLightbox = (id: string) => {
    setActiveLightboxId(id);
    trackGAEvent("reel_fullscreen_open", "video_engagement", id);
    trackPixelEvent("ViewContent", { content_name: `Reel-Fullscreen-${id}`, content_category: "Reels" });
  };

  const handleCloseLightbox = () => {
    setActiveLightboxId(null);
  };

  return (
    <section className="py-20 sm:py-28 bg-white border-t border-slate-100 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-1/3 right-0 w-[400px] h-[400px] bg-pink-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10" dir={lang === "ar" ? "rtl" : "ltr"}>
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-pink-500 font-semibold tracking-wider text-xs sm:text-sm uppercase mb-2 block">
            {lang === "ar" ? "المحتوى المرئي" : "Video Showcases"}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
            {lang === "ar" ? "شاهد أعمالنا من الداخل (Reels)" : "Explore Videos & Reels"}
          </h2>
          <p className="text-slate-500 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            {lang === "ar" 
              ? "تابع جولاتنا المصورة مباشرة من حسابنا على إنستغرام لمشاهدة التفاصيل الدقيقة للتسليم والتركيب."
              : "Watch live walkthroughs and execution details directly from our Instagram feed."
            }
          </p>
          <div className="w-16 h-1 bg-pink-600 mx-auto rounded-full mt-4" />
        </div>

        {/* Reels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto items-stretch justify-center">
          {reelsData.map((reel) => (
            <div
              key={reel.id}
              className="relative rounded-3xl overflow-hidden bg-slate-950 border border-slate-200/60 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 mx-auto w-full max-w-sm h-[580px] flex flex-col justify-between group"
            >
              {/* Inline Iframe Embed */}
              <div className="relative w-full h-[520px] bg-zinc-950">
                <iframe
                  src={`https://www.instagram.com/p/${reel.id}/embed/`}
                  className="w-full h-full border-0"
                  scrolling="no"
                  allowFullScreen
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                  title={`Instagram Reel ${reel.id}`}
                />
              </div>

              {/* Card Footer controls */}
              <div className="bg-zinc-900 border-t border-zinc-800 p-3 flex items-center justify-between z-10 text-white">
                <span className="text-[10px] text-zinc-400 font-bold truncate max-w-[180px] block" dir={lang === "ar" ? "rtl" : "ltr"}>
                  {lang === "ar" ? reel.titleAr : reel.titleEn}
                </span>

                <button
                  onClick={() => handleOpenLightbox(reel.id)}
                  className="inline-flex items-center gap-1 bg-pink-600 hover:bg-pink-700 text-white text-[10px] sm:text-xs font-bold px-3 py-1.5 rounded-lg cursor-pointer transition-all flex-shrink-0"
                >
                  <Maximize2 size={12} />
                  <span>{lang === "ar" ? "ملء الشاشة" : "Full Screen"}</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Channel CTA */}
        <div className="text-center mt-14">
          <a
            href={instagramProfileUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleProfileClick}
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-pink-600 to-fuchsia-600 hover:from-pink-700 hover:to-fuchsia-700 text-white font-bold px-8 py-4 rounded-full shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer text-sm"
          >
            {/* Inline Instagram SVG */}
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4"
            >
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
            </svg>
            <span>{lang === "ar" ? "شاهد المزيد على صفحة إنستغرام" : "Browse More Reels on Instagram"}</span>
          </a>
        </div>

        {/* Lightbox Modal (For true large view / full-screen simulation) */}
        {activeLightboxId && (
          <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4">
            
            {/* Lightbox Container */}
            <div className="relative w-full max-w-lg aspect-[9/16] max-h-[85vh] bg-zinc-950 rounded-3xl border border-zinc-800 shadow-2xl flex flex-col justify-between overflow-hidden animate-scale-up">
              
              {/* Header */}
              <div className="absolute top-4 left-4 right-4 z-30 flex items-center justify-between text-white pointer-events-auto">
                <span className="text-xs bg-zinc-950/70 px-3 py-1 rounded-full font-bold backdrop-blur-xs flex items-center gap-1.5">
                  {lang === "ar" ? "مشاهدة بملء الشاشة" : "Full Screen Lightbox"}
                </span>
                
                <button
                  onClick={handleCloseLightbox}
                  className="bg-zinc-900/80 hover:bg-pink-600 border border-zinc-800 p-1.5 rounded-full text-white cursor-pointer transition-all"
                  aria-label="Close Lightbox"
                >
                  <X size={18} />
                </button>
              </div>

              {/* High Resolution Iframe */}
              <div className="relative flex-grow w-full h-full pt-14 pb-16 bg-zinc-950">
                <iframe
                  src={`https://www.instagram.com/p/${activeLightboxId}/embed/`}
                  className="w-full h-full border-0"
                  scrolling="no"
                  allowFullScreen
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                  title="Instagram Full Screen Player"
                />
              </div>

              {/* Footer */}
              <div className="absolute bottom-0 left-0 right-0 bg-zinc-900 border-t border-zinc-800 p-3 z-30 flex items-center justify-between">
                <a
                  href={`https://www.instagram.com/p/${activeLightboxId}/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    trackGAEvent("reel_watch_direct_click", "video_engagement", activeLightboxId || "");
                    trackPixelEvent("ViewContent", { content_name: `Reel-External-${activeLightboxId}`, content_category: "Reels" });
                  }}
                  className="flex items-center gap-1.5 text-xs text-pink-500 hover:text-pink-400 font-bold mx-auto cursor-pointer"
                >
                  <span>{lang === "ar" ? "المشاهدة مباشرة في إنستغرام" : "Watch directly on Instagram"}</span>
                  <ExternalLink size={12} />
                </a>
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
}
