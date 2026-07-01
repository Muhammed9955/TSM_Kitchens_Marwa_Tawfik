"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, ArrowRight, ArrowLeft } from "lucide-react";
import { useLanguage } from "@/locales/LanguageContext";

interface ProjectPreviewItem {
  id: number;
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  image: string;
  locationAr: string;
  locationEn: string;
}

const projectsPreviewData: ProjectPreviewItem[] = [
  {
    id: 1,
    titleAr: "مطبخ أكريليك عصري - سموحة",
    titleEn: "Modern Acrylic Kitchen - Smouha",
    descAr: "مساحة واسعة بنظام الإضاءة الذكية ومزيج من خامات الأكريليك الفاخر والبولي لاك المقاوم للرطوبة.",
    descEn: "Spacious contemporary layout featuring smart LED profiles, high-gloss Acrylic, and moisture-resistant Poly-lac.",
    image: "/images/619683564_1488417939957968_8517148991043508014_n.jpg",
    locationAr: "سموحة، الإسكندرية",
    locationEn: "Smouha, Alexandria"
  },
  {
    id: 2,
    titleAr: "مطبخ كلاسيك خشب - كفر عبده",
    titleEn: "Luxury Natural Wood Kitchen - Kafr Abdo",
    descAr: "مطبخ دافئ وعريق مصنوع بالكامل من خشب الأرو الطبيعي المعالج ضد المياه، مع مقابض نحاسية عتيقة.",
    descEn: "Warm classical design crafted entirely of premium water-treated natural oak wood with vintage brass hardware.",
    image: "/images/627781586_1494778699321892_3431980651333181156_n.jpg",
    locationAr: "كفر عبده، الإسكندرية",
    locationEn: "Kafr Abdo, Alexandria"
  },
  {
    id: 3,
    titleAr: "دريسنج روم متكامل - سان ستيفانو",
    titleEn: "Bespoke Dressing Room - San Stefano",
    descAr: "استغلال ذكي للغاية للمساحات المتاحة مع تقسيمات داخلية مريحة، أرفف زجاجية مضيئة، ودرف ألومنيوم سوداء.",
    descEn: "Highly optimized walk-in closet space featuring customized drawer grids, profile LEDs, and tempered glass doors.",
    image: "/images/689215323_1577073144425780_5648049577088391907_n.jpg",
    locationAr: "سان ستيفانو، الإسكندرية",
    locationEn: "San Stefano, Alexandria"
  }
];

export default function ProjectsPreview() {
  const { lang } = useLanguage();
  const targetLink = lang === "ar" ? "/projects" : "/en/projects";

  return (
    <section id="projects" className="py-20 sm:py-28 bg-white border-t border-slate-100 relative overflow-hidden">
      {/* Decorative glows */}
      <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-pink-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <span className="text-pink-500 font-semibold tracking-wider text-xs sm:text-sm uppercase mb-2 block">
            {lang === "ar" ? "أحدث أعمالنا" : "Our Projects"}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
            {lang === "ar" ? "مشاريع تم تسليمها مؤخراً" : "Recently Handed-Over Projects"}
          </h2>
          <div className="w-16 h-1 bg-pink-600 mx-auto rounded-full mt-4" />
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {projectsPreviewData.map((project) => (
            <div
              key={project.id}
              className="glass-card rounded-2xl overflow-hidden flex flex-col justify-between group hover:shadow-2xl hover:-translate-y-1.5 hover:border-pink-500/20 border border-slate-100 bg-white transition-all duration-500"
            >
              <div>
                {/* Image Container */}
                <div className="relative aspect-[4/3] w-full overflow-hidden border-b border-slate-100">
                  <Image
                    src={project.image}
                    alt={lang === "ar" ? project.titleAr : project.titleEn}
                    fill
                    sizes="(max-w-768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-750 ease-out group-hover:scale-105"
                  />
                </div>

                {/* Body Details */}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-pink-600 transition-colors">
                    {lang === "ar" ? project.titleAr : project.titleEn}
                  </h3>
                  
                  <p className="text-slate-500 text-sm leading-relaxed mb-4">
                    {lang === "ar" ? project.descAr : project.descEn}
                  </p>

                  {/* Location Tag */}
                  <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                    <MapPin size={14} className="text-pink-500 flex-shrink-0" />
                    <span>{lang === "ar" ? project.locationAr : project.locationEn}</span>
                  </div>
                </div>
              </div>

              {/* View details page trigger CTA */}
              <div className="p-6 pt-0 mt-auto">
                <Link
                  href={`${targetLink}#project-${project.id}`}
                  className="w-full inline-flex items-center justify-center gap-2 bg-slate-50 hover:bg-pink-600 text-slate-700 hover:text-white font-bold py-3 rounded-xl border border-slate-200/50 hover:border-pink-500 transition-all duration-300 text-xs sm:text-sm cursor-pointer"
                >
                  <span>{lang === "ar" ? "عرض التفاصيل والمواصفات" : "View Details & Specs"}</span>
                  {lang === "ar" ? <ArrowLeft size={14} /> : <ArrowRight size={14} />}
                </Link>
              </div>

            </div>
          ))}
        </div>

        {/* Go to Dedicated Projects Page CTA Button */}
        <div className="text-center mt-6">
          <Link
            href={targetLink}
            className="inline-flex items-center justify-center bg-zinc-900 hover:bg-zinc-800 text-white font-bold px-8 py-4 rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            {lang === "ar" ? "تصفح كافة تفاصيل المشاريع" : "Explore All Project Details"}
          </Link>
        </div>

      </div>
    </section>
  );
}
