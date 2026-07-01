"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { MapPin, Calendar, CheckSquare, PhoneCall, Quote, Grid, Eye, Plus } from "lucide-react";
import { useLanguage } from "@/locales/LanguageContext";
import { projectsData, ProjectItem } from "@/data/projectsData";
import { trackGAEvent, trackPixelEvent } from "@/utils/analytics";

export default function Projects() {
  const { lang, dict } = useLanguage();
  const basePath = lang === "ar" ? "" : "/en";

  const [activeCategory, setActiveCategory] = useState<"all" | "modern" | "classic" | "dressing">("all");
  const [visibleCount, setVisibleCount] = useState(6);

  // Reset pagination on category change
  useEffect(() => {
    setVisibleCount(6);
  }, [activeCategory]);

  const handleCategoryChange = (category: "all" | "modern" | "classic" | "dressing") => {
    setActiveCategory(category);
    trackGAEvent("projects_category_filter", "engagement", category);
    trackPixelEvent("Search", { search_string: category, content_category: "Projects" });
  };

  const handleLoadMore = () => {
    const nextCount = visibleCount + 6;
    setVisibleCount(nextCount);
    trackGAEvent("projects_load_more", "engagement", `Show ${nextCount} items`);
  };

  const filteredProjects = projectsData.filter((project) => {
    if (activeCategory === "all") return true;
    return project.category === activeCategory;
  });

  const visibleProjects = filteredProjects.slice(0, visibleCount);

  return (
    <section id="projects" className="py-20 sm:py-28 bg-white relative overflow-hidden">
      {/* Decorative background glows */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-pink-500/5 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-fuchsia-500/5 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Page Banner Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <span className="text-pink-500 font-semibold tracking-wider text-xs sm:text-sm uppercase mb-2 block">
            {lang === "ar" ? "أعمال المهندسة مروة توفيق" : "Portfolio of Eng. Marwa Tawfik"}
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
            {lang === "ar" ? "مشاريع تم تسليمها في الإسكندرية" : "Executed Alexandria Projects"}
          </h1>
          <p className="text-slate-500 text-sm sm:text-base max-w-xl mx-auto leading-relaxed mt-4">
            {lang === "ar" 
              ? "نستعرض هنا تفاصيل التصميم، ومواصفات المواد المستخدمة، ومراجعات العملاء لكل مشروع قمنا بتنفيذه."
              : "Explore the custom design details, raw material specs, and client feedback for each completed showcase."
            }
          </p>
          <div className="w-16 h-1 bg-pink-600 mx-auto rounded-full mt-6" />
        </div>

        {/* Filter Navigation Tabs */}
        <div className="flex flex-wrap justify-center items-center gap-2 mb-16 border-b border-slate-100 pb-8 max-w-2xl mx-auto">
          {[
            { id: "all", labelAr: "كافة المشاريع", labelEn: "All Projects" },
            { id: "modern", labelAr: "مطابخ مودرن", labelEn: "Modern Kitchens" },
            { id: "classic", labelAr: "مطابخ كلاسيك خشب", labelEn: "Classic Wood Kitchens" },
            { id: "dressing", labelAr: "دريسنج روم وغرف ملابس", labelEn: "Dressing & Wardrobes" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id as any)}
              className={`px-4 sm:px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 cursor-pointer ${
                activeCategory === cat.id
                  ? "bg-slate-900 border border-slate-900 text-white shadow-md scale-105"
                  : "bg-slate-50 border border-slate-200 text-slate-600 hover:bg-pink-600 hover:border-pink-600 hover:text-white"
              }`}
            >
              {lang === "ar" ? cat.labelAr : cat.labelEn}
            </button>
          ))}
        </div>

        {/* Alternating Narrative Project Rows */}
        <div className="space-y-24 sm:space-y-36">
          {visibleProjects.map((project, index) => {
            const isEven = index % 2 === 0;

            return (
              <div
                key={project.id}
                id={`project-${project.id}`}
                className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-center scroll-mt-28"
              >
                {/* Image half (reordered dynamically on desktop) */}
                <div className={`w-full lg:w-1/2 ${isEven ? "lg:order-1" : "lg:order-2"}`}>
                  <div className="relative aspect-[4/3] w-full rounded-3xl overflow-hidden border border-slate-100 shadow-xl group">
                    <Image
                      src={project.image}
                      alt={lang === "ar" ? project.titleAr : project.titleEn}
                      fill
                      sizes="(max-w-1024px) 100vw, 50vw"
                      className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                      priority={index < 2}
                    />
                    
                    {/* Floating Date Tag */}
                    <div className="absolute top-5 left-5 z-10 bg-zinc-950/85 backdrop-blur-md text-white text-xs font-bold px-3.5 py-2 rounded-full shadow-md flex items-center gap-1.5">
                      <Calendar size={12} className="text-pink-500" />
                      <span>{project.year}</span>
                    </div>

                    {/* Floating Category Tag */}
                    <div className="absolute bottom-5 right-5 z-10 bg-pink-600 text-white text-xs font-bold px-4 py-2 rounded-full shadow-md">
                      <span>{lang === "ar" ? project.tagAr : project.tagEn}</span>
                    </div>
                  </div>
                </div>

                {/* Content half */}
                <div className={`w-full lg:w-1/2 ${isEven ? "lg:order-2" : "lg:order-1"}`} dir={lang === "ar" ? "rtl" : "ltr"}>
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin size={16} className="text-pink-500" />
                    <span className="text-xs sm:text-sm font-bold text-slate-400 uppercase tracking-wider">
                      {lang === "ar" ? project.locationAr : project.locationEn}
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-4 leading-tight">
                    {lang === "ar" ? project.titleAr : project.titleEn}
                  </h2>

                  <p className="text-slate-500 text-sm sm:text-base leading-relaxed mb-6">
                    {lang === "ar" ? project.descAr : project.descEn}
                  </p>

                  {/* Customer Testimonial Bubble */}
                  <div className="bg-pink-500/[0.02] border-r-4 border-pink-500 rounded-2xl p-5 mb-8 relative">
                    <Quote size={24} className="text-pink-500/10 absolute top-3 left-4" />
                    <p className="text-slate-600 italic text-sm leading-relaxed mb-2 pr-2">
                      "{lang === "ar" ? project.quoteAr : project.quoteEn}"
                    </p>
                    <span className="block text-xs font-bold text-slate-400">
                      - {lang === "ar" ? project.clientAr : project.clientEn}
                    </span>
                  </div>

                  {/* Specifications Checklist */}
                  <div className="border-t border-slate-100 pt-6 mb-8">
                    <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <CheckSquare size={16} className="text-pink-500" />
                      <span>{lang === "ar" ? "المواصفات الفنية والخامات:" : "Technical Specs & Materials:"}</span>
                    </h4>
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                      {lang === "ar" ? project.materialsAr : project.materialsEn}
                    </p>
                  </div>

                  {/* Request similar design button */}
                  <div>
                    <a
                      href={`${basePath}/#contact`}
                      onClick={() => {
                        trackGAEvent("view_project", "engagement", project.titleEn);
                        trackPixelEvent("InitiateCheckout", { content_name: project.titleEn });
                      }}
                      className="inline-flex items-center justify-center gap-2 bg-pink-600 hover:bg-pink-700 text-white font-bold px-7 py-3.5 rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer text-sm"
                    >
                      <PhoneCall size={14} />
                      <span>{lang === "ar" ? "طلب تصميم ومعاينة مشابهة" : "Request Similar Project Scan"}</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Load More Pagination */}
        {visibleCount < filteredProjects.length && (
          <div className="text-center mt-20 border-t border-slate-100 pt-12">
            <button
              onClick={handleLoadMore}
              className="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-pink-600 text-white hover:text-white font-bold px-8 py-4 rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer text-sm sm:text-base"
            >
              <Plus size={18} />
              <span>{lang === "ar" ? "عرض المزيد من المشاريع" : "Load More Projects"}</span>
            </button>
            <span className="block text-xs text-slate-400 mt-3 font-semibold">
              {lang === "ar"
                ? `عرض ${visibleProjects.length} من أصل ${filteredProjects.length} مشروع`
                : `Showing ${visibleProjects.length} of ${filteredProjects.length} projects`}
            </span>
          </div>
        )}

      </div>
    </section>
  );
}

