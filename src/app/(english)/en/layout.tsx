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
  title: "TSM Kitchens | Marwa Tawfik - Luxury & Modern Kitchen Designs",
  description: "TSM Kitchens by Eng. Marwa Tawfik. Specializing in designing and executing the finest modern kitchens (Acrylic, Poly-lac, Wood, Dressing Rooms) in Egypt.",
  keywords: ["kitchen design Egypt", "Marwa Tawfik kitchens", "TSM Kitchens", "Modern Kitchens Egypt", "Dressing Rooms Egypt"],
  authors: [{ name: "Marwa Tawfik" }],
  openGraph: {
    title: "TSM Kitchens | Marwa Tawfik",
    description: "Specializing in designing and executing the finest modern kitchens and dressing rooms in Egypt.",
    url: "https://tsm.com.eg/en",
    siteName: "TSM Kitchens - Marwa Tawfik",
    locale: "en_US",
    type: "website",
  },
  icons: {
    icon: "/favicon.png",
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
