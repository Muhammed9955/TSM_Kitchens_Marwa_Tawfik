"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Maximize2, Plus } from "lucide-react";
import { useLanguage } from "@/locales/LanguageContext";
import { galleryItems } from "../data/galleryData";
import { trackGAEvent, trackPixelEvent } from "@/utils/analytics";

export default function Gallery() {
  const [visibleCount, setVisibleCount] = useState(12);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const { lang, dict } = useLanguage();

  const totalItems = galleryItems.length;
  const visibleItems = galleryItems.slice(0, visibleCount);

  const nextImage = useCallback(() => {
    if (lightboxIndex === null) return;
    const nextIdx = (lightboxIndex + 1) % totalItems;
    setLightboxIndex(nextIdx);
    trackGAEvent("gallery_lightbox_next", "engagement", galleryItems[nextIdx].titleEn || `image_${nextIdx}`);
  }, [lightboxIndex, totalItems]);

  const prevImage = useCallback(() => {
    if (lightboxIndex === null) return;
    const prevIdx = (lightboxIndex - 1 + totalItems) % totalItems;
    setLightboxIndex(prevIdx);
    trackGAEvent("gallery_lightbox_prev", "engagement", galleryItems[prevIdx].titleEn || `image_${prevIdx}`);
  }, [lightboxIndex, totalItems]);

  const handleOpenLightbox = (index: number) => {
    setLightboxIndex(index);
    const item = galleryItems[index];
    trackGAEvent("view_gallary", "engagement", item.titleEn || `image_${index}`);
    trackPixelEvent("ViewContent", { content_name: item.titleEn || `Image-${index}`, content_category: "Gallery" });
  };

  // Handle keyboard keys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowRight") {
        lang === "ar" ? prevImage() : nextImage();
      }
      if (e.key === "ArrowLeft") {
        lang === "ar" ? nextImage() : prevImage();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, nextImage, prevImage, lang]);

  const handleLoadMore = () => {
    const nextCount = Math.min(visibleCount + 12, totalItems);
    setVisibleCount(nextCount);
    trackGAEvent("gallery_load_more", "engagement", `Show ${nextCount} images`);
  };

  return (
    <section id="gallery" className="py-20 sm:py-28 bg-white border-t border-slate-100 relative overflow-hidden">
      {/* Visual lighting decor */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-pink-500/5 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-pink-500 font-semibold tracking-wider text-xs sm:text-sm uppercase mb-2 block">
            {dict.gallery.title}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
            {lang === "ar" ? "معرض التصاميم والأعمال الكامل" : "Complete Design Portfolio"}
          </h2>
          <p className="text-slate-500 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            {lang === "ar" 
              ? "تصفح كتالوج أعمالنا الحصري من المطابخ العصرية والكلاسيكية والمخططات الهندسية."
              : "Browse our exclusive catalog of modern layouts, natural wood designs, and architectural plans."
            }
          </p>
          <div className="w-16 h-1 bg-pink-600 mx-auto rounded-full mt-4" />
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {visibleItems.map((item, index) => (
            <div
              key={item.id}
              onClick={() => handleOpenLightbox(index)}
              className="group relative aspect-square rounded-2xl overflow-hidden border border-slate-100 bg-slate-50 cursor-pointer shadow-xs hover:border-pink-500/40 hover:shadow-lg transition-all duration-300 opacity-0 animate-fade-in-up"
              style={{
                animationDelay: `${(index % 12) * 60}ms`,
                animationFillMode: "forwards"
              }}
            >
              {/* Image */}
              <div className="relative w-full h-full">
                <Image
                  src={item.src}
                  alt={lang === "ar" ? item.titleAr : item.titleEn}
                  fill
                  sizes="(max-w-768px) 100vw, 25vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
              </div>
              
              {/* Dark transparent overlay on hover */}
              <div className="absolute inset-0 bg-zinc-950/85 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 border-2 border-transparent group-hover:border-pink-500/30 rounded-2xl" />

              {/* Text and Icon details */}
              <div className="absolute inset-0 flex flex-col justify-between p-6 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 pointer-events-none">
                <div className="flex justify-end">
                  <div className="p-2 bg-pink-600 rounded-full text-white shadow-md">
                    <Maximize2 size={16} />
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-pink-400 font-bold uppercase tracking-wider block mb-1">
                    {dict.gallery.categories[item.category]}
                  </span>
                  <h3 className="text-base font-bold text-white leading-snug drop-shadow-sm">
                    {lang === "ar" ? item.titleAr : item.titleEn}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        {visibleCount < totalItems && (
          <div className="text-center mt-12 sm:mt-16">
            <button
              onClick={handleLoadMore}
              className="inline-flex items-center justify-center gap-2 border border-slate-200 hover:border-pink-500 bg-white text-slate-800 hover:text-pink-600 font-semibold px-7 py-3.5 rounded-full shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer text-sm sm:text-base"
            >
              <Plus size={18} />
              <span>{lang === "ar" ? "تحميل المزيد من الصور" : "Load More Images"}</span>
            </button>
            <span className="block text-xs text-slate-400 mt-2">
              {lang === "ar" 
                ? `عرض ${visibleCount} من أصل ${totalItems} صورة`
                : `Showing ${visibleCount} of ${totalItems} images`
              }
            </span>
          </div>
        )}

        {/* Lightbox Modal (remains dark mode for picture contrast) */}
        {lightboxIndex !== null && (
          <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-8 animate-fade-in">
            {/* Lightbox Header */}
            <div className="flex items-center justify-between text-zinc-400 z-10">
              <div className="text-sm">
                <span className="text-pink-500 font-semibold uppercase tracking-wider block text-xs">
                  {dict.gallery.categories[galleryItems[lightboxIndex].category]}
                </span>
                <span className="text-white font-medium text-base">
                  {lang === "ar"
                    ? galleryItems[lightboxIndex].titleAr
                    : galleryItems[lightboxIndex].titleEn}
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

            {/* Lightbox Main Image & Arrows */}
            <div className="relative flex-1 flex items-center justify-center py-4 my-2">
              {/* Previous Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                className="absolute left-4 sm:left-8 z-10 bg-zinc-900/60 hover:bg-pink-600 text-white p-3 rounded-full border border-zinc-800 backdrop-blur-md transition-all cursor-pointer"
                aria-label="Previous image"
              >
                <ChevronLeft size={24} />
              </button>

              {/* Large Image Container */}
              <div className="relative w-full h-full max-w-4xl max-h-[75vh]">
                <Image
                  src={galleryItems[lightboxIndex].src}
                  alt={
                    lang === "ar"
                      ? galleryItems[lightboxIndex].titleAr
                      : galleryItems[lightboxIndex].titleEn
                  }
                  fill
                  className="object-contain animate-fade-in"
                  sizes="100vw"
                  priority
                />
              </div>

              {/* Next Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                className="absolute right-4 sm:right-8 z-10 bg-zinc-900/60 hover:bg-pink-600 text-white p-3 rounded-full border border-zinc-800 backdrop-blur-md transition-all cursor-pointer"
                aria-label="Next image"
              >
                <ChevronRight size={24} />
              </button>
            </div>

            {/* Lightbox Status Footer */}
            <div className="text-center text-zinc-500 text-xs py-2 z-10">
              {lightboxIndex + 1} / {totalItems}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
