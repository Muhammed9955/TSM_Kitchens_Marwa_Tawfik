import Navbar from "@/components/Navbar";
import Projects from "@/components/Projects";
import Footer from "@/components/Footer";
import FloatingSocials from "@/components/FloatingSocials";

export default function ProjectsPage() {
  return (
    <>
      <Navbar />
      <main className="flex-grow pt-20">
        <Projects />
      </main>
      <Footer />
      <FloatingSocials />
    </>
  );
}
