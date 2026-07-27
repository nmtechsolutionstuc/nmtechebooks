import { Code2, BrainCircuit } from "lucide-react";
import FadeIn from "@/components/FadeIn";
import AnimatedText from "@/components/AnimatedText";
import BotonPrincipal from "@/components/BotonPrincipal";
import type { SiteSettings } from "@/lib/types";

export default function AboutSection({ settings }: { settings: SiteSettings }) {
  return (
    <section className="relative flex flex-col items-center justify-center gap-8 sm:gap-10 px-5 sm:px-8 md:px-10 py-16 sm:py-20">
      <FadeIn delay={0.1} x={-60} y={0} duration={0.9} className="hidden sm:block">
        <Code2
          className="absolute top-[10%] left-[2%] md:left-[6%] text-[#FF9500]/20 w-[70px] sm:w-[90px] md:w-[110px]"
          strokeWidth={0.75}
        />
      </FadeIn>
      <FadeIn delay={0.15} x={60} y={0} duration={0.9} className="hidden sm:block">
        <BrainCircuit
          className="absolute top-[10%] right-[2%] md:right-[6%] text-[#FF9500]/20 w-[70px] sm:w-[90px] md:w-[110px]"
          strokeWidth={0.75}
        />
      </FadeIn>

      <FadeIn delay={0} y={30}>
        <h2
          className="gradient-heading font-black uppercase leading-none tracking-tight text-center"
          style={{ fontSize: "clamp(2rem, 7vw, 90px)" }}
        >
          {settings.about_heading}
        </h2>
      </FadeIn>

      <AnimatedText
        text={settings.about_text}
        className="text-[#D7E2EA] font-medium text-center leading-relaxed max-w-[480px]"
      />

      {settings.custom_solution_enabled && (
        <FadeIn delay={0.1}>
          <div className="flex flex-col items-center gap-4 text-center max-w-md mt-2">
            <p className="text-[#D7E2EA]/70 font-light text-sm leading-relaxed">
              {settings.custom_solution_text}
            </p>
            <BotonPrincipal href={settings.custom_solution_url} target="_blank">
              Ver nuestros servicios
            </BotonPrincipal>
          </div>
        </FadeIn>
      )}
    </section>
  );
}
