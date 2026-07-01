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
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────
type RoomShape = "rectangle" | "lShape" | "uShape" | "galley" | "island" | "gShape" | "custom";
type CabinetFinish = "modern-gloss-grey" | "modern-matte-white" | "modern-sage-green" | "classic-oak" | "classic-walnut";
type CountertopStone = "white-marble" | "black-granite" | "grey-quartz";
type HandleStyle = "modern-chrome" | "classic-gold" | "handleless";
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
function createMarbleTexture(): THREE.Texture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d")!;
  const grad = ctx.createLinearGradient(0, 0, 512, 512);
  grad.addColorStop(0, "#ffffff");
  grad.addColorStop(1, "#f1f5f9");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);
  
  ctx.strokeStyle = "rgba(100, 116, 139, 0.15)";
  ctx.lineWidth = 1.5;
  for (let i = 0; i < 5; i++) {
    ctx.beginPath();
    ctx.moveTo(Math.random() * 512, 0);
    ctx.lineTo(Math.random() * 512, 512);
    ctx.stroke();
  }
  return new THREE.CanvasTexture(canvas);
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
  const [isLedActive, setIsLedActive] = useState(true);
  const [ledColor, setLedColor] = useState("#fff4e0");
  const [timeOfDay, setTimeOfDay] = useState<number>(12.0); // 6.0 to 22.0

  // ── WebGL References ─────────────────────────────────────────────────────
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [printSnapshotUrl, setPrintSnapshotUrl] = useState<string | null>(null);

  // Refs for scene loops (avoiding react state delay inside render animations)
  const activeLayoutRef = useRef<LayoutSuggestion | null>(null);
  const activeFinishRef = useRef<CabinetFinish>(activeFinish);
  const activeStoneRef = useRef<CountertopStone>(activeStone);
  const activeHandleRef = useRef<HandleStyle>(activeHandle);
  const isLedActiveRef = useRef<boolean>(isLedActive);
  const ledColorRef = useRef<string>(ledColor);
  const timeOfDayRef = useRef<number>(timeOfDay);

  useEffect(() => { activeLayoutRef.current = selectedLayout; }, [selectedLayout]);
  useEffect(() => { activeFinishRef.current = activeFinish; }, [activeFinish]);
  useEffect(() => { activeStoneRef.current = activeStone; }, [activeStone]);
  useEffect(() => { activeHandleRef.current = activeHandle; }, [activeHandle]);
  useEffect(() => { isLedActiveRef.current = isLedActive; }, [isLedActive]);
  useEffect(() => { ledColorRef.current = ledColor; }, [ledColor]);
  useEffect(() => { timeOfDayRef.current = timeOfDay; }, [timeOfDay]);

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

    const bboxArea = (wM * 30) * (hM * 30); // scale back to pixels
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
    // Snap to nearest 15px grid intersection
    const snap = 15;
    return {
      x: Math.round(x / snap) * snap,
      y: Math.round(y / snap) * snap,
    };
  };

  const handleCanvasClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (isDrawingClosed) return;
    const pt = getCanvasCoords(e);
    
    // Check if clicking close to the starting point to close the path
    if (drawingPoints.length >= 3) {
      const start = drawingPoints[0];
      const dist = Math.hypot(pt.x - start.x, pt.y - start.y);
      if (dist < 20) {
        setIsDrawingClosed(true);
        // Calculate bounding dimensions
        const xs = drawingPoints.map((p) => p.x);
        const ys = drawingPoints.map((p) => p.y);
        const minX = Math.min(...xs);
        const maxX = Math.max(...xs);
        const minY = Math.min(...ys);
        const maxY = Math.max(...ys);
        
        // Scale: 30px = 1 meter
        const calculatedWidth = +((maxX - minX) / 30).toFixed(1);
        const calculatedDepth = +((maxY - minY) / 30).toFixed(1);
        
        const wVal = Math.max(1.5, Math.min(12, calculatedWidth));
        const dVal = Math.max(1.5, Math.min(12, calculatedDepth));
        
        setWidth(wVal.toString());
        setDepth(dVal.toString());

        // Classify shape dynamically
        const detectedShape = classifyPolygonShape(drawingPoints, wVal, dVal);
        setSelectedShape(detectedShape);

        // Auto generate layout suggestions and load 3D visualizer
        const results = getLayoutsForShape(detectedShape, wVal, dVal);
        setSuggestions(results);
        setSelectedLayout(results[0]);
        setStep(3);
        return;
      }
    }
    setDrawingPoints((prev) => [...prev, pt]);
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

    const floorMat = new THREE.MeshStandardMaterial({ color: "#f1f5f9", roughness: 0.9 });
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(8, 8), floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -1.2;
    floor.receiveShadow = true;
    roomGroup.add(floor);

    const wallMat = new THREE.MeshStandardMaterial({ color: "#f8fafc", roughness: 0.9 });
    const wallBack = new THREE.Mesh(new THREE.PlaneGeometry(8, 3), wallMat);
    wallBack.position.set(0, 0.3, -4);
    wallBack.receiveShadow = true;
    roomGroup.add(wallBack);

    const ambientLight = new THREE.AmbientLight("#f8fafc", 0.9);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight("#fffaf0", 2.2);
    sunLight.position.set(-3.5, 3.5, 2);
    sunLight.castShadow = true;
    sunLight.shadow.bias = -0.0015;
    scene.add(sunLight);

    const spotLight = new THREE.SpotLight("#ffffff", 4);
    spotLight.position.set(0, 2.5, 0);
    spotLight.angle = Math.PI / 3;
    spotLight.castShadow = true;
    scene.add(spotLight);

    const ledLight = new THREE.PointLight("#fff4e0", 0, 5);
    ledLight.position.set(0, 0.35, -3.95);
    scene.add(ledLight);

    const chromeMat = new THREE.MeshStandardMaterial({ color: "#cccccc", metalness: 0.9, roughness: 0.1 });
    const handleGoldMat = new THREE.MeshStandardMaterial({ color: "#d4af37", metalness: 0.95, roughness: 0.15 });
    const blackGlassMat = new THREE.MeshStandardMaterial({ color: "#111111", roughness: 0.05, metalness: 0.9 });

    const cabinetMaterials = {
      "modern-gloss-grey": new THREE.MeshStandardMaterial({ color: "#475569", roughness: 0.05, metalness: 0.1 }),
      "modern-matte-white": new THREE.MeshStandardMaterial({ color: "#ffffff", roughness: 0.85, metalness: 0.05 }),
      "modern-sage-green": new THREE.MeshStandardMaterial({ color: "#607264", roughness: 0.7, metalness: 0.05 }),
      "classic-oak": new THREE.MeshStandardMaterial({ roughness: 0.5, metalness: 0.1 }),
      "classic-walnut": new THREE.MeshStandardMaterial({ roughness: 0.4, metalness: 0.1 }),
    };

    const oakTex = createWoodTexture("#cfa771", "#7e623d");
    const walnutTex = createWoodTexture("#7a5933", "#3f2d1e");
    cabinetMaterials["classic-oak"].map = oakTex;
    cabinetMaterials["classic-walnut"].map = walnutTex;

    const stoneMaterials = {
      "white-marble": new THREE.MeshStandardMaterial({ roughness: 0.1, metalness: 0.1 }),
      "black-granite": new THREE.MeshStandardMaterial({ color: "#1a1a1a", roughness: 0.12, metalness: 0.15 }),
      "grey-quartz": new THREE.MeshStandardMaterial({ color: "#64748b", roughness: 0.22, metalness: 0.05 }),
    };
    const marbleTex = createMarbleTexture();
    stoneMaterials["white-marble"].map = marbleTex;

    const cabinetGroup = new THREE.Group();
    roomGroup.add(cabinetGroup);

    const buildCabinetModule = (x: number, y: number, z: number, isUpper = false) => {
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

      const body = new THREE.Mesh(new THREE.BoxGeometry(widthMod - 0.01, heightMod, depthMod), cabMat);
      body.castShadow = true;
      body.receiveShadow = true;
      meshGroup.add(body);

      if (handleKey !== "handleless") {
        const handleMat = handleKey === "classic-gold" ? handleGoldMat : chromeMat;
        const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.15), handleMat);
        handle.rotation.z = Math.PI / 2;
        handle.position.set(0, isUpper ? -0.25 : 0.3, depthMod / 2 + 0.01);
        meshGroup.add(handle);
      }

      if (!isUpper) {
        const slab = new THREE.Mesh(new THREE.BoxGeometry(widthMod, 0.04, depthMod + 0.02), counterMat);
        slab.position.y = heightMod / 2 + 0.02;
        slab.castShadow = true;
        slab.receiveShadow = true;
        meshGroup.add(slab);
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

      if (id === "single-wall") {
        for (let x = -1.8; x <= 1.8; x += 0.6) {
          buildCabinetModule(x, -0.77, -3.6, false);
          buildCabinetModule(x, 0.45, -3.6, true);
        }
      } else if (id === "galley") {
        for (let x = -1.8; x <= 1.8; x += 0.6) {
          buildCabinetModule(x, -0.77, -3.6, false);
          buildCabinetModule(x, -0.77, -1.6, false);
        }
      } else if (id === "l-shape") {
        for (let x = -1.8; x <= 1.8; x += 0.6) {
          buildCabinetModule(x, -0.77, -3.6, false);
          buildCabinetModule(x, 0.45, -3.6, true);
        }
        for (let z = -3.0; z <= -1.2; z += 0.6) {
          buildCabinetModule(1.8, -0.77, z, false);
        }
      } else if (id === "u-shape") {
        for (let x = -1.8; x <= 1.8; x += 0.6) {
          buildCabinetModule(x, -0.77, -3.6, false);
          buildCabinetModule(x, 0.45, -3.6, true);
        }
        for (let z = -3.0; z <= -1.2; z += 0.6) {
          buildCabinetModule(-1.8, -0.77, z, false);
        }
        for (let z = -3.0; z <= -1.2; z += 0.6) {
          buildCabinetModule(1.8, -0.77, z, false);
        }
      } else if (id === "island") {
        for (let x = -1.8; x <= 1.8; x += 0.6) {
          buildCabinetModule(x, -0.77, -3.6, false);
          buildCabinetModule(x, 0.45, -3.6, true);
        }
        for (let x = -0.6; x <= 0.6; x += 0.6) {
          buildCabinetModule(x, -0.77, -1.8, false);
        }
      } else if (id === "g-shape") {
        for (let x = -1.8; x <= 1.8; x += 0.6) {
          buildCabinetModule(x, -0.77, -3.6, false);
        }
        for (let z = -3.0; z <= -1.2; z += 0.6) {
          buildCabinetModule(-1.8, -0.77, z, false);
        }
        for (let z = -3.0; z <= -1.2; z += 0.6) {
          buildCabinetModule(1.8, -0.77, z, false);
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

      camera.position.x = Math.sin(elapsed * 0.1) * 3.8;
      camera.position.z = Math.cos(elapsed * 0.1) * 3.8 + 1;
      camera.lookAt(0, -0.2, -2.6);

      const ledActive = isLedActiveRef.current;
      ledLight.intensity = ledActive ? 3.5 : 0;
      ledLight.color.set(ledColorRef.current);

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
      floorMat.dispose();
      wallMat.dispose();
      chromeMat.dispose();
      handleGoldMat.dispose();
      blackGlassMat.dispose();
      oakTex.dispose();
      walnutTex.dispose();
      marbleTex.dispose();
      Object.values(cabinetMaterials).forEach((m) => m.dispose());
      Object.values(stoneMaterials).forEach((m) => m.dispose());
      renderer.dispose();
    };
  }, [width, depth]);

  const wVal = parseFloat(width) || 4;
  const dVal = parseFloat(depth) || 3.5;

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

            {/* ── Left Column: Controls (Span 4) ── */}
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

              {/* Freehand Interactive Drawing Canvas (rendered only when custom shape is active) */}
              {selectedShape === "custom" && (
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-bold text-slate-800">{isRTL ? "لوحة الرسم الحر 2D" : "2D Sketching Board"}</h3>
                    <div className="flex gap-2">
                      <button onClick={handleUndo} className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-500 cursor-pointer" title="Undo">
                        <Undo2 size={14} />
                      </button>
                      <button onClick={handleClearDrawing} className="p-1.5 rounded-lg border border-slate-200 hover:bg-red-50 hover:text-red-500 text-slate-500 cursor-pointer" title="Clear">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  
                  {/* SVG Drawing Grid */}
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
                      ? "انقر على الشبكة لرسم زوايا المطبخ، انقر على النقطة الخضراء الأولى للإغلاق." 
                      : "Click on grid to add wall points. Click green start dot to close shape."}
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
                  
                  {/* Cabinet door styles */}
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
                      <option value="classic-oak">{isRTL ? "خشب قرو طبيعي (أوك)" : "Natural Oak Wood"}</option>
                      <option value="classic-walnut">{isRTL ? "خشب جوز فاخر (والنت)" : "Classic Walnut Wood"}</option>
                    </select>
                  </div>

                  {/* Countertop Stone */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-2">{isRTL ? "خامة سطح الرخام" : "Countertop Stone"}</label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {[
                        { key: "white-marble" as CountertopStone, l: isRTL ? "رخام أبيض" : "Marble" },
                        { key: "black-granite" as CountertopStone, l: isRTL ? "جرانيت أسود" : "Granite" },
                        { key: "grey-quartz" as CountertopStone, l: isRTL ? "كوارتز" : "Quartz" },
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

                  {/* Cabinet Handle styles */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-2">{isRTL ? "شكل ولون المقابض" : "Handles Style"}</label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {[
                        { key: "modern-chrome" as HandleStyle, l: isRTL ? "كروم فضي" : "Chrome" },
                        { key: "classic-gold" as HandleStyle, l: isRTL ? "ذهبي كلاسيك" : "Gold" },
                        { key: "handleless" as HandleStyle, l: isRTL ? "بدون مقبض" : "Handless" },
                      ].map((item) => (
                        <button
                          key={item.key}
                          onClick={() => setActiveHandle(item.key)}
                          className={`py-1.5 rounded-lg border text-[10px] font-bold transition-all cursor-pointer ${
                            activeHandle === item.key ? "border-pink-600 bg-pink-50/20 text-pink-600" : "border-slate-100 hover:border-slate-200"
                          }`}
                        >
                          {item.l}
                        </button>
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

            {/* ── Right Column: 3D Visualizer & Results (Span 8) ── */}
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
                    className="w-full sm:w-48 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-pink-505"
                  />
                </div>
              </div>

              {step >= 3 && (
                <div className="flex flex-col gap-6 print:block">
                  
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
