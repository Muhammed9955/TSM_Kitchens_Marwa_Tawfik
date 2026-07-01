"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, PhoneCall } from "lucide-react";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/locales/LanguageContext";

const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { lang, dict } = useLanguage();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const basePath = lang === "ar" ? "" : "/en";
  const navLinks = [
    { href: `${basePath}/`, label: dict.nav.home },
    { href: `${basePath}/#about`, label: dict.nav.about },
    { href: `${basePath}/#services`, label: dict.nav.services },
    { href: `${basePath}/projects`, label: dict.nav.projects },
    { href: `${basePath}/gallery`, label: dict.nav.gallery },
    { href: `${basePath}/room-planner`, label: lang === "ar" ? "مخطط المطبخ" : "Room Planner" },
    { href: `${basePath}/#quotation`, label: lang === "ar" ? "طلب عرض سعر" : "Get Quote" },
    { href: `${basePath}/#contact`, label: dict.nav.contact },
  ];

  const otherLang = lang === "ar" ? "en" : "ar";
  
  const getTogglePath = () => {
    if (lang === "ar") {
      if (pathname === "/") return "/en";
      return `/en${pathname}`;
    } else {
      const arPath = pathname.replace(/^\/en/, "");
      return arPath || "/";
    }
  };
  const langTogglePath = getTogglePath();

  // WhatsApp click action
  const handleWhatsApp = () => {
    window.open("https://wa.me/201113561777", "_blank");
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-100 shadow-xs transition-all duration-300 h-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand Name */}
          <div className="flex items-center gap-3">
            <Link href={lang === "ar" ? "/" : "/en"} className="flex items-center gap-2 group">
              <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-slate-100 bg-white p-0.5 group-hover:border-pink-500 transition-colors shadow-xs">
                <Image
                  src="/images/logo.jpg"
                  alt="TSM Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div className="flex flex-col select-none">
                <span className="text-xl font-bold tracking-tight transition-colors group-hover:text-pink-500 text-slate-900">
                  {dict.nav.brand}
                </span>
                <span className="text-[10px] -mt-1 transition-colors group-hover:text-pink-400 text-slate-500">
                  {dict.nav.subtitle}
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-6">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium transition-colors duration-200 text-slate-700 hover:text-pink-600"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </nav>

          {/* Action Buttons & Socials */}
          <div className="hidden md:flex items-center gap-4">
            {/* Social Icons */}
            <div className="flex items-center gap-3 mr-2">
              <a
                href="https://www.facebook.com/TSMKITCHENS"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors duration-200 text-slate-500 hover:text-pink-600"
                aria-label="Facebook"
              >
                <FacebookIcon className="w-[18px] h-[18px]" />
              </a>
              <a
                href="https://www.instagram.com/trust.marwa/"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors duration-200 text-slate-500 hover:text-pink-600"
                aria-label="Instagram"
              >
                <InstagramIcon className="w-[18px] h-[18px]" />
              </a>
            </div>

            {/* Language Switcher */}
            <Link
              href={langTogglePath}
              className="text-xs font-semibold px-3 py-1.5 rounded-full border transition-all duration-200 border-slate-200 text-slate-700 hover:border-pink-600 hover:text-pink-600"
            >
              {dict.nav.langToggle}
            </Link>

            {/* CTA WhatsApp Button */}
            <button
              onClick={handleWhatsApp}
              className="relative group overflow-hidden bg-pink-600 hover:bg-pink-700 text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-md flex items-center gap-2 transition-all duration-300 hover:shadow-[0_0_15px_rgba(236,72,153,0.5)] cursor-pointer"
            >
              <PhoneCall size={16} />
              <span>{dict.nav.whatsappBtn}</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-3">
            <Link
              href={langTogglePath}
              className="text-xs font-semibold px-2.5 py-1 rounded-full border transition-all duration-200 border-slate-200 text-slate-700"
            >
              {dict.nav.langToggle}
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="transition-colors p-2 text-slate-700 hover:text-pink-600"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-xs z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Drawer Menu */}
      <div
        className={`fixed top-0 bottom-0 z-50 w-72 max-w-[80vw] bg-white border-zinc-150 p-6 flex flex-col justify-between shadow-2xl transition-all duration-300 md:hidden ${
          mobileMenuOpen
            ? lang === "ar"
              ? "right-0 border-l"
              : "left-0 border-r"
            : lang === "ar"
            ? "-right-full"
            : "-left-full"
        }`}
      >
        <div>
          {/* Close Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-slate-900">{dict.nav.brand}</span>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="text-slate-500 hover:text-pink-600"
            >
              <X size={20} />
            </button>
          </div>

          {/* Links */}
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-medium text-slate-800 hover:text-pink-600 py-2 border-b border-slate-100 block transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Footer info in Drawer */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col gap-5">
          <div className="flex items-center gap-4 justify-center">
            <a
              href="https://www.facebook.com/TSMKITCHENS"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-pink-600 p-2.5 bg-slate-50 border border-slate-100 rounded-full"
            >
              <FacebookIcon className="w-[18px] h-[18px]" />
            </a>
            <a
              href="https://www.instagram.com/trust.marwa/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-pink-600 p-2.5 bg-slate-50 border border-slate-100 rounded-full"
            >
              <InstagramIcon className="w-[18px] h-[18px]" />
            </a>
          </div>

          <button
            onClick={() => {
              handleWhatsApp();
              setMobileMenuOpen(false);
            }}
            className="w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 rounded-full flex items-center justify-center gap-2 shadow-lg cursor-pointer"
          >
            <PhoneCall size={16} />
            <span>{dict.nav.whatsappBtn}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
