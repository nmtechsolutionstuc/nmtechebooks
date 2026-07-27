import type { Metadata } from "next";
import { Mail } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FadeIn from "@/components/FadeIn";
import BotonPrincipal from "@/components/BotonPrincipal";
import SolucionAMedida from "@/components/SolucionAMedida";
import { getSiteSettings } from "@/lib/data";

export const metadata: Metadata = {
  title: "Contacto -- nmtech solutions",
  description: "Escribinos por dudas sobre los ebooks o para desarrollo/automatización a medida.",
};

export const revalidate = 60;

export default async function ContactoPage() {
  const settings = await getSiteSettings();

  return (
    <main className="flex flex-col flex-1" style={{ overflowX: "clip" }}>
      <Navbar />

      <section className="flex-1 flex flex-col items-center justify-center gap-8 px-5 sm:px-8 md:px-10 py-24 text-center">
        <FadeIn>
          <Mail className="w-12 h-12 text-[#FF9500] mx-auto mb-4" strokeWidth={1.5} />
          <h1
            className="gradient-heading font-black uppercase leading-none mb-6"
            style={{ fontSize: "clamp(2.5rem, 9vw, 120px)" }}
          >
            {settings.contact_heading}
          </h1>
          <p className="text-[#D7E2EA] font-light leading-relaxed max-w-lg mx-auto">
            {settings.contact_text}
          </p>
        </FadeIn>

        <FadeIn delay={0.2}>
          <BotonPrincipal href={`mailto:${settings.contact_email}`}>
            {settings.contact_email}
          </BotonPrincipal>
        </FadeIn>
      </section>

      <SolucionAMedida settings={settings} />

      <Footer text={settings.footer_text} />
    </main>
  );
}
