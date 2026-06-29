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
  metadataBase: new URL("https://tsm.com.eg"),
  title: {
    default: "تي إس إم للمطابخ | مروة توفيق - تصاميم مطابخ راقية وعصرية",
    template: "%s | TSM Kitchens",
  },
  description: "شركة TSM Kitchens للمهندسة مروة توفيق. متخصصون في تصميم وتنفيذ أرقى وأحدث المطابخ العصرية (أكريليك، بولي لاك، خشب، ألومنيوم) والدريسنج روم بأعلى جودة في الإسكندرية ومصر.",
  keywords: [
    "مطابخ مروة توفيق", "TSM Kitchens", "تصميم مطابخ مصر", "مطابخ الإسكندرية",
    "دريسنج روم", "مطابخ بولي لاك", "مطابخ أكريليك", "مطابخ خشب طبيعي",
    "تصميم مطابخ سموحة", "مطابخ راقية", "مطبخ عصري", "ألومنيوم مطابخ",
  ],
  authors: [{ name: "Marwa Tawfik", url: "https://tsm.com.eg" }],
  creator: "Marwa Tawfik - TSM Kitchens",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: "https://tsm.com.eg",
    languages: {
      "ar": "https://tsm.com.eg",
      "en": "https://tsm.com.eg/en",
    },
  },
  openGraph: {
    title: "تي إس إم للمطابخ | مروة توفيق",
    description: "متخصصون في تصميم وتنفيذ أرقى وأحدث المطابخ العصرية والدريسنج روم بأعلى جودة في الإسكندرية ومصر.",
    url: "https://tsm.com.eg",
    siteName: "TSM Kitchens - Marwa Tawfik",
    locale: "ar_EG",
    type: "website",
    images: [
      {
        url: "/images/logo.jpg",
        width: 800,
        height: 600,
        alt: "TSM Kitchens - Marwa Tawfik",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "تي إس إم للمطابخ | مروة توفيق",
    description: "متخصصون في تصميم وتنفيذ أرقى وأحدث المطابخ العصرية والدريسنج روم.",
    images: ["/images/logo.jpg"],
  },
  icons: {
    icon: "/images/logo.jpg",
    apple: "/images/logo.jpg",
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
