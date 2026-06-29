"use client";

import React, { useState } from "react";
import { Phone, Mail, MapPin, Send, MessageSquare } from "lucide-react";
import { dictionaries, Locale } from "@/locales/dictionaries";

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

interface ContactProps {
  lang: Locale;
}

export default function Contact({ lang }: ContactProps) {
  const dict = dictionaries[lang];
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    location: "",
    service: "modern",
    preferredDate: "",
    notes: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    const serviceLabel =
      formData.service === "modern"
        ? dict.contact.serviceModern
        : formData.service === "classic"
        ? dict.contact.serviceClassic
        : formData.service === "dressing"
        ? dict.contact.serviceDressing
        : dict.contact.serviceGeneral;

    // Construct the structured WhatsApp message for booking inspection
    const formattedMessage = lang === "ar"
      ? `مرحباً TSM Kitchens،\n\nأود طلب موعد معاينة ورفع مقاسات عبر الموقع الإلكتروني:\n\n👤 *الاسم:* ${formData.name}\n📞 *الهاتف/واتساب:* ${formData.phone}\n📍 *المنطقة/العنوان:* ${formData.location}\n🛠️ *نوع المعاينة المطلوبة:* ${serviceLabel}\n📅 *تاريخ المعاينة المفضل:* ${formData.preferredDate}\n\n📝 *ملاحظات إضافية:*\n${formData.notes || "لا توجد"}`
      : `Hello TSM Kitchens,\n\nI'd like to book an inspection & measurement site visit from your website:\n\n👤 *Name:* ${formData.name}\n📞 *Phone/WhatsApp:* ${formData.phone}\n📍 *City/Area:* ${formData.location}\n🛠️ *Service Needed:* ${serviceLabel}\n📅 *Preferred Date:* ${formData.preferredDate}\n\n📝 *Additional Notes:*\n${formData.notes || "None"}`;

    // Open WhatsApp URL in a new window/tab
    const url = `https://wa.me/201113561777?text=${encodeURIComponent(formattedMessage)}`;
    window.open(url, "_blank");

    setStatus("success");
    setFormData({
      name: "",
      phone: "",
      location: "",
      service: "modern",
      preferredDate: "",
      notes: "",
    });
  };

  const whatsappMessage =
    lang === "ar"
      ? "مرحباً TSM Kitchens، أريد الاستفسار عن تصاميم المطابخ والمعاينة."
      : "Hello TSM Kitchens, I'd like to inquire about kitchen designs and booking a consultation.";
  const whatsappUrl = `https://wa.me/201113561777?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <section id="contact" className="py-20 sm:py-28 bg-white border-t border-slate-100 relative overflow-hidden">
      {/* Decorative glows */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-pink-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-fuchsia-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-24">
          <span className="text-pink-500 font-semibold tracking-wider text-xs sm:text-sm uppercase mb-2 block">
            {dict.contact.title}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
            {dict.contact.subtitle}
          </h2>
          <div className="w-16 h-1 bg-pink-600 mx-auto rounded-full mt-4" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-stretch">
          
          {/* Contact Details Column */}
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

          {/* Form Column */}
          <div className="lg:col-span-7">
            <div className="glass-card p-8 sm:p-10 rounded-2xl h-full flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-6">
                  {dict.contact.formTitle}
                </h3>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Name input */}
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="name" className="text-slate-600 text-xs font-semibold">
                        {dict.contact.name}
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full bg-slate-50 border border-slate-200 focus:border-pink-500 focus:bg-white rounded-xl px-4 py-3 text-slate-800 text-sm focus:outline-none transition-all"
                      />
                    </div>

                    {/* Phone input */}
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="phone" className="text-slate-600 text-xs font-semibold">
                        {dict.contact.phone}
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full bg-slate-50 border border-slate-200 focus:border-pink-500 focus:bg-white rounded-xl px-4 py-3 text-slate-800 text-sm focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Location / Area input */}
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="location" className="text-slate-600 text-xs font-semibold">
                        {dict.contact.location}
                      </label>
                      <input
                        type="text"
                        id="location"
                        name="location"
                        required
                        value={formData.location}
                        onChange={handleChange}
                        className="w-full bg-slate-50 border border-slate-200 focus:border-pink-500 focus:bg-white rounded-xl px-4 py-3 text-slate-800 text-sm focus:outline-none transition-all"
                      />
                    </div>

                    {/* Preferred Date input */}
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="preferredDate" className="text-slate-600 text-xs font-semibold">
                        {dict.contact.preferredDate}
                      </label>
                      <input
                        type="date"
                        id="preferredDate"
                        name="preferredDate"
                        required
                        value={formData.preferredDate}
                        onChange={handleChange}
                        className="w-full bg-slate-50 border border-slate-200 focus:border-pink-500 focus:bg-white rounded-xl px-4 py-3 text-slate-800 text-sm focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Service Needed Dropdown */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="service" className="text-slate-600 text-xs font-semibold">
                      {dict.contact.service}
                    </label>
                    <select
                      id="service"
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-pink-500 focus:bg-white rounded-xl px-4 py-3 text-slate-800 text-sm focus:outline-none transition-all cursor-pointer"
                    >
                      <option value="modern">{dict.contact.serviceModern}</option>
                      <option value="classic">{dict.contact.serviceClassic}</option>
                      <option value="dressing">{dict.contact.serviceDressing}</option>
                      <option value="general">{dict.contact.serviceGeneral}</option>
                    </select>
                  </div>

                  {/* Message/Notes input */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="notes" className="text-slate-600 text-xs font-semibold">
                      {dict.contact.notes}
                    </label>
                    <textarea
                      id="notes"
                      name="notes"
                      rows={4}
                      value={formData.notes}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-pink-500 focus:bg-white rounded-xl px-4 py-3 text-slate-800 text-sm focus:outline-none transition-all resize-none"
                    />
                  </div>

                  {/* Message responses */}
                  {status === "success" && (
                    <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 rounded-xl text-sm font-semibold animate-fade-in">
                      {dict.contact.success}
                    </div>
                  )}

                  {status === "error" && (
                    <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-600 rounded-xl text-sm font-semibold animate-fade-in">
                      {dict.contact.error}
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="w-full bg-pink-600 hover:bg-pink-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer hover:shadow-[0_0_15px_rgba(236,72,153,0.4)] disabled:cursor-not-allowed"
                  >
                    <Send size={18} />
                    <span>
                      {status === "sending" ? dict.contact.sending : dict.contact.send}
                    </span>
                  </button>
                </form>
              </div>
            </div>
          </div>

        </div>

        {/* Custom Grayscale Styled Google Maps Frame */}
        <div className="mt-16 sm:mt-24 rounded-2xl overflow-hidden border border-slate-200 shadow-lg relative h-[450px]">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d110484.77457788478!2d31.25846435!3d30.059483849999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14583fa60b21beeb%3A0x79dfb29633aeecb7!2sCairo%20Governorate%2C%20Egypt!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s"
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

      </div>
    </section>
  );
}
