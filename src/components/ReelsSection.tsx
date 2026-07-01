"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Play, Eye, Heart, X, ExternalLink } from "lucide-react";
import { useLanguage } from "@/locales/LanguageContext";
import { trackGAEvent, trackPixelEvent } from "@/utils/analytics";

const Instagram = (props: React.SVGProps<SVGSVGElement> & { size?: number }) => {
  const { size = 24, ...rest } = props;
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      width={size}
      height={size}
      {...rest}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
};

interface ReelItem {
  id: string; // Instagram Reel ID
  thumbnail: string;
  titleAr: string;
  titleEn: string;
  views: string;
  likes: string;
  duration: string;
}

const reelsData: ReelItem[] = [
  {
    id: "C_5f6q-vNzS", // Mock Instagram Reel ID
    thumbnail: "/images/656875593_1542746357858459_4466184516215847562_n.jpg",
    titleAr: "جولة كاملة في مطبخ بولي لاك فخم ومقاوم للمياه",
    titleEn: "Bespoke Poly-lac Luxury Kitchen Video Tour",
    views: "18.5K",
    likes: "1.2K",
    duration: "0:45"
  },
  {
    id: "C_3u7m-bLmO",
    thumbnail: "/images/627781586_1494778699321892_3431980651333181156_n.jpg",
    titleAr: "تفاصيل مطبخ خشب طبيعي أرو كلاسيك عريق",
    titleEn: "Classic Natural Oak Kitchen Craftsmanship",
    views: "24.1K",
    likes: "2.5K",
    duration: "1:00"
  },
  {
    id: "C_1t8x-dRsF",
    thumbnail: "/images/689215323_1577073144425780_5648049577088391907_n.jpg",
    titleAr: "شاهد استغلال المساحة في دريسنج روم متكامل",
    titleEn: "Smart Spaces inside a Bespoke Dressing Closet",
    views: "15.3K",
    likes: "950",
    duration: "0:30"
  }
];

export default function ReelsSection() {
  const [activeReel, setActiveReel] = useState<ReelItem | null>(null);
  const { lang } = useLanguage();

  const handleOpenReel = (reel: ReelItem) => {
    setActiveReel(reel);
    trackGAEvent("reel_open", "video_engagement", reel.id);
    trackPixelEvent("ViewContent", { content_name: `Reel-${reel.id}`, content_category: "Reels" });
  };

  const handleCloseReel = () => {
    setActiveReel(null);
  };

  const instagramProfileUrl = "https://www.instagram.com/trust.marwa/";

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
              ? "تابع جولاتنا المصورة بالفيديو داخل المطابخ المنفذة على أرض الواقع بالتفاصيل الدقيقة."
              : "Watch live walkthroughs and execution details directly inside completed kitchens."
            }
          </p>
          <div className="w-16 h-1 bg-pink-600 mx-auto rounded-full mt-4" />
        </div>

        {/* Reels Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {reelsData.map((reel) => (
            <div
              key={reel.id}
              onClick={() => handleOpenReel(reel)}
              className="group relative aspect-[9/16] rounded-3xl overflow-hidden bg-slate-950 border border-slate-100 cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 max-w-xs mx-auto w-full"
            >
              {/* Cover Image */}
              <Image
                src={reel.thumbnail}
                alt={lang === "ar" ? reel.titleAr : reel.titleEn}
                fill
                sizes="(max-w-768px) 100vw, 33vw"
                className="object-cover opacity-85 group-hover:opacity-75 transition-opacity duration-300"
              />

              {/* Linear gradient shade */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-transparent to-black/35 z-10" />

              {/* Top Details (Duration) */}
              <div className="absolute top-5 left-5 z-20 bg-zinc-950/60 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-1 rounded-md">
                <span>{reel.duration}</span>
              </div>

              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <div className="w-14 h-14 rounded-full bg-white/20 hover:bg-pink-600/90 text-white backdrop-blur-md flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:bg-pink-600">
                  <Play size={24} className="fill-white ml-1" />
                </div>
              </div>

              {/* Instagram brand mark */}
              <div className="absolute top-5 right-5 z-20 text-white/80 hover:text-white transition-colors">
                <Instagram size={20} />
              </div>

              {/* Bottom Details */}
              <div className="absolute bottom-0 left-0 right-0 p-6 z-20 text-white flex flex-col justify-end gap-3">
                <h3 className="text-sm font-bold leading-snug line-clamp-2 drop-shadow-md">
                  {lang === "ar" ? reel.titleAr : reel.titleEn}
                </h3>
                
                {/* Stats row */}
                <div className="flex items-center gap-4 text-xs text-zinc-300">
                  <div className="flex items-center gap-1">
                    <Eye size={14} className="text-pink-500" />
                    <span>{reel.views}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart size={14} className="text-pink-500" />
                    <span>{reel.likes}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Channel CTA */}
        <div className="text-center mt-12">
          <a
            href={instagramProfileUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              trackGAEvent("social_click", "engagement", "instagram_profile_reels");
              trackPixelEvent("Contact", { method: "instagram_profile_reels" });
            }}
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-pink-600 to-fuchsia-600 hover:from-pink-700 hover:to-fuchsia-700 text-white font-bold px-7 py-3.5 rounded-full shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer text-sm"
          >
            <Instagram size={18} />
            <span>{lang === "ar" ? "شاهد المزيد على صفحة إنستغرام" : "Browse More Reels on Instagram"}</span>
          </a>
        </div>

        {/* Video Player Modal Backdrop */}
        {activeReel && (
          <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4">
            
            {/* Modal Box */}
            <div className="relative w-full max-w-sm aspect-[9/16] bg-zinc-950 rounded-3xl border border-zinc-800 shadow-2xl flex flex-col justify-between overflow-hidden animate-scale-up">
              
              {/* Header */}
              <div className="absolute top-4 left-4 right-4 z-30 flex items-center justify-between text-white pointer-events-auto">
                <span className="text-xs bg-zinc-950/70 px-3 py-1 rounded-full font-bold backdrop-blur-xs flex items-center gap-1.5">
                  <Instagram size={12} className="text-pink-500" />
                  {lang === "ar" ? "معاينة الفيديو" : "Reel Video"}
                </span>
                
                <button
                  onClick={handleCloseReel}
                  className="bg-zinc-900/80 hover:bg-pink-600 border border-zinc-800 p-1.5 rounded-full text-white cursor-pointer transition-all"
                  aria-label="Close Player"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Embedded Player Frame */}
              <div className="relative flex-grow w-full h-full pt-14 pb-16">
                <iframe
                  src={`https://www.instagram.com/reel/${activeReel.id}/embed/`}
                  className="w-full h-full border-0 rounded-b-xl"
                  scrolling="no"
                  allowFullScreen
                  title="Instagram Reel Player"
                />

                {/* Cover Loader Fallback (Underlay while iframe loads or if blocked) */}
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-8 bg-zinc-950 text-center gap-4 pt-20 pointer-events-none select-none">
                  <div className="relative w-24 h-24 rounded-full overflow-hidden border border-zinc-800 p-0.5">
                    <Image
                      src={activeReel.thumbnail}
                      alt="Thumbnail placeholder"
                      fill
                      className="object-cover rounded-full"
                    />
                  </div>
                  <div className="z-10">
                    <h4 className="text-white text-sm font-bold mb-2">
                      {lang === "ar" ? activeReel.titleAr : activeReel.titleEn}
                    </h4>
                    <p className="text-zinc-500 text-xs leading-relaxed">
                      {lang === "ar"
                        ? "يتم تحميل الفيديو من إنستغرام. إذا لم يعمل بسبب إعدادات الخصوصية، اضغط أدناه."
                        : "Loading Reel player from Instagram. If it doesn't load, use the external link."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer CTA Banner */}
              <div className="absolute bottom-0 left-0 right-0 bg-zinc-900 border-t border-zinc-800 p-3 z-30 flex items-center justify-between">
                <a
                  href={`https://www.instagram.com/reel/${activeReel.id}/`}
                  target="_blank"
                  rel="noopener noreferrer"
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
