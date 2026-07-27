import FadeIn from "@/components/FadeIn";
import EbookCard from "@/components/EbookCard";
import type { PublicEbook } from "@/lib/types";

export default function MasEbooksSection({ ebooks }: { ebooks: PublicEbook[] }) {
  if (!ebooks.length) return null;

  return (
    <section className="px-5 sm:px-8 md:px-10 py-16 sm:py-20">
      <FadeIn>
        <h2 className="text-[#D7E2EA] font-medium uppercase text-xl sm:text-2xl text-center mb-10">
          También te puede interesar
        </h2>
      </FadeIn>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {ebooks.map((ebook, i) => (
          <FadeIn key={ebook.id} delay={i * 0.08}>
            <EbookCard ebook={ebook} />
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
