import Navbar from "@/components/Navbar";
import Gallery from "@/components/Gallery";
import Footer from "@/components/Footer";
import FloatingSocials from "@/components/FloatingSocials";

export const metadata = {
  title: "معرض أعمال مروة توفيق | TSM Kitchens",
  description: "تصفح كتالوج المطابخ الكامل المصمم والمنفذ بواسطة المهندسة مروة توفيق. مطابخ أكريليك، بولي لاك، يو في لاك، خشب طبيعي، ودريسنج روم بأعلى جودة.",
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
