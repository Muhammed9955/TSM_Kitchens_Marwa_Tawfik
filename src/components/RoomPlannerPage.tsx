"use client";

import React, { useState, useCallback } from "react";
import Link from "next/link";
import { useLanguage } from "@/locales/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingSocials from "@/components/FloatingSocials";
import {
  Layers,
  ArrowRight,
  RotateCcw,
  Share2,
  Calendar,
  MessageSquare,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Info,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────
type RoomShape = "rectangle" | "lShape" | "uShape" | "galley" | "island" | "gShape";

type LayoutSuggestion = {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  efficiencyPct: number;
  counterLengthFn: (w: number, d: number) => number;
  cabinetsFn: (w: number, d: number) => number;
  workTriangle: "good" | "fair" | "poor";
  cabinetStyle: "modern" | "classic" | "dressing";
  tags: string[];
  tagsAr: string[];
  pros: string[];
  prosAr: string[];
};

// ── Shape Definitions ─────────────────────────────────────────────────────
const SHAPES: { key: RoomShape; labelEn: string; labelAr: string; svgPath: string }[] = [
  { key: "rectangle", labelEn: "Rectangle",      labelAr: "مستطيل",       svgPath: "M4,4 L60,4 L60,56 L4,56 Z" },
  { key: "lShape",    labelEn: "L-Shape",         labelAr: "شكل L",        svgPath: "M4,4 L60,4 L60,32 L36,32 L36,56 L4,56 Z" },
  { key: "uShape",    labelEn: "U-Shape",         labelAr: "شكل U",        svgPath: "M4,4 L60,4 L60,56 L44,56 L44,24 L20,24 L20,56 L4,56 Z" },
  { key: "galley",    labelEn: "Galley",          labelAr: "ممر مزدوج",    svgPath: "M4,4 L60,4 L60,56 L4,56 Z" },
  { key: "island",    labelEn: "Island",          labelAr: "جزيرة وسطى",  svgPath: "M4,4 L60,4 L60,56 L4,56 Z" },
  { key: "gShape",    labelEn: "G-Shape",         labelAr: "شكل G",        svgPath: "M4,4 L60,4 L60,56 L28,56 L28,40 L44,40 L44,4" },
];

// ── Layout Catalog ────────────────────────────────────────────────────────
const ALL_LAYOUTS: LayoutSuggestion[] = [
  {
    id: "single-wall",
    name: "Single-Wall Kitchen",
    nameAr: "مطبخ أحادي الحائط",
    description: "All appliances and cabinets along one wall. Perfect for narrow spaces and studio layouts.",
    descriptionAr: "كل الأجهزة والخزائن على حائط واحد. مثالي للمساحات الضيقة والشقق الاستوديو.",
    efficiencyPct: 72,
    counterLengthFn: (w) => +(w * 0.85).toFixed(1),
    cabinetsFn: (w) => Math.floor(w / 0.6) + 2,
    workTriangle: "fair",
    cabinetStyle: "modern",
    tags: ["Compact", "Modern", "Efficient"],
    tagsAr: ["مضغوط", "مودرن", "فعّال"],
    pros: ["Easy to clean", "Maximum open floor space", "Perfect for small dimensions"],
    prosAr: ["سهل التنظيف", "أقصى مساحة للأرضية", "مثالي للمساحات الصغيرة"],
  },
  {
    id: "galley",
    name: "Galley Kitchen",
    nameAr: "مطبخ الممر المزدوج",
    description: "Two parallel counter runs facing each other. Highly efficient work triangle for rectangular rooms.",
    descriptionAr: "صفان متوازيان من الكونتر في مواجهة بعضهما. مثلث حركة فعال جداً للغرف المستطيلة.",
    efficiencyPct: 85,
    counterLengthFn: (w, d) => +((w + d) * 0.7).toFixed(1),
    cabinetsFn: (w, d) => Math.floor(w / 0.6) + Math.floor(d / 0.6),
    workTriangle: "good",
    cabinetStyle: "modern",
    tags: ["Chef Layout", "Dual Workspaces", "Symmetric"],
    tagsAr: ["تخطيط الطهاة", "مساحات عمل مزدوجة", "متوازن"],
    pros: ["Very short walking distances", "Huge prep space options", "High storage capabilities"],
    prosAr: ["مسافات حركة قصيرة جداً", "خيارات تحضير واسعة", "طاقة تخزين ممتازة"],
  },
  {
    id: "l-shape",
    name: "L-Shape Kitchen",
    nameAr: "مطبخ شكل L",
    description: "Cabinets along two adjacent walls. The most versatile layout for integrating a dining area.",
    descriptionAr: "خزائن على حائطين متجاورين. التصميم الأكثر تنوعاً لتضمين طاولة طعام.",
    efficiencyPct: 88,
    counterLengthFn: (w, d) => +((w + d) * 0.8).toFixed(1),
    cabinetsFn: (w, d) => Math.floor((w + d) / 0.6),
    workTriangle: "good",
    cabinetStyle: "modern",
    tags: ["Versatile", "Family Friendly", "Open Layout"],
    tagsAr: ["متعدد الاستخدامات", "عائلي ومريح", "تخطيط مفتوح"],
    pros: ["Excellent work triangle paths", "Eliminates kitchen traffic", "Fits dining tables easily"],
    prosAr: ["طرق ممتازة لمثلث الحركة", "يمنع زحمة المطبخ", "يستوعب طاولات الطعام بسهولة"],
  },
  {
    id: "u-shape",
    name: "U-Shape Kitchen",
    nameAr: "مطبخ شكل U",
    description: "Counters along three adjacent walls. Provides maximum storage and dedicated preparation zones.",
    descriptionAr: "كونترات على ثلاثة حوائط متجاورة. يوفر أقصى سعة تخزين ومناطق تحضير مخصصة.",
    efficiencyPct: 94,
    counterLengthFn: (w, d) => +((w * 2 + d) * 0.75).toFixed(1),
    cabinetsFn: (w, d) => Math.floor((w * 2 + d) / 0.6),
    workTriangle: "good",
    cabinetStyle: "classic",
    tags: ["Max Storage", "Luxury Countertop", "Divided Zones"],
    tagsAr: ["أقصى سعة تخزين", "سطح عمل فاخر", "مناطق مقسمة"],
    pros: ["Highest drawer and cabinet count", "Zero cross-through traffic", "Multiple preparation spaces"],
    prosAr: ["أكبر عدد أدراج وخزائن", "حركة مرور معزولة عن العمل", "مساحات تحضير متعددة"],
  },
  {
    id: "island",
    name: "Island Kitchen",
    nameAr: "مطبخ الجزيرة الوسطى",
    description: "L-Shape or U-Shape with a luxury central island block. Ideal for premium open home designs.",
    descriptionAr: "تخطيط L أو U مع جزيرة وسطية فاخرة. تصميم راقٍ جداً للمنازل ذات التخطيط المفتوح.",
    efficiencyPct: 98,
    counterLengthFn: (w, d) => +((w + d + Math.min(w, d) * 0.5) * 0.75).toFixed(1),
    cabinetsFn: (w, d) => Math.floor((w + d + 2) / 0.6),
    workTriangle: "good",
    cabinetStyle: "modern",
    tags: ["Luxury Statement", "Social Center", "Extra Prep"],
    tagsAr: ["لمسة فخامة", "مركز اجتماعي", "تحضير إضافي"],
    pros: ["Provides social bar seating", "Adds stunning visual focal point", "Increases home value significantly"],
    prosAr: ["يوفر مقاعد بار اجتماعية", "يضيف مركزاً جمالياً للمنزل", "يرفع قيمة البيت بشكل كبير"],
  },
  {
    id: "g-shape",
    name: "G-Shape Kitchen",
    nameAr: "مطبخ شكل G",
    description: "U-Shape layout extended with a peninsula desk. Offers breakfast bar and extra lower cabinet arrays.",
    descriptionAr: "تخطيط شكل U ممتد مع كونتر شبه جزيرة. يوفر بار إفطار ومساحة خزائن سفلية إضافية.",
    efficiencyPct: 91,
    counterLengthFn: (w, d) => +((w * 2 + d * 1.5) * 0.7).toFixed(1),
    cabinetsFn: (w, d) => Math.floor((w * 2 + d * 1.5) / 0.6),
    workTriangle: "fair",
    cabinetStyle: "classic",
    tags: ["Peninsula Bar", "Closed Layout", "Cabinet Rich"],
    tagsAr: ["بار شبه جزيرة", "تخطيط مغلق", "غني بالخزائن"],
    pros: ["Peninsula works as breakfast bar", "Clearly defines the kitchen area", "Immensely spacious counters"],
    prosAr: ["شبه الجزيرة تعمل كبار فطور", "يحدد مساحة المطبخ بوضوح", "كونترات تحضير واسعة جداً"],
  },
];

// ── Layout Matching Engine ────────────────────────────────────────────────
function getLayoutsForShape(shape: RoomShape, width: number, depth: number): LayoutSuggestion[] {
  const area = width * depth;
  const isNarrow = Math.min(width, depth) < 2.5;
  const isSmall = area < 10;
  const isMedium = area >= 10 && area < 20;
  const isLarge = area >= 20;

  switch (shape) {
    case "rectangle":
      if (isNarrow) return [ALL_LAYOUTS[1], ALL_LAYOUTS[0]];
      if (isSmall)  return [ALL_LAYOUTS[0], ALL_LAYOUTS[2]];
      if (isMedium) return [ALL_LAYOUTS[2], ALL_LAYOUTS[1], ALL_LAYOUTS[3]];
      return [ALL_LAYOUTS[2], ALL_LAYOUTS[3], ALL_LAYOUTS[4]];
    case "lShape":
      return [ALL_LAYOUTS[2], ALL_LAYOUTS[3], ALL_LAYOUTS[4]].slice(0, isSmall ? 2 : 3);
    case "uShape":
      return [ALL_LAYOUTS[3], ALL_LAYOUTS[5], ALL_LAYOUTS[4]].slice(0, isSmall ? 2 : 3);
    case "galley":
      return [ALL_LAYOUTS[1], ALL_LAYOUTS[0]];
    case "island":
      if (!isLarge) return [ALL_LAYOUTS[2], ALL_LAYOUTS[3]];
      return [ALL_LAYOUTS[4], ALL_LAYOUTS[3], ALL_LAYOUTS[5]];
    case "gShape":
      return [ALL_LAYOUTS[5], ALL_LAYOUTS[3], ALL_LAYOUTS[4]].slice(0, isSmall ? 2 : 3);
    default:
      return ALL_LAYOUTS.slice(0, 3);
  }
}

// ── SVG Layout Diagram ────────────────────────────────────────────────────
function LayoutDiagram({ layoutId, shape }: { layoutId: string; shape: RoomShape }) {
  const S = 96;
  const roomPaths: Record<RoomShape, string> = {
    rectangle: `M2,2 L${S-2},2 L${S-2},${S-2} L2,${S-2} Z`,
    lShape:    `M2,2 L${S-2},2 L${S-2},${S/2} L${S/2},${S/2} L${S/2},${S-2} L2,${S-2} Z`,
    uShape:    `M2,2 L${S-2},2 L${S-2},${S-2} L${S*0.65},${S-2} L${S*0.65},${S*0.45} L${S*0.35},${S*0.45} L${S*0.35},${S-2} L2,${S-2} Z`,
    galley:    `M2,2 L${S-2},2 L${S-2},${S-2} L2,${S-2} Z`,
    island:    `M2,2 L${S-2},2 L${S-2},${S-2} L2,${S-2} Z`,
    gShape:    `M2,2 L${S-2},2 L${S-2},${S-2} L${S*0.45},${S-2} L${S*0.45},${S*0.65} L${S*0.65},${S*0.65} L${S*0.65},${S*0.35} L${S-2},${S*0.35}`,
  };

  const cabinetBlocks: React.ReactNode[] = [];
  const cab = (x: number, y: number, w: number, h: number, key: string) => (
    <rect key={key} x={x} y={y} width={w} height={h} rx="2" fill="#ec4899" opacity="0.8" />
  );

  if (layoutId === "single-wall")  { cabinetBlocks.push(cab(4, 4, S-8, 13, "a")); }
  else if (layoutId === "galley")  { cabinetBlocks.push(cab(4, 4, S-8, 12, "a"), cab(4, S-16, S-8, 12, "b")); }
  else if (layoutId === "l-shape") { cabinetBlocks.push(cab(4, 4, S-8, 13, "a"), cab(S-17, 4, 13, S-8, "b")); }
  else if (layoutId === "u-shape") { cabinetBlocks.push(cab(4, 4, S-8, 13, "a"), cab(S-17, 4, 13, S-8, "b"), cab(4, 4, 13, S-8, "c")); }
  else if (layoutId === "island")  { cabinetBlocks.push(cab(4, 4, S-8, 13, "a"), cab(S-17, 4, 13, S/2, "b"), cab(S*0.27, S*0.42, S*0.46, S*0.28, "isl")); }
  else if (layoutId === "g-shape") { cabinetBlocks.push(cab(4, 4, S-8, 13, "a"), cab(S-17, 4, 13, S-8, "b"), cab(4, 4, 13, S-8, "c"), cab(4, S-17, S*0.44, 13, "d")); }

  const zones = [
    { cx: S*0.25, cy: S*0.5, c: "#38bdf8" },
    { cx: S*0.5,  cy: S*0.5, c: "#f97316" },
    { cx: S*0.75, cy: S*0.5, c: "#10b981" },
  ];

  return (
    <svg viewBox={`0 0 ${S} ${S}`} className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <path d={roomPaths[shape]} fill="#f8fafc" stroke="#dbeafe" strokeWidth="1.5" />
      {Array.from({length:7},(_,i)=><line key={`h${i}`} x1="0" y1={i*16} x2={S} y2={i*16} stroke="#e2e8f0" strokeWidth="0.4"/>)}
      {Array.from({length:7},(_,i)=><line key={`v${i}`} x1={i*16} y1="0" x2={i*16} y2={S} stroke="#e2e8f0" strokeWidth="0.4"/>)}
      {cabinetBlocks}
      <polygon points={zones.map(z=>`${z.cx},${z.cy}`).join(" ")} fill="rgba(236,72,153,0.04)" stroke="rgba(236,72,153,0.2)" strokeWidth="1" strokeDasharray="3,2"/>
      {zones.map((z,i)=>(
        <g key={i}>
          <circle cx={z.cx} cy={z.cy} r="6" fill={z.c} opacity="0.25"/>
          <circle cx={z.cx} cy={z.cy} r="3.5" fill={z.c}/>
        </g>
      ))}
    </svg>
  );
}

// ── Room Shape Preview ────────────────────────────────────────────────────
function ShapePreview({ path, selected }: { path: string; selected: boolean }) {
  return (
    <svg viewBox="0 0 64 60" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <path d={path} fill={selected ? "rgba(236,72,153,0.1)" : "rgba(148,163,184,0.05)"} stroke={selected ? "#db2777" : "rgba(148,163,184,0.3)"} strokeWidth={selected ? "2" : "1.5"}/>
    </svg>
  );
}

// ── Efficiency Gauge ──────────────────────────────────────────────────────
function EfficiencyBadge({ pct }: { pct: number }) {
  const color = pct >= 90 ? "#10b981" : pct >= 80 ? "#fbbf24" : "#64748b";
  const r = 22; const circ = 2 * Math.PI * r;
  return (
    <div className="relative w-14 h-14 shrink-0">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 56 56">
        <circle cx="28" cy="28" r={r} fill="none" stroke="#f1f5f9" strokeWidth="4"/>
        <circle cx="28" cy="28" r={r} fill="none" stroke={color} strokeWidth="4" strokeDasharray={`${(pct/100)*circ} ${circ-(pct/100)*circ}`} strokeLinecap="round"/>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[10px] font-bold" style={{color}}>{pct}%</span>
      </div>
    </div>
  );
}

// ── Main Page Component ───────────────────────────────────────────────────
export default function RoomPlannerPage() {
  const { lang, dict, dir } = useLanguage();
  const rp = dict.roomPlanner;
  const isRTL = lang === "ar";

  const [selectedShape, setSelectedShape] = useState<RoomShape | null>(null);
  const [width, setWidth] = useState<string>("4.0");
  const [depth, setDepth] = useState<string>("3.5");
  const [suggestions, setSuggestions] = useState<LayoutSuggestion[]>([]);
  const [selectedLayout, setSelectedLayout] = useState<LayoutSuggestion | null>(null);
  const [shareToast, setShareToast] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const handleGenerate = useCallback(() => {
    if (!selectedShape) return;
    const w = Math.max(1.5, Math.min(12, parseFloat(width) || 4));
    const d = Math.max(1.5, Math.min(12, parseFloat(depth) || 3.5));
    const results = getLayoutsForShape(selectedShape, w, d);
    setSuggestions(results);
    setSelectedLayout(results[0]);
    setStep(3);
  }, [selectedShape, width, depth]);

  const handleReset = () => {
    setSelectedShape(null);
    setSuggestions([]);
    setSelectedLayout(null);
    setWidth("4.0");
    setDepth("3.5");
    setStep(1);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setShareToast(true);
      setTimeout(() => setShareToast(false), 3000);
    });
  };

  const handleWhatsAppQuote = () => {
    if (!selectedLayout) return;
    const shapeLabel = SHAPES.find((s) => s.key === selectedShape)?.labelEn || "";
    const shapeLabelAr = SHAPES.find((s) => s.key === selectedShape)?.labelAr || "";

    const message = isRTL
      ? `مرحباً TSM Kitchens،\n\nلقد قمت بتخطيط مطبخ عبر موقعكم بمخطط المساحة الديكوري:\n\n👤 *شكل الغرفة:* ${shapeLabelAr}\n📏 *الأبعاد:* ${width} × ${depth} متر\n📐 *المساحة الكلية:* ${(parseFloat(width) * parseFloat(depth)).toFixed(1)} متر مربع\n💡 *التخطيط المقترح:* ${selectedLayout.nameAr}\n\nأود طلب موعد معاينة ورفع مقاسات وتنسيق التصميم.`
      : `Hello TSM Kitchens,\n\nI designed a kitchen using the Room Planner on your website:\n\n👤 *Room Shape:* ${shapeLabel}\n📏 *Dimensions:* ${width}m × ${depth}m\n📐 *Total Area:* ${(parseFloat(width) * parseFloat(depth)).toFixed(1)} m²\n💡 *Suggested Layout:* ${selectedLayout.name}\n\nI would like to book a layout consultation and site inspection.`;

    window.open(`https://wa.me/201113561777?text=${encodeURIComponent(message)}`, "_blank");
  };

  const w = parseFloat(width) || 4;
  const d = parseFloat(depth) || 3.5;

  return (
    <>
      <Navbar />
      <main className="flex-grow pt-28 bg-slate-50 text-slate-800">
        
        {/* ── Hero ── */}
        <div className="border-b border-slate-100 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-pink-100 bg-pink-50/50 text-pink-600 text-xs font-bold uppercase tracking-wider mb-6">
              <Sparkles className="w-3.5 h-3.5 text-pink-500" />
              <span>{isRTL ? "مخطط مروة توفيق الذكي" : "Marwa Tawfik Layout Planner"}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 leading-tight">
              {rp.title}
            </h1>
            <p className="text-slate-500 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
              {rp.subtitle}
            </p>

            {/* Step Indicator */}
            <div className="flex items-center justify-center mt-8 max-w-xs mx-auto" dir="ltr">
              {([1, 2, 3] as const).map((s, i) => (
                <div key={s} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                    step >= s ? "bg-pink-600 border-pink-600 text-white" : "bg-transparent border-slate-200 text-slate-400"
                  }`}>
                    {step > s ? <CheckCircle2 className="w-4 h-4" /> : s}
                  </div>
                  {i < 2 && <div className={`w-16 h-0.5 transition-all ${step > s ? "bg-pink-600" : "bg-slate-200"}`} />}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">

            {/* ── Controls Column ── */}
            <div className="xl:col-span-1 flex flex-col gap-6">

              {/* Step 1 – Shape */}
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h2 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-pink-100 text-pink-600 text-xs flex items-center justify-center font-bold">1</span>
                  <span>{rp.step1}</span>
                </h2>
                <div className="grid grid-cols-3 gap-2">
                  {SHAPES.map((shape) => (
                    <button
                      key={shape.key}
                      onClick={() => { setSelectedShape(shape.key); if (step === 1) setStep(2); }}
                      className={`flex flex-col items-center gap-2 p-3 rounded-xl border text-center transition-all ${
                        selectedShape === shape.key
                          ? "border-pink-600 bg-pink-50/50 shadow-sm"
                          : "border-slate-100 bg-slate-50/40 hover:border-slate-200"
                      }`}
                    >
                      <div className="w-12 h-10">
                        <ShapePreview path={shape.svgPath} selected={selectedShape === shape.key} />
                      </div>
                      <span className={`text-[10px] font-bold leading-tight ${selectedShape === shape.key ? "text-pink-600" : "text-slate-500"}`}>
                        {isRTL ? shape.labelAr : shape.labelEn}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2 – Dimensions */}
              <div className={`bg-white p-6 rounded-2xl border transition-all shadow-sm ${
                step >= 2 ? "border-slate-100" : "border-slate-100 opacity-40 pointer-events-none"
              }`}>
                <h2 className="text-sm font-bold text-slate-900 mb-5 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-pink-100 text-pink-600 text-xs flex items-center justify-center font-bold">2</span>
                  <span>{rp.step2}</span>
                </h2>

                <div className="space-y-4">
                  {[
                    { label: rp.widthLabel, val: width, set: setWidth },
                    { label: rp.depthLabel, val: depth, set: setDepth },
                  ].map(({ label, val, set }) => (
                    <div key={label}>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-bold text-slate-500">{label}</label>
                        <span className="text-sm font-extrabold text-pink-600">{parseFloat(val).toFixed(1)}m</span>
                      </div>
                      <input
                        type="range" min="1.5" max="10" step="0.5"
                        value={val}
                        onChange={(e) => set(e.target.value)}
                        className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-pink-600"
                      />
                      <div className="flex justify-between text-[9px] text-slate-400 mt-1 font-semibold">
                        <span>1.5m</span><span>10m</span>
                      </div>
                    </div>
                  ))}

                  {/* Area Summary Box */}
                  <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-50 border border-slate-100 text-center">
                    {[
                      { k: isRTL ? "المساحة الكلية" : "Total Area", v: `${(w * d).toFixed(1)}m²` },
                      { k: isRTL ? "العرض" : "Width", v: `${w.toFixed(1)}m` },
                      { k: isRTL ? "العمق" : "Depth", v: `${d.toFixed(1)}m` },
                    ].map(({ k, v }) => (
                      <div key={k}>
                        <span className="text-[9px] text-slate-400 block font-semibold">{k}</span>
                        <span className="text-xs font-bold text-slate-700">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleGenerate}
                  disabled={!selectedShape}
                  className="mt-6 w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold text-sm shadow-md hover:shadow-[0_0_12px_rgba(236,72,153,0.3)] transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <Layers className="w-4 h-4" />
                  <span>{rp.generateBtn}</span>
                </button>

                {step >= 3 && (
                  <button
                    onClick={handleReset}
                    className="mt-3 w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 font-bold text-xs transition-all cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>{rp.resetBtn}</span>
                  </button>
                )}
              </div>

              {/* TSM Tip Box */}
              <div className="flex gap-3 p-4 rounded-xl bg-pink-50/50 border border-pink-100 text-xs text-slate-500">
                <Info className="w-4 h-4 text-pink-500 shrink-0 mt-0.5" />
                <p>{isRTL
                  ? "اقتراحات التوزيع مبنية على معايير مثلث الحركة في المطابخ العالمية لضمان راحة الطاهي، وسيساعدك مهندسو مروة توفيق في ضبط التفاصيل بدقة."
                  : "Layout suggestions are calculated based on standard work-triangle ergonomics. Our technical engineers will inspect your site and customize options for you."
                }</p>
              </div>
            </div>

            {/* ── Results Column ── */}
            <div className="xl:col-span-2">
              {step < 3 ? (
                <div className="flex flex-col items-center justify-center min-h-[500px] rounded-2xl border-2 border-dashed border-slate-200 bg-white text-center p-10 gap-6 shadow-xs">
                  <div className="w-20 h-20 rounded-2xl bg-pink-50 border border-pink-100 flex items-center justify-center">
                    <Layers className="w-9 h-9 text-pink-500/60" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2">
                      {isRTL ? "مخطط مقترحات مطبخك سيظهر هنا" : "Your kitchen suggestions will appear here"}
                    </h3>
                    <p className="text-slate-400 text-sm max-w-sm mx-auto">
                      {isRTL ? "اختر شكل الغرفة أولاً وأدخل أبعاد حوائطك لنقوم بتوليد المخططات المقترحة تلقائياً." : "Select a room shape and input dimensions to generate optimized layout recommendations."}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-pink-500/70 text-xs font-semibold">
                    <ChevronRight className={`w-4 h-4 ${isRTL ? "rotate-180" : ""}`} />
                    <span>{isRTL ? "ابدأ بالخطوة 1 من القائمة الجانبية" : "Start with Step 1 in the sidebar"}</span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-pink-100 text-pink-600 text-xs flex items-center justify-center font-bold">3</span>
                      <span>{rp.step3}</span>
                    </h2>
                    <span className="text-[10px] text-slate-400 font-bold bg-slate-100 px-2.5 py-0.5 rounded-full">
                      {suggestions.length} {isRTL ? "مخططات مقترحة" : "suggestions"}
                    </span>
                  </div>

                  {/* Suggestions Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {suggestions.map((layout, idx) => {
                      const isSelected = selectedLayout?.id === layout.id;
                      const counterLen = layout.counterLengthFn(w, d);
                      const cabinetCount = layout.cabinetsFn(w, d);
                      const triLabel = layout.workTriangle === "good" ? rp.good : layout.workTriangle === "fair" ? rp.fair : rp.poor;
                      const triColor = layout.workTriangle === "good" ? "#10b981" : layout.workTriangle === "fair" ? "#fbbf24" : "#64748b";

                      return (
                        <button
                          key={layout.id}
                          onClick={() => setSelectedLayout(layout)}
                          className={`flex flex-col text-left rtl:text-right rounded-2xl border bg-white overflow-hidden transition-all text-slate-800 ${
                            isSelected ? "border-pink-600 shadow-[0_0_15px_rgba(236,72,153,0.15)]" : "border-slate-100 hover:border-slate-200"
                          }`}
                        >
                          {idx === 0 && (
                            <div className="bg-pink-600 px-3 py-1 text-[9px] font-bold text-white uppercase tracking-widest text-center">
                              {isRTL ? "⭐ الخيار المقترح" : "⭐ Best Match"}
                            </div>
                          )}

                          {/* Diagram */}
                          <div className="bg-slate-50 h-36 p-4 relative border-b border-slate-100">
                            <LayoutDiagram layoutId={layout.id} shape={selectedShape!} />
                            {/* Legend labels */}
                            <div className="absolute bottom-2 right-2 rtl:right-auto rtl:left-2 flex gap-1.5 bg-white/80 backdrop-blur-xs px-2 py-0.5 rounded-md border border-slate-100">
                              {[{c:"#38bdf8",l:"S"},{c:"#f97316",l:"C"},{c:"#10b981",l:"F"}].map(z=>(
                                <div key={z.l} className="flex items-center gap-0.5">
                                  <span className="w-1.5 h-1.5 rounded-full" style={{backgroundColor:z.c}} />
                                  <span className="text-[7px] font-bold text-slate-400">{z.l}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Card body */}
                          <div className="p-4 flex-1 flex flex-col gap-3">
                            <div className="flex items-start justify-between gap-2">
                              <h3 className="text-sm font-bold text-slate-900 leading-snug">
                                {isRTL ? layout.nameAr : layout.name}
                              </h3>
                              <EfficiencyBadge pct={layout.efficiencyPct} />
                            </div>

                            <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">
                              {isRTL ? layout.descriptionAr : layout.description}
                            </p>

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-1 text-center">
                              {[
                                { k: rp.counterLength, v: `${counterLen}m` },
                                { k: rp.cabinets, v: `${cabinetCount}` },
                                { k: rp.workTriangle, v: triLabel, color: triColor },
                              ].map(({ k, v, color }) => (
                                <div key={k} className="p-1 rounded-lg bg-slate-50 border border-slate-100/50">
                                  <span className="text-[8px] text-slate-400 block leading-tight font-semibold">{k}</span>
                                  <span className="text-[10px] font-bold" style={color ? {color} : {color:"#334155"}}>{v}</span>
                                </div>
                              ))}
                            </div>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-1">
                              {(isRTL ? layout.tagsAr : layout.tags).map((tag) => (
                                <span key={tag} className="px-2 py-0.5 rounded-full bg-pink-50 text-pink-600 border border-pink-100 text-[8px] font-bold uppercase tracking-wider">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Selected Layout Detail View */}
                  {selectedLayout && (
                    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm animate-fade-in-up">
                      <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-200/60 flex items-center justify-between">
                        <h3 className="font-bold text-slate-800 text-sm">
                          {isRTL ? "المخطط المختار: " : "Selected Scheme: "}
                          <span className="text-pink-600">{isRTL ? selectedLayout.nameAr : selectedLayout.name}</span>
                        </h3>
                        <span className="text-[10px] text-slate-400 font-bold">
                          {isRTL ? "مطابخ مروة توفيق" : "TSM Kitchen Designs"}
                        </span>
                      </div>

                      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                        {/* Pros */}
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 mb-3 uppercase tracking-wider">
                            {isRTL ? "المزايا في التصميم والتنفيذ" : "Key Design Benefits"}
                          </h4>
                          <ul className="space-y-2">
                            {(isRTL ? selectedLayout.prosAr : selectedLayout.pros).map((pro, i) => (
                              <li key={i} className="flex items-start gap-2.5 text-xs text-slate-600">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                                <span>{pro}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* CTAs */}
                        <div className="flex flex-col gap-3">
                          {/* Send to WhatsApp */}
                          <button
                            onClick={handleWhatsAppQuote}
                            className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs shadow-md hover:shadow-[0_0_12px_rgba(236,72,153,0.35)] transition-all cursor-pointer"
                          >
                            <MessageSquare className="w-4 h-4" />
                            <span>{rp.whatsappBtn}</span>
                          </button>

                          {/* Book Inspection */}
                          <Link
                            href={`/${lang}#contact`}
                            className="inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition-all"
                          >
                            <Calendar className="w-4 h-4" />
                            <span>{rp.bookConsultationBtn}</span>
                            <ArrowRight className={`w-3.5 h-3.5 ${isRTL ? "rotate-180" : ""}`} />
                          </Link>

                          {/* Share Link */}
                          <div className="relative">
                            <button
                              onClick={handleShare}
                              className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-5 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 font-bold text-xs transition-all cursor-pointer"
                            >
                              <Share2 className="w-3.5 h-3.5" />
                              <span>{isRTL ? "نسخ رابط المشاركة" : "Copy Design Share Link"}</span>
                            </button>
                            {shareToast && (
                              <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] font-bold px-3 py-1.5 rounded-lg whitespace-nowrap shadow-md z-50 animate-fade-in-up">
                                {isRTL ? "✓ تم النسخ بنجاح!" : "✓ Link copied!"}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>
        </div>

      </main>
      <Footer />
      <FloatingSocials />
    </>
  );
}
