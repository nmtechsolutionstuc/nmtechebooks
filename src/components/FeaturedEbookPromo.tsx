import Image from "next/image";
import FadeIn from "@/components/FadeIn";
import PriceTag from "@/components/PriceTag";
import LeadCaptureFlow from "@/components/LeadCaptureFlow";
import TermsNotice from "@/components/TermsNotice";
import type { PublicEbook, SiteSettings } from "@/lib/types";

export default function FeaturedEbookPromo({
  ebook,
  settings,
}: {
  ebook: PublicEbook;
  settings: SiteSettings;
}) {
  return (
    <section className="px-5 sm:px-8 md:px-10 py-16 sm:py-20">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
        <FadeIn x={-40} className="h-full">
          <div className="relative w-full aspect-[3/4] max-w-xs mx-auto lg:h-full lg:aspect-auto lg:max-w-none rounded-[30px] overflow-hidden border-2 border-[#D7E2EA]/15">
            <Image
              src={ebook.cover_image_url}
              alt={ebook.title}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 45vw, 70vw"
              priority
            />
          </div>
        </FadeIn>

        <FadeIn x={40}>
          <div className="flex flex-col gap-5">
            <span className="text-[#FF9500] uppercase tracking-widest text-sm font-medium">
              {ebook.category} · Primer capítulo gratis
            </span>
            <h2 className="text-[#D7E2EA] font-black uppercase leading-tight text-3xl sm:text-4xl md:text-5xl">
              {ebook.title}
            </h2>

            {ebook.promo_message && (
              <p className="border-l-2 border-[#FF9500] pl-4 text-[#D7E2EA] font-medium italic leading-relaxed">
                {ebook.promo_message}
              </p>
            )}

            <p className="text-[#D7E2EA]/70 font-light leading-relaxed">
              {ebook.long_description}
            </p>

            <PriceTag
              originalPrice={ebook.original_price}
              currentPrice={ebook.current_price}
              size="lg"
            />
            <TermsNotice text={settings.terms_notice_text} />

            <div className="mt-2 rounded-[30px] border-2 border-[#D7E2EA]/15 p-5 sm:p-6">
              <LeadCaptureFlow
                ebookSlug={ebook.slug}
                defaultTopic={ebook.category}
                settings={settings}
              />
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
