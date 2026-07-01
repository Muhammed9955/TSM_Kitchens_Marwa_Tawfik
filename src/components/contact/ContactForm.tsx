import React, { useState } from "react";
import { Send } from "lucide-react";
import { useLanguage } from "@/locales/LanguageContext";

export default function ContactForm() {
  const { lang, dict } = useLanguage();
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

  return (
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
  );
}
