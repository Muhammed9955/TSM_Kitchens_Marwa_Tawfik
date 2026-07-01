"use client";

import React, { useState } from "react";
import Image from "next/image";
import { HelpCircle } from "lucide-react";
import { useLanguage } from "@/locales/LanguageContext";
import { trackGAEvent, trackPixelEvent } from "@/utils/analytics";

const MoveLeftRight = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="m9 18-6-6 6-6" />
    <path d="m15 6 6 6-6 6" />
  </svg>
);

interface SliderShowcase {
  id: string;
  titleAr: string;
  titleEn: string;
  beforeImg: string;
  afterImg: string;
  beforeLabelAr: string;
  beforeLabelEn: string;
  afterLabelAr: string;
  afterLabelEn: string;
  descAr: string;
  descEn: string;
}

const showcases: SliderShowcase[] = [
  // {
  //   id: "showcase-1",
  //   titleAr: "مطبخ أكريليك فخم (نموذج 11)",
  //   titleEn: "Luxury Acrylic Kitchen (Model 11)",
  //   beforeImg: "/images/648641871_1523994963066932_480663675121755074_n.jpg", // 3D Render
  //   afterImg: "/images/648889942_1523994966400265_8096599965218287035_n.jpg", // Executed site
  //   beforeLabelAr: "التصميم ثلاثي الأبعاد 3D",
  //   beforeLabelEn: "3D Render Design",
  //   afterLabelAr: "التسليم الفعلي على أرض الواقع",
  //   afterLabelEn: "Final Executed Site",
  //   descAr: "مطابقة تامة بنسبة 100% بين التصميم الهندسي المقترح والتركيب الفعلي بالموقع مع رخام كوارتز وإضاءة مخفية.",
  //   descEn: "100% precision match between the proposed 3D CAD render and the final execution at the client's home."
  // },
  // {
  //   id: "showcase-2",
  //   titleAr: "مطبخ مودرن عصري (نموذج 1)",
  //   titleEn: "Modern Design (Model 1)",
  //   beforeImg: "/images/619683564_1488417939957968_8517148991043508014_n.jpg", // 3D
  //   afterImg: "/images/622381245_1488418043291291_1345312205051082767_n.jpg", // Reality
  //   beforeLabelAr: "المخطط المقترح ثلاثي الأبعاد",
  //   beforeLabelEn: "Proposed 3D Layout",
  //   afterLabelAr: "موقع التسليم والتركيب",
  //   afterLabelEn: "Executed Installation",
  //   descAr: "توزيع مثالي لوحدات التخزين ومكان البلت-إن مع توزيع ذكي لمسار الإضاءة.",
  //   descEn: "Perfect coordination of storage cabinets, built-in appliances and custom LED placement."
  // },
  {
    id: "showcase-3",
    titleAr: "مقارنة التأسيس والتسليم",
    titleEn: "Site Prep vs Finished",
    beforeImg:  "/images/627781586_1494778699321892_3431980651333181156_n.jpg", // Prep
    afterImg: "/images/627859366_1494778672655228_3301318912919462723_n.jpg", // Completed
    beforeLabelAr: "قبل التركيب (موقع العمل)",
    beforeLabelEn: "Before (On-site Work)",
    afterLabelAr: "بعد التركيب والتشطيب النهائي",
    afterLabelEn: "After (Final Completed Kitchen)",
    descAr: "شاهد كيف تم تحويل الجدران الخالية إلى تحفة فنية من خشب الأرو الطبيعي الفاخر بتناسق مذهل.",
    descEn: "See how bare walls were transformed into a masterpiece of premium natural oak wood."
  }
];

export default function BeforeAfterSlider() {
  const [activeTab, setActiveTab] = useState(showcases[0].id);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isInteracted, setIsInteracted] = useState(false);
  const { lang } = useLanguage();

  const activeShowcase = showcases.find((s) => s.id === activeTab) || showcases[0];

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderPosition(Number(e.target.value));
    if (!isInteracted) {
      setIsInteracted(true);
      trackGAEvent("before_after_interaction", "engagement", activeTab);
      trackPixelEvent("CustomizeProduct", { content_name: `BeforeAfter-${activeTab}` });
    }
  };

  const handleTabChange = (id: string) => {
    setActiveTab(id);
    setSliderPosition(50);
    setIsInteracted(false);
  };

  return (
    <section className="py-20 sm:py-28 bg-slate-50 border-t border-slate-100 relative overflow-hidden">
      {/* Visual lighting decor */}
      <div className="absolute top-0 left-10 w-[500px] h-[500px] bg-pink-500/5 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-[500px] h-[500px] bg-fuchsia-500/5 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10" dir={lang === "ar" ? "rtl" : "ltr"}>
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-pink-500 font-semibold tracking-wider text-xs sm:text-sm uppercase mb-2 block">
            {lang === "ar" ? "دقة التنفيذ والواقعية" : "Execution Accuracy"}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
            {lang === "ar" ? "مقارنة قبل وبعد والتصاميم" : "Before & After Comparisons"}
          </h2>
          <p className="text-slate-500 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            {lang === "ar" 
              ? "اسحب المقبض في منتصف الصور لمشاهدة مدى مطابقة تنفيذنا الفعلي للتصاميم المقترحة."
              : "Drag the slider handles to contrast our actual executions with our 3D render planning."
            }
          </p>
          <div className="w-16 h-1 bg-pink-600 mx-auto rounded-full mt-4" />
        </div>

        {/* Dynamic Showcase Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {showcases.map((showcase) => (
            <button
              key={showcase.id}
              onClick={() => handleTabChange(showcase.id)}
              className={`px-5 py-3 rounded-full text-xs sm:text-sm font-bold border transition-all cursor-pointer ${
                activeTab === showcase.id
                  ? "bg-pink-600 border-pink-600 text-white shadow-[0_4px_12px_rgba(236,72,153,0.3)] scale-105"
                  : "bg-white border-slate-200 text-slate-600 hover:border-pink-500/50 hover:text-pink-600"
              }`}
            >
              {lang === "ar" ? showcase.titleAr : showcase.titleEn}
            </button>
          ))}
        </div>

        {/* Slider Card Container */}
        <div className="glass-card p-4 sm:p-6 rounded-3xl border border-slate-100 bg-white/80 backdrop-blur-md shadow-xl max-w-4xl mx-auto">
          
          {/* Main Visual Arena */}
          <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden shadow-md select-none">
            
            {/* After Image (Always underlay/right side background) */}
            <Image
              src={activeShowcase.afterImg}
              alt={lang === "ar" ? activeShowcase.afterLabelAr : activeShowcase.afterLabelEn}
              fill
              sizes="(max-w-1024px) 100vw, 80vw"
              className="object-cover pointer-events-none"
              priority
            />

            {/* After Label (Bottom Right) */}
            <div className={`absolute bottom-4 z-20 bg-zinc-950/70 backdrop-blur-xs text-white text-[10px] sm:text-xs font-bold px-3 py-1.5 rounded-lg select-none pointer-events-none ${
              lang === "ar" ? "left-4" : "right-4"
            }`}>
              {lang === "ar" ? activeShowcase.afterLabelAr : activeShowcase.afterLabelEn}
            </div>

            {/* Before Image Container (Clipped Overlay) */}
            <div
              className="absolute inset-0 w-full h-full z-10 overflow-hidden"
              style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
            >
              <Image
                src={activeShowcase.beforeImg}
                alt={lang === "ar" ? activeShowcase.beforeLabelAr : activeShowcase.beforeLabelEn}
                fill
                sizes="(max-w-1024px) 100vw, 80vw"
                className="object-cover pointer-events-none"
                priority
              />
            </div>

            {/* Before Label (Bottom Left) */}
            <div className={`absolute bottom-4 z-20 bg-pink-600/90 backdrop-blur-xs text-white text-[10px] sm:text-xs font-bold px-3 py-1.5 rounded-lg select-none pointer-events-none ${
              lang === "ar" ? "right-4" : "left-4"
            }`}>
              {lang === "ar" ? activeShowcase.beforeLabelAr : activeShowcase.beforeLabelEn}
            </div>

            {/* Pulsing Interactivity Help Banner */}
            {!isInteracted && (
              <div className="absolute inset-0 bg-black/20 flex flex-col items-center justify-center z-20 transition-opacity duration-500 pointer-events-none">
                <div className="bg-pink-600 text-white rounded-full p-3 shadow-lg animate-bounce flex items-center justify-center">
                  <MoveLeftRight className="w-6 h-6" />
                </div>
                <span className="text-white text-xs sm:text-sm font-semibold tracking-wider drop-shadow-md mt-3 bg-zinc-950/60 px-4 py-1.5 rounded-full flex items-center gap-1.5">
                  <HelpCircle size={14} className="text-pink-400" />
                  {lang === "ar" ? "اسحب لمشاهدة الفرق" : "Drag to compare"}
                </span>
              </div>
            )}

            {/* Slider Control Line & Handle */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-pink-600 z-20 pointer-events-none shadow-md"
              style={{ left: `${sliderPosition}%`, transform: "translateX(-50%)" }}
            >
              {/* Handle Disc */}
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 left-1/2 w-10 h-10 rounded-full bg-pink-600 text-white shadow-xl flex items-center justify-center border-2 border-white select-none pointer-events-none z-20 hover:scale-105 active:scale-95 transition-transform duration-100">
                <MoveLeftRight className="w-5 h-5" />
              </div>
            </div>

            {/* Invisible Range Input Slider for absolute gesture compliance */}
            <input
              type="range"
              min="0"
              max="100"
              value={sliderPosition}
              onChange={handleSliderChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-col-resize z-30 select-none"
              aria-label="Before/After Image Comparison Slider"
            />
          </div>

          {/* Description footer */}
          <div className="mt-6 text-center px-4" dir={lang === "ar" ? "rtl" : "ltr"}>
            <p className="text-slate-600 text-sm sm:text-base font-medium leading-relaxed">
              {lang === "ar" ? activeShowcase.descAr : activeShowcase.descEn}
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
