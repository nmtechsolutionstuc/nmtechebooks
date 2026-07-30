import { BookOpen } from "lucide-react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import FadeIn from "@/components/FadeIn";
import Magnet from "@/components/Magnet";
import BotonPrincipal from "@/components/BotonPrincipal";
import type { SiteSettings } from "@/lib/types";

function HeroIconFallback() {
  return (
    <div
      className="w-full h-full rounded-full flex items-center justify-center"
      style={{
        background: "radial-gradient(circle, rgba(255,149,0,0.15) 0%, rgba(255,149,0,0) 70%)",
      }}
    >
      <BookOpen className="w-1/2 h-1/2 text-[#FFD166]" strokeWidth={1} />
    </div>
  );
}

export default function HeroSection({ settings }: { settings: SiteSettings }) {
  const isBanner = settings.hero_image_style === "banner" && settings.hero_image_url;

  return (
    <section className="h-screen flex flex-col relative" style={{ overflowX: "clip" }}>
      <Navbar />

      <div className="flex-1 flex items-center justify-center relative">
        {isBanner ? (
          <Magnet
            padding={400}
            strength={25}
            className="relative w-screen left-1/2 -translate-x-1/2 h-[220px] sm:h-[300px] md:h-[380px] overflow-hidden"
          >
            <Image
              src={settings.hero_image_url}
              alt=""
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
          </Magnet>
        ) : (
          <Magnet
            padding={150}
            strength={5}
            className="relative z-0 flex items-center justify-center w-[220px] h-[220px] sm:w-[300px] sm:h-[300px] md:w-[380px] md:h-[380px] rounded-full overflow-hidden"
          >
            {settings.hero_image_url ? (
              <Image
                src={settings.hero_image_url}
                alt=""
                fill
                className="object-cover rounded-full"
                sizes="380px"
                priority
              />
            ) : (
              <HeroIconFallback />
            )}
          </Magnet>
        )}
      </div>

      <div className="px-4 flex flex-col items-center gap-2">
        {settings.hero_kicker && (
          <FadeIn delay={0.05} y={20} immediate>
            <p className="text-[#D7E2EA]/60 uppercase tracking-[0.3em] text-xs sm:text-sm text-center">
              {settings.hero_kicker}
            </p>
          </FadeIn>
        )}
        <FadeIn delay={0.15} y={40} immediate>
          <h1
            className="gradient-heading font-black uppercase leading-none tracking-tight text-center"
            style={{ fontSize: "clamp(2rem, 7vw, 90px)" }}
          >
            {settings.hero_heading}
          </h1>
        </FadeIn>
      </div>

      <div className="flex justify-between items-end pb-7 sm:pb-8 md:pb-10 px-6 md:px-10 gap-4">
        <FadeIn delay={0.35} y={20} immediate>
          <p
            className="text-[#D7E2EA] font-light uppercase tracking-wide leading-snug max-w-[160px] sm:max-w-[220px] md:max-w-[320px]"
            style={{ fontSize: "clamp(0.75rem, 1.4vw, 1.5rem)" }}
          >
            {settings.hero_tagline}
          </p>
        </FadeIn>
        <FadeIn delay={0.5} y={20} immediate>
          <BotonPrincipal href="/ebooks">{settings.hero_cta_label}</BotonPrincipal>
        </FadeIn>
      </div>
    </section>
  );
}
