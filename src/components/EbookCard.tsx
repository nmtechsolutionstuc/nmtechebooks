import Image from "next/image";
import Link from "next/link";
import PriceTag from "@/components/PriceTag";
import type { PublicEbook } from "@/lib/types";

export default function EbookCard({ ebook }: { ebook: PublicEbook }) {
  return (
    <Link
      href={`/ebooks/${ebook.slug}`}
      className="group flex flex-col gap-4 rounded-[30px] border-2 border-[#D7E2EA]/20 p-4 hover:border-[#D7E2EA]/50 transition-colors duration-200"
    >
      <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden">
        <Image
          src={ebook.cover_image_url}
          alt={ebook.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 40vw, 90vw"
        />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-[#D7E2EA]/60 uppercase tracking-widest text-xs">
          {ebook.category}
        </span>
        <h3 className="text-[#D7E2EA] font-medium uppercase text-lg leading-snug">
          {ebook.title}
        </h3>
        <p className="text-[#D7E2EA]/70 text-sm font-light leading-relaxed line-clamp-2 whitespace-pre-line">
          {ebook.short_description}
        </p>
        <PriceTag
          originalPrice={ebook.original_price}
          currentPrice={ebook.current_price}
          size="sm"
        />
      </div>
    </Link>
  );
}
