export type LeadStatus = "nuevo" | "contactado" | "comprado";
export type PaymentMethod = "hotmart" | "transferencia" | "tiendanube";
export type LeadIntent = "leer" | "comprar";

export interface Ebook {
  id: string;
  slug: string;
  title: string;
  short_description: string;
  long_description: string;
  /** Mensaje corto y persuasivo para la sección destacada del Home, editable por ebook desde /admin. */
  promo_message: string;
  category: string;
  cover_image_url: string;
  free_chapter: string;
  /** URL pública del PDF del primer capítulo (bucket free-chapters). Se entrega recién tras capturar el lead, igual que free_chapter. */
  free_chapter_pdf_url: string;
  original_price: number;
  current_price: number;
  hotmart_sale_url: string;
  hotmart_affiliate_url: string;
  tiendanube_sale_url: string;
  bank_alias: string;
  bank_cbu: string;
  bank_name: string;
  private_file_path: string;
  featured: boolean;
  /** false = borrador: oculto del sitio público, sigue visible/editable en /admin. */
  published: boolean;
  /** false = solo se puede pedir la versión/capítulo gratis: se oculta toda opción de compra para este ebook. */
  sales_enabled: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Campos de un ebook seguros para mostrar ANTES de que la persona complete el
 * formulario de captura de lead: nada de capítulo gratis, link de compra en
 * Hotmart ni datos bancarios (eso se entrega recién en la respuesta de
 * POST /api/leads, ver PostLeadEbookData más abajo).
 */
export type PublicEbook = Pick<
  Ebook,
  | "id"
  | "slug"
  | "title"
  | "short_description"
  | "long_description"
  | "promo_message"
  | "category"
  | "cover_image_url"
  | "original_price"
  | "current_price"
  | "hotmart_affiliate_url"
  | "featured"
  | "sales_enabled"
  | "created_at"
  | "updated_at"
>;

export function toPublicEbook(ebook: Ebook): PublicEbook {
  const {
    id,
    slug,
    title,
    short_description,
    long_description,
    promo_message,
    category,
    cover_image_url,
    original_price,
    current_price,
    hotmart_affiliate_url,
    featured,
    sales_enabled,
    created_at,
    updated_at,
  } = ebook;
  return {
    id,
    slug,
    title,
    short_description,
    long_description,
    promo_message,
    category,
    cover_image_url,
    original_price,
    current_price,
    hotmart_affiliate_url,
    featured,
    sales_enabled,
    created_at,
    updated_at,
  };
}

/** Datos que se entregan recién después de capturar el lead: capítulo gratis + opciones de compra. */
export interface PostLeadEbookData {
  /** Id del lead recién creado, para poder registrar qué medio de pago eligió (ver /api/leads/[id]/payment-choice). */
  lead_id: string;
  free_chapter: string;
  free_chapter_pdf_url: string;
  hotmart_sale_url: string;
  tiendanube_sale_url: string;
  bank_alias: string;
  bank_cbu: string;
  bank_name: string;
  /** Precio de lista, sin descuento (referencia para mostrar tachado si hubo descuento). */
  transfer_original_price: number;
  /** Monto final a transferir: igual al original si no hubo código válido aplicado. */
  transfer_price: number;
  /** Si se aplicó un descuento por transferencia (código válido). */
  discount_applied: boolean;
  discount_percent: number | null;
  /** Si el comprador tipeó un código pero no era válido/estaba vencido, para avisarle. */
  discount_error: string | null;
}

export function toPostLeadEbookData(
  leadId: string,
  ebook: Ebook,
  discount: { applied: boolean; percent: number | null; error: string | null; finalPrice: number }
): PostLeadEbookData {
  return {
    lead_id: leadId,
    free_chapter: ebook.free_chapter,
    free_chapter_pdf_url: ebook.free_chapter_pdf_url,
    hotmart_sale_url: ebook.hotmart_sale_url,
    tiendanube_sale_url: ebook.tiendanube_sale_url,
    bank_alias: ebook.bank_alias,
    bank_cbu: ebook.bank_cbu,
    bank_name: ebook.bank_name,
    transfer_original_price: ebook.current_price,
    transfer_price: discount.finalPrice,
    discount_applied: discount.applied,
    discount_percent: discount.percent,
    discount_error: discount.error,
  };
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  topic: string;
  /** Campo libre y opcional: algo más que el lead quiera contarnos. */
  interests: string;
  /** Qué eligió en el formulario: leer el capítulo gratis primero, o ir directo a comprar. */
  intent: LeadIntent;
  /** Código de descuento aplicado (si hubo uno válido), solo afecta el precio por transferencia. */
  discount_code: string | null;
  ebook_id: string | null;
  status: LeadStatus;
  payment_method: PaymentMethod | null;
  payment_confirmed_at: string | null;
  created_at: string;
}

export interface MailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  created_at: string;
  updated_at: string;
}

/** Un mail que efectivamente se mandó a un lead (manual o automático), para mostrar como historial en /admin. */
export interface MailLogEntry {
  id: string;
  lead_id: string;
  subject: string;
  template_name: string;
  sent_at: string;
}

export interface ContentItem {
  title: string;
  description: string;
}

export interface SiteSettings {
  id: 1;

  hero_kicker: string;
  hero_heading: string;
  hero_tagline: string;
  hero_cta_label: string;
  hero_image_url: string;
  /** "circle" = retrato circular con efecto magnet (default). "banner" = imagen ancha, todo el ancho de pantalla. */
  hero_image_style: "circle" | "banner";

  marquee_visible: boolean;
  featured_ebook_visible: boolean;
  why_visible: boolean;
  also_interested_visible: boolean;
  about_visible: boolean;

  lead_topics: string[];

  /** Variables disponibles: {nombre}, {ebook}, {capitulo} */
  free_chapter_email_subject: string;
  free_chapter_email_body: string;

  why_heading: string;
  why_reasons: ContentItem[];

  about_heading: string;
  about_text: string;

  custom_solution_enabled: boolean;
  custom_solution_text: string;
  custom_solution_url: string;

  footer_text: string;

  contact_heading: string;
  contact_text: string;
  contact_email: string;
  /** Número en formato internacional sin "+" ni espacios, ej "5493811234567". Vacío = no se muestra el link de WhatsApp. */
  contact_whatsapp: string;

  /** Se agrega al final de TODOS los mails que manda el sitio. Variable disponible: {contact_email}. */
  email_footer_note: string;

  buy_heading: string;
  transfer_instructions: string;
  chapter_heading: string;
  chapter_missing_text: string;
  chapter_email_note: string;

  discount_field_label: string;
  discount_field_hint: string;
  discount_field_placeholder: string;
  transfer_amount_label: string;
  /** Se arma como "-{porcentaje}% {discount_applied_note}", ej. "-10% con tu código". */
  discount_applied_note: string;
  /** Aviso corto cerca del precio/botones de compra, ej. "Al comprar, aceptás nuestros Términos y Condiciones". Enlaza a /terminos. */
  terms_notice_text: string;

  terms_heading: string;
  terms_content: string;

  privacy_heading: string;
  privacy_content: string;

  /**
   * Usuario/handle de Telegram sin "@" (ej. "nmtechsolutions"), o un bot.
   * Junto con contact_email y contact_whatsapp, define qué botones de "enviar
   * comprobante" se muestran tras pagar por transferencia — se muestra uno
   * por cada uno de los tres que tenga valor cargado, no hay que elegir "el" canal.
   */
  transfer_telegram_contact: string;

  affiliates_heading: string;
  affiliates_intro: string;
  affiliates_steps: ContentItem[];

  updated_at: string;
}

export interface AdminUser {
  id: string;
  username: string;
  password_hash: string;
  created_at: string;
}

export interface DiscountCode {
  id: string;
  code: string;
  discount_percent: number;
  active: boolean;
  /** null = aplica a cualquier ebook. */
  ebook_id: string | null;
  expires_at: string | null;
  created_at: string;
}
