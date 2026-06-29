"use client";

import { Locale } from "@/locales/dictionaries";

interface FloatingSocialsProps {
  lang: Locale;
}

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M12.012 2c-5.506 0-9.988 4.482-9.988 9.988 0 1.761.459 3.475 1.332 4.988L2 22l5.224-1.371a9.92 9.92 0 004.788 1.233H12c5.506 0 9.988-4.482 9.988-9.988C22 6.482 17.518 2 12.012 2zm0 18.294h-.007a8.21 8.21 0 01-4.17-1.129l-.299-.178-3.098.813.827-3.021-.196-.312a8.219 8.219 0 01-1.258-4.39A8.272 8.272 0 0112.012 3.71c4.566 0 8.277 3.71 8.277 8.276 0 4.567-3.71 8.308-8.277 8.308zM16.52 13.91c-.247-.123-1.463-.722-1.692-.804-.229-.082-.395-.123-.562.123-.166.247-.645.804-.79 0-.146-.165-.292-.288-.583-.452-.292-.164-.583-.37-.876-.617-.293-.247-.49-.554-.567-.68a.862.862 0 01-.144-.39c-.04-.15-.015-.285.045-.407.062-.123.167-.247.25-.33.083-.082.125-.164.188-.247.062-.083.083-.164.041-.287-.041-.124-.395-.951-.541-1.303-.146-.352-.292-.303-.395-.303-.105 0-.229-.021-.354-.021-.125 0-.333.041-.5.226-.167.185-.646.63-.646 1.539 0 .91.666 1.787.75 1.91.083.123 1.312 2.003 3.176 2.808 1.865.805 1.865.537 2.203.504.338-.033 1.463-.598 1.67-1.176.208-.578.208-1.073.146-1.176-.063-.103-.23-.185-.477-.308z" />
      </svg>
);

export default function FloatingSocials({ lang }: FloatingSocialsProps) {
  const whatsappMessage =
    lang === "ar"
      ? "مرحباً TSM Kitchens، أريد الاستفسار عن تصاميم المطابخ والمعاينة."
      : "Hello TSM Kitchens, I'd like to inquire about kitchen designs and booking a consultation.";
  const whatsappUrl = `https://wa.me/201113561777?text=${encodeURIComponent(whatsappMessage)}`;
  const instagramUrl = "https://www.instagram.com/trust.marwa/";

  return (
    <div
      className={`fixed bottom-6 z-40 flex flex-col gap-4 select-none ${
        lang === "ar" ? "left-6" : "right-6"
      }`}
    >
      {/* Instagram Button */}
      <a
        href={instagramUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="relative flex items-center justify-center bg-gradient-to-tr from-amber-500 via-pink-600 to-purple-600 text-white rounded-full p-3.5 shadow-2xl transition-all duration-300 hover:scale-110 cursor-pointer hover:shadow-[0_0_20px_rgba(219,39,119,0.5)] group"
        aria-label="Instagram Page"
      >
        <span className="absolute -inset-1 rounded-full bg-pink-500/20 animate-ping group-hover:animate-none pointer-events-none" />
        <InstagramIcon className="w-[26px] h-[26px]" />
      </a>

      {/* WhatsApp Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="relative flex items-center justify-center bg-emerald-500 hover:bg-emerald-600 text-white rounded-full p-3.5 shadow-2xl transition-all duration-300 hover:scale-110 cursor-pointer hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] group"
        aria-label="Chat on WhatsApp"
      >
        <span className="absolute -inset-1 rounded-full bg-emerald-500/20 animate-ping group-hover:animate-none pointer-events-none" />
        <WhatsAppIcon className="w-[26px] h-[26px]" />
      </a>
    </div>
  );
}
