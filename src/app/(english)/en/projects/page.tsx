import Navbar from "@/components/Navbar";
import Projects from "@/components/Projects";
import Footer from "@/components/Footer";
import FloatingSocials from "@/components/FloatingSocials";

export const metadata = {
  title: "Marwa Tawfik Executed Projects | TSM Kitchens",
  description: "Explore the materials, layout specifications, and client testimonials of our completed kitchen and dressing room projects in Alexandria (Smouha, Kafr Abdo, San Stefano).",
  keywords: ["kitchen projects Alexandria", "Smouha kitchen", "Kafr Abdo kitchen", "TSM Kitchens projects", "luxury kitchen design Egypt"],
  alternates: {
    canonical: "https://tsm.com.eg/en/projects",
    languages: {
      "ar": "https://tsm.com.eg/projects",
      "en": "https://tsm.com.eg/en/projects",
    },
  },
  openGraph: {
    title: "Marwa Tawfik Projects | TSM Kitchens",
    description: "Explore completed kitchen projects with premium European materials in Alexandria.",
    url: "https://tsm.com.eg/en/projects",
    images: [{ url: "/images/logo.jpg", alt: "TSM Kitchens Projects" }],
  },
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
