"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getStoredConsent, setStoredConsent, type ConsentValue } from "@/lib/meta-pixel";

export default function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage no existe en SSR, hay que leerlo recién en el cliente.
    setVisible(getStoredConsent() === null);
  }, []);

  if (!visible) return null;

  function handle(value: ConsentValue) {
    setStoredConsent(value);
    setVisible(false);
  }

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 px-4 py-4 sm:px-6">
      <div className="mx-auto max-w-3xl rounded-2xl border border-[#D7E2EA]/15 bg-[#0C0C0C] shadow-lg shadow-black/40 p-5 flex flex-col sm:flex-row sm:items-center gap-4">
        <p className="text-[#D7E2EA]/80 text-xs sm:text-sm leading-relaxed flex-1">
          Usamos cookies propias y de terceros (Meta) para medir el rendimiento de nuestras
          campañas y mostrarte publicidad relevante. Podés aceptarlas o rechazarlas — el sitio
          funciona igual en ambos casos. Más info en nuestra{" "}
          <Link
            href="/politica-de-privacidad"
            className="underline underline-offset-2 hover:text-[#D7E2EA]"
          >
            Política de Privacidad
          </Link>
          .
        </p>
        <div className="flex gap-3 shrink-0">
          <button
            type="button"
            onClick={() => handle("rejected")}
            className="rounded-full border border-[#D7E2EA]/40 text-[#D7E2EA] uppercase text-xs tracking-wider px-5 py-2.5 hover:bg-[#D7E2EA]/10 transition-colors"
          >
            Rechazar
          </button>
          <button
            type="button"
            onClick={() => handle("accepted")}
            className="rounded-full bg-[#FF9500] text-[#0C0C0C] font-medium uppercase text-xs tracking-wider px-5 py-2.5 hover:brightness-110 transition-[filter]"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}
