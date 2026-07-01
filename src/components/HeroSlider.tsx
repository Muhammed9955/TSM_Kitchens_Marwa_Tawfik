"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/locales/LanguageContext";

// 4 Premium full-view kitchen layout images (wide-angle designs)
const slideImages = [
  "/images/619683564_1488417939957968_8517148991043508014_n.jpg",
  "/images/work-triangle-kitchen-remodel.jpg",
  "/images/711846958_1607152504751177_8435629229339703644_n.jpg",
  "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=2070",
];

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { lang, dict } = useLanguage();
  const slides = dict.hero.slides;

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 4000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <section id="home" className="relative h-[85vh] sm:h-screen w-full overflow-hidden bg-zinc-950" dir="ltr">
      {/* Slider flex row wrapper - translated using viewport width units */}
      <div
        className="h-full flex transition-transform duration-700 ease-in-out"
        style={{
          transform: `translate3d(-${currentSlide * 100}vw, 0, 0)`,
        }}
      >
        {slides.map((slide, index) => (
          <div key={index} className="w-screen h-full relative flex-shrink-0">
            {/* Background image covering full viewport width */}
            <div className="absolute inset-0 w-full h-full">
              <Image
                src={slideImages[index]}
                alt={`Kitchen Showcase ${index + 1}`}
                fill
                sizes="100vw"
                className="object-cover object-center"
                priority={index === 0}
              />
              {/* Dark Translucent Vignette Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/55" />
            </div>

            {/* Content Container */}
            <div
              className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center"
              dir={lang === "ar" ? "rtl" : "ltr"}
            >
              <div
                className={`max-w-2xl transition-all duration-700 ease-out delay-150 ${
                  index === currentSlide
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                } ${lang === "ar" ? "text-right" : "text-left"}`}
              >
                {/* Tagline */}
                <span className="inline-block text-pink-500 font-semibold tracking-wider text-[10px] sm:text-xs md:text-sm uppercase mb-2 sm:mb-3 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full border border-pink-500/30 bg-pink-500/10">
                  {lang === "ar" ? "قيمة حقيقية لمنزلك" : "Real Value For Your Home"}
                </span>

                {/* Title */}
                <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-3 sm:mb-4 drop-shadow-md">
                  {slide.title}
                </h1>

                {/* Description */}
                <p className="text-xs sm:text-base md:text-lg text-zinc-200 mb-6 sm:mb-8 max-w-xl leading-relaxed">
                  {slide.description}
                </p>

                {/* Buttons wrapper */}
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 justify-start">
                  <a
                    href="#gallery"
                    className="inline-flex items-center justify-center bg-pink-600 hover:bg-pink-700 text-white font-bold px-5 py-2.5 sm:px-7 sm:py-3.5 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(236,72,153,0.5)] cursor-pointer text-xs sm:text-sm md:text-base"
                  >
                    {slide.cta}
                  </a>
                  
                  <a
                    href="#contact"
                    className="inline-flex items-center justify-center border border-white hover:bg-white hover:text-slate-900 text-white font-bold px-5 py-2.5 sm:px-7 sm:py-3.5 rounded-full transition-all duration-300 hover:scale-105 backdrop-blur-xs cursor-pointer text-xs sm:text-sm md:text-base"
                  >
                    {lang === "ar" ? "احجز موعد معاينة" : "Book Inspection"}
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={lang === "ar" ? nextSlide : prevSlide}
        className="absolute top-1/2 -translate-y-1/2 z-20 bg-black/35 hover:bg-pink-600 text-white border border-zinc-700/30 p-2.5 rounded-full backdrop-blur-md transition-all cursor-pointer left-4 sm:left-8 hidden sm:inline-flex"
        aria-label="Previous Slide"
      >
        <ChevronLeft size={24} />
      </button>

      <button
        onClick={lang === "ar" ? prevSlide : nextSlide}
        className="absolute top-1/2 -translate-y-1/2 z-20 bg-black/35 hover:bg-pink-600 text-white border border-zinc-700/30 p-2.5 rounded-full backdrop-blur-md transition-all cursor-pointer right-4 sm:right-8 hidden sm:inline-flex"
        aria-label="Next Slide"
      >
        <ChevronRight size={24} />
      </button>

      {/* Indicators Dots */}
      <div className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-2.5">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 cursor-pointer ${
              index === currentSlide
                ? "bg-pink-500 w-8 shadow-[0_0_8px_rgba(236,72,153,0.8)]"
                : "bg-white/40 hover:bg-white"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
