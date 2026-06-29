import Navbar from "@/components/Navbar";
import Projects from "@/components/Projects";
import Footer from "@/components/Footer";
import FloatingSocials from "@/components/FloatingSocials";

export const metadata = {
  title: "مشاريع مروة توفيق المنفذة | TSM Kitchens",
  description: "استعرض تفاصيل ومواصفات وخامات المشاريع المنفذة بواسطة المهندسة مروة توفيق في الإسكندرية (سموحة، كفر عبده، سان ستيفانو) وآراء عملائنا.",
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
