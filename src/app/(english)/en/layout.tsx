import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../../globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://tsm.com.eg"),
  title: {
    default: "TSM Kitchens | Marwa Tawfik - Luxury & Modern Kitchen Designs",
    template: "%s | TSM Kitchens",
  },
  description: "TSM Kitchens by Eng. Marwa Tawfik. Specializing in designing and executing the finest modern kitchens (Acrylic, Poly-lac, Wood, Aluminum, Dressing Rooms) with premium European materials in Alexandria, Egypt.",
  keywords: [
    "kitchen design Egypt", "Marwa Tawfik kitchens", "TSM Kitchens", "Modern Kitchens Egypt",
    "Dressing Rooms Egypt", "kitchen Alexandria", "luxury kitchen design", "acrylic kitchens Egypt",
    "poly-lac kitchens", "wood kitchen Egypt", "Smouha kitchens", "premium kitchen contractor",
  ],
  authors: [{ name: "Marwa Tawfik", url: "https://tsm.com.eg" }],
  creator: "Marwa Tawfik - TSM Kitchens",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: "https://tsm.com.eg/en",
    languages: {
      "ar": "https://tsm.com.eg",
      "en": "https://tsm.com.eg/en",
    },
  },
  openGraph: {
    title: "TSM Kitchens | Marwa Tawfik",
    description: "Specializing in designing and executing the finest modern kitchens and dressing rooms with premium materials in Alexandria, Egypt.",
    url: "https://tsm.com.eg/en",
    siteName: "TSM Kitchens - Marwa Tawfik",
    locale: "en_US",
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
    title: "TSM Kitchens | Marwa Tawfik",
    description: "Specializing in designing the finest modern kitchens and dressing rooms in Alexandria, Egypt.",
    images: ["/images/logo.jpg"],
  },
  icons: {
    icon: "/images/logo.jpg",
    apple: "/images/logo.jpg",
  },
};

export default function EnglishLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr" className={`${inter.variable} h-full antialiased scroll-smooth`}>
      <body className="min-h-full flex flex-col font-sans bg-white text-slate-900 selection:bg-pink-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
