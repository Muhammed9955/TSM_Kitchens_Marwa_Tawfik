"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { Calculator, ChevronRight, ChevronLeft, Send, CheckCircle2, RotateCcw, Layers, LayoutDashboard, Settings, User } from "lucide-react";
import { useLanguage } from "@/locales/LanguageContext";
import { trackGAEvent, trackPixelEvent } from "@/utils/analytics";

// ─── Types ───────────────────────────────────────────────────────────────────
interface QuoteFormData {
  type: string;
  color: string;
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
  color: "white",
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

// ─── Material Options (Updated High-Quality Unsplash Kitchen Detail Shots) ───
interface MaterialOption {
  id: string;
  titleAr: string;
  titleEn: string;
  tagAr: string;
  tagEn: string;
  tier: "budget" | "popular" | "premium" | "ultra";
  tierColorClass: string;
  img: string;
  features: string[];
  featuresAr: string[];
}

const materialOptions: MaterialOption[] = [
  {
    id: "poly_lac",
    titleAr: "بولي لاك",
    titleEn: "Poly-lac",
    tagAr: "مقاوم للحرارة والرطوبة",
    tagEn: "High-Resistance Heat Proof",
    tier: "popular",
    tierColorClass: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=500&q=80",
    features: ["Heat resistant", "Scratch proof", "Easy to clean"],
    featuresAr: ["مقاوم للحرارة", "مقاوم للخدش", "سهل التنظيف"],
  },
  {
    id: "acrylic",
    titleAr: "أكريليك",
    titleEn: "High-Gloss Acrylic",
    tagAr: "لمعان زجاجي فخم",
    tagEn: "Reflective Mirror Gloss",
    tier: "popular",
    tierColorClass: "bg-pink-500/20 text-pink-300 border-pink-500/30",
    img: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=500&q=80",
    features: ["Mirror-like gloss", "Expands space visually", "Modern look"],
    featuresAr: ["لمعان مرآوي", "يوسع المساحة بصرياً", "مظهر عصري"],
  },
  {
    id: "uv_lacquer",
    titleAr: "يو في لاك",
    titleEn: "UV Lacquer",
    tagAr: "ألوان مطفية ومقاومة للبقع",
    tagEn: "Anti-Fingerprint Matte/Gloss",
    tier: "premium",
    tierColorClass: "bg-violet-500/20 text-violet-300 border-violet-500/30",
    img: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=500&q=80",
    features: ["UV grease shield", "Matte or gloss", "Rich color range"],
    featuresAr: ["حماية ضد البقع", "مطفي أو لامع", "ألوان ثرية"],
  },
  {
    id: "natural_wood",
    titleAr: "خشب أرو طبيعي",
    titleEn: "Natural Oak Wood",
    tagAr: "فخامة الخشب الكلاسيكي",
    tagEn: "Classic Solid Hardwood",
    tier: "ultra",
    tierColorClass: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    img: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=500&q=80",
    features: ["Solid natural oak", "Lifetime durability", "Classic elegance"],
    featuresAr: ["خشب أرو طبيعي", "متانة مدى الحياة", "أناقة كلاسيكية"],
  },
  {
    id: "dressing",
    titleAr: "دريسنج روم",
    titleEn: "Dressing Closet",
    tagAr: "تقسيمات ذكية وإضاءة ليد",
    tagEn: "Bespoke Wardrobe Organizers",
    tier: "premium",
    tierColorClass: "bg-rose-500/20 text-rose-300 border-rose-500/30",
    img: "https://images.unsplash.com/photo-1558882224-cca166733360?auto=format&fit=crop&w=500&q=80",
    features: ["LED lighting", "Pull-out trays", "Custom compartments"],
    featuresAr: ["إضاءة ليد مدمجة", "أدراج سحب هيدروليك", "تقسيمات حسب الطلب"],
  },
];

// ─── Color Options (Cabinet color swatches) ──────────────────────────────────
interface ColorOption {
  id: string;
  nameAr: string;
  nameEn: string;
  hex: string;
}

const colorOptions: ColorOption[] = [
  { id: "white", nameAr: "أبيض ناصع", nameEn: "Glossy White", hex: "#FFFFFF" },
  { id: "cashmere", nameAr: "كشمير فخم", nameEn: "Luxurious Cashmere", hex: "#E3D3C4" },
  { id: "grey", nameAr: "رمادي جرافيت", nameEn: "Graphite Grey", hex: "#4A4A4A" },
  { id: "green", nameAr: "أخضر زيتوني", nameEn: "Sage Green", hex: "#708272" },
  { id: "navy", nameAr: "كحلي ملكي", nameEn: "Royal Navy", hex: "#1D2A44" },
  { id: "wood", nameAr: "خشبي طبيعي", nameEn: "Wood Grain", hex: "#A87C53" },
];

// ─── SVG Floor Plan Shapes ───────────────────────────────────────────────────
const ShapeSVGs: Record<string, React.FC<{ selected: boolean }>> = {
  straight: ({ selected }) => (
    <svg viewBox="0 0 80 60" className="w-full h-full" fill="none">
      <rect x="4" y="22" width="72" height="16" rx="3" fill={selected ? "#ec4899" : "#475569"} />
      <rect x="4" y="22" width="72" height="5" rx="2" fill={selected ? "#f472b6" : "#64748b"} />
    </svg>
  ),
  parallel: ({ selected }) => (
    <svg viewBox="0 0 80 60" className="w-full h-full" fill="none">
      <rect x="4" y="8" width="72" height="14" rx="3" fill={selected ? "#ec4899" : "#475569"} />
      <rect x="4" y="8" width="72" height="4" rx="2" fill={selected ? "#f472b6" : "#64748b"} />
      <rect x="4" y="38" width="72" height="14" rx="3" fill={selected ? "#ec4899" : "#475569"} />
      <rect x="4" y="38" width="72" height="5" rx="2" fill={selected ? "#f472b6" : "#64748b"} />
    </svg>
  ),
  l_shape: ({ selected }) => (
    <svg viewBox="0 0 80 60" className="w-full h-full" fill="none">
      <rect x="4" y="4" width="14" height="52" rx="3" fill={selected ? "#ec4899" : "#475569"} />
      <rect x="4" y="42" width="72" height="14" rx="3" fill={selected ? "#ec4899" : "#475569"} />
      <rect x="4" y="4" width="5" height="52" rx="2" fill={selected ? "#f472b6" : "#64748b"} />
      <rect x="4" y="42" width="72" height="5" rx="2" fill={selected ? "#f472b6" : "#64748b"} />
    </svg>
  ),
  u_shape: ({ selected }) => (
    <svg viewBox="0 0 80 60" className="w-full h-full" fill="none">
      <rect x="4" y="4" width="14" height="52" rx="3" fill={selected ? "#ec4899" : "#475569"} />
      <rect x="62" y="4" width="14" height="52" rx="3" fill={selected ? "#ec4899" : "#475569"} />
      <rect x="4" y="42" width="72" height="14" rx="3" fill={selected ? "#ec4899" : "#475569"} />
      <rect x="4" y="4" width="5" height="52" rx="2" fill={selected ? "#f472b6" : "#64748b"} />
      <rect x="62" y="4" width="5" height="52" rx="2" fill={selected ? "#f472b6" : "#64748b"} />
      <rect x="4" y="42" width="72" height="5" rx="2" fill={selected ? "#f472b6" : "#64748b"} />
    </svg>
  ),
  island: ({ selected }) => (
    <svg viewBox="0 0 80 60" className="w-full h-full" fill="none">
      <rect x="4" y="4" width="72" height="14" rx="3" fill={selected ? "#ec4899" : "#475569"} />
      <rect x="4" y="4" width="72" height="5" rx="2" fill={selected ? "#f472b6" : "#64748b"} />
      <rect x="20" y="36" width="40" height="18" rx="3" fill={selected ? "#ec4899" : "#475569"} opacity="0.7" />
      <rect x="20" y="36" width="40" height="5" rx="2" fill={selected ? "#f472b6" : "#64748b"} opacity="0.7" />
    </svg>
  ),
};

interface ShapeOption { id: string; titleAr: string; titleEn: string; descAr: string; descEn: string; }
const shapeOptions: ShapeOption[] = [
  { id: "straight", titleAr: "خطي مستقيم", titleEn: "Straight", descAr: "جدار واحد — للمساحات الضيقة", descEn: "One wall — for narrow spaces" },
  { id: "parallel", titleAr: "ممر موازي", titleEn: "Galley", descAr: "جداران متقابلان — حركة سريعة", descEn: "Two facing walls — fast workflow" },
  { id: "l_shape", titleAr: "شكل L", titleEn: "L-Shape", descAr: "الأكثر شعبية — مرونة التوزيع", descEn: "Most popular — flexible layout" },
  { id: "u_shape", titleAr: "شكل U", titleEn: "U-Shape", descAr: "3 جدران — أقصى مساحة تخزين", descEn: "3 walls — maximum storage" },
  { id: "island", titleAr: "جزيرة وسطية", titleEn: "With Island", descAr: "جزيرة مستقلة — للمطابخ الكبيرة", descEn: "Center island — for open spaces" },
];

// ─── Tier badge label ────────────────────────────────────────────────────────
function getTierLabel(tier: string, lang: string): string {
  if (tier === "budget") return lang === "ar" ? "اقتصادي" : "Budget";
  if (tier === "popular") return lang === "ar" ? "⭐ الأكثر طلباً" : "⭐ Popular";
  if (tier === "premium") return lang === "ar" ? "💎 بريميوم" : "💎 Premium";
  return lang === "ar" ? "✨ الفاخر الأعلى" : "✨ Ultra Luxury";
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function QuotationForm() {
  const { lang } = useLanguage();
  const [step, setStep] = useState(1); // 1=Material, 2=Shape, 3=Dimensions&Options, 4=Contact
  const [formData, setFormData] = useState<QuoteFormData>(initialFormData);
  const [status, setStatus] = useState<"idle" | "success">("idle");
  const [priceResult, setPriceResult] = useState<{ min: number; max: number; meters: number } | null>(null);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (accessory: string) => {
    setFormData((prev) => {
      const has = prev.accessories.includes(accessory);
      return { ...prev, accessories: has ? prev.accessories.filter((a) => a !== accessory) : [...prev.accessories, accessory] };
    });
  };

  // Live price estimate (recalculates on every render)
  const liveEstimate = useMemo(() => {
    const w = parseFloat(formData.width) || 0;
    const d = parseFloat(formData.depth) || 0;
    let rm = 0;
    if (formData.shape === "straight") rm = w;
    else if (formData.shape === "parallel") rm = w * 2;
    else if (formData.shape === "l_shape") rm = w + d - 0.6;
    else if (formData.shape === "u_shape") rm = w + (d * 2) - 1.2;
    else rm = w + 1.2;
    if (rm < 1) rm = 1;

    let ppm = 8000;
    if (formData.type === "poly_lac") ppm = 9500;
    else if (formData.type === "uv_lacquer") ppm = 9000;
    else if (formData.type === "natural_wood") ppm = 12500;
    else if (formData.type === "dressing") ppm = 7500;
    if (formData.height === "ceiling") ppm *= 1.15;

    let ct = 0;
    if (formData.countertop === "quartz") ct = 5500;
    else if (formData.countertop === "granite") ct = 3500;
    else if (formData.countertop === "marble") ct = 4000;

    let extras = 0;
    if (formData.handles === "gola") extras += rm * 350;
    if (formData.handles === "push_open") extras += rm * 250;
    if (formData.hardwareClass === "blum") extras += 5000;
    else if (formData.hardwareClass === "smart_soft") extras += 2000;
    if (formData.accessories.includes("cargo")) extras += 4500;
    if (formData.accessories.includes("led")) extras += 2000;
    if (formData.accessories.includes("builtin")) extras += 1500;

    const total = rm * ppm + rm * ct + extras;
    return {
      min: Math.round((total * 0.9) / 500) * 500,
      max: Math.round((total * 1.1) / 500) * 500,
      meters: Math.round(rm * 10) / 10,
    };
  }, [formData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPriceResult(liveEstimate);

    const typeLabel = materialOptions.find((m) => m.id === formData.type)?.[lang === "ar" ? "titleAr" : "titleEn"] ?? formData.type;
    const colorLabel = colorOptions.find((c) => c.id === formData.color)?.[lang === "ar" ? "nameAr" : "nameEn"] ?? formData.color;
    const shapeLabel = shapeOptions.find((s) => s.id === formData.shape)?.[lang === "ar" ? "titleAr" : "titleEn"] ?? formData.shape;

    const countertopLabel = formData.countertop === "quartz" ? (lang === "ar" ? "كوارتز" : "Quartz")
      : formData.countertop === "granite" ? (lang === "ar" ? "جرانيت" : "Granite")
      : formData.countertop === "marble" ? (lang === "ar" ? "رخام" : "Marble")
      : (lang === "ar" ? "بدون رخام" : "None");

    const heightLabel = formData.height === "ceiling"
      ? (lang === "ar" ? "واصل للسقف 260سم+" : "Ceiling-High 260cm+")
      : (lang === "ar" ? "قياسي 220سم" : "Standard 220cm");

    const handlesLabel = formData.handles === "gola" ? (lang === "ar" ? "مجرى جولا مخفي" : "Hidden Gola Profile")
      : formData.handles === "push_open" ? (lang === "ar" ? "فتح بالضغط (Tip-on)" : "Push-to-Open (Tip-on)")
      : (lang === "ar" ? "مقابض بارزة" : "Standard Handles");

    const hardwareLabel = formData.hardwareClass === "blum" ? "Blum Austrian"
      : formData.hardwareClass === "smart_soft" ? (lang === "ar" ? "هيدروليك صامت" : "Smart Soft-close")
      : (lang === "ar" ? "أساسي" : "Basic");

    const accLabels = formData.accessories.map((a) =>
      a === "cargo" ? (lang === "ar" ? "كارجو" : "Cargo") :
      a === "led" ? "LED" : (lang === "ar" ? "بلت-إن" : "Built-in")
    ).join(", ");

    const msg = lang === "ar"
      ? `مرحباً TSM Kitchens،\n\nطلب تسعيرة مطبخ:\n\n📐 *المواصفات:*\n- الخامة: ${typeLabel}\n- اللون المختار: ${colorLabel}\n- الشكل: ${shapeLabel}\n- الأبعاد: ${formData.width}م × ${formData.depth}م\n- الارتفاع: ${heightLabel}\n- المقابض: ${handlesLabel}\n- الإكسسوارات: ${hardwareLabel}\n- الرخام: ${countertopLabel}\n- الإضافات: ${accLabels || "لا توجد"}\n\n👤 *بيانات العميل:*\n- الاسم: ${formData.name}\n- الهاتف: ${formData.phone}\n- المنطقة: ${formData.location}\n\n🧮 *التقدير التقريبي:*\n- ~ ${liveEstimate.meters} متر طولي\n- بين ${liveEstimate.min.toLocaleString()} و ${liveEstimate.max.toLocaleString()} ج.م\n\n📝 ملاحظات: ${formData.notes || "لا توجد"}`
      : `Hello TSM Kitchens,\n\nKitchen Quote Request:\n\n📐 *Specifications:*\n- Material: ${typeLabel}\n- Selected Color: ${colorLabel}\n- Shape: ${shapeLabel}\n- Dimensions: ${formData.width}m × ${formData.depth}m\n- Height: ${heightLabel}\n- Handles: ${handlesLabel}\n- Hardware: ${hardwareLabel}\n- Countertop: ${countertopLabel}\n- Accessories: ${accLabels || "None"}\n\n👤 *Client Details:*\n- Name: ${formData.name}\n- Phone: ${formData.phone}\n- Location: ${formData.location}\n\n🧮 *Estimate:*\n- ~ ${liveEstimate.meters} running meters\n- EGP ${liveEstimate.min.toLocaleString()} – ${liveEstimate.max.toLocaleString()}\n\n📝 Notes: ${formData.notes || "None"}`;

    window.open(`https://wa.me/201113561777?text=${encodeURIComponent(msg)}`, "_blank");
    trackGAEvent("form_submit", "lead", "quotation_calculator");
    trackPixelEvent("Lead", { content_name: "Quotation Calculator", value: (liveEstimate.min + liveEstimate.max) / 2, currency: "EGP", content_category: formData.type });
    setStatus("success");
  };

  const handleReset = () => { setFormData(initialFormData); setPriceResult(null); setStatus("idle"); setStep(1); };

  const STEPS = [
    { icon: Layers, labelAr: "الخامة واللون", labelEn: "Material & Color" },
    { icon: LayoutDashboard, labelAr: "الشكل", labelEn: "Layout" },
    { icon: Settings, labelAr: "الخيارات", labelEn: "Options" },
    { icon: User, labelAr: "العميل", labelEn: "Contact" },
  ];

  return (
    <section id="quotation" className="py-20 sm:py-28 bg-slate-900 text-white relative overflow-hidden border-t border-slate-800">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-pink-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-fuchsia-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10" dir={lang === "ar" ? "rtl" : "ltr"}>

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-pink-500 font-bold tracking-wider text-xs sm:text-sm uppercase mb-2 block">
            {lang === "ar" ? "حساب التكلفة التقديرية" : "Quote Calculator"}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            {lang === "ar" ? "طلب عرض سعر تفصيلي للمطبخ" : "Get a Customized Kitchen Quote"}
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            {lang === "ar"
              ? "اختر خامة المطبخ ولونه وشكله ومقاساته واحصل على تسعير فوري يُرسَل مباشرة إلى واتساب المعرض."
              : "Pick your material, color, layout, dimensions and finishes to get an instant quote sent to WhatsApp."}
          </p>
          <div className="w-16 h-1 bg-pink-600 mx-auto rounded-full mt-4" />
        </div>

        {/* Success State */}
        {status === "success" && priceResult ? (
          <div className="bg-white text-slate-900 rounded-3xl p-8 sm:p-12 shadow-2xl border border-pink-500/20 max-w-2xl mx-auto">
            <div className="flex flex-col items-center text-center mb-8">
              <CheckCircle2 className="w-16 h-16 text-emerald-500 mb-4" />
              <h3 className="text-2xl font-extrabold text-slate-900 mb-2">
                {lang === "ar" ? "تم إرسال طلبك بنجاح!" : "Quote Sent Successfully!"}
              </h3>
              <p className="text-slate-500 text-sm max-w-sm leading-relaxed">
                {lang === "ar"
                  ? "تم توجيهك إلى واتساب المعرض. سيتواصل معك فريقنا لتأكيد موعد المعاينة."
                  : "You've been redirected to our WhatsApp. Our team will contact you to schedule a site visit."}
              </p>
            </div>
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 mb-6 text-sm space-y-3">
              {[
                [lang === "ar" ? "الخامة:" : "Material:", materialOptions.find(m => m.id === formData.type)?.[lang === "ar" ? "titleAr" : "titleEn"]],
                [lang === "ar" ? "اللون:" : "Color:", colorOptions.find(c => c.id === formData.color)?.[lang === "ar" ? "nameAr" : "nameEn"]],
                [lang === "ar" ? "الشكل:" : "Layout:", shapeOptions.find(s => s.id === formData.shape)?.[lang === "ar" ? "titleAr" : "titleEn"]],
                [lang === "ar" ? "المحيط التقريبي:" : "Est. Length:", `~ ${priceResult.meters} ${lang === "ar" ? "متر طولي" : "meters"}`],
              ].map(([label, val]) => (
                <div key={String(label)} className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-400 font-medium">{label}</span>
                  <span className="font-bold text-slate-800">{val}</span>
                </div>
              ))}
              <div className="flex justify-between pt-1">
                <span className="text-pink-600 font-bold">{lang === "ar" ? "التقدير:" : "Est. Range:"}</span>
                <span className="font-extrabold text-pink-600 text-lg">
                  {priceResult.min.toLocaleString()} – {priceResult.max.toLocaleString()} {lang === "ar" ? "ج.م" : "EGP"}
                </span>
              </div>
            </div>
            <button onClick={handleReset} className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl cursor-pointer transition-all">
              <RotateCcw size={16} />
              <span>{lang === "ar" ? "حساب تسعيرة جديدة" : "Start New Quote"}</span>
            </button>
          </div>
        ) : (
          <div className="bg-slate-800 border border-slate-700/80 rounded-3xl shadow-2xl p-6 sm:p-10 max-w-3xl mx-auto">

            {/* Step Progress Bar */}
            <div className="flex items-center gap-1 mb-10">
              {STEPS.map((s, i) => {
                const active = step === i + 1;
                const done = step > i + 1;
                const Icon = s.icon;
                return (
                  <React.Fragment key={i}>
                    <button
                      type="button"
                      onClick={() => { if (done) setStep(i + 1); }}
                      className={`flex flex-col items-center gap-1 transition-all flex-shrink-0 ${done ? "cursor-pointer" : "cursor-default"}`}
                    >
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all ${active ? "bg-pink-600 border-pink-500 text-white scale-110" : done ? "bg-pink-600/30 border-pink-500/50 text-pink-400" : "bg-slate-700 border-slate-600 text-zinc-500"}`}>
                        <Icon size={16} />
                      </div>
                      <span className={`text-[10px] font-bold hidden sm:block transition-colors ${active ? "text-pink-400" : done ? "text-pink-500/60" : "text-zinc-600"}`}>
                        {lang === "ar" ? s.labelAr : s.labelEn}
                      </span>
                    </button>
                    {i < STEPS.length - 1 && (
                      <div className={`flex-grow h-0.5 rounded-full transition-colors mx-1 ${step > i + 1 ? "bg-pink-500/50" : "bg-slate-700"}`} />
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            <form onSubmit={handleSubmit}>

              {/* ── STEP 1: Material & Color Selection ── */}
              {step === 1 && (
                <div className="space-y-6 animate-fade-in">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white mb-1">
                      {lang === "ar" ? "اختر خامة المطبخ ولونه" : "Choose Cabinet Material & Color"}
                    </h3>
                    <p className="text-zinc-500 text-xs mb-5">
                      {lang === "ar" ? "اختر نوع الخامة واللون المفضل لخزائن مطبخك" : "Select cabinet material and color swatches for your project."}
                    </p>

                    {/* Material Options Grid */}
                    <div className="grid grid-cols-1 gap-3">
                      {materialOptions.map((item) => {
                        const selected = formData.type === item.id;
                        return (
                          <div
                            key={item.id}
                            onClick={() => setFormData((prev) => ({ ...prev, type: item.id }))}
                            className={`relative rounded-2xl overflow-hidden border cursor-pointer select-none transition-all duration-300 group flex items-stretch ${selected ? "border-pink-500 bg-pink-500/5 shadow-lg shadow-pink-500/10" : "border-slate-700 bg-slate-900/60 hover:border-slate-500"}`}
                          >
                            {/* Image */}
                            <div className="relative w-24 sm:w-32 flex-shrink-0">
                              <Image
                                src={item.img}
                                alt={lang === "ar" ? item.titleAr : item.titleEn}
                                fill
                                sizes="128px"
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                              {/* Selected overlay */}
                              {selected && (
                                <div className="absolute inset-0 bg-pink-600/20 flex items-center justify-center">
                                  <div className="w-7 h-7 rounded-full bg-pink-600 flex items-center justify-center shadow-lg">
                                    <svg viewBox="0 0 12 9" fill="none" className="w-3.5 h-3.5"><path d="M1 4.5L4.5 8L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Content */}
                            <div className="flex-grow p-4 flex flex-col justify-between min-w-0">
                              <div>
                                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                                  <h4 className={`text-sm sm:text-base font-extrabold transition-colors ${selected ? "text-pink-400" : "text-white"}`}>
                                    {lang === "ar" ? item.titleAr : item.titleEn}
                                  </h4>
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${item.tierColorClass}`}>
                                    {getTierLabel(item.tier, lang)}
                                  </span>
                                </div>
                                <p className="text-[11px] text-zinc-500 font-semibold italic mb-2">
                                  {lang === "ar" ? item.tagAr : item.tagEn}
                                </p>
                              </div>
                              {/* Feature tags */}
                              <div className="flex flex-wrap gap-1.5">
                                {(lang === "ar" ? item.featuresAr : item.features).map((f) => (
                                  <span key={f} className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${selected ? "bg-pink-600/20 text-pink-300" : "bg-slate-700 text-zinc-400"}`}>
                                    {f}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Color Swatch Selection */}
                    <div className="mt-8 border-t border-slate-700/50 pt-6">
                      <h4 className="text-zinc-300 text-xs sm:text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                        <span className="w-1.5 h-3.5 bg-pink-500 rounded-full inline-block" />
                        {lang === "ar" ? "اختر لون خزائن المطبخ:" : "Select Cabinet Color Swatch:"}
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                        {colorOptions.map((c) => {
                          const isSelected = formData.color === c.id;
                          return (
                            <button
                              key={c.id}
                              type="button"
                              onClick={() => setFormData((prev) => ({ ...prev, color: c.id }))}
                              className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-[11px] sm:text-xs font-bold transition-all cursor-pointer ${
                                isSelected
                                  ? "border-pink-500 bg-pink-500/10 text-white"
                                  : "border-slate-700 bg-slate-900/60 text-zinc-400 hover:border-slate-650"
                              }`}
                            >
                              <span
                                className="w-4 h-4 rounded-full border border-slate-600 flex-shrink-0 shadow-inner"
                                style={{ backgroundColor: c.hex }}
                              />
                              <span className="truncate">{lang === "ar" ? c.nameAr : c.nameEn}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* ── STEP 2: Layout Shape (SVG Diagrams) ── */}
              {step === 2 && (
                <div className="space-y-5 animate-fade-in">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white mb-1">
                      {lang === "ar" ? "اختر شكل مخطط المطبخ" : "Select Kitchen Layout Shape"}
                    </h3>
                    <p className="text-zinc-500 text-xs mb-6">
                      {lang === "ar" ? "المخطط يحدد توزيع الوحدات ومساحة الحركة في مطبخك" : "The layout determines cabinet placement and flow inside your kitchen."}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {shapeOptions.map((item) => {
                        const selected = formData.shape === item.id;
                        const SvgIcon = ShapeSVGs[item.id];
                        return (
                          <div
                            key={item.id}
                            onClick={() => setFormData((prev) => ({ ...prev, shape: item.id }))}
                            className={`relative rounded-2xl border cursor-pointer select-none transition-all duration-300 group p-4 flex flex-col items-center gap-3 ${selected ? "border-pink-500 bg-pink-500/5 shadow-lg shadow-pink-500/10 scale-[1.02]" : "border-slate-700 bg-slate-900/60 hover:border-slate-500"}`}
                          >
                            {/* SVG Floor Plan */}
                            <div className="w-full h-20 flex items-center justify-center px-4">
                              <SvgIcon selected={selected} />
                            </div>

                            {/* Labels */}
                            <div className="text-center w-full">
                              <h4 className={`text-sm font-extrabold mb-1 transition-colors ${selected ? "text-pink-400" : "text-white"}`}>
                                {lang === "ar" ? item.titleAr : item.titleEn}
                              </h4>
                              <p className="text-[11px] text-zinc-500 leading-tight">
                                {lang === "ar" ? item.descAr : item.descEn}
                              </p>
                            </div>

                            {/* Selected indicator */}
                            {selected && (
                              <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-pink-600 flex items-center justify-center shadow">
                                <svg viewBox="0 0 12 9" fill="none" className="w-2.5 h-2.5"><path d="M1 4.5L4.5 8L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* ── STEP 3: Dimensions + Options + Live Price Preview ── */}
              {step === 3 && (
                <div className="space-y-6 animate-fade-in">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white mb-1">
                      {lang === "ar" ? "المقاسات والخيارات الفنية" : "Dimensions & Technical Options"}
                    </h3>
                    <p className="text-zinc-500 text-xs mb-5">
                      {lang === "ar" ? "أدخل مقاسات الغرفة واختر تفاصيل التشطيبات الداخلية" : "Enter room dimensions and configure interior finishes."}
                    </p>
                  </div>

                  {/* Dimensions */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="width" className="text-zinc-300 text-xs font-semibold">
                        {lang === "ar" ? "عرض الجدار الرئيسي (م):" : "Main Wall Width (m):"}
                      </label>
                      <input type="number" id="width" name="width" step="0.1" min="1" max="20" required value={formData.width} onChange={handleTextChange}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-pink-500 transition-all" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="depth" className="text-zinc-300 text-xs font-semibold">
                        {lang === "ar" ? "عرض الجدار الجانبي (م):" : "Side Wall Depth (m):"}
                      </label>
                      <input type="number" id="depth" name="depth" step="0.1" min="0" max="20" required
                        disabled={formData.shape === "straight"} value={formData.shape === "straight" ? "0" : formData.depth} onChange={handleTextChange}
                        className="w-full bg-slate-900 border border-slate-700 disabled:opacity-40 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-pink-500 transition-all" />
                    </div>
                  </div>

                  {/* Config row */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                      { id: "height", label: lang === "ar" ? "ارتفاع الخزائن:" : "Cabinet Height:", options: [{ v: "standard", l: lang === "ar" ? "قياسي (220سم)" : "Standard 220cm" }, { v: "ceiling", l: lang === "ar" ? "واصل للسقف (260سم+)" : "Ceiling-High 260cm+" }] },
                      { id: "handles", label: lang === "ar" ? "نوع المقابض:" : "Handle Type:", options: [{ v: "gola", l: lang === "ar" ? "مجرى جولا مخفي" : "Hidden Gola" }, { v: "classic", l: lang === "ar" ? "مقابض بارزة" : "Classic Handles" }, { v: "push_open", l: lang === "ar" ? "فتح بالضغط (Tip-on)" : "Push-to-Open" }] },
                      { id: "hardwareClass", label: lang === "ar" ? "فئة الأنظمة:" : "Hardware Grade:", options: [{ v: "smart_soft", l: lang === "ar" ? "هيدروليك صامت" : "Smart Soft-close" }, { v: "blum", l: lang === "ar" ? "بلوم نمساوي (Blum)" : "Premium Blum" }, { v: "basic", l: lang === "ar" ? "أساسي" : "Basic" }] },
                    ].map((field) => (
                      <div key={field.id} className="flex flex-col gap-1.5">
                        <label htmlFor={field.id} className="text-zinc-300 text-xs font-semibold">{field.label}</label>
                        <select id={field.id} name={field.id} value={(formData as unknown as Record<string, string>)[field.id]} onChange={handleTextChange}
                          className="w-full bg-slate-900 border border-slate-700 focus:border-pink-500 rounded-xl px-3 py-3 text-white text-xs sm:text-sm focus:outline-none transition-all cursor-pointer">
                          {field.options.map((o) => <option key={o.v} value={o.v}>{o.l}</option>)}
                        </select>
                      </div>
                    ))}
                  </div>

                  {/* Countertop */}
                  <div className="flex flex-col gap-2">
                    <label className="text-zinc-300 text-sm font-semibold">{lang === "ar" ? "رخام السطح العلوي (القرصة):" : "Countertop Surface:"}</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[{ id: "quartz", ar: "كوارتز صناعي", en: "Quartz" }, { id: "granite", ar: "جرانيت", en: "Granite" }, { id: "marble", ar: "رخام طبيعي", en: "Marble" }, { id: "none", ar: "بدون رخام", en: "No Countertop" }].map((ct) => (
                        <div key={ct.id} onClick={() => setFormData((p) => ({ ...p, countertop: ct.id }))}
                          className={`p-3 rounded-xl border text-center cursor-pointer text-xs font-semibold transition-all ${formData.countertop === ct.id ? "bg-pink-600 border-pink-500 text-white" : "bg-slate-900 border-slate-700 hover:border-slate-500 text-zinc-300"}`}>
                          {lang === "ar" ? ct.ar : ct.en}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Accessories */}
                  <div className="flex flex-col gap-2">
                    <label className="text-zinc-300 text-sm font-semibold">{lang === "ar" ? "إضافات وترقيات:" : "Upgrades & Accessories:"}</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[{ id: "cargo", ar: "وحدة كارجو رأسية", en: "Pantry Cargo Column" }, { id: "led", ar: "إضاءة ليد بروفايل", en: "Cabinet LED Profiles" }, { id: "builtin", ar: "تجهيز أجهزة بلت-إن", en: "Built-in Appliances Prep" }].map((acc) => (
                        <label key={acc.id} className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer text-xs transition-all ${formData.accessories.includes(acc.id) ? "bg-pink-600/10 border-pink-500 text-white" : "bg-slate-900 border-slate-700 hover:border-slate-600 text-zinc-400"}`}>
                          <input type="checkbox" checked={formData.accessories.includes(acc.id)} onChange={() => handleCheckboxChange(acc.id)}
                            className="rounded text-pink-600 focus:ring-pink-500 bg-slate-900 border-slate-700 flex-shrink-0" />
                          <span className="font-semibold">{lang === "ar" ? acc.ar : acc.en}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Live Price Preview Bar */}
                  <div className="bg-gradient-to-r from-pink-950/60 to-fuchsia-950/60 border border-pink-500/30 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="text-center sm:text-start">
                      <p className="text-zinc-400 text-xs font-semibold mb-0.5">
                        {lang === "ar" ? "التقدير الأولي المباشر (يتحدث تلقائياً):" : "Live Running Estimate (updates as you configure):"}
                      </p>
                      <p className="text-zinc-300 text-xs">~ {liveEstimate.meters} {lang === "ar" ? "متر طولي" : "running meters"}</p>
                    </div>
                    <div className="text-center">
                      <span className="text-2xl sm:text-3xl font-extrabold text-pink-400 tracking-tight">
                        {liveEstimate.min.toLocaleString()}
                      </span>
                      <span className="text-zinc-400 text-sm mx-1">–</span>
                      <span className="text-2xl sm:text-3xl font-extrabold text-pink-400 tracking-tight">
                        {liveEstimate.max.toLocaleString()}
                      </span>
                      <span className="text-zinc-400 text-xs ml-1">{lang === "ar" ? "ج.م" : "EGP"}</span>
                    </div>
                  </div>

                </div>
              )}

              {/* ── STEP 4: Contact & Submit ── */}
              {step === 4 && (
                <div className="space-y-5 animate-fade-in">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white mb-1">
                      {lang === "ar" ? "بيانات التواصل والإرسال" : "Contact Details & Submit"}
                    </h3>
                    <p className="text-zinc-500 text-xs mb-5">
                      {lang === "ar" ? "ستُرسَل التفاصيل كاملةً مع التسعيرة التقديرية إلى واتساب المعرض مباشرةً." : "Your full specs and estimate will be sent directly to our WhatsApp."}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[{ id: "name", type: "text", ar: "الاسم الكامل:", en: "Full Name:" }, { id: "phone", type: "tel", ar: "رقم الهاتف / واتساب:", en: "Phone / WhatsApp:" }].map((f) => (
                      <div key={f.id} className="flex flex-col gap-1.5">
                        <label htmlFor={f.id} className="text-zinc-300 text-xs font-semibold">{lang === "ar" ? f.ar : f.en}</label>
                        <input type={f.type} id={f.id} name={f.id} required value={(formData as unknown as Record<string, string>)[f.id]} onChange={handleTextChange}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-pink-500 transition-all" />
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="location" className="text-zinc-300 text-xs font-semibold">
                      {lang === "ar" ? "المنطقة / العنوان (مثال: سموحة، الإسكندرية):" : "Area / Location (e.g. Smouha, Alexandria):"}
                    </label>
                    <input type="text" id="location" name="location" required value={formData.location} onChange={handleTextChange}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-pink-500 transition-all" />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="notes" className="text-zinc-300 text-xs font-semibold">
                      {lang === "ar" ? "ملاحظات إضافية (اختياري):" : "Additional Notes (optional):"}
                    </label>
                    <textarea id="notes" name="notes" rows={3} value={formData.notes} onChange={handleTextChange}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-pink-500 transition-all resize-none" />
                  </div>

                  {/* Final summary mini card */}
                  <div className="bg-slate-900/80 border border-slate-700 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
                    <div className="flex flex-col gap-1 text-zinc-400 text-xs">
                      <span>📦 {materialOptions.find(m => m.id === formData.type)?.[lang === "ar" ? "titleAr" : "titleEn"]}</span>
                      <span>🎨 {colorOptions.find(c => c.id === formData.color)?.[lang === "ar" ? "nameAr" : "nameEn"]}</span>
                      <span>📐 {shapeOptions.find(s => s.id === formData.shape)?.[lang === "ar" ? "titleAr" : "titleEn"]} · {formData.width}m × {formData.depth}m</span>
                    </div>
                    <div className="text-center">
                      <p className="text-zinc-500 text-[10px]">{lang === "ar" ? "التقدير التقريبي" : "Price Range"}</p>
                      <p className="text-pink-400 font-extrabold text-base">
                        {liveEstimate.min.toLocaleString()} – {liveEstimate.max.toLocaleString()} {lang === "ar" ? "ج.م" : "EGP"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Controls */}
              <div className="flex items-center justify-between border-t border-slate-700/60 pt-6 mt-8">
                {step > 1 ? (
                  <button type="button" onClick={() => setStep((p) => p - 1)}
                    className="flex items-center gap-1.5 bg-slate-700 hover:bg-slate-650 text-white font-bold py-3 px-6 rounded-xl cursor-pointer transition-all">
                    <ChevronLeft size={16} className={lang === "ar" ? "rotate-180" : ""} />
                    <span>{lang === "ar" ? "السابق" : "Back"}</span>
                  </button>
                ) : <div />}

                {step < 4 ? (
                  <button type="button" onClick={() => setStep((p) => p + 1)}
                    className="flex items-center gap-1.5 bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-6 rounded-xl cursor-pointer transition-all shadow-md shadow-pink-600/20">
                    <span>{lang === "ar" ? "التالي" : "Next"}</span>
                    <ChevronRight size={16} className={lang === "ar" ? "rotate-180" : ""} />
                  </button>
                ) : (
                  <button type="submit"
                    className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold py-3.5 px-8 rounded-xl cursor-pointer transition-all shadow-lg shadow-emerald-500/20">
                    <Calculator size={18} />
                    <span>{lang === "ar" ? "احسب وأرسل الطلب على واتساب" : "Get Quote on WhatsApp"}</span>
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
