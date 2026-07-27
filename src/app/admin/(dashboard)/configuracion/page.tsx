"use client";

import { useEffect, useState, type FormEvent } from "react";
import Image from "next/image";
import type { SiteSettings } from "@/lib/types";
import ContentItemListEditor from "@/components/admin/ContentItemListEditor";
import StringListEditor from "@/components/admin/StringListEditor";

const inputClass =
  "rounded-full border border-[#D7E2EA]/30 bg-transparent px-4 py-2 text-[#D7E2EA] text-sm";
const textareaClass =
  "rounded-2xl border border-[#D7E2EA]/30 bg-transparent px-4 py-3 text-[#D7E2EA] text-sm";

function Section({
  title,
  description,
  visible,
  children,
}: {
  title: string;
  description?: string;
  visible?: { value: boolean; onChange: (v: boolean) => void };
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-[#D7E2EA]/15 p-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-[#D7E2EA] uppercase text-sm tracking-wider">{title}</h2>
        {visible && (
          <label className="flex items-center gap-2 text-xs text-[#D7E2EA]/70 shrink-0">
            <input
              type="checkbox"
              checked={visible.value}
              onChange={(e) => visible.onChange(e.target.checked)}
            />
            Mostrar en el sitio
          </label>
        )}
      </div>
      {description && <p className="text-[#D7E2EA]/50 text-xs">{description}</p>}
      {children}
    </div>
  );
}

export default function AdminConfiguracionPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadingHero, setUploadingHero] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((data) => setSettings(data.settings));
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!settings) return;
    setLoading(true);
    setMessage("");

    const payload = {
      hero_kicker: settings.hero_kicker,
      hero_heading: settings.hero_heading,
      hero_tagline: settings.hero_tagline,
      hero_cta_label: settings.hero_cta_label,
      marquee_visible: settings.marquee_visible,
      featured_ebook_visible: settings.featured_ebook_visible,
      why_visible: settings.why_visible,
      also_interested_visible: settings.also_interested_visible,
      about_visible: settings.about_visible,
      lead_topics: settings.lead_topics,
      free_chapter_email_subject: settings.free_chapter_email_subject,
      free_chapter_email_body: settings.free_chapter_email_body,
      why_heading: settings.why_heading,
      why_reasons: settings.why_reasons,
      about_heading: settings.about_heading,
      about_text: settings.about_text,
      custom_solution_enabled: settings.custom_solution_enabled,
      custom_solution_text: settings.custom_solution_text,
      custom_solution_url: settings.custom_solution_url,
      footer_text: settings.footer_text,
      contact_heading: settings.contact_heading,
      contact_text: settings.contact_text,
      contact_email: settings.contact_email,
      contact_whatsapp: settings.contact_whatsapp,
      buy_heading: settings.buy_heading,
      transfer_instructions: settings.transfer_instructions,
      chapter_heading: settings.chapter_heading,
      chapter_missing_text: settings.chapter_missing_text,
      chapter_email_note: settings.chapter_email_note,
      discount_field_label: settings.discount_field_label,
      discount_field_hint: settings.discount_field_hint,
      discount_field_placeholder: settings.discount_field_placeholder,
      transfer_amount_label: settings.transfer_amount_label,
      discount_applied_note: settings.discount_applied_note,
      terms_notice_text: settings.terms_notice_text,
      terms_heading: settings.terms_heading,
      terms_content: settings.terms_content,
      affiliates_heading: settings.affiliates_heading,
      affiliates_intro: settings.affiliates_intro,
      affiliates_steps: settings.affiliates_steps,
    };

    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setMessage(data.error ?? "Ocurrió un error.");
      return;
    }
    setSettings(data.settings);
    setMessage("Guardado.");
  }

  async function handleHeroImageUpload(file: File) {
    setUploadingHero(true);
    setMessage("");

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/admin/settings/hero-image", { method: "POST", body: formData });
    const data = await res.json();
    setUploadingHero(false);

    if (!res.ok) {
      setMessage(data.error ?? "No pudimos subir la imagen.");
      return;
    }
    setSettings(data.settings);
    setMessage("Imagen del hero actualizada.");
  }

  if (!settings) {
    return <p className="text-[#D7E2EA]/60">Cargando...</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8 max-w-2xl">
      <div className="flex items-center justify-between">
        <h1 className="text-[#D7E2EA] font-medium uppercase text-2xl">Configuración</h1>
        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-[#FF9500] text-[#0C0C0C] font-medium uppercase text-xs tracking-wider px-6 py-2.5 disabled:opacity-50"
        >
          {loading ? "Guardando..." : "Guardar todo"}
        </button>
      </div>
      {message && <p className="text-sm text-[#D7E2EA]/80">{message}</p>}

      <Section title="Hero (Home)" description="Lo primero que se ve al entrar al sitio.">
        <label className="flex flex-col gap-1 text-sm text-[#D7E2EA]">
          Texto pequeño arriba del título
          <input
            type="text"
            value={settings.hero_kicker}
            onChange={(e) => setSettings({ ...settings, hero_kicker: e.target.value })}
            className={inputClass}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-[#D7E2EA]">
          Título grande
          <input
            type="text"
            value={settings.hero_heading}
            onChange={(e) => setSettings({ ...settings, hero_heading: e.target.value })}
            className={inputClass}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-[#D7E2EA]">
          Bajada
          <textarea
            value={settings.hero_tagline}
            onChange={(e) => setSettings({ ...settings, hero_tagline: e.target.value })}
            rows={2}
            className={textareaClass}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-[#D7E2EA]">
          Texto del botón
          <input
            type="text"
            value={settings.hero_cta_label}
            onChange={(e) => setSettings({ ...settings, hero_cta_label: e.target.value })}
            className={inputClass}
          />
        </label>
        <div className="flex items-center gap-4">
          <div className="relative w-20 h-20 rounded-full overflow-hidden bg-[#D7E2EA]/10 shrink-0">
            {settings.hero_image_url && (
              <Image
                src={settings.hero_image_url}
                alt=""
                fill
                className="object-cover"
                sizes="80px"
              />
            )}
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs uppercase text-[#D7E2EA]/60">
              Imagen del hero (opcional, si no hay se muestra un ícono)
            </label>
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              disabled={uploadingHero}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleHeroImageUpload(file);
              }}
              className="text-[#D7E2EA] text-sm"
            />
            {uploadingHero && <p className="text-[#D7E2EA]/60 text-xs">Subiendo...</p>}
          </div>
        </div>
      </Section>

      <Section
        title="Marquee de portadas"
        visible={{
          value: settings.marquee_visible,
          onChange: (v) => setSettings({ ...settings, marquee_visible: v }),
        }}
      >
        <p className="text-[#D7E2EA]/50 text-xs">
          Fila de portadas que se mueve con el scroll, debajo del hero. Usa las portadas de los
          ebooks cargados, no tiene texto propio.
        </p>
      </Section>

      <Section
        title="Ebook destacado"
        description="El ebook con formulario embebido que aparece grande en el Home."
        visible={{
          value: settings.featured_ebook_visible,
          onChange: (v) => setSettings({ ...settings, featured_ebook_visible: v }),
        }}
      >
        <p className="text-[#D7E2EA]/50 text-xs">
          El contenido (título, mensaje de convencimiento, precio, portada) se edita en{" "}
          <strong>/admin/ebooks</strong>. Acá solo controlás si se muestra.
        </p>
      </Section>

      <Section
        title="Por qué nuestros ebooks"
        visible={{ value: settings.why_visible, onChange: (v) => setSettings({ ...settings, why_visible: v }) }}
      >
        <label className="flex flex-col gap-1 text-sm text-[#D7E2EA]">
          Título de la sección
          <input
            type="text"
            value={settings.why_heading}
            onChange={(e) => setSettings({ ...settings, why_heading: e.target.value })}
            className={inputClass}
          />
        </label>
        <ContentItemListEditor
          items={settings.why_reasons}
          onChange={(why_reasons) => setSettings({ ...settings, why_reasons })}
          maxItems={8}
        />
      </Section>

      <Section
        title="También te puede interesar"
        description="Grid con el resto de los ebooks (si hay más de uno)."
        visible={{
          value: settings.also_interested_visible,
          onChange: (v) => setSettings({ ...settings, also_interested_visible: v }),
        }}
      >
        <p className="text-[#D7E2EA]/50 text-xs">
          No tiene texto propio: lista automáticamente los ebooks que no son el destacado.
        </p>
      </Section>

      <Section
        title="Quiénes somos"
        visible={{ value: settings.about_visible, onChange: (v) => setSettings({ ...settings, about_visible: v }) }}
      >
        <label className="flex flex-col gap-1 text-sm text-[#D7E2EA]">
          Título
          <input
            type="text"
            value={settings.about_heading}
            onChange={(e) => setSettings({ ...settings, about_heading: e.target.value })}
            className={inputClass}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-[#D7E2EA]">
          Texto
          <textarea
            value={settings.about_text}
            onChange={(e) => setSettings({ ...settings, about_text: e.target.value })}
            rows={3}
            className={textareaClass}
          />
        </label>
      </Section>

      <Section
        title='Sección "¿Necesitás una solución a medida?"'
        description="Se muestra en el Home (dentro de Quiénes somos) y en Contacto."
        visible={{
          value: settings.custom_solution_enabled,
          onChange: (v) => setSettings({ ...settings, custom_solution_enabled: v }),
        }}
      >
        <textarea
          value={settings.custom_solution_text}
          onChange={(e) => setSettings({ ...settings, custom_solution_text: e.target.value })}
          rows={2}
          className={textareaClass}
        />
        <input
          type="url"
          value={settings.custom_solution_url}
          onChange={(e) => setSettings({ ...settings, custom_solution_url: e.target.value })}
          placeholder="https://nmtechsolutions.vercel.app/"
          className={inputClass}
        />
      </Section>

      <Section title="Contacto">
        <label className="flex flex-col gap-1 text-sm text-[#D7E2EA]">
          Título
          <input
            type="text"
            value={settings.contact_heading}
            onChange={(e) => setSettings({ ...settings, contact_heading: e.target.value })}
            className={inputClass}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-[#D7E2EA]">
          Texto
          <textarea
            value={settings.contact_text}
            onChange={(e) => setSettings({ ...settings, contact_text: e.target.value })}
            rows={2}
            className={textareaClass}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-[#D7E2EA]">
          Mail de contacto
          <input
            type="email"
            value={settings.contact_email}
            onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
            className={inputClass}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-[#D7E2EA]">
          WhatsApp (opcional, solo números con código de país, ej. 5493811234567)
          <input
            type="text"
            inputMode="numeric"
            value={settings.contact_whatsapp}
            onChange={(e) =>
              setSettings({ ...settings, contact_whatsapp: e.target.value.replace(/\D/g, "") })
            }
            placeholder="5493811234567"
            className={inputClass}
          />
        </label>
      </Section>

      <Section
        title="Compra y entrega del capítulo"
        description="Textos que se muestran después de completar el formulario de cada ebook (leer gratis o comprar)."
      >
        <label className="flex flex-col gap-1 text-sm text-[#D7E2EA]">
          Título del bloque de compra
          <input
            type="text"
            value={settings.buy_heading}
            onChange={(e) => setSettings({ ...settings, buy_heading: e.target.value })}
            className={inputClass}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-[#D7E2EA]">
          Instrucciones de transferencia (los links de mail/WhatsApp se agregan solos, con los
          datos de arriba)
          <textarea
            value={settings.transfer_instructions}
            onChange={(e) => setSettings({ ...settings, transfer_instructions: e.target.value })}
            rows={2}
            className={textareaClass}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-[#D7E2EA]">
          Título del bloque del capítulo gratis
          <input
            type="text"
            value={settings.chapter_heading}
            onChange={(e) => setSettings({ ...settings, chapter_heading: e.target.value })}
            className={inputClass}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-[#D7E2EA]">
          Texto cuando todavía no se cargó el capítulo
          <textarea
            value={settings.chapter_missing_text}
            onChange={(e) => setSettings({ ...settings, chapter_missing_text: e.target.value })}
            rows={2}
            className={textareaClass}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-[#D7E2EA]">
          Nota de &quot;también te lo mandamos por mail&quot;
          <input
            type="text"
            value={settings.chapter_email_note}
            onChange={(e) => setSettings({ ...settings, chapter_email_note: e.target.value })}
            className={inputClass}
          />
        </label>

        <p className="text-[#D7E2EA]/50 text-xs pt-2">
          Código de descuento (solo se aplica pagando por transferencia; los códigos en sí se
          crean en <strong>/admin/descuentos</strong>):
        </p>
        <label className="flex flex-col gap-1 text-sm text-[#D7E2EA]">
          Etiqueta del campo
          <input
            type="text"
            value={settings.discount_field_label}
            onChange={(e) => setSettings({ ...settings, discount_field_label: e.target.value })}
            className={inputClass}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-[#D7E2EA]">
          Aclaración chica junto a la etiqueta
          <input
            type="text"
            value={settings.discount_field_hint}
            onChange={(e) => setSettings({ ...settings, discount_field_hint: e.target.value })}
            className={inputClass}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-[#D7E2EA]">
          Placeholder del campo
          <input
            type="text"
            value={settings.discount_field_placeholder}
            onChange={(e) =>
              setSettings({ ...settings, discount_field_placeholder: e.target.value })
            }
            className={inputClass}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-[#D7E2EA]">
          Etiqueta del monto a transferir
          <input
            type="text"
            value={settings.transfer_amount_label}
            onChange={(e) => setSettings({ ...settings, transfer_amount_label: e.target.value })}
            className={inputClass}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-[#D7E2EA]">
          Nota junto al porcentaje aplicado (ej. &quot;-10% {"{esto}"}&quot;)
          <input
            type="text"
            value={settings.discount_applied_note}
            onChange={(e) => setSettings({ ...settings, discount_applied_note: e.target.value })}
            className={inputClass}
          />
        </label>
      </Section>

      <Section
        title="Términos y Condiciones"
        description='Aviso corto que aparece debajo del precio de cada ebook (ej. "Al comprar, aceptás nuestros Términos y Condiciones"), con link a la página completa.'
      >
        <label className="flex flex-col gap-1 text-sm text-[#D7E2EA]">
          Aviso corto (cerca del precio)
          <input
            type="text"
            value={settings.terms_notice_text}
            onChange={(e) => setSettings({ ...settings, terms_notice_text: e.target.value })}
            className={inputClass}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-[#D7E2EA]">
          Título de la página /terminos
          <input
            type="text"
            value={settings.terms_heading}
            onChange={(e) => setSettings({ ...settings, terms_heading: e.target.value })}
            className={inputClass}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-[#D7E2EA]">
          Texto completo de los Términos y Condiciones
          <textarea
            value={settings.terms_content}
            onChange={(e) => setSettings({ ...settings, terms_content: e.target.value })}
            rows={14}
            className={`${textareaClass} font-mono text-xs`}
          />
        </label>
      </Section>

      <Section title="Afiliados">
        <label className="flex flex-col gap-1 text-sm text-[#D7E2EA]">
          Título
          <input
            type="text"
            value={settings.affiliates_heading}
            onChange={(e) => setSettings({ ...settings, affiliates_heading: e.target.value })}
            className={inputClass}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-[#D7E2EA]">
          Texto introductorio
          <textarea
            value={settings.affiliates_intro}
            onChange={(e) => setSettings({ ...settings, affiliates_intro: e.target.value })}
            rows={3}
            className={textareaClass}
          />
        </label>
        <p className="text-[#D7E2EA]/50 text-xs">
          Pasos de cómo funciona el programa de afiliados:
        </p>
        <ContentItemListEditor
          items={settings.affiliates_steps}
          onChange={(affiliates_steps) => setSettings({ ...settings, affiliates_steps })}
          maxItems={6}
        />
        <p className="text-[#D7E2EA]/50 text-xs">
          El link de afiliado de cada ebook se carga en <strong>/admin/ebooks</strong>.
        </p>
      </Section>

      <Section
        title="Formulario de captura de lead"
        description='Temáticas del selector "¿qué temática te interesa?" (se muestra en cada ebook y en el Home).'
      >
        <StringListEditor
          items={settings.lead_topics}
          onChange={(lead_topics) => setSettings({ ...settings, lead_topics })}
        />
      </Section>

      <Section
        title="Mail del capítulo gratis"
        description="Se manda automáticamente apenas alguien completa el formulario (si el ebook tiene capítulo gratis cargado en /admin/ebooks). Variables: {nombre}, {ebook}, {capitulo}."
      >
        <label className="flex flex-col gap-1 text-sm text-[#D7E2EA]">
          Asunto
          <input
            type="text"
            value={settings.free_chapter_email_subject}
            onChange={(e) => setSettings({ ...settings, free_chapter_email_subject: e.target.value })}
            className={inputClass}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-[#D7E2EA]">
          Cuerpo del mensaje
          <textarea
            value={settings.free_chapter_email_body}
            onChange={(e) => setSettings({ ...settings, free_chapter_email_body: e.target.value })}
            rows={8}
            className={`${textareaClass} font-mono text-xs`}
          />
        </label>
      </Section>

      <Section title="Footer">
        <label className="flex flex-col gap-1 text-sm text-[#D7E2EA]">
          Texto (el año se agrega automáticamente antes)
          <input
            type="text"
            value={settings.footer_text}
            onChange={(e) => setSettings({ ...settings, footer_text: e.target.value })}
            className={inputClass}
          />
        </label>
      </Section>

      <button
        type="submit"
        disabled={loading}
        className="self-start rounded-full bg-[#FF9500] text-[#0C0C0C] font-medium uppercase text-xs tracking-wider px-6 py-2.5 disabled:opacity-50"
      >
        {loading ? "Guardando..." : "Guardar todo"}
      </button>
    </form>
  );
}
