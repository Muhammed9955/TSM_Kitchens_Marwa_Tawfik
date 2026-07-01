import type { Metadata } from "next";
import ProjectsPage from "@/components/ProjectsPage";
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
      title: "مشاريع مروة توفيق المنفذة | TSM Kitchens",
      description: "استعرض تفاصيل ومواصفات وخامات المشاريع المنفذة بواسطة المهندسة مروة توفيق في الإسكندرية (سموحة، كفر عبده، سان ستيفانو) وآراء عملائنا.",
      keywords: ["مشاريع مطابخ الإسكندرية", "مطابخ سموحة", "مطابخ كفر عبده", "TSM Kitchens مشاريع", "تصميم مطابخ راقي"],
      alternates: {
        canonical: "https://tsm.com.eg/projects",
        languages: {
          "ar": "https://tsm.com.eg/projects",
          "en": "https://tsm.com.eg/en/projects",
        },
      },
      openGraph: {
        title: "مشاريع مروة توفيق | TSM Kitchens",
        description: "استعرض تفاصيل ومواصفات المشاريع المنفذة في الإسكندرية.",
        url: "https://tsm.com.eg/projects",
        images: [{ url: "/images/logo.jpg", alt: "TSM Kitchens Projects" }],
      },
    };
  } else {
    return {
      title: "Marwa Tawfik Executed Projects | TSM Kitchens",
      description: "Explore the materials, layout specifications, and client testimonials of our completed kitchen and dressing room projects in Alexandria (Smouha, Kafr Abdo, San Stefano).",
      keywords: ["kitchen projects Alexandria", "Smouha kitchen", "Kafr Abdo kitchen", "TSM Kitchens projects", "luxury kitchen design Egypt"],
      alternates: {
        canonical: "https://tsm.com.eg/en/projects",
        languages: {
          "ar": "https://tsm.com.eg/projects",
          "en": "https://tsm.com.eg/en/projects",
        },
      },
      openGraph: {
        title: "Marwa Tawfik Projects | TSM Kitchens",
        description: "Explore completed kitchen projects with premium European materials in Alexandria.",
        url: "https://tsm.com.eg/en/projects",
        images: [{ url: "/images/logo.jpg", alt: "TSM Kitchens Projects" }],
      },
    };
  }
}

export default function ProjectsPageRoute() {
  return <ProjectsPage />;
}
