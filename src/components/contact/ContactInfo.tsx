import { Phone, Mail, MapPin, MessageSquare } from "lucide-react";
import { useLanguage } from "@/locales/LanguageContext";
import { FacebookIcon, InstagramIcon } from "./ContactIcons";

export default function ContactInfo() {
  const { lang, dict } = useLanguage();

  const whatsappMessage =
    lang === "ar"
      ? "مرحباً TSM Kitchens، أريد الاستفسار عن تصاميم المطابخ والمعاينة."
      : "Hello TSM Kitchens, I'd like to inquire about kitchen designs and booking a consultation.";
  const whatsappUrl = `https://wa.me/201113561777?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="lg:col-span-5 flex flex-col justify-between">
      <div>
        <h3 className="text-2xl font-bold text-slate-900 mb-6">
          {dict.contact.infoTitle}
        </h3>

        <div className="space-y-6">
          {/* Address block */}
          <div className="flex gap-4">
            <div className="p-3 bg-white border border-slate-100 rounded-xl h-fit text-pink-500 shadow-xs">
              <MapPin size={22} />
            </div>
            <div>
              <span className="text-slate-400 text-xs uppercase font-bold tracking-wider block">
                {dict.contact.addressLabel}
              </span>
              <span className="text-slate-700 text-sm leading-relaxed block mt-1">
                {dict.contact.addressValue}
              </span>
            </div>
          </div>

          {/* Phone & WhatsApp block */}
          <div className="flex gap-4">
            <div className="p-3 bg-white border border-slate-100 rounded-xl h-fit text-pink-500 shadow-xs">
              <Phone size={22} />
            </div>
            <div>
              <span className="text-slate-400 text-xs uppercase font-bold tracking-wider block">
                {dict.contact.phoneLabel}
              </span>
              <a
                href="tel:+201113561777"
                className="text-slate-800 hover:text-pink-600 font-semibold text-lg block mt-1 transition-colors"
              >
                0111 356 1777
              </a>
            </div>
          </div>

          {/* Email block */}
          <div className="flex gap-4">
            <div className="p-3 bg-white border border-slate-100 rounded-xl h-fit text-pink-500 shadow-xs">
              <Mail size={22} />
            </div>
            <div>
              <span className="text-slate-400 text-xs uppercase font-bold tracking-wider block">
                {lang === "ar" ? "البريد الإلكتروني" : "Email Address"}
              </span>
              <a
                href="mailto:info@tsm.com.eg"
                className="text-slate-700 hover:text-pink-600 text-sm block mt-1 transition-colors"
              >
                info@tsm.com.eg
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Social Icons and WhatsApp Button */}
      <div className="mt-12 space-y-6">
        <div>
          <span className="text-slate-400 text-xs uppercase font-bold tracking-wider block mb-3">
            {dict.contact.socialsLabel}
          </span>
          <div className="flex items-center gap-3">
            <a
              href="https://www.facebook.com/TSMKITCHENS"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-white hover:bg-pink-600 border border-slate-150 text-slate-500 hover:text-white rounded-xl shadow-xs transition-all cursor-pointer"
              aria-label="Facebook Page"
            >
              <FacebookIcon className="w-5 h-5" />
            </a>
            <a
              href="https://www.instagram.com/trust.marwa/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-white hover:bg-pink-600 border border-slate-150 text-slate-500 hover:text-white rounded-xl shadow-xs transition-all cursor-pointer"
              aria-label="Instagram Page"
            >
              <InstagramIcon className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Direct WhatsApp Call to Action */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg transition-all hover:shadow-[0_0_15px_rgba(16,185,129,0.4)] w-full sm:w-auto cursor-pointer"
        >
          <MessageSquare size={20} />
          <span>{lang === "ar" ? "مراسلة فورية عبر واتساب" : "Chat on WhatsApp"}</span>
        </a>
      </div>
    </div>
  );
}
