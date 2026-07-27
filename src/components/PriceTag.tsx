import { formatPrice, discountPercent } from "@/lib/price";

export default function PriceTag({
  originalPrice,
  currentPrice,
  size = "md",
}: {
  originalPrice: number;
  currentPrice: number;
  size?: "sm" | "md" | "lg";
}) {
  const hasOffer = originalPrice > currentPrice;
  const currentSize =
    size === "lg" ? "text-3xl sm:text-4xl" : size === "md" ? "text-xl sm:text-2xl" : "text-lg";
  const originalSize = size === "lg" ? "text-lg" : "text-sm";

  return (
    <div className="flex items-center gap-3 flex-wrap">
      {hasOffer && (
        <span className={`text-[#D7E2EA]/50 line-through ${originalSize}`}>
          {formatPrice(originalPrice)}
        </span>
      )}
      <span className={`text-[#FF9500] font-semibold ${currentSize}`}>
        {formatPrice(currentPrice)}
      </span>
      {hasOffer && (
        <span className="rounded-full bg-[#FF9500]/15 text-[#FF9500] text-xs font-medium uppercase tracking-wider px-3 py-1">
          {discountPercent(originalPrice, currentPrice)}% OFF
        </span>
      )}
    </div>
  );
}
