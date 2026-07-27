import HeroSection from "@/components/HeroSection";
import Marquee from "@/components/Marquee";
import FeaturedEbookPromo from "@/components/FeaturedEbookPromo";
import WhyOurEbooksSection from "@/components/WhyOurEbooksSection";
import MasEbooksSection from "@/components/MasEbooksSection";
import AboutSection from "@/components/AboutSection";
import Footer from "@/components/Footer";
import { getPublicEbooks, getSiteSettings } from "@/lib/data";

export const revalidate = 60;

export default async function HomePage() {
  const [allEbooks, settings] = await Promise.all([
    getPublicEbooks(),
    getSiteSettings(),
  ]);

  const coverImages = allEbooks.map((e) => e.cover_image_url);
  const featuredEbook = allEbooks.find((e) => e.featured) ?? allEbooks[0] ?? null;
  const otherEbooks = allEbooks.filter((e) => e.id !== featuredEbook?.id);

  return (
    <main className="flex flex-col" style={{ overflowX: "clip" }}>
      <HeroSection settings={settings} />
      {settings.marquee_visible && <Marquee images={coverImages} />}
      {settings.featured_ebook_visible && featuredEbook && (
        <FeaturedEbookPromo ebook={featuredEbook} settings={settings} />
      )}
      {settings.why_visible && (
        <WhyOurEbooksSection heading={settings.why_heading} reasons={settings.why_reasons} />
      )}
      {settings.also_interested_visible && <MasEbooksSection ebooks={otherEbooks} />}
      {settings.about_visible && <AboutSection settings={settings} />}
      <Footer text={settings.footer_text} />
    </main>
  );
}
