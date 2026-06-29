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
    titleAr: "مطبخ أكريليك عصري - الشيخ زايد",
    titleEn: "Modern Acrylic Kitchen - Sheikh Zayed",
    descAr: "مساحة واسعة بنظام الإضاءة الذكية ومزيج من خامات الأكريليك الفاخر والبولي لاك المقاوم للرطوبة مع جزيرة مطبخ وسطية رخام.",
    descEn: "Spacious contemporary layout featuring smart LED profiles, high-gloss Acrylic cabinetry, and moisture-resistant Poly-lac with a marble island.",
    image: "/images/627444162_1494778629321899_6247081398093507899_n.jpg",
    locationAr: "الشيخ زايد، الجيزة",
    locationEn: "Sheikh Zayed, Giza",
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
    titleAr: "مطبخ كلاسيك خشب - التجمع الخامس",
    titleEn: "Luxury Natural Wood Kitchen - New Cairo",
    descAr: "مطبخ دافئ وعريق مصنوع بالكامل من خشب الأرو الطبيعي المعالج ضد المياه، مع مقابض نحاسية عتيقة ومساحة تخزين مصممة خصيصاً.",
    descEn: "Warm classical design crafted entirely of premium water-treated natural oak wood, featuring vintage brass hardware and custom storage units.",
    image: "/images/648466344_1523994953066933_1065404319821191504_n.jpg",
    locationAr: "التجمع الخامس، القاهرة الجديدة",
    locationEn: "Fifth Settlement, New Cairo",
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
    titleAr: "دريسنج روم متكامل - مصر الجديدة",
    titleEn: "Bespoke Dressing Room - Heliopolis",
    descAr: "استغلال ذكي للغاية للمساحات المتاحة مع تقسيمات داخلية مريحة لتنظيم الملابس، أرفف زجاجية مضيئة، ودرف ألومنيوم سوداء زجاج.",
    descEn: "Highly optimized walk-in closet space featuring customized drawer grids, integrated LED profiles, and premium black aluminum glass doors.",
    image: "/images/711846958_1607152504751177_8435629229339703644_n.jpg",
    locationAr: "مصر الجديدة، القاهرة",
    locationEn: "Heliopolis, Cairo",
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
  return (
    <section id="projects" className="py-20 sm:py-28 bg-white border-t border-slate-100 relative overflow-hidden">
      {/* Decorative glows */}
      <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-pink-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-fuchsia-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-24">
          <span className="text-pink-500 font-semibold tracking-wider text-xs sm:text-sm uppercase mb-2 block">
            {lang === "ar" ? "أحدث أعمالنا" : "Our Projects"}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
            {lang === "ar" ? "مشاريع تم تسليمها مؤخراً" : "Recently Handed-Over Projects"}
          </h2>
          <div className="w-16 h-1 bg-pink-600 mx-auto rounded-full mt-4" />
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {projectsData.map((project) => (
            <div
              key={project.id}
              className="glass-card rounded-2xl overflow-hidden flex flex-col justify-between group hover:shadow-2xl hover:-translate-y-2 hover:border-pink-500/20 border border-slate-100 bg-white transition-all duration-500"
            >
              <div>
                {/* Image Container with floating tags */}
                <div className="relative aspect-video w-full overflow-hidden border-b border-slate-100">
                  <Image
                    src={project.image}
                    alt={lang === "ar" ? project.titleAr : project.titleEn}
                    fill
                    sizes="(max-w-768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-750 ease-out group-hover:scale-105"
                  />
                  {/* Floating Date Tag */}
                  <div className={`absolute top-4 z-10 bg-zinc-950/80 backdrop-blur-md text-white text-[10px] sm:text-xs font-bold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1 ${
                    lang === "ar" ? "right-4" : "left-4"
                  }`}>
                    <Calendar size={12} className="text-pink-500" />
                    <span>{project.year}</span>
                  </div>

                  {/* Floating Category Tag */}
                  <div className={`absolute bottom-4 z-10 bg-pink-600 text-white text-[10px] sm:text-xs font-bold px-3 py-1.5 rounded-full shadow-md ${
                    lang === "ar" ? "left-4" : "right-4"
                  }`}>
                    <span>{lang === "ar" ? project.tagAr : project.tagEn}</span>
                  </div>
                </div>

                {/* Body Details */}
                <div className="p-6">
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-3 group-hover:text-pink-600 transition-colors">
                    {lang === "ar" ? project.titleAr : project.titleEn}
                  </h3>
                  
                  <p className="text-slate-500 text-sm leading-relaxed mb-5">
                    {lang === "ar" ? project.descAr : project.descEn}
                  </p>

                  {/* Testimonial Quote */}
                  <div className="bg-pink-500/[0.03] rounded-xl p-4 border-r-2 border-pink-500/60 text-xs italic text-slate-600 mb-6 flex gap-3 relative">
                    <Quote size={18} className="text-pink-500/40 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="leading-relaxed">
                        {lang === "ar" ? project.quoteAr : project.quoteEn}
                      </p>
                      <span className="block text-[10px] text-slate-400 font-bold mt-1">
                        - {lang === "ar" ? project.clientAr : project.clientEn}
                      </span>
                    </div>
                  </div>

                  {/* Metadata fields */}
                  <div className="space-y-3 pt-4 border-t border-slate-100/60 text-xs sm:text-sm">
                    {/* Location */}
                    <div className="flex items-center gap-2 text-slate-600">
                      <MapPin size={16} className="text-pink-500 flex-shrink-0" />
                      <span className="font-semibold">{lang === "ar" ? "الموقع:" : "Location:"}</span>
                      <span>{lang === "ar" ? project.locationAr : project.locationEn}</span>
                    </div>

                    {/* Materials */}
                    <div className="flex items-start gap-2 text-slate-600">
                      <CheckSquare size={16} className="text-pink-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-semibold block sm:inline">{lang === "ar" ? "المواصفات:" : "Specs:"} </span>
                        <span>{lang === "ar" ? project.materialsAr : project.materialsEn}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Consultation trigger CTA */}
              <div className="p-6 pt-0 mt-auto">
                <a
                  href="#contact"
                  className="w-full inline-flex items-center justify-center gap-2 bg-slate-50 hover:bg-pink-600 text-slate-700 hover:text-white font-bold py-3 rounded-xl border border-slate-200/50 hover:border-pink-500 transition-all duration-300 text-sm cursor-pointer"
                >
                  <PhoneCall size={14} />
                  <span>{lang === "ar" ? "طلب تصميم مشابه" : "Request Similar Design"}</span>
                </a>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
