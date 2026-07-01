import Navbar from "@/components/Navbar";
import Gallery from "@/components/Gallery";
import Footer from "@/components/Footer";
import FloatingSocials from "@/components/FloatingSocials";

export default function GalleryPage() {
  return (
    <>
      <Navbar />
      <main className="flex-grow pt-20">
        <Gallery />
      </main>
      <Footer />
      <FloatingSocials />
    </>
  );
}
