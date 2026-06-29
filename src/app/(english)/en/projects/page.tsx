import Navbar from "@/components/Navbar";
import Projects from "@/components/Projects";
import Footer from "@/components/Footer";
import FloatingSocials from "@/components/FloatingSocials";

export const metadata = {
  title: "Marwa Tawfik Executed Projects | TSM Kitchens",
  description: "Explore the materials, layout specifications, and client testimonials of our completed projects in Alexandria (Smouha, Kafr Abdo, San Stefano).",
};

export default function EnglishProjectsPage() {
  return (
    <>
      <Navbar lang="en" />
      <main className="flex-grow pt-20">
        <Projects lang="en" />
      </main>
      <Footer lang="en" />
      <FloatingSocials lang="en" />
    </>
  );
}
