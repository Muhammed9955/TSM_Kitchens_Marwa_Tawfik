"use client";

import Image from "next/image";
import { MapPin, Calendar, CheckSquare, PhoneCall, Quote } from "lucide-react";
import { Locale } from "@/locales/dictionaries";

interface ProjectsProps {
  lang: Locale;
}

interface ProjectItem {
  id: number;
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  image: string;
  locationAr: string;
  locationEn: string;
  year: string;
  materialsAr: string;
  materialsEn: string;
  tagAr: string;
  tagEn: string;
  quoteAr: string;
  quoteEn: string;
  clientAr: string;
  clientEn: string;
}

const projectsData: ProjectItem[] = [
  {
    id: 1,
    titleAr: "مطبخ أكريليك عصري - سموحة",
    titleEn: "Modern Acrylic Kitchen - Smouha",
    descAr: "مساحة واسعة بنظام الإضاءة الذكية ومزيج من خامات الأكريليك الفاخر والبولي لاك المقاوم للرطوبة مع جزيرة مطبخ وسطية رخام.",
    descEn: "Spacious contemporary layout featuring smart LED profiles, high-gloss Acrylic cabinetry, and moisture-resistant Poly-lac with a marble island.",
    image: "/images/619683564_1488417939957968_8517148991043508014_n.jpg",
    locationAr: "سموحة، الإسكندرية",
    locationEn: "Smouha, Alexandria",
    year: "2026",
    materialsAr: "أكريليك تركي، بولي لاك، كوارتز، إكسسوارات بلوم نمساوية",
    materialsEn: "Turkish Acrylic, Poly-lac, Quartz countertop, Austrian Blum fittings",
    tagAr: "تصميم عصري متكامل",
    tagEn: "Complete Modern Design",
    quoteAr: "التزام رائع بمواعيد التركيب ودقة متناهية في التفاصيل الهندسية للمطبخ.",
    quoteEn: "Exceptional commitment to delivery timelines and immaculate precision in execution.",
    clientAr: "أ. كريم رفعت",
    clientEn: "Karim R."
  },
  {
    id: 2,
    titleAr: "مطبخ كلاسيك خشب - كفر عبده",
    titleEn: "Luxury Natural Wood Kitchen - Kafr Abdo",
    descAr: "مطبخ دافئ وعريق مصنوع بالكامل من خشب الأرو الطبيعي المعالج ضد المياه، مع مقابض نحاسية عتيقة ومساحة تخزين مصممة خصيصاً.",
    descEn: "Warm classical design crafted entirely of premium water-treated natural oak wood, featuring vintage brass hardware and custom storage units.",
    image: "/images/showroom.jpg",
    locationAr: "كفر عبده، الإسكندرية",
    locationEn: "Kafr Abdo, Alexandria",
    year: "2025",
    materialsAr: "خشب أرو طبيعي، إكسسوارات هيدروليك إيطالية، جرانيت مستورد",
    materialsEn: "Natural Oak Wood, Italian soft-close hardware, imported Granite tops",
    tagAr: "خشب طبيعي كلاسيك",
    tagEn: "Classic Oak Wood",
    quoteAr: "جودة خامات الخشب والتشطيب فاقت كل توقعاتي، المهندسة مروة وفريق العمل قمة في الاحترافية.",
    quoteEn: "The wood selection and finishing quality exceeded all my expectations. Highly recommended.",
    clientAr: "د. سارة فهمي",
    clientEn: "Dr. Sarah F."
  },
  {
    id: 3,
    titleAr: "دريسنج روم متكامل - سان ستيفانو",
    titleEn: "Bespoke Dressing Room - San Stefano",
    descAr: "استغلال ذكي للغاية للمساحات المتاحة مع تقسيمات داخلية مريحة لتنظيم الملابس، أرفف زجاجية مضيئة، ودرف ألومنيوم سوداء زجاج.",
    descEn: "Highly optimized walk-in closet space featuring customized drawer grids, integrated LED profiles, and premium black aluminum glass doors.",
    image: "/images/711846958_1607152504751177_8435629229339703644_n.jpg",
    locationAr: "سان ستيفانو، الإسكندرية",
    locationEn: "San Stefano, Alexandria",
    year: "2026",
    materialsAr: "ألواح خشبية معالجة، درف زجاج سيكوريت، إضاءة ليد بروفايل",
    materialsEn: "Moisture-treated panels, tempered glass doors, profile LED setup",
    tagAr: "تصميم وحلول ذكية",
    tagEn: "Smart Storage Solutions",
    quoteAr: "استغلال عبقري للمساحة وتصميم الدريسنج روم مريح جداً وعملي مع إضاءة داخلية تحفة.",
    quoteEn: "Brilliant space optimization. The walk-in closet is extremely functional and visually stunning.",
    clientAr: "م. رانيا علي",
    clientEn: "Rania A."
  }
];

export default function Projects({ lang }: ProjectsProps) {
  const basePath = lang === "ar" ? "" : "/en";

  return (
    <section id="projects" className="py-20 sm:py-28 bg-white relative overflow-hidden">
      {/* Decorative background glows */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-pink-500/5 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-fuchsia-500/5 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Page Banner Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 sm:mb-28">
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

        {/* Alternating Narrative Project Rows */}
        <div className="space-y-24 sm:space-y-36">
          {projectsData.map((project, index) => {
            const isEven = index % 2 === 0;

            return (
              <div
                key={project.id}
                className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-center"
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
                      priority={index === 0}
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

                  {/* Request similar design button (fixed to point to absolute home contact anchor) */}
                  <div>
                    <a
                      href={`${basePath}/#contact`}
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

      </div>
    </section>
  );
}
