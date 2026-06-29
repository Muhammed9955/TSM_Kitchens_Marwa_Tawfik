import Navbar from "@/components/Navbar";
import Gallery from "@/components/Gallery";
import Footer from "@/components/Footer";
import FloatingSocials from "@/components/FloatingSocials";

export const metadata = {
  title: "Marwa Tawfik Gallery Portfolio | TSM Kitchens",
  description: "Browse the complete kitchen designs and walk-in dressing room portfolio executed by Eng. Marwa Tawfik with premium European materials.",
};

export default function EnglishGalleryPage() {
  return (
    <>
      <Navbar lang="en" />
      <main className="flex-grow pt-20">
        <Gallery lang="en" />
      </main>
      <Footer lang="en" />
      <FloatingSocials lang="en" />
    </>
  );
}
