"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import { useLanguage } from "@/locales/LanguageContext";

// 10 Featured kitchen design images for the home page carousel
const featuredFiles = [
  "619683564_1488417939957968_8517148991043508014_n.jpg",
  "619207793_1488418006624628_6320482486334913994_n.jpg",
  "622381245_1488418043291291_1345312205051082767_n.jpg",
  "624211153_1488418093291286_5983506602548432865_n.jpg",
  "624527128_1488417973291298_8686738273473628199_n.jpg",
  "625342074_1497847029015059_7713089983891098552_n.jpg",
  "627444162_1494778629321899_6247081398093507899_n.jpg",
  "627609817_1494778685988560_2780931454884796765_n.jpg",
  "627781586_1494778699321892_3431980651333181156_n.jpg",
  "627792934_1494778709321891_1945409576520292824_n.jpg",
];

export default function GalleryPreview() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [slidesToShow, setSlidesToShow] = useState(3);
  const { lang, dict } = useLanguage();

  // Update slidesToShow based on viewport width
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setSlidesToShow(1); // Mobile
      } else if (window.innerWidth < 1024) {
        setSlidesToShow(2); // Tablet
      } else {
        setSlidesToShow(3); // Desktop
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalItems = featuredFiles.length;
  const maxIndex = totalItems - slidesToShow;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const nextLightboxImage = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev! + 1) % totalItems);
  }, [lightboxIndex, totalItems]);

  const prevLightboxImage = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev! - 1 + totalItems) % totalItems);
  }, [lightboxIndex, totalItems]);

  // Handle keyboard keys for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowRight") {
        lang === "ar" ? prevLightboxImage() : nextLightboxImage();
      }
      if (e.key === "ArrowLeft") {
        lang === "ar" ? nextLightboxImage() : prevLightboxImage();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, nextLightboxImage, prevLightboxImage, lang]);

  return (
    <section id="gallery" className="py-20 sm:py-28 bg-white border-t border-slate-100 relative overflow-hidden" dir="ltr">
      {/* Decorative glows */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-pink-500/5 rounded-full blur-[130px] pointer-events-none" />

      {/* Outer wrapper to force RTL/LTR layout based on site language */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10" dir={lang === "ar" ? "rtl" : "ltr"}>
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-pink-500 font-semibold tracking-wider text-xs sm:text-sm uppercase mb-2 block">
            {dict.gallery.title}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
            {lang === "ar" ? "نماذج مختارة من أعمالنا" : "Featured Design Showcases"}
          </h2>
          <div className="w-16 h-1 bg-pink-600 mx-auto rounded-full mt-4" />
        </div>

        {/* Carousel Container */}
        <div className="relative px-2 sm:px-8 mb-12">
          {/* Navigation Arrow Left */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white hover:bg-pink-600 text-slate-700 hover:text-white border border-slate-200 p-2 sm:p-2.5 rounded-full shadow-md transition-all cursor-pointer"
            aria-label="Previous Slide"
          >
            <ChevronLeft size={20} />
          </button>

          {/* Carousel Viewport (forced LTR for stable slide offsets) */}
          <div className="overflow-hidden" dir="ltr">
            <div
              className="flex transition-transform duration-500 ease-in-out gap-6"
              style={{
                transform: `translate3d(-${currentIndex * (100 / slidesToShow)}%, 0, 0)`,
              }}
            >
              {featuredFiles.map((filename, index) => {
                const encodedSrc = `/images/${encodeURIComponent(filename)}`;
                const itemTitleAr = `تصميم مطبخ مميز - نموذج ${index + 1}`;
                const itemTitleEn = `Featured Kitchen Design - Model ${index + 1}`;

                return (
                  <div
                    key={index}
                    onClick={() => openLightbox(index)}
                    className="group relative aspect-square rounded-2xl overflow-hidden border border-slate-100 bg-slate-50 cursor-pointer transition-all duration-500 hover:border-pink-500/40 hover:shadow-lg flex-shrink-0"
                    style={{
                      width: `calc(${100 / slidesToShow}% - ${(slidesToShow - 1) * 24 / slidesToShow}px)`,
                    }}
                    dir={lang === "ar" ? "rtl" : "ltr"}
                  >
                    {/* Slide Image */}
                    <div className="relative w-full h-full">
                      <Image
                        src={encodedSrc}
                        alt={lang === "ar" ? itemTitleAr : itemTitleEn}
                        fill
                        sizes="(max-w-768px) 100vw, 33vw"
                        className="object-cover transition-transform duration-750 ease-out group-hover:scale-110"
                      />
                    </div>

                    {/* Dark Hover Mask */}
                    <div className="absolute inset-0 bg-zinc-950/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 border-2 border-transparent group-hover:border-pink-500/30 rounded-2xl" />

                    {/* Hover text / icon */}
                    <div className="absolute inset-0 flex flex-col justify-between p-6 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 pointer-events-none">
                      <div className="flex justify-end">
                        <div className="p-2 bg-pink-600 rounded-full text-white shadow-md">
                          <Maximize2 size={16} />
                        </div>
                      </div>
                      <div>
                        <span className="text-[10px] text-pink-400 font-bold uppercase tracking-wider block mb-1">
                          {lang === "ar" ? "معرض المطابخ" : "Kitchen Portfolio"}
                        </span>
                        <h3 className="text-base font-bold text-white leading-snug drop-shadow-sm">
                          {lang === "ar" ? itemTitleAr : itemTitleEn}
                        </h3>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Navigation Arrow Right */}
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white hover:bg-pink-600 text-slate-700 hover:text-white border border-slate-200 p-2 sm:p-2.5 rounded-full shadow-md transition-all cursor-pointer"
            aria-label="Next Slide"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Go to Dedicated Gallery Page CTA Button */}
        <div className="text-center mt-10">
          <Link
            href={lang === "ar" ? "/gallery" : "/en/gallery"}
            className="inline-flex items-center justify-center bg-pink-600 hover:bg-pink-700 text-white font-bold px-8 py-4 rounded-full shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(236,72,153,0.4)]"
          >
            {lang === "ar" ? "عرض معرض الأعمال الكامل (50+ تصميم)" : "View Full Portfolio (50+ Designs)"}
          </Link>
        </div>

        {/* Lightbox Modal (dark background) */}
        {lightboxIndex !== null && (
          <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-8 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between text-zinc-400 z-10">
              <div className="text-sm">
                <span className="text-pink-500 font-semibold uppercase tracking-wider block text-xs">
                  {lang === "ar" ? "مطبخ مميز" : "Featured Kitchen"}
                </span>
                <span className="text-white font-medium text-base">
                  {lang === "ar"
                    ? `تصميم مطبخ مميز - نموذج ${lightboxIndex + 1}`
                    : `Featured Kitchen Design - Model ${lightboxIndex + 1}`}
                </span>
              </div>
              <button
                onClick={() => setLightboxIndex(null)}
                className="text-zinc-400 hover:text-white p-2 rounded-full bg-zinc-900 border border-zinc-800 transition-all cursor-pointer"
                aria-label="Close Lightbox"
              >
                <X size={20} />
              </button>
            </div>

            {/* Main content slider */}
            <div className="relative flex-1 flex items-center justify-center py-4 my-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevLightboxImage();
                }}
                className="absolute left-4 sm:left-8 z-10 bg-zinc-900/60 hover:bg-pink-600 text-white p-3 rounded-full border border-zinc-800 backdrop-blur-md transition-all cursor-pointer"
                aria-label="Previous image"
              >
                <ChevronLeft size={24} />
              </button>

              <div className="relative w-full h-full max-w-4xl max-h-[75vh]">
                <Image
                  src={`/images/${encodeURIComponent(featuredFiles[lightboxIndex])}`}
                  alt={`Lightbox Kitchen ${lightboxIndex + 1}`}
                  fill
                  className="object-contain"
                  sizes="100vw"
                  priority
                />
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextLightboxImage();
                }}
                className="absolute right-4 sm:right-8 z-10 bg-zinc-900/60 hover:bg-pink-600 text-white p-3 rounded-full border border-zinc-800 backdrop-blur-md transition-all cursor-pointer"
                aria-label="Next image"
              >
                <ChevronRight size={24} />
              </button>
            </div>

            {/* Footer */}
            <div className="text-center text-zinc-500 text-xs py-2 z-10">
              {lightboxIndex + 1} / {totalItems}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
