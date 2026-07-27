import { BookOpenCheck, Sparkles, Users, Tag } from "lucide-react";
import FadeIn from "@/components/FadeIn";
import type { ContentItem } from "@/lib/types";

const ICONS = [BookOpenCheck, Users, Sparkles, Tag];

export default function WhyOurEbooksSection({
  heading,
  reasons,
}: {
  heading: string;
  reasons: ContentItem[];
}) {
  if (!reasons.length) return null;

  return (
    <section className="bg-white rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] px-5 sm:px-8 md:px-10 py-16 sm:py-20 md:py-24">
      <FadeIn>
        <h2
          className="font-black uppercase text-center text-[#0C0C0C] mb-12 sm:mb-16"
          style={{ fontSize: "clamp(2rem, 7vw, 90px)" }}
        >
          {heading}
        </h2>
      </FadeIn>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
        {reasons.map((reason, i) => {
          const Icon = ICONS[i % ICONS.length];
          return (
            <FadeIn key={`${reason.title}-${i}`} delay={i * 0.1}>
              <div className="flex flex-col gap-3">
                <Icon className="w-9 h-9 text-[#FF7A00]" strokeWidth={1.5} />
                <h3 className="font-medium uppercase text-[#0C0C0C] text-lg">{reason.title}</h3>
                <p className="font-light leading-relaxed text-[#0C0C0C]/60 text-sm">
                  {reason.description}
                </p>
              </div>
            </FadeIn>
          );
        })}
      </div>
    </section>
  );
}
