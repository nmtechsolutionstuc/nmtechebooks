import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FadeIn from "@/components/FadeIn";
import { getSiteSettings } from "@/lib/data";

export const metadata: Metadata = {
  title: "Términos y Condiciones -- nmtech solutions",
};

export const revalidate = 60;

export default async function TerminosPage() {
  const settings = await getSiteSettings();

  return (
    <main className="flex flex-col flex-1" style={{ overflowX: "clip" }}>
      <Navbar />

      <section className="px-5 sm:px-8 md:px-10 py-16 max-w-2xl mx-auto w-full">
        <FadeIn>
          <h1
            className="gradient-heading font-black uppercase leading-none mb-10"
            style={{ fontSize: "clamp(2rem, 7vw, 90px)" }}
          >
            {settings.terms_heading}
          </h1>
        </FadeIn>
        <FadeIn delay={0.1}>
          <div className="text-[#D7E2EA]/80 font-light leading-relaxed whitespace-pre-line">
            {settings.terms_content}
          </div>
        </FadeIn>
      </section>

      <Footer text={settings.footer_text} />
    </main>
  );
}
