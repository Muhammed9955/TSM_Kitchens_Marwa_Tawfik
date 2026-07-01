"use client";

import React, { useState } from "react";
import { Calculator, ChevronRight, ChevronLeft, Send, CheckCircle2, RotateCcw } from "lucide-react";
import { useLanguage } from "@/locales/LanguageContext";
import { trackGAEvent, trackPixelEvent } from "@/utils/analytics";

interface QuoteFormData {
  type: string;
  shape: string;
  width: string;
  depth: string;
  countertop: string;
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
  accessories: ["hydraulic", "led"],
  name: "",
  phone: "",
  location: "",
  notes: "",
};

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

  // Perform rough price calculation based on Egyptian/local market standard rates
  const calculateEstimate = () => {
    // 1. Determine running meters based on shape
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

    // 2. Base cost per meter
    let pricePerMeter = 8000; // Default Acrylic
    if (formData.type === "poly_lac") pricePerMeter = 9500;
    if (formData.type === "uv_lacquer") pricePerMeter = 9000;
    if (formData.type === "natural_wood") pricePerMeter = 12500;
    if (formData.type === "dressing") pricePerMeter = 7500;

    let kitchenCost = runningMeters * pricePerMeter;

    // 3. Countertop costs
    let countertopPerMeter = 0;
    if (formData.countertop === "quartz") countertopPerMeter = 5500;
    if (formData.countertop === "granite") countertopPerMeter = 3500;
    if (formData.countertop === "marble") countertopPerMeter = 4000;

    let countertopCost = runningMeters * countertopPerMeter;

    // 4. Accessories costs
    let accessoriesCost = 0;
    if (formData.accessories.includes("hydraulic")) accessoriesCost += 2500;
    if (formData.accessories.includes("cargo")) accessoriesCost += 4500;
    if (formData.accessories.includes("led")) accessoriesCost += 2000;
    if (formData.accessories.includes("builtin")) accessoriesCost += 1500;

    const totalEstimate = kitchenCost + countertopCost + accessoriesCost;

    // Output range (-10% to +10%)
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

    // Format Arabic/English item names
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

    const accLabels = formData.accessories.map((acc) => {
      if (acc === "hydraulic") return lang === "ar" ? "إكسسوارات هيدروليك" : "Hydraulic Soft-close";
      if (acc === "cargo") return lang === "ar" ? "وحدة كارجو طولية" : "Pantry Cargo Unit";
      if (acc === "led") return lang === "ar" ? "ليد بروفايل مخفي" : "Cabinet LED Profiles";
      return lang === "ar" ? "تجهيز بلت-إن" : "Built-in Appliances Prep";
    }).join(" - ");

    // Build the WhatsApp receipt message
    const formattedMessage = lang === "ar"
      ? `مرحباً TSM Kitchens،\n\nأود الحصول على تسعير تقديري وتفصيلي لمطبخي:\n\n📐 *المواصفات الفنية:*\n- *النوع:* ${typeLabel}\n- *الشكل:* ${shapeLabel}\n- *الأبعاد:* ${formData.width}م عرض × ${formData.depth}م عمق\n- *الرخام:* ${countertopLabel}\n- *الإضافات:* ${accLabels || "لا توجد"}\n\n👤 *بيانات العميل:*\n- *الاسم:* ${formData.name}\n- *الهاتف:* ${formData.phone}\n- *العنوان:* ${formData.location}\n\n🧮 *التقدير التلقائي الأولي:*\n- *الطول المقدر:* ~ ${calculation.meters} متر طولي\n- *السعر التقريبي للمشروع:* بين ${calculation.min.toLocaleString()} و ${calculation.max.toLocaleString()} جنيه مصري\n\n📝 *ملاحظات:* ${formData.notes || "لا توجد"}`
      : `Hello TSM Kitchens,\n\nI'd like to get an estimated quote for my kitchen project:\n\n📐 *Specifications:*\n- *Material Type:* ${typeLabel}\n- *Layout Shape:* ${shapeLabel}\n- *Dimensions:* ${formData.width}m width x ${formData.depth}m depth\n- *Countertop:* ${countertopLabel}\n- *Accessories:* ${accLabels || "None"}\n\n👤 *Client Details:*\n- *Name:* ${formData.name}\n- *Phone:* ${formData.phone}\n- *Location:* ${formData.location}\n\n🧮 *Automated Estimate:*\n- *Est. Length:* ~ ${calculation.meters} running meters\n- *Est. Total Budget:* EGP ${calculation.min.toLocaleString()} - EGP ${calculation.max.toLocaleString()}\n\n📝 *Notes:* ${formData.notes || "None"}`;

    // Open WhatsApp
    const url = `https://wa.me/201113561777?text=${encodeURIComponent(formattedMessage)}`;
    window.open(url, "_blank");

    // Track Lead Conversion
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
      {/* Dynamic background glows */}
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
              ? "اختر نوع الخامات والشكل والمساحة واحصل على تسعير فوري ومطابقة مباشرة مع واتساب المعرض."
              : "Select materials, layout shapes, and sizes to get an instant budget range and request booking."
            }
          </p>
          <div className="w-16 h-1 bg-pink-600 mx-auto rounded-full mt-4" />
        </div>

        {/* Calculation Bill Success State */}
        {status === "success" && priceResult ? (
          <div className="bg-white text-slate-900 rounded-3xl p-8 sm:p-12 shadow-2xl border border-pink-500/20 max-w-2xl mx-auto animate-scale-up">
            <div className="flex flex-col items-center text-center">
              <CheckCircle2 className="w-16 h-16 text-emerald-500 mb-4 animate-ping-once" />
              <h3 className="text-2xl font-extrabold text-slate-900 mb-2">
                {lang === "ar" ? "تم حساب عرض السعر وإرساله!" : "Quote Computed & Sent!"}
              </h3>
              <p className="text-slate-500 text-sm max-w-sm mb-8 leading-relaxed">
                {lang === "ar"
                  ? "تم إعداد الطلب وتوجيهك إلى واتساب المعرض لتأكيد التفاصيل وحجز موعد المعاينة الفعلية."
                  : "We've redirected you to WhatsApp to complete your request and schedule a validation site visit."}
              </p>
            </div>

            {/* Receipt Summary Grid */}
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 mb-8 text-sm space-y-4">
              <div className="flex justify-between border-b border-slate-200/60 pb-3">
                <span className="text-slate-400 font-medium">{lang === "ar" ? "نوع المطبخ:" : "Kitchen Type:"}</span>
                <span className="font-bold text-slate-800">
                  {formData.type === "poly_lac" ? (lang === "ar" ? "بولي لاك" : "Poly-lac") : 
                   formData.type === "acrylic" ? (lang === "ar" ? "أكريليك" : "Acrylic") : 
                   formData.type === "natural_wood" ? (lang === "ar" ? "خشب طبيعي" : "Natural Wood") :
                   formData.type === "uv_lacquer" ? (lang === "ar" ? "يو في لاك" : "UV Lacquer") : 
                   (lang === "ar" ? "دريسنج روم" : "Dressing Closet")}
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-200/60 pb-3">
                <span className="text-slate-400 font-medium">{lang === "ar" ? "الشكل المختار:" : "Selected Shape:"}</span>
                <span className="font-bold text-slate-800">
                  {formData.shape === "straight" ? (lang === "ar" ? "خطي مستقيم" : "Straight") : 
                   formData.shape === "parallel" ? (lang === "ar" ? "ممر موازي" : "Parallel") : 
                   formData.shape === "l_shape" ? (lang === "ar" ? "شكل L" : "L-Shape") : 
                   formData.shape === "u_shape" ? (lang === "ar" ? "شكل U" : "U-Shape") : 
                   (lang === "ar" ? "مع جزيرة وسطى" : "With Island")}
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-200/60 pb-3">
                <span className="text-slate-400 font-medium">{lang === "ar" ? "أبعاد الغرفة المقدرة:" : "Est. Dimensions:"}</span>
                <span className="font-bold text-slate-800">{formData.width}م × {formData.depth}م</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/60 pb-3">
                <span className="text-slate-400 font-medium">{lang === "ar" ? "المحيط التقريبي:" : "Est. Running Length:"}</span>
                <span className="font-bold text-slate-800">~ {priceResult.meters} {lang === "ar" ? "متر طولي" : "meters"}</span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-pink-600 font-bold text-base">{lang === "ar" ? "ميزانية تقديرية متوقعة:" : "Estimated Price Range:"}</span>
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
          /* Multi-Step Calculator Form Container */
          <div className="bg-slate-800 border border-slate-700/80 rounded-3xl shadow-2xl p-6 sm:p-10 max-w-3xl mx-auto">
            
            {/* Step Indicators */}
            <div className="flex items-center justify-between mb-10 border-b border-slate-700/60 pb-6 text-xs sm:text-sm font-semibold select-none">
              <div className={`flex items-center gap-2 ${step >= 1 ? "text-pink-500" : "text-zinc-500"}`}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 1 ? "bg-pink-600 text-white" : "bg-slate-700 text-zinc-400"}`}>1</span>
                <span>{lang === "ar" ? "نوع المطبخ وشكله" : "Layout & Shape"}</span>
              </div>
              <div className="w-8 h-[2px] bg-slate-700 flex-grow mx-4 hidden sm:block" />
              <div className={`flex items-center gap-2 ${step >= 2 ? "text-pink-500" : "text-zinc-500"}`}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 2 ? "bg-pink-600 text-white" : "bg-slate-700 text-zinc-400"}`}>2</span>
                <span>{lang === "ar" ? "المقاسات والرخام" : "Size & Counters"}</span>
              </div>
              <div className="w-8 h-[2px] bg-slate-700 flex-grow mx-4 hidden sm:block" />
              <div className={`flex items-center gap-2 ${step >= 3 ? "text-pink-500" : "text-zinc-500"}`}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 3 ? "bg-pink-600 text-white" : "bg-slate-700 text-zinc-400"}`}>3</span>
                <span>{lang === "ar" ? "تأكيد الطلب والتسليم" : "Contact & Submit"}</span>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              
              {/* STEP 1: Kitchen Style & Layout */}
              {step === 1 && (
                <div className="space-y-6 animate-fade-in">
                  
                  {/* Style Select */}
                  <div className="flex flex-col gap-2">
                    <label className="text-zinc-300 text-sm font-semibold">
                      {lang === "ar" ? "اختر خامة المطبخ المفضلة:" : "Select Cabinet Material:"}
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { id: "poly_lac", labelAr: "بولي لاك (Poly-lac) - مقاوم للحرارة", labelEn: "Poly-lac - Heat & Moisture Proof" },
                        { id: "acrylic", labelAr: "أكريليك فاخر (Acrylic) - لمعان فخم", labelEn: "High-Gloss Acrylic" },
                        { id: "uv_lacquer", labelAr: "يو في لاك (UV Lacquer) - حداثة وألوان", labelEn: "UV Lacquer Glossy" },
                        { id: "natural_wood", labelAr: "خشب طبيعي أرو (Oak Wood) - كلاسيك عريق", labelEn: "Natural Oak Wood - Classical" },
                        { id: "dressing", labelAr: "دريسنج روم وغرف ملابس", labelEn: "Walk-in Dressing Closet" },
                      ].map((item) => (
                        <label
                          key={item.id}
                          className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer select-none transition-all ${
                            formData.type === item.id
                              ? "bg-pink-600/10 border-pink-500 text-white"
                              : "bg-slate-900 border-slate-700 hover:border-zinc-500 text-zinc-300"
                          }`}
                        >
                          <span className="text-sm font-semibold">{lang === "ar" ? item.labelAr : item.labelEn}</span>
                          <input
                            type="radio"
                            name="type"
                            value={item.id}
                            checked={formData.type === item.id}
                            onChange={handleTextChange}
                            className="text-pink-600 focus:ring-pink-500 h-4 w-4 border-slate-700 bg-slate-900"
                          />
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Shape Select */}
                  <div className="flex flex-col gap-2 pt-4">
                    <label className="text-zinc-300 text-sm font-semibold">
                      {lang === "ar" ? "اختر شكل مخطط المطبخ:" : "Select Layout Shape:"}
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {[
                        { id: "straight", labelAr: "خطي مستقيم", labelEn: "Straight Line" },
                        { id: "parallel", labelAr: "ممر مزدوج", labelEn: "Parallel / Galley" },
                        { id: "l_shape", labelAr: "شكل L زاوي", labelEn: "L-Shape" },
                        { id: "u_shape", labelAr: "شكل U متكامل", labelEn: "U-Shape" },
                        { id: "island", labelAr: "مع جزيرة وسطية", labelEn: "With Island" },
                      ].map((item) => (
                        <div
                          key={item.id}
                          onClick={() => setFormData((prev) => ({ ...prev, shape: item.id }))}
                          className={`p-3.5 rounded-xl border text-center cursor-pointer select-none transition-all ${
                            formData.shape === item.id
                              ? "bg-pink-600 border-pink-500 text-white font-bold"
                              : "bg-slate-900 border-slate-700 hover:border-zinc-500 text-zinc-300"
                          }`}
                        >
                          <span className="text-xs sm:text-sm">{lang === "ar" ? item.labelAr : item.labelEn}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

              {/* STEP 2: Sizes, Stone & Optional accessories */}
              {step === 2 && (
                <div className="space-y-6 animate-fade-in">
                  
                  {/* Dimensions Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

                  {/* Countertop Select */}
                  <div className="flex flex-col gap-2 pt-2">
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
                          className={`p-3 rounded-xl border text-center cursor-pointer select-none transition-all ${
                            formData.countertop === item.id
                              ? "bg-pink-600 border-pink-500 text-white font-bold"
                              : "bg-slate-900 border-slate-700 hover:border-zinc-500 text-zinc-300"
                          }`}
                        >
                          <span className="text-xs">{lang === "ar" ? item.labelAr : item.labelEn}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Accessories Checklist */}
                  <div className="flex flex-col gap-2 pt-2">
                    <label className="text-zinc-300 text-sm font-semibold">
                      {lang === "ar" ? "إضافات وأنظمة تنظيم ذكية:" : "Cabinet Systems & Upgrades:"}
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                      {[
                        { id: "hydraulic", labelAr: "مفصلات وأدراج هيدروليك Soft-Close", labelEn: "Soft-Close Hydraulic Hinge Upgrade" },
                        { id: "cargo", labelAr: "وحدة كارجو رأسية لتخزين البقوليات", labelEn: "Pantry Cargo Pullout Column" },
                        { id: "led", labelAr: "إضاءة ليد بروفايل مدمجة تحت الخزانات", labelEn: "Integrated Profile LED Lighting" },
                        { id: "builtin", labelAr: "تنسيق تجهيزات الأجهزة البلت-إن", labelEn: "Built-in Appliances coordination" },
                      ].map((item) => (
                        <label
                          key={item.id}
                          className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
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
                  
                  {/* Name and Phone */}
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

                  {/* Location Area */}
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

                  {/* Custom Notes */}
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
