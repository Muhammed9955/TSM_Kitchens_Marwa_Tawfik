import Navbar from "@/components/Navbar";
import Projects from "@/components/Projects";
import Footer from "@/components/Footer";
import FloatingSocials from "@/components/FloatingSocials";

export const metadata = {
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

export default function ArabicProjectsPage() {
  return (
    <>
      <Navbar lang="ar" />
      <main className="flex-grow pt-20">
        <Projects lang="ar" />
      </main>
      <Footer lang="ar" />
      <FloatingSocials lang="ar" />
    </>
  );
}
