import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FadeIn from "@/components/FadeIn";
import PriceTag from "@/components/PriceTag";
import LeadCaptureFlow from "@/components/LeadCaptureFlow";
import TermsNotice from "@/components/TermsNotice";
import { getEbookBySlugPublic, getSiteSettings } from "@/lib/data";

export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const ebook = await getEbookBySlugPublic(slug);
  if (!ebook) return { title: "Ebook no encontrado -- nmtech solutions" };
  return {
    title: `${ebook.title} -- nmtech solutions`,
    description: ebook.short_description,
  };
}

export default async function EbookDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const [ebook, settings] = await Promise.all([
    getEbookBySlugPublic(slug),
    getSiteSettings(),
  ]);

  if (!ebook) notFound();

  return (
    <main className="flex flex-col flex-1" style={{ overflowX: "clip" }}>
      <Navbar />

      <section className="px-5 sm:px-8 md:px-10 py-16 grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-6xl mx-auto w-full items-center">
        <FadeIn x={-40}>
          <div className="relative w-full aspect-[3/4] max-w-xs mx-auto rounded-[30px] overflow-hidden">
            <Image
              src={ebook.cover_image_url}
              alt={ebook.title}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 25vw, 70vw"
              priority
            />
          </div>
        </FadeIn>

        <FadeIn x={40}>
          <div className="flex flex-col gap-5">
            <span className="text-[#D7E2EA]/60 uppercase tracking-widest text-sm">
              {ebook.category}
            </span>
            <h1 className="text-[#D7E2EA] font-black uppercase text-3xl sm:text-4xl md:text-5xl leading-tight">
              {ebook.title}
            </h1>
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

            <div className="mt-6">
              <LeadCaptureFlow
                ebookSlug={ebook.slug}
                defaultTopic={ebook.category}
                settings={settings}
              />
            </div>
          </div>
        </FadeIn>
      </section>

      <Footer text={settings.footer_text} />
    </main>
  );
}
