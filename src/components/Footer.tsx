"use client";

import Image from "next/image";
import Link from "next/link";
import { Phone } from "lucide-react";
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

export default function Footer() {
  const { lang, dict } = useLanguage();

  const quickLinks = [
    { href: "#home", label: dict.nav.home },
    { href: "#about", label: dict.nav.about },
    { href: "#services", label: dict.nav.services },
    { href: "#gallery", label: dict.nav.gallery },
    { href: "#contact", label: dict.nav.contact },
  ];

  return (
    <footer className="bg-zinc-950 border-t border-zinc-900 py-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Footer Top Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 pb-8 border-b border-zinc-900">
          {/* Logo & Description block */}
          <div className="md:col-span-6 flex flex-col items-start gap-4">
            <Link href={lang === "ar" ? "/" : "/en"} className="flex items-center gap-2 group">
              <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-zinc-800 bg-white p-0.5 group-hover:border-pink-500 transition-colors">
                <Image
                  src="/images/logo.jpg"
                  alt="TSM Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-tight text-white group-hover:text-pink-500 transition-colors">
                  {dict.nav.brand}
                </span>
                <span className="text-[9px] text-zinc-400 -mt-1">
                  {dict.nav.subtitle}
                </span>
              </div>
            </Link>
            
            <p className="text-zinc-400 text-xs sm:text-sm max-w-sm leading-relaxed mt-2">
              {dict.footer.tagline} {lang === "ar" ? "خبرتنا وتصاميمنا المميزة تجعل من بيتك تحفة فنية تلائم تطلعاتك." : "Our design expertise turns your home into a masterpiece matching your aspirations."}
            </p>
          </div>

          {/* Quick Links block */}
          <div className="md:col-span-3">
            <h4 className="text-white font-semibold text-sm mb-4">
              {lang === "ar" ? "روابط سريعة" : "Quick Links"}
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-zinc-400 hover:text-pink-500 text-xs sm:text-sm transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Socials & Phone block */}
          <div className="md:col-span-3">
            <h4 className="text-white font-semibold text-sm mb-4">
              {lang === "ar" ? "تواصل معنا" : "Contact Us"}
            </h4>
            
            <div className="space-y-4">
              {/* WhatsApp direct phone link */}
              <a
                href="https://wa.me/201113561777"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-zinc-400 hover:text-pink-500 transition-colors text-xs sm:text-sm"
              >
                <Phone size={14} className="text-pink-500" />
                <span>0111 356 1777</span>
              </a>

              {/* Social icons */}
              <div className="flex items-center gap-3 mt-4">
                <a
                  href="https://www.facebook.com/TSMKITCHENS"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 bg-zinc-900 hover:bg-pink-600 border border-zinc-800 text-zinc-400 hover:text-white rounded-lg transition-all"
                  aria-label="Facebook Page"
                >
                  <FacebookIcon className="w-4 h-4" />
                </a>
                <a
                  href="https://www.instagram.com/trust.marwa/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 bg-zinc-900 hover:bg-pink-600 border border-zinc-800 text-zinc-400 hover:text-white rounded-lg transition-all"
                  aria-label="Instagram Page"
                >
                  <InstagramIcon className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom Rights */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-zinc-500 text-xs text-center sm:text-right">
            {dict.footer.rights}
          </p>
          <div className="text-zinc-600 text-[10px]">
            {lang === "ar" ? "تصميم بواسطة TSM Team" : "Designed by TSM Team"}
          </div>
        </div>

      </div>
    </footer>
  );
}
