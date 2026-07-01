import { useLanguage } from "@/locales/LanguageContext";

export default function ContactMap() {
  const { lang, dict } = useLanguage();

  return (
    <div className="mt-16 sm:mt-24 rounded-2xl overflow-hidden border border-slate-200 shadow-lg relative h-[450px]">
      <iframe
        src="https://maps.google.com/maps?q=TRUST-TSM,%20Sidi%20Gaber,%20Alexandria,%20Egypt&t=&z=16&ie=UTF8&iwloc=&output=embed"
        width="100%"
        height="100%"
        style={{ border: 0, filter: "grayscale(1) opacity(0.85) contrast(1.1)" }}
        allowFullScreen={false}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title={dict.contact.mapTitle}
      />
      {/* Floating Address Card on Map */}
      <div className="absolute bottom-6 left-6 right-6 sm:left-auto bg-white/95 backdrop-blur-md border border-slate-200 p-5 rounded-xl shadow-xl max-w-sm">
        <span className="text-pink-500 font-bold text-sm block mb-1">
          {lang === "ar" ? "موقع المعرض" : "Showroom Location"}
        </span>
        <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
          {dict.contact.addressValue}
        </p>
      </div>
    </div>
  );
}
