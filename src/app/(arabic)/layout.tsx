import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "../globals.css";

const cairo = Cairo({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-cairo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "تي إس إم للمطابخ | مروة توفيق - تصاميم مطابخ راقية وعصرية",
  description: "شركة TSM Kitchens للمهندسة مروة توفيق. متخصصون في تصميم وتنفيذ أرقى وأحدث المطابخ العصرية (أكريليك، بولي لاك، خشب، ألومنيوم) والدريسنج روم بأعلى جودة في مصر.",
  keywords: ["مطابخ مروة توفيق", "TSM Kitchens", "تصميم مطابخ مصر", "دريسنج روم", "مطابخ بولي لاك", "مطابخ أكريليك"],
  authors: [{ name: "Marwa Tawfik" }],
  openGraph: {
    title: "تي إس إم للمطابخ | مروة توفيق",
    description: "متخصصون في تصميم وتنفيذ أرقى وأحدث المطابخ العصرية والدريسنج روم بأعلى جودة في مصر.",
    url: "https://tsm.com.eg",
    siteName: "TSM Kitchens - Marwa Tawfik",
    locale: "ar_EG",
    type: "website",
  },
  icons: {
    icon: "/favicon.jpg",
  },
};

export default function ArabicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} h-full antialiased scroll-smooth`}>
      <body className="min-h-full flex flex-col font-cairo bg-white text-slate-900 selection:bg-pink-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
