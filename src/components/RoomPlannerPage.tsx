"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useLanguage } from "@/locales/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingSocials from "@/components/FloatingSocials";
import * as THREE from "three";
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
  Printer,
  Undo2,
  Trash2,
  Check,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────
type RoomShape = "rectangle" | "lShape" | "uShape" | "galley" | "island" | "gShape" | "custom";
type CabinetFinish = 
  | "modern-gloss-grey" 
  | "modern-matte-white" 
  | "modern-sage-green" 
  | "modern-navy-blue" 
  | "modern-forest-green" 
  | "modern-charcoal" 
  | "classic-oak" 
  | "classic-walnut";

type CountertopStone = "white-marble" | "calacatta-gold" | "black-granite" | "grey-quartz" | "concrete-grey";
type HandleStyle = "modern-chrome" | "classic-gold" | "handleless";
type FloorMaterial = "parquet-oak" | "marble-tiles" | "concrete-grey";
type WallMaterial = "off-white" | "exposed-brick" | "dark-charcoal";
type Point2D = { x: number; y: number };

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
  tags: string[];
  tagsAr: string[];
  pros: string[];
  prosAr: string[];
};

// ── Constants & Presets ────────────────────────────────────────────────────
const SHAPES: { key: RoomShape; labelEn: string; labelAr: string; svgPath: string }[] = [
  { key: "rectangle", labelEn: "Rectangle",      labelAr: "مستطيل",       svgPath: "M4,4 L60,4 L60,56 L4,56 Z" },
  { key: "lShape",    labelEn: "L-Shape",         labelAr: "شكل L",        svgPath: "M4,4 L60,4 L60,32 L36,32 L36,56 L4,56 Z" },
  { key: "uShape",    labelEn: "U-Shape",         labelAr: "شكل U",        svgPath: "M4,4 L60,4 L60,56 L44,56 L44,24 L20,24 L20,56 L4,56 Z" },
  { key: "galley",    labelEn: "Galley",          labelAr: "ممر مزدوج",    svgPath: "M4,4 L60,4 L60,56 L4,56 Z" },
  { key: "island",    labelEn: "Island",          labelAr: "جزيرة وسطى",  svgPath: "M4,4 L60,4 L60,56 L4,56 Z" },
  { key: "gShape",    labelEn: "G-Shape",         labelAr: "شكل G",        svgPath: "M4,4 L60,4 L60,56 L28,56 L28,40 L44,40 L44,4" },
];

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
    tags: ["Compact", "Modern", "Efficient"],
    tagsAr: ["مضغوط", "مستقل", "فعّال"],
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
    tags: ["Peninsula Bar", "Closed Layout", "Cabinet Rich"],
    tagsAr: ["بار شبه جزيرة", "تخطيط مغلق", "غني بالخزائن"],
    pros: ["Peninsula works as breakfast bar", "Clearly defines the kitchen area", "Immensely spacious counters"],
    prosAr: ["شبه الجزيرة تعمل كبار فطور", "يحدد مساحة المطبخ بوضوح", "كونترات تحضير واسعة جداً"],
  },
];

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
    case "custom":
      if (isNarrow) return [ALL_LAYOUTS[0], ALL_LAYOUTS[1]];
      if (isSmall) return [ALL_LAYOUTS[2], ALL_LAYOUTS[0]];
      return [ALL_LAYOUTS[4], ALL_LAYOUTS[3], ALL_LAYOUTS[2]];
    default:
      return ALL_LAYOUTS.slice(0, 3);
  }
}

// ── Procedural Wood Texture Generator ─────────────────────────────────────
function createWoodTexture(baseColor: string, grainColor: string): THREE.Texture {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = baseColor;
  ctx.fillRect(0, 0, 256, 256);
  ctx.fillStyle = grainColor;
  for (let i = 0; i < 200; i++) {
    const w = Math.random() * 2 + 0.5;
    const h = Math.random() * 100 + 40;
    ctx.fillRect(Math.random() * 256, Math.random() * 256, w, h);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

// ── Procedural Marble Texture Generator ───────────────────────────────────
function createMarbleTexture(veinColor = "rgba(100, 116, 139, 0.15)"): THREE.Texture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d")!;
  const grad = ctx.createLinearGradient(0, 0, 512, 512);
  grad.addColorStop(0, "#ffffff");
  grad.addColorStop(1, "#f8fafc");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);
  
  ctx.strokeStyle = veinColor;
  ctx.lineWidth = 1.5;
  for (let i = 0; i < 6; i++) {
    ctx.beginPath();
    ctx.moveTo(Math.random() * 512, 0);
    ctx.bezierCurveTo(
      Math.random() * 512, 170,
      Math.random() * 512, 340,
      Math.random() * 512, 512
    );
    ctx.stroke();
  }
  return new THREE.CanvasTexture(canvas);
}

// ── Procedural Brick Wall Texture ─────────────────────────────────────────
function createBrickTexture(): THREE.Texture {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#b45309"; // brick rustic orange
  ctx.fillRect(0, 0, 256, 256);
  ctx.strokeStyle = "#e2e8f0"; // mortar
  ctx.lineWidth = 2.5;
  for (let y = 0; y <= 256; y += 32) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(256, y);
    ctx.stroke();
    const offset = (y / 32) % 2 === 0 ? 0 : 32;
    for (let x = offset; x < 256 + 64; x += 64) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, y + 32);
      ctx.stroke();
    }
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(3, 2);
  return texture;
}

// ── Procedural Herringbone Parquet Floor ──────────────────────────────────
function createParquetTexture(): THREE.Texture {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#b45309"; // Warm golden oak base
  ctx.fillRect(0, 0, 256, 256);
  ctx.strokeStyle = "#451a03"; // Dark plank grooves
  ctx.lineWidth = 1;
  for (let i = 0; i < 256; i += 32) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, 256);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(256, i);
    ctx.stroke();
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  return texture;
}

// ── Procedural Grout Ceramic Floor Tiles ──────────────────────────────────
function createTilesFloorTexture(): THREE.Texture {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#f1f5f9"; // light grey ceramic tiles
  ctx.fillRect(0, 0, 256, 256);
  ctx.strokeStyle = "#cbd5e1"; // grout
  ctx.lineWidth = 3;
  for (let i = 0; i <= 256; i += 64) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, 256);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(256, i);
    ctx.stroke();
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(5, 5);
  return texture;
}

// ── Room Planner Page Component ───────────────────────────────────────────
export default function RoomPlannerPage() {
  const { lang, dict, dir } = useLanguage();
  const rp = dict.roomPlanner;
  const isRTL = lang === "ar";

  // ── State variables ──────────────────────────────────────────────────────
  const [selectedShape, setSelectedShape] = useState<RoomShape | null>(null);
  const [width, setWidth] = useState<string>("4.0");
  const [depth, setDepth] = useState<string>("3.5");
  const [suggestions, setSuggestions] = useState<LayoutSuggestion[]>([]);
  const [selectedLayout, setSelectedLayout] = useState<LayoutSuggestion | null>(null);
  const [shareToast, setShareToast] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Custom drawing states
  const [drawingPoints, setDrawingPoints] = useState<Point2D[]>([]);
  const [isDrawingClosed, setIsDrawingClosed] = useState(false);
  const [hoverPoint, setHoverPoint] = useState<Point2D | null>(null);

  // 3D parameters states
  const [activeFinish, setActiveFinish] = useState<CabinetFinish>("modern-gloss-grey");
  const [activeStone, setActiveStone] = useState<CountertopStone>("white-marble");
  const [activeHandle, setActiveHandle] = useState<HandleStyle>("modern-chrome");
  const [floorType, setFloorType] = useState<FloorMaterial>("parquet-oak");
  const [wallType, setWallType] = useState<WallMaterial>("off-white");
  const [isLedActive, setIsLedActive] = useState(true);
  const [ledColor, setLedColor] = useState("#fff4e0");
  const [timeOfDay, setTimeOfDay] = useState<number>(12.0); // 6.0 to 22.0

  // Appliance toggles states
  const [hasFridge, setHasFridge] = useState(true);
  const [hasOvenTower, setHasOvenTower] = useState(true);
  const [hasSink, setHasSink] = useState(true);

  // ── WebGL References ─────────────────────────────────────────────────────
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [printSnapshotUrl, setPrintSnapshotUrl] = useState<string | null>(null);

  // Refs for scene loops (avoiding react state delay inside render animations)
  const activeLayoutRef = useRef<LayoutSuggestion | null>(null);
  const activeFinishRef = useRef<CabinetFinish>(activeFinish);
  const activeStoneRef = useRef<CountertopStone>(activeStone);
  const activeHandleRef = useRef<HandleStyle>(activeHandle);
  const activeFloorRef = useRef<FloorMaterial>(floorType);
  const activeWallRef = useRef<WallMaterial>(wallType);
  const isLedActiveRef = useRef<boolean>(isLedActive);
  const ledColorRef = useRef<string>(ledColor);
  const timeOfDayRef = useRef<number>(timeOfDay);

  const hasFridgeRef = useRef(hasFridge);
  const hasOvenTowerRef = useRef(hasOvenTower);
  const hasSinkRef = useRef(hasSink);

  useEffect(() => { activeLayoutRef.current = selectedLayout; }, [selectedLayout]);
  useEffect(() => { activeFinishRef.current = activeFinish; }, [activeFinish]);
  useEffect(() => { activeStoneRef.current = activeStone; }, [activeStone]);
  useEffect(() => { activeHandleRef.current = activeHandle; }, [activeHandle]);
  useEffect(() => { activeFloorRef.current = floorType; }, [floorType]);
  useEffect(() => { activeWallRef.current = wallType; }, [wallType]);
  useEffect(() => { isLedActiveRef.current = isLedActive; }, [isLedActive]);
  useEffect(() => { ledColorRef.current = ledColor; }, [ledColor]);
  useEffect(() => { timeOfDayRef.current = timeOfDay; }, [timeOfDay]);

  useEffect(() => { hasFridgeRef.current = hasFridge; }, [hasFridge]);
  useEffect(() => { hasOvenTowerRef.current = hasOvenTower; }, [hasOvenTower]);
  useEffect(() => { hasSinkRef.current = hasSink; }, [hasSink]);

  // ── Shape Classification Engine ──────────────────────────────────────────
  const classifyPolygonShape = (pts: Point2D[], wM: number, hM: number): RoomShape => {
    const N = pts.length;
    if (N <= 4) return "rectangle";
    
    // Calculate Shoelace Area
    let area = 0;
    for (let i = 0; i < N; i++) {
      const j = (i + 1) % N;
      area += pts[i].x * pts[j].y;
      area -= pts[j].x * pts[i].y;
    }
    area = Math.abs(area) * 0.5;

    const bboxArea = (wM * 30) * (hM * 30);
    const ratio = area / bboxArea;

    if (ratio > 0.88) return "rectangle";
    if (ratio >= 0.65 && ratio <= 0.85) return "lShape";
    if (ratio < 0.65) return "uShape";
    return "custom";
  };

  // ── 2D Canvas Drawing Handlers ───────────────────────────────────────────
  const getCanvasCoords = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const snap = 15;
    return {
      x: Math.round(x / snap) * snap,
      y: Math.round(y / snap) * snap,
    };
  };

  const handleCanvasClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (isDrawingClosed) return;
    const pt = getCanvasCoords(e);
    
    if (drawingPoints.length >= 3) {
      const start = drawingPoints[0];
      const dist = Math.hypot(pt.x - start.x, pt.y - start.y);
      if (dist < 20) {
        handleAutoClose();
        return;
      }
    }
    setDrawingPoints((prev) => [...prev, pt]);
  };

  const handleAutoClose = () => {
    if (drawingPoints.length < 3 || isDrawingClosed) return;
    setIsDrawingClosed(true);
    
    const xs = drawingPoints.map((p) => p.x);
    const ys = drawingPoints.map((p) => p.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    
    const calculatedWidth = +((maxX - minX) / 30).toFixed(1);
    const calculatedDepth = +((maxY - minY) / 30).toFixed(1);
    
    const wVal = Math.max(1.5, Math.min(12, calculatedWidth));
    const dVal = Math.max(1.5, Math.min(12, calculatedDepth));
    
    setWidth(wVal.toString());
    setDepth(dVal.toString());

    const detectedShape = classifyPolygonShape(drawingPoints, wVal, dVal);
    setSelectedShape(detectedShape);

    const results = getLayoutsForShape(detectedShape, wVal, dVal);
    setSuggestions(results);
    setSelectedLayout(results[0]);
    setStep(3);
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (isDrawingClosed || drawingPoints.length === 0) return;
    setHoverPoint(getCanvasCoords(e));
  };

  const handleUndo = () => {
    if (isDrawingClosed) {
      setIsDrawingClosed(false);
      return;
    }
    setDrawingPoints((prev) => prev.slice(0, -1));
  };

  const handleClearDrawing = () => {
    setDrawingPoints([]);
    setIsDrawingClosed(false);
    setHoverPoint(null);
  };

  // ── Layout Matching Actions ──────────────────────────────────────────────
  const handleGenerate = useCallback(() => {
    if (!selectedShape) return;
    const wVal = Math.max(1.5, Math.min(12, parseFloat(width) || 4));
    const dVal = Math.max(1.5, Math.min(12, parseFloat(depth) || 3.5));
    const results = getLayoutsForShape(selectedShape, wVal, dVal);
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
    handleClearDrawing();
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setShareToast(true);
      setTimeout(() => setShareToast(false), 3000);
    });
  };

  const handleWhatsAppQuote = () => {
    if (!selectedLayout) return;
    const shapeLabel = selectedShape === "custom" ? "Custom Draw" : SHAPES.find((s) => s.key === selectedShape)?.labelEn || "";
    const shapeLabelAr = selectedShape === "custom" ? "رسم حر مخصص" : SHAPES.find((s) => s.key === selectedShape)?.labelAr || "";

    const message = isRTL
      ? `مرحباً TSM Kitchens،\n\nلقد قمت بتخطيط مطبخ عبر مخطط المساحة التفاعلي بموقعكم:\n\n👤 *شكل المخطط:* ${shapeLabelAr}\n📏 *الأبعاد:* ${width} × ${depth} متر\n📐 *المساحة:* ${(parseFloat(width) * parseFloat(depth)).toFixed(1)} م²\n🎨 *الخامة واللون:* ${activeFinish}\n🪨 *الرخام:* ${activeStone}\n💡 *التخطيط:* ${selectedLayout.nameAr}`
      : `Hello TSM Kitchens,\n\nI created a kitchen design using your interactive Room Planner:\n\n👤 *Shape:* ${shapeLabel}\n📏 *Dimensions:* ${width}m × ${depth}m\n📐 *Area:* ${(parseFloat(width) * parseFloat(depth)).toFixed(1)} m²\n🎨 *Cabinet Finish:* ${activeFinish}\n🪨 *Stone:* ${activeStone}\n💡 *Layout:* ${selectedLayout.name}`;

    window.open(`https://wa.me/201113561777?text=${encodeURIComponent(message)}`, "_blank");
  };

  const handlePrint = () => {
    if (canvasRef.current) {
      setPrintSnapshotUrl(canvasRef.current.toDataURL("image/jpeg", 0.95));
      setTimeout(() => {
        window.print();
      }, 300);
    } else {
      window.print();
    }
  };

  // ── Three.js Scene Setup & Render Loop ───────────────────────────────────
  useEffect(() => {
    if (typeof window === "undefined" || !canvasRef.current || !containerRef.current) return;

    const container = containerRef.current;
    let width3D = container.clientWidth || 500;
    let height3D = container.clientHeight || 500;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      preserveDrawingBuffer: true,
    });
    renderer.setSize(width3D, height3D);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#f8fafc");
    const camera = new THREE.PerspectiveCamera(40, width3D / height3D, 0.1, 100);
    camera.position.set(0, 3.2, 4.5);

    const roomGroup = new THREE.Group();
    scene.add(roomGroup);

    // Floor Mesh Setup
    const floorGeo = new THREE.PlaneGeometry(12, 12);
    const floorMesh = new THREE.Mesh(floorGeo, new THREE.MeshStandardMaterial({ roughness: 0.8 }));
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.position.y = -1.2;
    floorMesh.receiveShadow = true;
    roomGroup.add(floorMesh);

    // Wall Mesh Setup
    const wallGeo = new THREE.PlaneGeometry(12, 4);
    const wallMesh = new THREE.Mesh(wallGeo, new THREE.MeshStandardMaterial({ roughness: 0.9 }));
    wallMesh.position.set(0, 0.8, -4);
    wallMesh.receiveShadow = true;
    roomGroup.add(wallMesh);

    const ambientLight = new THREE.AmbientLight("#ffffff", 0.85);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight("#fffaf0", 2.2);
    sunLight.position.set(-3.5, 3.5, 2);
    sunLight.castShadow = true;
    sunLight.shadow.bias = -0.0015;
    scene.add(sunLight);

    const spotLight = new THREE.SpotLight("#ffffff", 3);
    spotLight.position.set(0, 2.5, -1);
    spotLight.angle = Math.PI / 3;
    spotLight.castShadow = true;
    scene.add(spotLight);

    const ledLight = new THREE.PointLight("#fff4e0", 0, 5);
    ledLight.position.set(0, 0.35, -3.95);
    scene.add(ledLight);

    const chromeMat = new THREE.MeshStandardMaterial({ color: "#cccccc", metalness: 0.9, roughness: 0.1 });
    const handleGoldMat = new THREE.MeshStandardMaterial({ color: "#d4af37", metalness: 0.95, roughness: 0.15 });
    const blackGlassMat = new THREE.MeshStandardMaterial({ color: "#111111", roughness: 0.05, metalness: 0.9 });
    const applianceSteelMat = new THREE.MeshStandardMaterial({ color: "#e2e8f0", metalness: 0.85, roughness: 0.2 });

    // Wood / Matte textures
    const oakTex = createWoodTexture("#cfa771", "#7e623d");
    const walnutTex = createWoodTexture("#7a5933", "#3f2d1e");
    
    // Cabinet Materials Dictionary
    const cabinetMaterials = {
      "modern-gloss-grey": new THREE.MeshStandardMaterial({ color: "#475569", roughness: 0.05, metalness: 0.1 }),
      "modern-matte-white": new THREE.MeshStandardMaterial({ color: "#ffffff", roughness: 0.85, metalness: 0.05 }),
      "modern-sage-green": new THREE.MeshStandardMaterial({ color: "#607264", roughness: 0.75, metalness: 0.05 }),
      "modern-navy-blue": new THREE.MeshStandardMaterial({ color: "#1e293b", roughness: 0.75, metalness: 0.1 }),
      "modern-forest-green": new THREE.MeshStandardMaterial({ color: "#14532d", roughness: 0.8, metalness: 0.05 }),
      "modern-charcoal": new THREE.MeshStandardMaterial({ color: "#18181b", roughness: 0.7, metalness: 0.1 }),
      "classic-oak": new THREE.MeshStandardMaterial({ roughness: 0.5, metalness: 0.1, map: oakTex }),
      "classic-walnut": new THREE.MeshStandardMaterial({ roughness: 0.4, metalness: 0.1, map: walnutTex }),
    };

    // Countertop Stone Dictionary
    const stoneMaterials = {
      "white-marble": new THREE.MeshStandardMaterial({ roughness: 0.1, metalness: 0.1, map: createMarbleTexture("rgba(100, 116, 139, 0.15)") }),
      "calacatta-gold": new THREE.MeshStandardMaterial({ roughness: 0.08, metalness: 0.1, map: createMarbleTexture("rgba(180, 140, 60, 0.28)") }),
      "black-granite": new THREE.MeshStandardMaterial({ color: "#1a1a1a", roughness: 0.12, metalness: 0.15 }),
      "grey-quartz": new THREE.MeshStandardMaterial({ color: "#64748b", roughness: 0.22, metalness: 0.05 }),
      "concrete-grey": new THREE.MeshStandardMaterial({ color: "#78716c", roughness: 0.6, metalness: 0.1 }),
    };

    // Procedural Floor/Wall textures
    const floorTextures = {
      "parquet-oak": createParquetTexture(),
      "marble-tiles": createTilesFloorTexture(),
      "concrete-grey": new THREE.Texture(), // base solid
    };
    const wallTextures = {
      "off-white": new THREE.Texture(),
      "exposed-brick": createBrickTexture(),
      "dark-charcoal": new THREE.Texture(),
    };

    const cabinetGroup = new THREE.Group();
    roomGroup.add(cabinetGroup);

    // Cabinet component builder
    const buildCabinetModule = (x: number, y: number, z: number, isUpper = false, isApplianceType: "none" | "oven" | "sink" = "none") => {
      const widthMod = 0.6;
      const heightMod = isUpper ? 0.7 : 0.85;
      const depthMod = isUpper ? 0.35 : 0.6;

      const finishKey = activeFinishRef.current;
      const stoneKey = activeStoneRef.current;
      const handleKey = activeHandleRef.current;

      const cabMat = cabinetMaterials[finishKey];
      const counterMat = stoneMaterials[stoneKey];

      const meshGroup = new THREE.Group();
      meshGroup.position.set(x, y, z);

      if (isApplianceType === "oven" && !isUpper) {
        // Renders an Oven tower tall unit
        const tallBody = new THREE.Mesh(new THREE.BoxGeometry(widthMod - 0.01, 2.2, depthMod), cabMat);
        tallBody.position.y = 0.67;
        tallBody.castShadow = true;
        tallBody.receiveShadow = true;
        meshGroup.add(tallBody);

        // Black glass oven insert
        const oven = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.55, 0.02), blackGlassMat);
        oven.position.set(0, 0.4, depthMod / 2 + 0.01);
        meshGroup.add(oven);

        // Stainless steel handle bar
        const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.4), chromeMat);
        bar.rotation.z = Math.PI / 2;
        bar.position.set(0, 0.6, depthMod / 2 + 0.03);
        meshGroup.add(bar);
      } else {
        // Renders standard cabinet box
        const body = new THREE.Mesh(new THREE.BoxGeometry(widthMod - 0.01, heightMod, depthMod), cabMat);
        body.castShadow = true;
        body.receiveShadow = true;
        meshGroup.add(body);

        // Handles
        if (handleKey !== "handleless") {
          const handleMat = handleKey === "classic-gold" ? handleGoldMat : chromeMat;
          const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.15), handleMat);
          handle.rotation.z = Math.PI / 2;
          handle.position.set(0, isUpper ? -0.25 : 0.3, depthMod / 2 + 0.01);
          meshGroup.add(handle);
        }

        // Countertop
        if (!isUpper) {
          const slab = new THREE.Mesh(new THREE.BoxGeometry(widthMod, 0.04, depthMod + 0.02), counterMat);
          slab.position.y = heightMod / 2 + 0.02;
          slab.castShadow = true;
          slab.receiveShadow = true;
          meshGroup.add(slab);

          // Add steel sink insert
          if (isApplianceType === "sink") {
            const sinkUnit = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.01, 0.35), chromeMat);
            sinkUnit.position.set(0, heightMod / 2 + 0.042, 0);
            meshGroup.add(sinkUnit);

            const faucet = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.15), chromeMat);
            faucet.position.set(0, heightMod / 2 + 0.12, -0.12);
            meshGroup.add(faucet);
          }
        }
      }

      cabinetGroup.add(meshGroup);
    };

    const updateKitchen3DModel = () => {
      while (cabinetGroup.children.length > 0) {
        const child = cabinetGroup.children[0];
        cabinetGroup.remove(child);
      }

      const activeLayout = activeLayoutRef.current;
      if (!activeLayout) return;

      const id = activeLayout.id;
      const showFridge = hasFridgeRef.current;
      const showOvenTower = hasOvenTowerRef.current;
      const showSink = hasSinkRef.current;

      // Standalone Refrigerator block
      if (showFridge) {
        const fridgeGroup = new THREE.Group();
        fridgeGroup.position.set(-2.4, -0.3, -3.5);
        const fBody = new THREE.Mesh(new THREE.BoxGeometry(0.7, 1.8, 0.7), applianceSteelMat);
        fBody.castShadow = true;
        fridgeGroup.add(fBody);

        const fGlass = new THREE.Mesh(new THREE.BoxGeometry(0.01, 0.8, 0.2), blackGlassMat);
        fGlass.position.set(0.36, 0.3, 0);
        fridgeGroup.add(fGlass);
        cabinetGroup.add(fridgeGroup);
      }

      if (id === "single-wall") {
        let idx = 0;
        for (let x = -1.8; x <= 1.8; x += 0.6) {
          const type = (idx === 1 && showSink) ? "sink" : (idx === 4 && showOvenTower) ? "oven" : "none";
          buildCabinetModule(x, -0.77, -3.6, false, type);
          if (type !== "oven") {
            buildCabinetModule(x, 0.45, -3.6, true);
          }
          idx++;
        }
      } else if (id === "galley") {
        let idx = 0;
        for (let x = -1.8; x <= 1.8; x += 0.6) {
          const type = (idx === 1 && showSink) ? "sink" : "none";
          buildCabinetModule(x, -0.77, -3.6, false, type);
          buildCabinetModule(x, -0.77, -1.6, false, (idx === 3 && showOvenTower) ? "oven" : "none");
          idx++;
        }
      } else if (id === "l-shape") {
        let idx = 0;
        for (let x = -1.8; x <= 1.8; x += 0.6) {
          const type = (idx === 1 && showSink) ? "sink" : "none";
          buildCabinetModule(x, -0.77, -3.6, false, type);
          buildCabinetModule(x, 0.45, -3.6, true);
          idx++;
        }
        let zIdx = 0;
        for (let z = -3.0; z <= -1.2; z += 0.6) {
          buildCabinetModule(1.8, -0.77, z, false, (zIdx === 1 && showOvenTower) ? "oven" : "none");
          zIdx++;
        }
      } else if (id === "u-shape") {
        let idx = 0;
        for (let x = -1.8; x <= 1.8; x += 0.6) {
          buildCabinetModule(x, -0.77, -3.6, false, (idx === 3 && showSink) ? "sink" : "none");
          buildCabinetModule(x, 0.45, -3.6, true);
          idx++;
        }
        for (let z = -3.0; z <= -1.2; z += 0.6) {
          buildCabinetModule(-1.8, -0.77, z, false);
        }
        let zIdx = 0;
        for (let z = -3.0; z <= -1.2; z += 0.6) {
          buildCabinetModule(1.8, -0.77, z, false, (zIdx === 1 && showOvenTower) ? "oven" : "none");
          zIdx++;
        }
      } else if (id === "island") {
        let idx = 0;
        for (let x = -1.8; x <= 1.8; x += 0.6) {
          buildCabinetModule(x, -0.77, -3.6, false, (idx === 4 && showOvenTower) ? "oven" : "none");
          if (idx !== 4) buildCabinetModule(x, 0.45, -3.6, true);
          idx++;
        }
        for (let x = -0.6; x <= 0.6; x += 0.6) {
          buildCabinetModule(x, -0.77, -1.8, false, (x === 0 && showSink) ? "sink" : "none");
        }
      } else if (id === "g-shape") {
        let idx = 0;
        for (let x = -1.8; x <= 1.8; x += 0.6) {
          buildCabinetModule(x, -0.77, -3.6, false, (idx === 2 && showSink) ? "sink" : "none");
          idx++;
        }
        for (let z = -3.0; z <= -1.2; z += 0.6) {
          buildCabinetModule(-1.8, -0.77, z, false);
        }
        let zIdx = 0;
        for (let z = -3.0; z <= -1.2; z += 0.6) {
          buildCabinetModule(1.8, -0.77, z, false, (zIdx === 1 && showOvenTower) ? "oven" : "none");
          zIdx++;
        }
        for (let x = -0.6; x <= 0.6; x += 0.6) {
          buildCabinetModule(x, -0.77, -0.6, false);
        }
      }
    };

    const clock = new THREE.Clock();
    let reqId: number;

    const tick = () => {
      const elapsed = clock.getElapsedTime();

      // Slow camera auto rotation orbiting the kitchen
      camera.position.x = Math.sin(elapsed * 0.08) * 3.8;
      camera.position.z = Math.cos(elapsed * 0.08) * 3.8 + 1;
      camera.lookAt(0, -0.15, -2.6);

      // Floor Type Switch
      const activeF = activeFloorRef.current;
      if (activeF === "concrete-grey") {
        floorMesh.material = new THREE.MeshStandardMaterial({ color: "#78716c", roughness: 0.65 });
      } else {
        const floorMat = new THREE.MeshStandardMaterial({ map: floorTextures[activeF], roughness: 0.4 });
        floorMesh.material = floorMat;
      }

      // Wall Type Switch
      const activeW = activeWallRef.current;
      if (activeW === "exposed-brick") {
        wallMesh.material = new THREE.MeshStandardMaterial({ map: wallTextures["exposed-brick"], roughness: 0.95 });
      } else if (activeW === "dark-charcoal") {
        wallMesh.material = new THREE.MeshStandardMaterial({ color: "#18181b", roughness: 0.85 });
      } else {
        wallMesh.material = new THREE.MeshStandardMaterial({ color: "#f8fafc", roughness: 0.9 });
      }

      // LED strip intensity
      const ledActive = isLedActiveRef.current;
      ledLight.intensity = ledActive ? 3.5 : 0;
      ledLight.color.set(ledColorRef.current);

      // Sunlight Tracing time-of-day
      const hrs = timeOfDayRef.current;
      let targetSunIntensity = 2.2;
      let targetSunColor = new THREE.Color("#fffaf0");
      if (hrs >= 6 && hrs < 9) {
        targetSunIntensity = 1.0;
        targetSunColor.set("#ff7a00");
      } else if (hrs >= 17 && hrs < 19.5) {
        targetSunIntensity = 1.2;
        targetSunColor.set("#ffaa44");
      } else if (hrs >= 19.5 || hrs < 6) {
        targetSunIntensity = 0;
      }
      sunLight.intensity += (targetSunIntensity - sunLight.intensity) * 0.08;
      sunLight.color.lerp(targetSunColor, 0.08);

      updateKitchen3DModel();

      renderer.render(scene, camera);
      reqId = requestAnimationFrame(tick);
    };

    tick();

    const handleResize = () => {
      width3D = container.clientWidth;
      height3D = container.clientHeight;
      camera.aspect = width3D / height3D;
      camera.updateProjectionMatrix();
      renderer.setSize(width3D, height3D);
    };
    const resizeObserver = new ResizeObserver(() => handleResize());
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(reqId);
      resizeObserver.disconnect();
      floorMesh.geometry.dispose();
      (floorMesh.material as THREE.Material).dispose();
      wallMesh.geometry.dispose();
      (wallMesh.material as THREE.Material).dispose();
      chromeMat.dispose();
      handleGoldMat.dispose();
      blackGlassMat.dispose();
      applianceSteelMat.dispose();
      oakTex.dispose();
      walnutTex.dispose();
      Object.values(cabinetMaterials).forEach((m) => m.dispose());
      Object.values(stoneMaterials).forEach((m) => m.dispose());
      Object.values(floorTextures).forEach((t) => t.dispose());
      Object.values(wallTextures).forEach((t) => t.dispose());
      renderer.dispose();
    };
  }, [width, depth]);

  const wVal = parseFloat(width) || 4;
  const dVal = parseFloat(depth) || 3.5;
  const roomArea = wVal * dVal;

  return (
    <>
      <Navbar />
      <main className="flex-grow pt-28 bg-slate-50 text-slate-800 printable-planner">
        
        {/* ── PRINT-ONLY SPEC SHEET HEADER ── */}
        <div className="hidden print:block mb-8 border-b-2 border-slate-200 pb-4 text-center">
          <h1 className="text-2xl font-extrabold text-slate-900 mb-1">TSM KITCHENS — Eng. Marwa Tawfik</h1>
          <p className="text-xs text-slate-500">{isRTL ? "مخطط وتقرير مساحة المطبخ الفني" : "Technical Kitchen Layout Specification Sheet"}</p>
        </div>

        {/* ── Hero ── */}
        <div className="border-b border-slate-100 bg-white print:hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-pink-100 bg-pink-50/50 text-pink-600 text-xs font-bold uppercase tracking-wider mb-6">
              <Sparkles className="w-3.5 h-3.5 text-pink-500" />
              <span>{isRTL ? "مخطط مروة توفيق الذكي" : "Marwa Tawfik Layout Planner"}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-3 leading-tight">
              {rp.title}
            </h1>
            <p className="text-slate-500 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
              {rp.subtitle}
            </p>

            {/* Step Indicator */}
            <div className="flex items-center justify-center mt-6 max-w-xs mx-auto" dir="ltr">
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

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-stretch">

            {/* ── Left Column: Controls ── */}
            <div className="xl:col-span-4 flex flex-col gap-6 print:hidden">

              {/* Step 1 – Shape & Custom Draw */}
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
                      className={`flex flex-col items-center gap-2 p-3 rounded-xl border text-center transition-all cursor-pointer ${
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
                  
                  {/* Custom Freehand shape button */}
                  <button
                    onClick={() => { setSelectedShape("custom"); if (step === 1) setStep(2); }}
                    className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl border text-center transition-all cursor-pointer ${
                      selectedShape === "custom"
                        ? "border-pink-600 bg-pink-50/50 shadow-sm"
                        : "border-slate-100 bg-slate-50/40 hover:border-slate-200"
                    }`}
                  >
                    <Layers className="w-7 h-7 text-pink-500" />
                    <span className={`text-[10px] font-bold leading-tight ${selectedShape === "custom" ? "text-pink-600" : "text-slate-500"}`}>
                      {isRTL ? "رسم حر 2D" : "Freehand Draw"}
                    </span>
                  </button>
                </div>
              </div>

              {/* Freehand Interactive Drawing Canvas */}
              {selectedShape === "custom" && (
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-bold text-slate-800">{isRTL ? "لوحة الرسم الحر 2D" : "2D Sketching Board"}</h3>
                    <div className="flex gap-1.5">
                      <button
                        onClick={handleAutoClose}
                        disabled={drawingPoints.length < 3 || isDrawingClosed}
                        className="px-2 py-1 rounded-lg border border-pink-200 bg-pink-50 hover:bg-pink-100 text-pink-600 text-[10px] font-bold disabled:opacity-40 cursor-pointer"
                        title={isRTL ? "إغلاق وتوليد المخطط" : "Close and Auto-Render"}
                      >
                        {isRTL ? "إغلاق الشكل" : "Close Shape"}
                      </button>
                      <button onClick={handleUndo} className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-500 cursor-pointer" title="Undo">
                        <Undo2 size={14} />
                      </button>
                      <button onClick={handleClearDrawing} className="p-1.5 rounded-lg border border-slate-200 hover:bg-red-50 hover:text-red-500 text-slate-500 cursor-pointer" title="Clear">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  
                  <svg
                    className="w-full h-44 bg-slate-50 border border-slate-200 rounded-xl cursor-crosshair"
                    onClick={handleCanvasClick}
                    onMouseMove={handleCanvasMouseMove}
                  >
                    {/* Draw Grid lines */}
                    {Array.from({ length: 15 }).map((_, i) => (
                      <line key={`lh-${i}`} x1="0" y1={i * 15} x2="400" y2={i * 15} stroke="#e2e8f0" strokeWidth="0.5" />
                    ))}
                    {Array.from({ length: 25 }).map((_, i) => (
                      <line key={`lv-${i}`} x1={i * 15} y1="0" x2={i * 15} y2={200} stroke="#e2e8f0" strokeWidth="0.5" />
                    ))}

                    {/* Plotted wall lines */}
                    {drawingPoints.map((pt, i) => {
                      if (i === 0) return null;
                      const prev = drawingPoints[i - 1];
                      return (
                        <line
                          key={i}
                          x1={prev.x} y1={prev.y}
                          x2={pt.x} y2={pt.y}
                          stroke="#db2777" strokeWidth="2.5"
                        />
                      );
                    })}

                    {/* Active line to cursor */}
                    {drawingPoints.length > 0 && !isDrawingClosed && hoverPoint && (
                      <line
                        x1={drawingPoints[drawingPoints.length - 1].x}
                        y1={drawingPoints[drawingPoints.length - 1].y}
                        x2={hoverPoint.x}
                        y2={hoverPoint.y}
                        stroke="#db2777" strokeWidth="1.5"
                        strokeDasharray="4,3"
                      />
                    )}

                    {/* Render dots */}
                    {drawingPoints.map((pt, i) => (
                      <circle
                        key={i}
                        cx={pt.x} cy={pt.y}
                        r={i === 0 ? "5" : "3.5"}
                        fill={i === 0 ? "#10b981" : "#db2777"}
                        className={i === 0 ? "animate-pulse" : ""}
                      />
                    ))}
                  </svg>
                  
                  <p className="text-[10px] text-slate-400 mt-2 text-center">
                    {isRTL 
                      ? "انقر على الشبكة للرسم، أو انقر على 'إغلاق الشكل' لتوليد المطبخ ثلاثي الأبعاد فوراً." 
                      : "Click on grid to draw. Click 'Close Shape' to load 3D visualizer instantly."}
                  </p>
                </div>
              )}

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
                        disabled={selectedShape === "custom" && isDrawingClosed}
                      />
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleGenerate}
                  disabled={!selectedShape || (selectedShape === "custom" && !isDrawingClosed)}
                  className="mt-6 w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold text-sm shadow-md hover:shadow-[0_0_12px_rgba(236,72,153,0.3)] transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <Layers className="w-4 h-4" />
                  <span>{rp.generateBtn}</span>
                </button>
              </div>

              {/* 3D Visualizer Parameters Customize box */}
              {step >= 3 && (
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-5">
                  <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-pink-500" />
                    <span>{isRTL ? "مواصفات الخامات والألوان" : "Materials & Finish customizer"}</span>
                  </h3>
                  
                  {/* Cabinet wood finishes */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-2">{isRTL ? "خامة ولون خشب الخزائن" : "Cabinet Wood & Finish"}</label>
                    <select
                      value={activeFinish}
                      onChange={(e) => setActiveFinish(e.target.value as CabinetFinish)}
                      className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl px-3 py-2 text-slate-700 font-bold focus:outline-none"
                    >
                      <option value="modern-gloss-grey">{isRTL ? "أكريليك رمادي لامع" : "High-Gloss Grey Acrylic"}</option>
                      <option value="modern-matte-white">{isRTL ? "أكريليك أبيض مطفي" : "Matte White Acrylic"}</option>
                      <option value="modern-sage-green">{isRTL ? "بولي لاك أخضر سيج" : "Sage Green Poly-lac"}</option>
                      <option value="modern-navy-blue">{isRTL ? "بولي لاك أزرق داكن" : "Matte Navy Blue"}</option>
                      <option value="modern-forest-green">{isRTL ? "أكريليك أخضر غابات" : "Forest Green Satin"}</option>
                      <option value="modern-charcoal">{isRTL ? "أكريليك فحم داكن" : "Luxury Charcoal Black"}</option>
                      <option value="classic-oak">{isRTL ? "خشب قرو طبيعي (أوك)" : "Natural Oak Wood"}</option>
                      <option value="classic-walnut">{isRTL ? "خشب جوز فاخر (والنت)" : "Classic Walnut Wood"}</option>
                    </select>
                  </div>

                  {/* Countertop Stone */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-2">{isRTL ? "خامة سطح الرخام" : "Countertop Stone"}</label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {[
                        { key: "white-marble" as CountertopStone, l: isRTL ? "رخام أبيض" : "Carrara Marble" },
                        { key: "calacatta-gold" as CountertopStone, l: isRTL ? "كالكاتا ذهبي" : "Calacatta Gold" },
                        { key: "black-granite" as CountertopStone, l: isRTL ? "جرانيت أسود" : "Black Granite" },
                        { key: "grey-quartz" as CountertopStone, l: isRTL ? "كوارتز رمادي" : "Grey Quartz" },
                        { key: "concrete-grey" as CountertopStone, l: isRTL ? "خرسانة ناعمة" : "Concrete Grey" },
                      ].map((item) => (
                        <button
                          key={item.key}
                          onClick={() => setActiveStone(item.key)}
                          className={`py-1.5 rounded-lg border text-[10px] font-bold transition-all cursor-pointer ${
                            activeStone === item.key ? "border-pink-600 bg-pink-50/20 text-pink-600" : "border-slate-100 hover:border-slate-200"
                          }`}
                        >
                          {item.l}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Floor style selection */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-2">{isRTL ? "نوع أرضية المطبخ 3D" : "3D Kitchen Floor Style"}</label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {[
                        { key: "parquet-oak" as FloorMaterial, l: isRTL ? "باركيه أوك" : "Oak Parquet" },
                        { key: "marble-tiles" as FloorMaterial, l: isRTL ? "بورسلين" : "Ceramic Tile" },
                        { key: "concrete-grey" as FloorMaterial, l: isRTL ? "خرساني" : "Grey Solid" },
                      ].map((item) => (
                        <button
                          key={item.key}
                          onClick={() => setFloorType(item.key)}
                          className={`py-1.5 rounded-lg border text-[9px] font-bold transition-all cursor-pointer ${
                            floorType === item.key ? "border-pink-600 bg-pink-50/20 text-pink-600" : "border-slate-100 hover:border-slate-200"
                          }`}
                        >
                          {item.l}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Wall background style selection */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-2">{isRTL ? "خامة حائط الخلفية" : "3D Wall Background Theme"}</label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {[
                        { key: "off-white" as WallMaterial, l: isRTL ? "سادة" : "Off-white" },
                        { key: "exposed-brick" as WallMaterial, l: isRTL ? "طوب أحمر" : "Brick Wall" },
                        { key: "dark-charcoal" as WallMaterial, l: isRTL ? "رمادي داكن" : "Dark Wall" },
                      ].map((item) => (
                        <button
                          key={item.key}
                          onClick={() => setWallType(item.key)}
                          className={`py-1.5 rounded-lg border text-[9px] font-bold transition-all cursor-pointer ${
                            wallType === item.key ? "border-pink-600 bg-pink-50/20 text-pink-600" : "border-slate-100 hover:border-slate-200"
                          }`}
                        >
                          {item.l}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Integrated Appliance toggles */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-2">{isRTL ? "تضمين أجهزة المطبخ" : "Integrate Kitchen Appliances"}</label>
                    <div className="space-y-2 text-xs">
                      {[
                        { label: isRTL ? "ثلاجة ستانلس ستيل" : "Stainless Refrigerator", val: hasFridge, set: setHasFridge },
                        { label: isRTL ? "برج الفرن المدمج" : "Integrated Oven Tower", val: hasOvenTower, set: setHasOvenTower },
                        { label: isRTL ? "حوض مدمج مع صنبور" : "Built-in Sink & Faucet", val: hasSink, set: setHasSink },
                      ].map((item, idx) => (
                        <label key={idx} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={item.val}
                            onChange={(e) => item.set(e.target.checked)}
                            className="w-3.5 h-3.5 accent-pink-600 cursor-pointer"
                          />
                          <span className="text-slate-700 font-medium">{item.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* LED Settings */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">{isRTL ? "إضاءة LED أسفل الخزائن" : "Under-Cabinet LED Light"}</span>
                    <input
                      type="checkbox"
                      checked={isLedActive}
                      onChange={(e) => setIsLedActive(e.target.checked)}
                      className="w-4 h-4 accent-pink-600 cursor-pointer"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* ── Right Column: 3D Visualizer & Results ── */}
            <div className="xl:col-span-8 flex flex-col gap-6">

              {/* 3D Scene WebGL Container Panel */}
              <div
                ref={containerRef}
                className="relative min-h-[380px] sm:min-h-[480px] rounded-2xl overflow-hidden border border-slate-200 shadow-lg bg-slate-100 flex flex-col justify-between items-stretch print:hidden"
              >
                <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-0 block cursor-grab active:cursor-grabbing" />
                
                <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-center pointer-events-none">
                  <div className="bg-slate-900/85 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/10 text-white text-[11px] font-semibold flex items-center gap-2">
                    <Info size={14} className="text-pink-500" />
                    <span>{selectedLayout ? (isRTL ? selectedLayout.nameAr : selectedLayout.name) : "TSM Kitchens 3D"}</span>
                  </div>
                  
                  <div className="flex gap-2 pointer-events-auto">
                    <button
                      onClick={handlePrint}
                      className="p-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 shadow-md cursor-pointer transition-colors"
                      title={isRTL ? "طباعة المخطط PDF" : "Print PDF Spec Sheet"}
                    >
                      <Printer size={16} />
                    </button>
                  </div>
                </div>

                <div className="absolute bottom-4 left-4 right-4 z-10 bg-slate-950/85 backdrop-blur-md px-4 py-3 rounded-xl border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-white">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-400 block">{isRTL ? "ساعة محاكاة الشمس:" : "Sun Light Simulation:"}</span>
                    <span className="text-xs font-bold text-pink-500">
                      {Math.floor(timeOfDay)}:00 {timeOfDay >= 12 ? (isRTL ? "مساءً" : "PM") : (isRTL ? "صباحاً" : "AM")}
                    </span>
                  </div>
                  <input
                    type="range" min="6.0" max="21.0" step="1.0"
                    value={timeOfDay}
                    onChange={(e) => setTimeOfDay(parseFloat(e.target.value))}
                    className="w-full sm:w-48 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-pink-500"
                  />
                </div>
              </div>

              {step >= 3 && (
                <div className="flex flex-col gap-6 print:block">
                  
                  {/* Dynamic Color & Design Advice Card based on dimensions */}
                  <div className="bg-gradient-to-r from-pink-50 to-rose-50 border-l-4 border-pink-500 p-4 rounded-xl flex items-start gap-3 print:hidden">
                    <Sparkles className="w-5 h-5 text-pink-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-extrabold text-pink-800 uppercase tracking-wider mb-1">
                        {isRTL ? "توصية مصممي TSM للتنفيذ" : "Marwa Tawfik Design Advice"}
                      </h4>
                      <p className="text-xs text-slate-700 leading-relaxed font-medium">
                        {roomArea < 10 ? (
                          isRTL
                            ? `مساحة مطبخك (${roomArea.toFixed(1)} م²) صغيرة نسبياً. نوصيك باختيار خامات أكريليك لامعة (أبيض أو رمادي فاتح) لتعكس الضوء وتزيد اتساع المكان، مع إضاءة LED دافئة.`
                            : `Your kitchen area (${roomArea.toFixed(1)} sqm) is compact. We recommend High-Gloss White Acrylic cabinet finishes combined with under-cabinet LEDs to reflect light and maximize the feeling of space.`
                        ) : (
                          isRTL
                            ? `مساحتك (${roomArea.toFixed(1)} م²) واسعة وممتازة. ننصحك باختيار ألوان دافئة وراقية مثل أخضر الغابات أو خشب الجوز الداكن، مع دمج جزيرة وسطية فاخرة أو خزائن أجهزة طويلة.`
                            : `Your space (${roomArea.toFixed(1)} sqm) is spacious! We recommend using Walnut Wood or Matte Forest Green cabinets combined with a luxury central Island block and tall appliance cabinet towers.`
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="hidden print:block space-y-6">
                    <div className="grid grid-cols-2 gap-4 font-sans">
                      <div className="border border-slate-200 p-4 rounded-xl h-48 flex items-center justify-center bg-slate-50">
                        {selectedLayout && <LayoutDiagram layoutId={selectedLayout.id} shape={selectedShape!} />}
                      </div>
                      
                      <div className="border border-slate-200 rounded-xl h-48 overflow-hidden bg-slate-100 relative">
                        {printSnapshotUrl ? (
                          <img src={printSnapshotUrl} alt="3D Kitchen design render" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">3D Viewport Snapshot</div>
                        )}
                      </div>
                    </div>

                    <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                      <table className="w-full text-left rtl:text-right border-collapse">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200">
                            <th className="p-3 font-extrabold text-slate-700">{isRTL ? "البيان فني" : "Specification Key"}</th>
                            <th className="p-3 font-extrabold text-slate-700">{isRTL ? "التفاصيل والمقاسات" : "Detail Value"}</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-slate-200">
                            <td className="p-3 font-bold text-slate-500">{isRTL ? "نوع المخطط" : "Layout Template"}</td>
                            <td className="p-3 text-slate-800">{selectedLayout ? (isRTL ? selectedLayout.nameAr : selectedLayout.name) : ""}</td>
                          </tr>
                          <tr className="border-b border-slate-200">
                            <td className="p-3 font-bold text-slate-500">{isRTL ? "أبعاد الغرفة" : "Dimensions Width × Depth"}</td>
                            <td className="p-3 text-slate-800">{width} × {depth} {isRTL ? "متر" : "meters"} ({wVal * dVal} sqm)</td>
                          </tr>
                          <tr className="border-b border-slate-200">
                            <td className="p-3 font-bold text-slate-500">{isRTL ? "طول الرخام / الكرانيش" : "Est. Countertop Length"}</td>
                            <td className="p-3 text-slate-800">{selectedLayout ? selectedLayout.counterLengthFn(wVal, dVal) : 0} {isRTL ? "متر طولي" : "linear meters"}</td>
                          </tr>
                          <tr className="border-b border-slate-200">
                            <td className="p-3 font-bold text-slate-500">{isRTL ? "عدد وحدات الخزائن التقديري" : "Estimated Cabinet Count"}</td>
                            <td className="p-3 text-slate-800">{selectedLayout ? selectedLayout.cabinetsFn(wVal, dVal) : 0} {isRTL ? "وحدة" : "cabinet modules"}</td>
                          </tr>
                          <tr className="border-b border-slate-200">
                            <td className="p-3 font-bold text-slate-500">{isRTL ? "خامة خشب الخزائن" : "Cabinet Wood & Finish"}</td>
                            <td className="p-3 text-slate-800">{activeFinish}</td>
                          </tr>
                          <tr className="border-b border-slate-200">
                            <td className="p-3 font-bold text-slate-500">{isRTL ? "خامة الرخام" : "Countertop Stone Material"}</td>
                            <td className="p-3 text-slate-800">{activeStone}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="flex items-center justify-between print:hidden">
                    <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-pink-100 text-pink-600 text-xs flex items-center justify-center font-bold">3</span>
                      <span>{rp.step3}</span>
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 print:hidden">
                    {suggestions.map((layout) => {
                      const isSelected = selectedLayout?.id === layout.id;
                      const counterLen = layout.counterLengthFn(wVal, dVal);
                      const cabinetCount = layout.cabinetsFn(wVal, dVal);
                      const triLabel = layout.workTriangle === "good" ? rp.good : layout.workTriangle === "fair" ? rp.fair : rp.poor;
                      const triColor = layout.workTriangle === "good" ? "#10b981" : layout.workTriangle === "fair" ? "#fbbf24" : "#64748b";

                      return (
                        <button
                          key={layout.id}
                          onClick={() => setSelectedLayout(layout)}
                          className={`flex flex-col text-left rtl:text-right rounded-2xl border bg-white overflow-hidden transition-all text-slate-800 cursor-pointer ${
                            isSelected ? "border-pink-600 shadow-[0_0_15px_rgba(236,72,153,0.15)]" : "border-slate-100 hover:border-slate-200"
                          }`}
                        >
                          <div className="bg-slate-50 h-32 p-4 relative border-b border-slate-100">
                            <LayoutDiagram layoutId={layout.id} shape={selectedShape!} />
                          </div>

                          <div className="p-4 flex-1 flex flex-col gap-3">
                            <div className="flex items-start justify-between gap-2">
                              <h3 className="text-xs font-bold text-slate-900 leading-snug">
                                {isRTL ? layout.nameAr : layout.name}
                              </h3>
                              <EfficiencyBadge pct={layout.efficiencyPct} />
                            </div>

                            <p className="text-[10px] text-slate-500 leading-relaxed line-clamp-2">
                              {isRTL ? layout.descriptionAr : layout.description}
                            </p>

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
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {selectedLayout && (
                    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm animate-fade-in-up print:hidden">
                      <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-200/60 flex items-center justify-between">
                        <h3 className="font-bold text-slate-800 text-sm">
                          {isRTL ? "المخطط المختار: " : "Selected Layout: "}
                          <span className="text-pink-600">{isRTL ? selectedLayout.nameAr : selectedLayout.name}</span>
                        </h3>
                        <span className="text-[10px] text-slate-400 font-bold">
                          {isRTL ? "مطابخ مروة توفيق" : "TSM Kitchen Designs"}
                        </span>
                      </div>

                      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
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

                        <div className="flex flex-col gap-3">
                          <button
                            onClick={handleWhatsAppQuote}
                            className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs shadow-md hover:shadow-[0_0_12px_rgba(236,72,153,0.35)] transition-all cursor-pointer"
                          >
                            <MessageSquare className="w-4 h-4" />
                            <span>{rp.whatsappBtn}</span>
                          </button>

                          <Link
                            href={`/${lang}#contact`}
                            className="inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition-all"
                          >
                            <Calendar className="w-4 h-4" />
                            <span>{rp.bookConsultationBtn}</span>
                            <ArrowRight className={`w-3.5 h-3.5 ${isRTL ? "rotate-180" : ""}`} />
                          </Link>

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

// ── Room Shape SVG Diagrams ───────────────────────────────────────────────
function LayoutDiagram({ layoutId, shape }: { layoutId: string; shape: RoomShape }) {
  const S = 96;
  const roomPaths: Record<RoomShape, string> = {
    rectangle: `M2,2 L${S-2},2 L${S-2},${S-2} L2,${S-2} Z`,
    lShape:    `M2,2 L${S-2},2 L${S-2},${S/2} L${S/2},${S/2} L${S/2},${S-2} L2,${S-2} Z`,
    uShape:    `M2,2 L${S-2},2 L${S-2},${S-2} L${S*0.65},${S-2} L${S*0.65},${S*0.45} L${S*0.35},${S*0.45} L${S*0.35},${S-2} L2,${S-2} Z`,
    galley:    `M2,2 L${S-2},2 L${S-2},${S-2} L2,${S-2} Z`,
    island:    `M2,2 L${S-2},2 L${S-2},${S-2} L2,${S-2} Z`,
    gShape:    `M2,2 L${S-2},2 L${S-2},${S-2} L${S*0.45},${S-2} L${S*0.45},${S*0.65} L${S*0.65},${S*0.65} L${S*0.65},${S*0.35} L${S-2},${S*0.35}`,
    custom:    `M2,2 L${S-2},2 L${S-2},${S-2} L2,${S-2} Z`,
  };

  const cabinetBlocks: React.ReactNode[] = [];
  const cab = (x: number, y: number, w: number, h: number, key: string) => (
    <rect key={key} x={x} y={y} width={w} height={h} rx="2" fill="#db2777" opacity="0.8" />
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
    <svg viewBox={`0 0 ${S} ${S}`} className="w-24 h-24 sm:w-28 sm:h-28 mx-auto" xmlns="http://www.w3.org/2000/svg">
      <path d={roomPaths[shape]} fill="#f8fafc" stroke="#db2777" strokeWidth="1.5" />
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
      <path d={path} fill={selected ? "rgba(236,72,153,0.1)" : "rgba(148,163,184,0.04)"} stroke={selected ? "#db2777" : "rgba(148,163,184,0.25)"} strokeWidth={selected ? "2" : "1.5"}/>
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
      <div className="absolute inset-0 flex items-center justify-center font-sans">
        <span className="text-[10px] font-bold" style={{color}}>{pct}%</span>
      </div>
    </div>
  );
}
