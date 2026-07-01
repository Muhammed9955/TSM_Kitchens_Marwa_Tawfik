import Navbar from "@/components/Navbar";
import HeroSlider from "@/components/HeroSlider";
import About from "@/components/About";
import Services from "@/components/Services";
import ProjectsPreview from "@/components/ProjectsPreview";
import GalleryPreview from "@/components/GalleryPreview";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import FloatingSocials from "@/components/FloatingSocials";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import ReelsSection from "@/components/ReelsSection";
import QuotationForm from "@/components/QuotationForm";

export default function MainPage() {
  return (
    <>
      <Navbar />
      <main className="flex-grow pt-20">
        <HeroSlider />
        <About />
        <BeforeAfterSlider />
        <Services />
        <ProjectsPreview />
        <GalleryPreview />
        <ReelsSection />
        <QuotationForm />
        <Contact />
      </main>
      <Footer />
      <FloatingSocials />
    </>
  );
}

