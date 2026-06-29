import Navbar from "@/components/Navbar";
import Gallery from "@/components/Gallery";
import Footer from "@/components/Footer";
import FloatingSocials from "@/components/FloatingSocials";

export const metadata = {
  title: "Marwa Tawfik Gallery Portfolio | TSM Kitchens",
  description: "Browse the complete kitchen designs and walk-in dressing room portfolio executed by Eng. Marwa Tawfik with premium European materials in Alexandria, Egypt.",
  keywords: ["kitchen gallery Egypt", "kitchen portfolio", "acrylic kitchen photos", "dressing room gallery", "TSM Kitchens gallery"],
  alternates: {
    canonical: "https://tsm.com.eg/en/gallery",
    languages: {
      "ar": "https://tsm.com.eg/gallery",
      "en": "https://tsm.com.eg/en/gallery",
    },
  },
  openGraph: {
    title: "Marwa Tawfik Gallery | TSM Kitchens",
    description: "Browse the complete kitchen and dressing room portfolio with premium European materials.",
    url: "https://tsm.com.eg/en/gallery",
    images: [{ url: "/images/logo.jpg", alt: "TSM Kitchens Gallery" }],
  },
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
