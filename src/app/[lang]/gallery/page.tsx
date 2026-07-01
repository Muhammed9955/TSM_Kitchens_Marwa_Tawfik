import type { Metadata } from "next";
import GalleryPage from "@/components/GalleryPage";
import { Locale } from "@/locales/dictionaries";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }> | { lang: string };
}): Promise<Metadata> {
  const { lang } = await Promise.resolve(params);
  const locale = lang as Locale;

  if (locale === "ar") {
    return {
      title: "معرض أعمال مروة توفيق | TSM Kitchens",
      description: "تصفح كتالوج المطابخ الكامل المصمم والمنفذ بواسطة المهندسة مروة توفيق. مطابخ أكريليك، بولي لاك، يو في لاك، خشب طبيعي، ودريسنج روم بأعلى جودة.",
      keywords: ["معرض مطابخ", "كتالوج مطابخ", "صور مطابخ", "مطابخ أكريليك", "دريسنج روم", "TSM Gallery"],
      alternates: {
        canonical: "https://tsm.com.eg/gallery",
        languages: {
          "ar": "https://tsm.com.eg/gallery",
          "en": "https://tsm.com.eg/en/gallery",
        },
      },
      openGraph: {
        title: "معرض أعمال مروة توفيق | TSM Kitchens",
        description: "تصفح كتالوج المطابخ والدريسنج روم بأعلى جودة في الإسكندرية.",
        url: "https://tsm.com.eg/gallery",
        images: [{ url: "/images/logo.jpg", alt: "TSM Kitchens Gallery" }],
      },
    };
  } else {
    return {
      title: "Marwa Tawfik Gallery Portfolio | TSM Kitchens",
      description: "Browse the complete kitchen designs and walk-in dressing room portfolio executed by Eng. Marwa Tawfik with premium European materials in Alexandria, Egypt.",
      keywords: ["kitchen gallery Egypt", "kitchen portfolio", "acrylic kitchen photos", "dressing room gallery", "TSM Kitchens gallery"],
      alternates: {
        canonical: "https://tsm.com.eg/en/gallery",
        languages: {
          "ar": "https://tsm.com.eg/gallery",
          "en": "https://tsm.com.eg/en/gallery",
        },
      },
      openGraph: {
        title: "Marwa Tawfik Gallery | TSM Kitchens",
        description: "Browse the complete kitchen and dressing room portfolio with premium European materials.",
        url: "https://tsm.com.eg/en/gallery",
        images: [{ url: "/images/logo.jpg", alt: "TSM Kitchens Gallery" }],
      },
    };
  }
}

export default function GalleryPageRoute() {
  return <GalleryPage />;
}
