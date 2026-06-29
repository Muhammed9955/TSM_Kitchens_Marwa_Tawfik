import Navbar from "@/components/Navbar";
import HeroSlider from "@/components/HeroSlider";
import About from "@/components/About";
import Services from "@/components/Services";
import Projects from "@/components/Projects";
import GalleryPreview from "@/components/GalleryPreview";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import FloatingSocials from "@/components/FloatingSocials";

export default function EnglishHome() {
  return (
    <>
      <Navbar lang="en" />
      <main className="flex-grow pt-20">
        <HeroSlider lang="en" />
        <About lang="en" />
        <Services lang="en" />
        <Projects lang="en" />
        <GalleryPreview lang="en" />
        <Contact lang="en" />
      </main>
      <Footer lang="en" />
      <FloatingSocials lang="en" />
    </>
  );
}
