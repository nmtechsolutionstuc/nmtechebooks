"use client";

import { usePathname } from "next/navigation";
import MetaPixel from "@/components/analytics/MetaPixel";
import CookieConsentBanner from "@/components/analytics/CookieConsentBanner";

/** No tiene sentido mostrarle el banner de cookies de marketing a nosotros mismos en /admin. */
export default function AnalyticsGate() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

  return (
    <>
      <MetaPixel />
      <CookieConsentBanner />
    </>
  );
}
