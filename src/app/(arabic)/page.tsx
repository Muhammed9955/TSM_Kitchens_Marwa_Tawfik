import Navbar from "@/components/Navbar";
import HeroSlider from "@/components/HeroSlider";
import About from "@/components/About";
import Services from "@/components/Services";
import Projects from "@/components/Projects";
import GalleryPreview from "@/components/GalleryPreview";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import FloatingSocials from "@/components/FloatingSocials";

export default function ArabicHome() {
  return (
    <>
      <Navbar lang="ar" />
      <main className="flex-grow pt-20">
        <HeroSlider lang="ar" />
        <About lang="ar" />
        <Services lang="ar" />
        <Projects lang="ar" />
        <GalleryPreview lang="ar" />
        <Contact lang="ar" />
      </main>
      <Footer lang="ar" />
      <FloatingSocials lang="ar" />
    </>
  );
}
