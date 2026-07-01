import type { Metadata } from "next";
import { Cairo, Inter } from "next/font/google";
import "../globals.css";
import { LanguageProvider } from "@/locales/LanguageContext";
import { Locale, dictionaries } from "@/locales/dictionaries";

const cairo = Cairo({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-cairo",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
});

export async function generateStaticParams() {
  return [{ lang: "ar" }, { lang: "en" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }> | { lang: string };
}): Promise<Metadata> {
  const { lang } = await Promise.resolve(params);
  const locale = (lang === "en" ? "en" : "ar") as Locale;
  const dict = dictionaries[locale] || dictionaries.ar;

  return {
    metadataBase: new URL("https://tsm.com.eg"),
    title: {
      default: dict.meta.title,
      template: "%s | TSM Kitchens",
    },
    description: dict.meta.description,
    keywords: dict.meta.keywords.split(",").map((k) => k.trim()),
    authors: [{ name: "Marwa Tawfik", url: "https://tsm.com.eg" }],
    creator: "Marwa Tawfik - TSM Kitchens",
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
    alternates: {
      canonical: locale === "ar" ? "https://tsm.com.eg" : "https://tsm.com.eg/en",
      languages: {
        "ar": "https://tsm.com.eg",
        "en": "https://tsm.com.eg/en",
      },
    },
    openGraph: {
      title: dict.meta.title,
      description: dict.meta.description,
      url: locale === "ar" ? "https://tsm.com.eg" : "https://tsm.com.eg/en",
      siteName: "TSM Kitchens - Marwa Tawfik",
      locale: locale === "ar" ? "ar_EG" : "en_US",
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
      title: dict.meta.title,
      description: dict.meta.description,
      images: ["/images/logo.jpg"],
    },
    icons: {
      icon: "/images/logo.jpg",
      apple: "/images/logo.jpg",
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }> | { lang: string };
}) {
  const { lang } = await Promise.resolve(params);
  const locale = (lang === "en" ? "en" : "ar") as Locale;
  const dir = locale === "ar" ? "rtl" : "ltr";
  const fontClass = locale === "ar" ? cairo.variable : inter.variable;
  const bodyFont = locale === "ar" ? "font-cairo" : "font-sans";

  return (
    <html lang={locale} dir={dir} className={`${fontClass} h-full antialiased scroll-smooth`}>
      <body className={`min-h-full flex flex-col ${bodyFont} bg-white text-slate-900 selection:bg-pink-600 selection:text-white`}>
        <LanguageProvider lang={locale}>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
