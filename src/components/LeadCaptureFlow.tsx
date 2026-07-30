"use client";

import { useState, type FormEvent } from "react";
import BotonPrincipal from "@/components/BotonPrincipal";
import BotonSecundario from "@/components/BotonSecundario";
import FadeIn from "@/components/FadeIn";
import { formatPrice } from "@/lib/price";
import type { PaymentMethod, PostLeadEbookData, SiteSettings } from "@/lib/types";

type Status = "form" | "loading" | "success" | "error";
type Intent = "leer" | "comprar";

const fieldLabel = "text-xs uppercase tracking-wider text-[#D7E2EA]/60";
const fieldInput =
  "rounded-2xl border-2 border-[#D7E2EA]/30 bg-transparent px-5 py-3 text-[#D7E2EA] placeholder:text-[#D7E2EA]/40 focus:outline-none focus:border-[#FF9500]";

export default function LeadCaptureFlow({
  ebookSlug,
  defaultTopic,
  settings,
}: {
  ebookSlug: string;
  defaultTopic: string;
  settings: SiteSettings;
}) {
  const [status, setStatus] = useState<Status>("form");
  const [errorMessage, setErrorMessage] = useState("");
  const [unlocked, setUnlocked] = useState<PostLeadEbookData | null>(null);
  const [intent, setIntent] = useState<Intent>("leer");
  // Cuál de los dos botones se clickeó, para mostrar "Enviando..." solo en ese
  // (antes se mostraba siempre en el botón de "leer gratis", sin importar cuál se tocara).
  const [submittingIntent, setSubmittingIntent] = useState<Intent | null>(null);
  const [showTransferencia, setShowTransferencia] = useState(false);
  // Cuándo se mostró el formulario: si se envía casi al instante, es casi
  // seguro un bot (un humano tarda al menos un par de segundos en completarlo).
  const [renderedAt] = useState(() => Date.now());

  const topics = settings.lead_topics;
  const initialTopic = topics.includes(defaultTopic) ? defaultTopic : topics[0];

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    // FormData no incluye el botón submit clickeado salvo que se pase
    // explícitamente como "submitter" (así sabemos qué intent se eligió).
    const submitter = (e.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
    const formData = new FormData(e.currentTarget, submitter ?? undefined);
    const submittedIntent: Intent = formData.get("intent") === "comprar" ? "comprar" : "leer";
    setIntent(submittedIntent);
    setSubmittingIntent(submittedIntent);

    const payload = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      topic: String(formData.get("topic") ?? ""),
      interests: String(formData.get("interests") ?? ""),
      intent: submittedIntent,
      ebookSlug,
      website: String(formData.get("website") ?? ""),
      renderedAt,
      discountCode: String(formData.get("discountCode") ?? ""),
    };

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error ?? "No pudimos procesar tu solicitud. Probá de nuevo en un rato.");
        setStatus("error");
        return;
      }

      setUnlocked(data.ebook as PostLeadEbookData);
      setStatus("success");
    } catch {
      setErrorMessage("No pudimos conectar con el servidor. Probá de nuevo en un rato.");
      setStatus("error");
    }
  }

  if (status === "success" && unlocked) {
    const mailHref = `mailto:${settings.contact_email}?subject=${encodeURIComponent(
      "Comprobante de transferencia"
    )}`;
    const whatsappHref = settings.contact_whatsapp
      ? `https://wa.me/${settings.contact_whatsapp}`
      : null;

    // Deja registrado en el lead qué medio de pago eligió, apenas lo clickea
    // (no bloquea la navegación al link externo ni el toggle de transferencia).
    const leadId = unlocked.lead_id;
    function recordPaymentChoice(paymentMethod: PaymentMethod) {
      fetch(`/api/leads/${leadId}/payment-choice`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentMethod }),
      }).catch(() => {});
    }

    const buyBlock = (
      <div className="rounded-[30px] border-2 border-[#FF9500]/40 p-6 sm:p-8 flex flex-col gap-4">
        <h3 className="text-[#D7E2EA] font-medium uppercase text-lg">{settings.buy_heading}</h3>
        <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
          {unlocked.hotmart_sale_url && (
            <BotonPrincipal
              href={unlocked.hotmart_sale_url}
              target="_blank"
              onClick={() => recordPaymentChoice("hotmart")}
            >
              Comprar por Hotmart
            </BotonPrincipal>
          )}
          {unlocked.tiendanube_sale_url && (
            <BotonPrincipal
              href={unlocked.tiendanube_sale_url}
              target="_blank"
              onClick={() => recordPaymentChoice("tiendanube")}
            >
              Comprar por Tiendanube
            </BotonPrincipal>
          )}
          <BotonSecundario
            onClick={() => {
              setShowTransferencia((v) => !v);
              recordPaymentChoice("transferencia");
            }}
          >
            Pagar por transferencia
          </BotonSecundario>
        </div>

        {showTransferencia && (
          <div className="mt-2 text-[#D7E2EA]/80 font-light leading-relaxed text-sm sm:text-base">
            <p>
              <strong>{settings.transfer_amount_label}</strong>{" "}
              {unlocked.discount_applied ? (
                <>
                  <span className="line-through text-[#D7E2EA]/40 mr-2">
                    {formatPrice(unlocked.transfer_original_price)}
                  </span>
                  <span className="text-[#FF9500] font-semibold">
                    {formatPrice(unlocked.transfer_price)}
                  </span>{" "}
                  <span className="text-[#FF9500] text-xs">
                    (-{unlocked.discount_percent}% {settings.discount_applied_note})
                  </span>
                </>
              ) : (
                formatPrice(unlocked.transfer_price)
              )}
            </p>
            {unlocked.discount_error && (
              <p className="text-red-400 text-xs mt-1">{unlocked.discount_error}</p>
            )}
            <p><strong>Banco:</strong> {unlocked.bank_name}</p>
            <p><strong>Alias:</strong> {unlocked.bank_alias}</p>
            <p><strong>CBU:</strong> {unlocked.bank_cbu}</p>
            <p className="mt-3">{settings.transfer_instructions}</p>
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start mt-2">
              <a href={mailHref} className="text-[#FF9500] underline underline-offset-2">
                Escribinos por mail
              </a>
              {whatsappHref && (
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#FF9500] underline underline-offset-2"
                >
                  Escribinos por WhatsApp
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    );

    const chapterBlock = (
      <div className="rounded-[30px] border-2 border-[#D7E2EA]/30 p-6 sm:p-8">
        <h3 className="text-[#D7E2EA] font-medium uppercase text-lg mb-4">
          {settings.chapter_heading}
        </h3>
        {unlocked.free_chapter || unlocked.free_chapter_pdf_url ? (
          <>
            {unlocked.free_chapter && (
              <p className="text-[#D7E2EA]/80 font-light leading-relaxed whitespace-pre-line">
                {unlocked.free_chapter}
              </p>
            )}
            {unlocked.free_chapter_pdf_url && (
              <div className={unlocked.free_chapter ? "mt-4" : ""}>
                <BotonSecundario href={unlocked.free_chapter_pdf_url} target="_blank">
                  Ver capítulo en PDF
                </BotonSecundario>
              </div>
            )}
            <p className="text-[#D7E2EA]/50 text-xs mt-4">{settings.chapter_email_note}</p>
          </>
        ) : (
          <p className="text-[#D7E2EA]/80 font-light leading-relaxed">
            {settings.chapter_missing_text}
          </p>
        )}
      </div>
    );

    return (
      <FadeIn>
        <div className="flex flex-col gap-8 max-w-2xl mx-auto lg:mx-0 text-center lg:text-left">
          {intent === "comprar" ? (
            buyBlock
          ) : (
            <>
              {chapterBlock}
              {buyBlock}
            </>
          )}
        </div>
      </FadeIn>
    );
  }

  return (
    <div className="max-w-md flex flex-col gap-4 mx-auto lg:mx-0 text-center lg:text-left">
      <h3 className="text-[#D7E2EA] font-medium uppercase text-lg">
        ¿Querés leer el primer capítulo gratis, o comprarlo directamente?
      </h3>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Honeypot anti-bots: campo invisible que un humano nunca completa */}
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          className="absolute -left-[9999px] w-px h-px opacity-0"
          aria-hidden="true"
        />

        <label className="flex flex-col gap-1">
          <span className={fieldLabel}>Nombre</span>
          <input
            type="text"
            name="name"
            placeholder="Tu nombre"
            required
            minLength={2}
            maxLength={100}
            className={fieldInput}
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className={fieldLabel}>Mail</span>
          <input
            type="email"
            name="email"
            placeholder="tu@mail.com"
            required
            maxLength={200}
            className={fieldInput}
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className={fieldLabel}>¿Qué temática te interesa?</span>
          <select name="topic" required defaultValue={initialTopic} className={fieldInput}>
            {topics.map((topic) => (
              <option key={topic} value={topic}>
                {topic}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1">
          <span className={fieldLabel}>
            ¿Algo más que quieras contarnos? <span className="normal-case text-[#D7E2EA]/40">(opcional)</span>
          </span>
          <textarea
            name="interests"
            placeholder="Ej: me interesa sobre todo aplicar IA en marketing..."
            maxLength={500}
            rows={2}
            className={fieldInput}
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className={fieldLabel}>
            {settings.discount_field_label}{" "}
            {settings.discount_field_hint && (
              <span className="normal-case text-[#D7E2EA]/40">{settings.discount_field_hint}</span>
            )}
          </span>
          <input
            type="text"
            name="discountCode"
            placeholder={settings.discount_field_placeholder}
            maxLength={50}
            className={fieldInput}
          />
        </label>

        {status === "error" && (
          <p className="text-red-400 text-sm">{errorMessage}</p>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
          <BotonPrincipal type="submit" name="intent" value="leer" disabled={status === "loading"}>
            {status === "loading" && submittingIntent === "leer"
              ? "Enviando..."
              : "Quiero el primer capítulo gratis"}
          </BotonPrincipal>
          <BotonSecundario type="submit" name="intent" value="comprar" disabled={status === "loading"}>
            {status === "loading" && submittingIntent === "comprar" ? "Enviando..." : "Ya lo quiero comprar"}
          </BotonSecundario>
        </div>
      </form>
    </div>
  );
}
