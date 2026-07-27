import { Rocket } from "lucide-react";
import FadeIn from "@/components/FadeIn";
import BotonPrincipal from "@/components/BotonPrincipal";
import type { SiteSettings } from "@/lib/types";

export default function SolucionAMedida({ settings }: { settings: SiteSettings }) {
  if (!settings.custom_solution_enabled) return null;

  return (
    <FadeIn>
      <div className="mx-auto max-w-3xl flex flex-col items-center gap-6 text-center px-5 py-12">
        <Rocket className="w-12 h-12 text-[#FF9500]" strokeWidth={1.5} />
        <p className="text-[#D7E2EA] font-light leading-relaxed max-w-xl">
          {settings.custom_solution_text}
        </p>
        <BotonPrincipal href={settings.custom_solution_url} target="_blank">
          Ver nuestros servicios
        </BotonPrincipal>
      </div>
    </FadeIn>
  );
}
