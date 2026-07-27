import type { Metadata } from "next";
import { Link2, Percent, Handshake } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FadeIn from "@/components/FadeIn";
import BotonSecundario from "@/components/BotonSecundario";
import { getPublicEbooks, getSiteSettings } from "@/lib/data";

export const metadata: Metadata = {
  title: "Afiliados -- nmtech solutions",
  description: "Sumate como afiliado y vendé nuestros ebooks a través de Hotmart.",
};

export const revalidate = 60;

const ICONS = [Link2, Handshake, Percent];

export default async function AfiliadosPage() {
  const [ebooks, settings] = await Promise.all([getPublicEbooks(), getSiteSettings()]);

  return (
    <main className="flex flex-col flex-1" style={{ overflowX: "clip" }}>
      <Navbar />

      <section className="px-5 sm:px-8 md:px-10 py-16 max-w-4xl mx-auto text-center">
        <FadeIn>
          <h1
            className="gradient-heading font-black uppercase leading-none mb-6"
            style={{ fontSize: "clamp(2.5rem, 9vw, 120px)" }}
          >
            {settings.affiliates_heading}
          </h1>
          <p className="text-[#D7E2EA] font-light leading-relaxed max-w-xl mx-auto mb-16">
            {settings.affiliates_intro}
          </p>
        </FadeIn>

        {settings.affiliates_steps.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-20 text-left">
            {settings.affiliates_steps.map((step, i) => {
              const Icon = ICONS[i % ICONS.length];
              return (
                <FadeIn key={`${step.title}-${i}`} delay={i * 0.15}>
                  <div className="flex flex-col gap-3">
                    <Icon className="w-10 h-10 text-[#FF9500]" strokeWidth={1.5} />
                    <h3 className="text-[#D7E2EA] font-medium uppercase">{step.title}</h3>
                    <p className="text-[#D7E2EA]/70 font-light text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        )}
      </section>

      <section className="px-5 sm:px-8 md:px-10 pb-24 max-w-4xl mx-auto w-full">
        <FadeIn>
          <h2 className="text-[#D7E2EA] font-medium uppercase text-xl mb-8 text-center">
            Elegí un ebook para sumarte como afiliado
          </h2>
        </FadeIn>

        {ebooks.length === 0 ? (
          <p className="text-center text-[#D7E2EA]/60 font-light">
            Todavía no hay ebooks publicados.
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            {ebooks.map((ebook, i) => (
              <FadeIn key={ebook.id} delay={i * 0.05}>
                <div className="flex flex-wrap items-center justify-between gap-4 rounded-full border-2 border-[#D7E2EA]/20 px-6 py-4">
                  <span className="text-[#D7E2EA] font-medium uppercase">{ebook.title}</span>
                  {ebook.hotmart_affiliate_url ? (
                    <BotonSecundario href={ebook.hotmart_affiliate_url} target="_blank">
                      Sumarme como afiliado
                    </BotonSecundario>
                  ) : (
                    <span className="text-[#D7E2EA]/40 text-sm uppercase">Próximamente</span>
                  )}
                </div>
              </FadeIn>
            ))}
          </div>
        )}
      </section>

      <Footer text={settings.footer_text} />
    </main>
  );
}
