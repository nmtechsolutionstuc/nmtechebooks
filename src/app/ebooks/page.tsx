import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FadeIn from "@/components/FadeIn";
import EbookCard from "@/components/EbookCard";
import { getPublicEbooks, getSiteSettings } from "@/lib/data";

export const metadata: Metadata = {
  title: "Ebooks -- nmtech solutions",
  description: "Todos los ebooks de nmtech solutions sobre software, datos e IA.",
};

export const revalidate = 60;

export default async function EbooksPage() {
  const [ebooks, settings] = await Promise.all([getPublicEbooks(), getSiteSettings()]);

  return (
    <main className="flex flex-col flex-1" style={{ overflowX: "clip" }}>
      <Navbar />

      <section className="px-5 sm:px-8 md:px-10 pt-16 pb-24">
        <FadeIn>
          <h1
            className="gradient-heading font-black uppercase text-center mb-16"
            style={{ fontSize: "clamp(2.5rem, 9vw, 120px)" }}
          >
            Biblioteca de ebooks
          </h1>
        </FadeIn>

        {ebooks.length === 0 ? (
          <p className="text-center text-[#D7E2EA]/60 font-light">
            Todavía no hay ebooks publicados. ¡Muy pronto!
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {ebooks.map((ebook, i) => (
              <FadeIn key={ebook.id} delay={(i % 4) * 0.08}>
                <EbookCard ebook={ebook} />
              </FadeIn>
            ))}
          </div>
        )}
      </section>

      <Footer text={settings.footer_text} />
    </main>
  );
}
