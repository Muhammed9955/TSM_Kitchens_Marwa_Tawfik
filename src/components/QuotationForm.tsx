"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Calculator, ChevronRight, ChevronLeft, Send, CheckCircle2, RotateCcw, HelpCircle, Layers, Maximize, Settings } from "lucide-react";
import { useLanguage } from "@/locales/LanguageContext";
import { trackGAEvent, trackPixelEvent } from "@/utils/analytics";

interface QuoteFormData {
  type: string;
  shape: string;
  width: string;
  depth: string;
  countertop: string;
  height: string;
  handles: string;
  hardwareClass: string;
  accessories: string[];
  name: string;
  phone: string;
  location: string;
  notes: string;
}

const initialFormData: QuoteFormData = {
  type: "poly_lac",
  shape: "l_shape",
  width: "3.5",
  depth: "2.5",
  countertop: "quartz",
  height: "standard",
  handles: "gola",
  hardwareClass: "smart_soft",
  accessories: ["led"],
  name: "",
  phone: "",
  location: "",
  notes: "",
};

interface SelectionOption {
  id: string;
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  img: string;
}

const materialOptions: SelectionOption[] = [
  {
    id: "poly_lac",
    titleAr: "بولي لاك (Poly-lac)",
    titleEn: "Poly-lac Kitchens",
    descAr: "خامة تركية ذات لمعان فائق ومقاومة ممتازة للحرارة والخدش والرطوبة.",
    descEn: "Ultra-glossy Turkish panels with high resistance to heat, scratches and steam.",
    img: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=250&q=80"
  },
  {
    id: "acrylic",
    titleAr: "أكريليك فاخر (Acrylic)",
    titleEn: "High-Gloss Acrylic",
    descAr: "مظهر زجاجي لامع وأنيق للغاية يعطي اتساعاً بصرياً مذهلاً لغرفة المطبخ.",
    descEn: "Stunning mirror-glass visual depth that expands small kitchen spaces.",
    img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=250&q=80"
  },
  {
    id: "uv_lacquer",
    titleAr: "يو في لاك (UV Lacquer)",
    titleEn: "UV-Lacquer Styling",
    descAr: "أحدث صيحات المطابخ بألوان مطفية ولمعان فخم مع حماية فائقة ضد البقع والأشعة.",
    descEn: "Modern sleek finish in matte or gloss with robust defense against grease stains.",
    img: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=250&q=80"
  },
  {
    id: "natural_wood",
    titleAr: "خشب أرو كلاسيك (Oak Wood)",
    titleEn: "Classic Natural Oak",
    descAr: "خشب أرو طبيعي فخم معالج بالكامل ليعطي مطبخك فخامة كلاسيكية تدوم العمر كله.",
    descEn: "Premium solid oak wood treated for long-term water and moisture resistance.",
    img: "https://images.unsplash.com/photo-1565183997392-2f6f122e5912?auto=format&fit=crop&w=250&q=80"
  },
  {
    id: "dressing",
    titleAr: "دريسنج روم وغرف ملابس",
    titleEn: "Walk-in Dressing Closet",
    descAr: "تصاميم وتنسيقات داخلية ذكية ومضاءة لتنظيم الملابس والمجوهرات والشنط بكفاءة.",
    descEn: "Bespoke storage systems with LED hangers and pull-out trays for organizing apparel.",
    img: "https://images.unsplash.com/photo-1558882224-cca166733360?auto=format&fit=crop&w=250&q=80"
  }
];

const shapeOptions: SelectionOption[] = [
  {
    id: "straight",
    titleAr: "جدار مستقيم (I-Shape)",
    titleEn: "Straight I-Shape",
    descAr: "مثالي للمطابخ الصغيرة، حيث تصطف الخزائن والأجهزة على جدار واحد.",
    descEn: "Best for tight areas. All counters and prep zones align along one single wall.",
    img: "https://images.unsplash.com/photo-1556909212-d5b604ad0567?auto=format&fit=crop&w=250&q=80"
  },
  {
    id: "parallel",
    titleAr: "ممر مزدوج (Parallel)",
    titleEn: "Parallel / Galley",
    descAr: "توزيع مقابل يوفر مساحتي عمل متوازيتين وسهولة الحركة بين الأجهزة.",
    descEn: "Features two facing rows of cabinets, creating an efficient and fast workspace.",
    img: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=250&q=80"
  },
  {
    id: "l_shape",
    titleAr: "شكل L زاوي (L-Shape)",
    titleEn: "Corner L-Shape",
    descAr: "الشكل الأكثر شعبية، يسهل توزيع مثلث الحركة بحرية في الزوايا.",
    descEn: "Highly popular setup optimizing corner workspaces and matching open-concept areas.",
    img: "https://images.unsplash.com/photo-1556912173-3bb406ef7e77?auto=format&fit=crop&w=250&q=80"
  },
  {
    id: "u_shape",
    titleAr: "شكل U متكامل (U-Shape)",
    titleEn: "Spacious U-Shape",
    descAr: "توزيع على 3 جدران يوفر مساحات تخزين وتحضير رخام هائلة ومريحة.",
    descEn: "Surrounds the cook on three sides with maximum cabinets and countertop spaces.",
    img: "https://images.unsplash.com/photo-1556911220-115b1368a180?auto=format&fit=crop&w=250&q=80"
  },
  {
    id: "island",
    titleAr: "مع جزيرة وسطية (Island)",
    titleEn: "Center Island Setup",
    descAr: "إضافة جزيرة للمطبخ تستخدم كمنطقة طبخ، غسيل، أو كطاولة لتناول الوجبات.",
    descEn: "Adds a center focal point for cooking, washing, or gathering for morning meals.",
    img: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=250&q=80"
  }
];

export default function QuotationForm() {
  const { lang } = useLanguage();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<QuoteFormData>(initialFormData);
  const [priceResult, setPriceResult] = useState<{ min: number; max: number; meters: number } | null>(null);
  const [status, setStatus] = useState<"idle" | "success">("idle");

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (accessory: string) => {
    setFormData((prev) => {
      const alreadySelected = prev.accessories.includes(accessory);
      return {
        ...prev,
        accessories: alreadySelected
          ? prev.accessories.filter((a) => a !== accessory)
          : [...prev.accessories, accessory],
      };
    });
  };

  const calculateEstimate = () => {
    const w = parseFloat(formData.width) || 0;
    const d = parseFloat(formData.depth) || 0;
    let runningMeters = 0;

    switch (formData.shape) {
      case "straight":
        runningMeters = w;
        break;
      case "parallel":
        runningMeters = w * 2;
        break;
      case "l_shape":
        runningMeters = w + d - 0.6;
        break;
      case "u_shape":
        runningMeters = w + (d * 2) - 1.2;
        break;
      case "island":
        runningMeters = w + 1.2;
        break;
      default:
        runningMeters = w;
    }

    if (runningMeters < 1) runningMeters = 1;

    // 1. Base cost per meter
    let pricePerMeter = 8000; // Acrylic
    if (formData.type === "poly_lac") pricePerMeter = 9500;
    if (formData.type === "uv_lacquer") pricePerMeter = 9000;
    if (formData.type === "natural_wood") pricePerMeter = 12500;
    if (formData.type === "dressing") pricePerMeter = 7500;

    // 2. Adjust for Height
    if (formData.height === "ceiling") {
      pricePerMeter = pricePerMeter * 1.15; // Full ceiling-high cabinets add 15% cost
    }

    let kitchenCost = runningMeters * pricePerMeter;

    // 3. Countertop costs
    let countertopPerMeter = 0;
    if (formData.countertop === "quartz") countertopPerMeter = 5500;
    if (formData.countertop === "granite") countertopPerMeter = 3500;
    if (formData.countertop === "marble") countertopPerMeter = 4000;

    let countertopCost = runningMeters * countertopPerMeter;

    // 4. Handles premium adjustments
    let handlesCost = 0;
    if (formData.handles === "gola") handlesCost += runningMeters * 350; // Aluminum gola profile per meter
    if (formData.handles === "push_open") handlesCost += runningMeters * 250; // Tip-on mechanism

    // 5. Hardware Class premium adjustments
    let hardwareCost = 0;
    if (formData.hardwareClass === "blum") hardwareCost += 5000; // Blum flat upgrade
    if (formData.hardwareClass === "smart_soft") hardwareCost += 2000; // Generic smart soft-close

    // 6. Extra accessories
    let accessoriesCost = 0;
    if (formData.accessories.includes("cargo")) accessoriesCost += 4500;
    if (formData.accessories.includes("led")) accessoriesCost += 2000;
    if (formData.accessories.includes("builtin")) accessoriesCost += 1500;

    const totalEstimate = kitchenCost + countertopCost + handlesCost + hardwareCost + accessoriesCost;

    return {
      min: Math.round((totalEstimate * 0.9) / 500) * 500,
      max: Math.round((totalEstimate * 1.1) / 500) * 500,
      meters: Math.round(runningMeters * 10) / 10,
    };
  };

  const handleNext = () => {
    if (step < 3) setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep((prev) => prev - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const calculation = calculateEstimate();
    setPriceResult(calculation);

    const typeLabel =
      formData.type === "poly_lac"
        ? (lang === "ar" ? "بولي لاك (Poly-lac)" : "Poly-lac")
        : formData.type === "acrylic"
        ? (lang === "ar" ? "أكريليك فاخر" : "Premium Acrylic")
        : formData.type === "uv_lacquer"
        ? (lang === "ar" ? "يو في لاك (UV-Lacquer)" : "UV-Lacquer")
        : formData.type === "natural_wood"
        ? (lang === "ar" ? "خشب أرو طبيعي" : "Natural Oak Wood")
        : (lang === "ar" ? "دريسنج روم وغرف ملابس" : "Walk-in Dressing Room");

    const shapeLabel =
      formData.shape === "straight"
        ? (lang === "ar" ? "خطي مستقيم" : "Straight Layout")
        : formData.shape === "parallel"
        ? (lang === "ar" ? "ممر موازي" : "Parallel Layout")
        : formData.shape === "l_shape"
        ? (lang === "ar" ? "شكل L" : "L-Shape Layout")
        : formData.shape === "u_shape"
        ? (lang === "ar" ? "شكل U" : "U-Shape Layout")
        : (lang === "ar" ? "مع جزيرة وسطى" : "Island Layout");

    const countertopLabel =
      formData.countertop === "quartz"
        ? (lang === "ar" ? "كوارتز مستورد" : "Imported Quartz")
        : formData.countertop === "granite"
        ? (lang === "ar" ? "جرانيت مستورد" : "Imported Granite")
        : formData.countertop === "marble"
        ? (lang === "ar" ? "رخام طبيعي" : "Natural Marble")
        : (lang === "ar" ? "بدون رخام" : "None");

    const heightLabel =
      formData.height === "ceiling"
        ? (lang === "ar" ? "واصل للسقف (ارتفاع 260سم+)" : "Ceiling-High (260cm+)")
        : (lang === "ar" ? "ارتفاع قياسي (220سم)" : "Standard Height (220cm)");

    const handlesLabel =
      formData.handles === "gola"
        ? (lang === "ar" ? "مجرى ألومنيوم مخفي (Gola)" : "Hidden Gola Profile")
        : formData.handles === "push_open"
        ? (lang === "ar" ? "فتح بالضغط باللمس (Tip-on)" : "Push-to-Open (Tip-on)")
        : (lang === "ar" ? "مقابض بارزة تقليدية" : "Standard Handles");

    const hardwareLabel =
      formData.hardwareClass === "blum"
        ? (lang === "ar" ? "بلوم نمساوي فاخر (Blum)" : "Premium Blum Austrian")
        : formData.hardwareClass === "smart_soft"
        ? (lang === "ar" ? "هيدروليك ذكي صامت" : "Smart Soft-Close Hydraulic")
        : (lang === "ar" ? "إكسسوارات هيدروليك أساسية" : "Basic Soft-Close");

    const accLabels = formData.accessories.map((acc) => {
      if (acc === "cargo") return lang === "ar" ? "وحدة كارجو طولية" : "Pantry Cargo Unit";
      if (acc === "led") return lang === "ar" ? "ليد بروفايل مخفي" : "Cabinet LED Profiles";
      return lang === "ar" ? "تجهيز بلت-إن" : "Built-in Appliances Prep";
    }).join(" - ");

    const formattedMessage = lang === "ar"
      ? `مرحباً TSM Kitchens،\n\nأود الحصول على تسعير تقديري وتفصيلي لمشروعي:\n\n📐 *المواصفات الفنية:*\n- *النوع:* ${typeLabel}\n- *الشكل:* ${shapeLabel}\n- *الأبعاد:* ${formData.width}م عرض × ${formData.depth}م عمق\n- *الارتفاع:* ${heightLabel}\n- *المقابض:* ${handlesLabel}\n- *الإكسسوارات:* ${hardwareLabel}\n- *الرخام:* ${countertopLabel}\n- *الإضافات:* ${accLabels || "لا توجد"}\n\n👤 *بيانات العميل:*\n- *الاسم:* ${formData.name}\n- *الهاتف:* ${formData.phone}\n- *العنوان:* ${formData.location}\n\n🧮 *التقدير التلقائي الأولي:*\n- *الطول المقدر:* ~ ${calculation.meters} متر طولي\n- *السعر التقريبي للمشروع:* بين ${calculation.min.toLocaleString()} و ${calculation.max.toLocaleString()} جنيه مصري\n\n📝 *ملاحظات:* ${formData.notes || "لا توجد"}`
      : `Hello TSM Kitchens,\n\nI'd like to get an estimated quote for my kitchen project:\n\n📐 *Specifications:*\n- *Material Type:* ${typeLabel}\n- *Layout Shape:* ${shapeLabel}\n- *Dimensions:* ${formData.width}m width x ${formData.depth}m depth\n- *Height:* ${heightLabel}\n- *Handles:* ${handlesLabel}\n- *Hardware Class:* ${hardwareLabel}\n- *Countertop:* ${countertopLabel}\n- *Accessories:* ${accLabels || "None"}\n\n👤 *Client Details:*\n- *Name:* ${formData.name}\n- *Phone:* ${formData.phone}\n- *Location:* ${formData.location}\n\n🧮 *Automated Estimate:*\n- *Est. Length:* ~ ${calculation.meters} running meters\n- *Est. Total Budget:* EGP ${calculation.min.toLocaleString()} - EGP ${calculation.max.toLocaleString()}\n\n📝 *Notes:* ${formData.notes || "None"}`;

    const url = `https://wa.me/201113561777?text=${encodeURIComponent(formattedMessage)}`;
    window.open(url, "_blank");

    trackGAEvent("form_submit", "lead", "quotation_calculator");
    trackPixelEvent("Lead", {
      content_name: "Quotation Calculator",
      value: (calculation.min + calculation.max) / 2,
      currency: "EGP",
      content_category: formData.type,
    });

    setStatus("success");
  };

  const handleReset = () => {
    setFormData(initialFormData);
    setPriceResult(null);
    setStatus("idle");
    setStep(1);
  };

  return (
    <section id="quotation" className="py-20 sm:py-28 bg-slate-900 text-white relative overflow-hidden border-t border-slate-800">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-pink-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-fuchsia-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10" dir={lang === "ar" ? "rtl" : "ltr"}>
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-pink-500 font-bold tracking-wider text-xs sm:text-sm uppercase mb-2 block">
            {lang === "ar" ? "حساب التكلفة التقديرية" : "Quote Calculator"}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            {lang === "ar" ? "طلب عرض سعر تفصيلي للمطبخ" : "Get a Customized Kitchen Quote"}
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            {lang === "ar" 
              ? "اختر نوع الخامات وتفاصيل المطبخ بالكامل واحصل على تسعير فوري ومطابقة مباشرة مع واتساب المعرض."
              : "Select materials, shapes, and options to get an instant budget range and schedule inspection."
            }
          </p>
          <div className="w-16 h-1 bg-pink-600 mx-auto rounded-full mt-4" />
        </div>

        {/* Calculation Success state */}
        {status === "success" && priceResult ? (
          <div className="bg-white text-slate-900 rounded-3xl p-8 sm:p-12 shadow-2xl border border-pink-500/20 max-w-2xl mx-auto animate-scale-up">
            <div className="flex flex-col items-center text-center">
              <CheckCircle2 className="w-16 h-16 text-emerald-500 mb-4 animate-ping-once" />
              <h3 className="text-2xl font-extrabold text-slate-900 mb-2">
                {lang === "ar" ? "تم حساب عرض السعر وإرساله!" : "Quote Computed & Sent!"}
              </h3>
              <p className="text-slate-500 text-sm max-w-sm mb-8 leading-relaxed">
                {lang === "ar"
                  ? "تم إعداد الطلب وتوجيهك إلى واتساب المعرض لتأكيد الموعد للمعاينة وتحديد التصميم."
                  : "Your quote range is prepared. We redirected you to WhatsApp to complete your request."}
              </p>
            </div>

            {/* Bill Receipt summary */}
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 mb-8 text-sm space-y-4">
              <div className="flex justify-between border-b border-slate-200/60 pb-3">
                <span className="text-slate-400 font-medium">{lang === "ar" ? "الخامة:" : "Material:"}</span>
                <span className="font-bold text-slate-800">
                  {formData.type === "poly_lac" ? (lang === "ar" ? "بولي لاك" : "Poly-lac") : 
                   formData.type === "acrylic" ? (lang === "ar" ? "أكريليك" : "Acrylic") : 
                   formData.type === "natural_wood" ? (lang === "ar" ? "خشب طبيعي" : "Natural Wood") :
                   formData.type === "uv_lacquer" ? (lang === "ar" ? "يو في لاك" : "UV Lacquer") : 
                   (lang === "ar" ? "دريسنج روم" : "Dressing Closet")}
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-200/60 pb-3">
                <span className="text-slate-400 font-medium">{lang === "ar" ? "المخطط الهيكلي:" : "Layout Shape:"}</span>
                <span className="font-bold text-slate-800">
                  {formData.shape === "straight" ? (lang === "ar" ? "خطي مستقيم" : "Straight") : 
                   formData.shape === "parallel" ? (lang === "ar" ? "ممر موازي" : "Parallel") : 
                   formData.shape === "l_shape" ? (lang === "ar" ? "شكل L" : "L-Shape") : 
                   formData.shape === "u_shape" ? (lang === "ar" ? "شكل U" : "U-Shape") : 
                   (lang === "ar" ? "مع جزيرة وسطى" : "With Island")}
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-200/60 pb-3">
                <span className="text-slate-400 font-medium">{lang === "ar" ? "المحيط المقدر:" : "Est. Running Length:"}</span>
                <span className="font-bold text-slate-800">~ {priceResult.meters} {lang === "ar" ? "متر طولي" : "meters"}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/60 pb-3">
                <span className="text-slate-400 font-medium">{lang === "ar" ? "ارتفاع الوحدات:" : "Cabinet Height:"}</span>
                <span className="font-bold text-slate-800">
                  {formData.height === "ceiling" ? (lang === "ar" ? "واصل للسقف" : "Ceiling-High") : (lang === "ar" ? "ارتفاع قياسي" : "Standard")}
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-200/60 pb-3">
                <span className="text-slate-400 font-medium">{lang === "ar" ? "فئة الإكسسوارات:" : "Hardware Class:"}</span>
                <span className="font-bold text-slate-800">
                  {formData.hardwareClass === "blum" ? (lang === "ar" ? "بلوم نمساوي" : "Blum Austrian") : 
                   formData.hardwareClass === "smart_soft" ? (lang === "ar" ? "هيدروليك صامت" : "Smart Soft-close") : 
                   (lang === "ar" ? "أساسي" : "Basic")}
                </span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-pink-600 font-bold text-base">{lang === "ar" ? "التسعير التقريبي المتوقع:" : "Estimated Price Range:"}</span>
                <span className="font-extrabold text-pink-600 text-lg">
                  {priceResult.min.toLocaleString()} - {priceResult.max.toLocaleString()} {lang === "ar" ? "ج.م" : "EGP"}
                </span>
              </div>
            </div>

            <button
              onClick={handleReset}
              className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl cursor-pointer transition-all"
            >
              <RotateCcw size={16} />
              <span>{lang === "ar" ? "حساب تسعيرة جديدة" : "Compute Another Quote"}</span>
            </button>
          </div>
        ) : (
          /* Wizard form */
          <div className="bg-slate-800 border border-slate-700/80 rounded-3xl shadow-2xl p-6 sm:p-10 max-w-3xl mx-auto">
            
            {/* Steps bar */}
            <div className="flex items-center justify-between mb-10 border-b border-slate-700/60 pb-6 text-xs sm:text-sm font-semibold select-none">
              <button
                type="button"
                onClick={() => setStep(1)}
                className={`flex items-center gap-2 transition-colors ${step >= 1 ? "text-pink-500" : "text-zinc-500"}`}
              >
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 1 ? "bg-pink-600 text-white" : "bg-slate-700 text-zinc-400"}`}>1</span>
                <span>{lang === "ar" ? "الخامات والهيكل" : "Material & Shape"}</span>
              </button>
              <div className="w-8 h-[2px] bg-slate-700 flex-grow mx-4 hidden sm:block" />
              <button
                type="button"
                onClick={() => { if (step > 1) setStep(2); }}
                className={`flex items-center gap-2 transition-colors ${step >= 2 ? "text-pink-500" : "text-zinc-500"}`}
              >
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 2 ? "bg-pink-600 text-white" : "bg-slate-700 text-zinc-400"}`}>2</span>
                <span>{lang === "ar" ? "المقاسات والخيارات" : "Dimensions & Options"}</span>
              </button>
              <div className="w-8 h-[2px] bg-slate-700 flex-grow mx-4 hidden sm:block" />
              <button
                type="button"
                onClick={() => { if (step > 2) setStep(3); }}
                className={`flex items-center gap-2 transition-colors ${step >= 3 ? "text-pink-500" : "text-zinc-500"}`}
              >
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 3 ? "bg-pink-600 text-white" : "bg-slate-700 text-zinc-400"}`}>3</span>
                <span>{lang === "ar" ? "العميل والتسليم" : "Contact & Submit"}</span>
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              
              {/* STEP 1: Material and Shapes (Visual cards with pictures!) */}
              {step === 1 && (
                <div className="space-y-8 animate-fade-in">
                  
                  {/* Visual Material Grid Cards */}
                  <div className="flex flex-col gap-3">
                    <label className="text-zinc-300 text-sm font-semibold flex items-center gap-1.5">
                      <Layers size={16} className="text-pink-500" />
                      <span>{lang === "ar" ? "اختر خامة المطبخ المفضلة (شاهد الصور):" : "Choose Material Finish (With Photos):"}</span>
                    </label>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {materialOptions.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => setFormData((prev) => ({ ...prev, type: item.id }))}
                          className={`relative rounded-xl overflow-hidden border cursor-pointer select-none transition-all duration-300 group flex items-center p-3 gap-3 ${
                            formData.type === item.id
                              ? "border-pink-500 bg-pink-500/[0.03] shadow-lg shadow-pink-500/5 scale-[1.01]"
                              : "border-slate-700 bg-slate-900/60 hover:border-slate-500 text-zinc-300"
                          }`}
                        >
                          {/* Small Square Image Box */}
                          <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 border border-slate-800">
                            <Image
                              src={item.img}
                              alt={lang === "ar" ? item.titleAr : item.titleEn}
                              fill
                              sizes="64px"
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          </div>

                          {/* Content Box */}
                          <div className="flex-grow min-w-0">
                            <h4 className="text-xs sm:text-sm font-bold text-white mb-0.5">
                              {lang === "ar" ? item.titleAr : item.titleEn}
                            </h4>
                            <p className="text-[10px] text-zinc-400 leading-relaxed line-clamp-2">
                              {lang === "ar" ? item.descAr : item.descEn}
                            </p>
                          </div>

                          {/* Radio Dot indicator */}
                          <div className="flex-shrink-0 pt-0.5">
                            <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-colors ${
                              formData.type === item.id ? "border-pink-500 bg-pink-600 text-white" : "border-slate-500"
                            }`}>
                              {formData.type === item.id && <div className="w-1 h-1 rounded-full bg-white" />}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Visual Shape Grid Cards */}
                  <div className="flex flex-col gap-3 pt-6 border-t border-slate-700/50">
                    <label className="text-zinc-300 text-sm font-semibold flex items-center gap-1.5">
                      <Maximize size={16} className="text-pink-500" />
                      <span>{lang === "ar" ? "اختر مخطط شكل المطبخ الهيكلي:" : "Select Layout Shape Configuration:"}</span>
                    </label>

                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                      {shapeOptions.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => setFormData((prev) => ({ ...prev, shape: item.id }))}
                          className={`rounded-xl overflow-hidden border cursor-pointer select-none transition-all duration-300 flex flex-col justify-between group p-2 gap-2 text-center ${
                            formData.shape === item.id
                              ? "border-pink-500 bg-pink-500/[0.03] shadow-md shadow-pink-500/5"
                              : "border-slate-700 bg-slate-900/60 hover:border-slate-500"
                          }`}
                        >
                          {/* Image Box */}
                          <div className="relative aspect-square w-full rounded-lg overflow-hidden border border-slate-800">
                            <Image
                              src={item.img}
                              alt={lang === "ar" ? item.titleAr : item.titleEn}
                              fill
                              sizes="80px"
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover:opacity-0 transition-opacity" />
                          </div>

                          <div className="pb-1 text-center flex items-center justify-center min-h-[28px]">
                            <span className={`text-[10px] sm:text-xs font-bold transition-colors leading-tight ${
                              formData.shape === item.id ? "text-pink-500 font-extrabold" : "text-zinc-300"
                            }`}>
                              {lang === "ar" ? catLabelAr(item.id) : catLabelEn(item.id)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

              {/* STEP 2: Sizes, Stone & Expanded custom Options (Height, Handles, Hardware) */}
              {step === 2 && (
                <div className="space-y-6 animate-fade-in">
                  
                  {/* Dimensions Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="width" className="text-zinc-300 text-xs font-semibold">
                        {lang === "ar" ? "عرض جدار المطبخ الأساسي (بالمتر):" : "Primary Wall Width (meters):"}
                      </label>
                      <input
                        type="number"
                        id="width"
                        name="width"
                        step="0.1"
                        min="1"
                        max="20"
                        required
                        value={formData.width}
                        onChange={handleTextChange}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-pink-500 transition-all"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="depth" className="text-zinc-300 text-xs font-semibold">
                        {lang === "ar" ? "عمق أو الجدار الفرعي (بالمتر):" : "Sub Wall Depth (meters):"}
                      </label>
                      <input
                        type="number"
                        id="depth"
                        name="depth"
                        step="0.1"
                        min="0"
                        max="20"
                        required
                        disabled={formData.shape === "straight"}
                        value={formData.shape === "straight" ? "0" : formData.depth}
                        onChange={handleTextChange}
                        className="w-full bg-slate-900 border border-slate-700 disabled:opacity-40 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-pink-500 transition-all"
                      />
                    </div>
                  </div>

                  {/* Expanded Custom Options Section */}
                  <div className="border-t border-slate-700/40 pt-6 space-y-6">
                    <h4 className="text-xs font-bold text-pink-500 uppercase tracking-wider flex items-center gap-1.5">
                      <Settings size={14} />
                      <span>{lang === "ar" ? "مواصفات التنسيق الفني:" : "Technical configuration specs:"}</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      
                      {/* Height Select */}
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="height" className="text-zinc-300 text-xs font-semibold">
                          {lang === "ar" ? "ارتفاع دواليب المطبخ:" : "Cabinet Height Setup:"}
                        </label>
                        <select
                          id="height"
                          name="height"
                          value={formData.height}
                          onChange={handleTextChange}
                          className="w-full bg-slate-900 border border-slate-700 focus:border-pink-500 rounded-xl px-3 py-3 text-white text-xs sm:text-sm focus:outline-none transition-all cursor-pointer"
                        >
                          <option value="standard">{lang === "ar" ? "ارتفاع قياسي (220 سم)" : "Standard (220cm)"}</option>
                          <option value="ceiling">{lang === "ar" ? "واصل للسقف (260 سم+)" : "Ceiling-High (260cm+)"}</option>
                        </select>
                      </div>

                      {/* Handles Select */}
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="handles" className="text-zinc-300 text-xs font-semibold">
                          {lang === "ar" ? "نوع مقابض الدرف:" : "Cabinet Handle Type:"}
                        </label>
                        <select
                          id="handles"
                          name="handles"
                          value={formData.handles}
                          onChange={handleTextChange}
                          className="w-full bg-slate-900 border border-slate-700 focus:border-pink-500 rounded-xl px-3 py-3 text-white text-xs sm:text-sm focus:outline-none transition-all cursor-pointer"
                        >
                          <option value="gola">{lang === "ar" ? "مجرى ألومنيوم مخفي (Gola)" : "Hidden Gola Profile"}</option>
                          <option value="classic">{lang === "ar" ? "مقابض بارزة كلاسيكية" : "Traditional Pull Handles"}</option>
                          <option value="push_open">{lang === "ar" ? "فتح بالضغط باللمس (Tip-on)" : "Push-to-Open (Tip-on)"}</option>
                        </select>
                      </div>

                      {/* Hardware Class Select */}
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="hardwareClass" className="text-zinc-300 text-xs font-semibold">
                          {lang === "ar" ? "فئة المفصلات والأنظمة:" : "Hardware Brand Grade:"}
                        </label>
                        <select
                          id="hardwareClass"
                          name="hardwareClass"
                          value={formData.hardwareClass}
                          onChange={handleTextChange}
                          className="w-full bg-slate-900 border border-slate-700 focus:border-pink-500 rounded-xl px-3 py-3 text-white text-xs sm:text-sm focus:outline-none transition-all cursor-pointer"
                        >
                          <option value="smart_soft">{lang === "ar" ? "هيدروليك ذكي صامت" : "Smart Silent Hydraulic"}</option>
                          <option value="blum">{lang === "ar" ? "بلوم نمساوي فاخر (Blum)" : "Premium Austrian Blum"}</option>
                          <option value="basic">{lang === "ar" ? "مفصلات هيدروليك أساسية" : "Basic soft-close"}</option>
                        </select>
                      </div>

                    </div>
                  </div>

                  {/* Countertop surface select */}
                  <div className="flex flex-col gap-2 pt-2 border-t border-slate-700/40">
                    <label className="text-zinc-300 text-sm font-semibold">
                      {lang === "ar" ? "نوع رخام / قرصة المطبخ:" : "Countertop surface material:"}
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        { id: "quartz", labelAr: "كوارتز صناعي", labelEn: "Quartz" },
                        { id: "granite", labelAr: "جرانيت مستورد", labelEn: "Imported Granite" },
                        { id: "marble", labelAr: "رخام طبيعي", labelEn: "Natural Marble" },
                        { id: "none", labelAr: "بدون رخام", labelEn: "None" },
                      ].map((item) => (
                        <div
                          key={item.id}
                          onClick={() => setFormData((prev) => ({ ...prev, countertop: item.id }))}
                          className={`p-3 rounded-xl border text-center cursor-pointer select-none transition-all text-xs ${
                            formData.countertop === item.id
                              ? "bg-pink-600 border-pink-500 text-white font-bold"
                              : "bg-slate-900 border-slate-700 hover:border-zinc-500 text-zinc-300"
                          }`}
                        >
                          <span>{lang === "ar" ? item.labelAr : item.labelEn}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Smart items Checklist */}
                  <div className="flex flex-col gap-2 pt-2 border-t border-slate-700/40">
                    <label className="text-zinc-300 text-sm font-semibold">
                      {lang === "ar" ? "إضافات وأنظمة تنظيم ذكية:" : "Cabinet Systems & Upgrades:"}
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                      {[
                        { id: "cargo", labelAr: "وحدة كارجو طولية للبقوليات", labelEn: "Pantry Cargo Column" },
                        { id: "led", labelAr: "إضاءة ليد بروفايل مدمجة", labelEn: "Cabinet LED Profiles" },
                        { id: "builtin", labelAr: "تنسيق تجهيزات الأجهزة البلت-إن", labelEn: "Built-in Appliances Prep" },
                      ].map((item) => (
                        <label
                          key={item.id}
                          className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all text-xs ${
                            formData.accessories.includes(item.id)
                              ? "bg-pink-600/10 border-pink-500 text-white"
                              : "bg-slate-900 border-slate-700 hover:border-zinc-700 text-zinc-400"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={formData.accessories.includes(item.id)}
                            onChange={() => handleCheckboxChange(item.id)}
                            className="rounded text-pink-600 focus:ring-pink-500 bg-slate-900 border-slate-700"
                          />
                          <span>{lang === "ar" ? item.labelAr : item.labelEn}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                </div>
              )}

              {/* STEP 3: Contact & Send */}
              {step === 3 && (
                <div className="space-y-5 animate-fade-in">
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="name" className="text-zinc-300 text-xs font-semibold">
                        {lang === "ar" ? "الاسم الكامل للعميل:" : "Full Name:"}
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleTextChange}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-pink-500 transition-all"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="phone" className="text-zinc-300 text-xs font-semibold">
                        {lang === "ar" ? "رقم الهاتف / واتساب:" : "Phone / WhatsApp:"}
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleTextChange}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-pink-500 transition-all"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="location" className="text-zinc-300 text-xs font-semibold">
                      {lang === "ar" ? "المنطقة / العنوان (مثال: سموحة، الإسكندرية):" : "Area / Location (e.g. Smouha, Alexandria):"}
                    </label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      required
                      value={formData.location}
                      onChange={handleTextChange}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-pink-500 transition-all"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="notes" className="text-zinc-300 text-xs font-semibold">
                      {lang === "ar" ? "ملاحظات خاصة (أجهزة معينة، متطلبات تفصيلية):" : "Custom Notes (specific items, height requirements):"}
                    </label>
                    <textarea
                      id="notes"
                      name="notes"
                      rows={3}
                      value={formData.notes}
                      onChange={handleTextChange}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-pink-500 transition-all resize-none"
                    />
                  </div>

                </div>
              )}

              {/* Form Navigation Controls */}
              <div className="flex items-center justify-between border-t border-slate-700/60 pt-6 mt-8">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="flex items-center gap-1.5 bg-slate-700 hover:bg-slate-650 text-white font-bold py-3 px-6 rounded-xl cursor-pointer transition-all"
                  >
                    <ChevronLeft size={16} className={lang === "ar" ? "rotate-180" : ""} />
                    <span>{lang === "ar" ? "السابق" : "Back"}</span>
                  </button>
                ) : (
                  <div />
                )}

                {step < 3 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex items-center gap-1.5 bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-6 rounded-xl cursor-pointer transition-all shadow-md"
                  >
                    <span>{lang === "ar" ? "التالي" : "Next"}</span>
                    <ChevronRight size={16} className={lang === "ar" ? "rotate-180" : ""} />
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold py-3.5 px-8 rounded-xl cursor-pointer transition-all shadow-lg hover:shadow-emerald-500/20"
                  >
                    <Calculator size={18} />
                    <span>{lang === "ar" ? "احسب السعر وأرسل الطلب" : "Calculate & Request Quote"}</span>
                    <Send size={14} className={lang === "ar" ? "rotate-180" : ""} />
                  </button>
                )}
              </div>

            </form>
          </div>
        )}

      </div>
    </section>
  );
}

// Helpers for localized shape tags
function catLabelAr(shape: string) {
  if (shape === "straight") return "جدار مستقيم";
  if (shape === "parallel") return "ممر موازي";
  if (shape === "l_shape") return "شكل L زاوي";
  if (shape === "u_shape") return "شكل U متكامل";
  return "جزيرة وسطية";
}

function catLabelEn(shape: string) {
  if (shape === "straight") return "Straight";
  if (shape === "parallel") return "Parallel";
  if (shape === "l_shape") return "L-Shape";
  if (shape === "u_shape") return "U-Shape";
  return "With Island";
}
