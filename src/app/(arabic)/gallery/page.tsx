import Navbar from "@/components/Navbar";
import Gallery from "@/components/Gallery";
import Footer from "@/components/Footer";
import FloatingSocials from "@/components/FloatingSocials";

export const metadata = {
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

export default function ArabicGalleryPage() {
  return (
    <>
      <Navbar lang="ar" />
      <main className="flex-grow pt-20">
        <Gallery lang="ar" />
      </main>
      <Footer lang="ar" />
      <FloatingSocials lang="ar" />
    </>
  );
}
