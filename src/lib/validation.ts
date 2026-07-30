import { z } from "zod";

export const leadFormSchema = z.object({
  name: z.string().trim().min(2, "Ingresá tu nombre").max(100),
  email: z.string().trim().email("Ingresá un mail válido").max(200),
  topic: z.string().trim().min(2, "Elegí una temática").max(100),
  interests: z.string().trim().max(500).optional().or(z.literal("")),
  intent: z.enum(["leer", "comprar"]).default("leer"),
  ebookSlug: z.string().trim().min(1),
  // solo tiene efecto en el precio por transferencia (Hotmart tiene sus propios cupones)
  discountCode: z.string().trim().max(50).optional().or(z.literal("")),
  // honeypot: si viene con contenido, es un bot.
  website: z.string().max(0).optional().or(z.literal("")),
  // timestamp (Date.now()) de cuando se mostró el formulario, para detectar
  // envíos instantáneos típicos de bots (ver checkNotTooFast en /api/leads).
  renderedAt: z.number().optional(),
});

export const adminLoginSchema = z.object({
  username: z.string().trim().min(1).max(100),
  password: z.string().min(1).max(200),
});

export const mailTemplateSchema = z.object({
  name: z.string().trim().min(1).max(100),
  subject: z.string().trim().min(1).max(200),
  // HTML real (viene del editor rich-text de /admin/plantillas), no texto plano.
  body: z.string().trim().min(1).max(20000),
});

export const leadUpdateSchema = z.object({
  name: z.string().trim().min(2).max(100).optional(),
  email: z.string().trim().email().max(200).optional(),
  topic: z.string().trim().min(1).max(100).optional(),
  interests: z.string().trim().max(500).optional().or(z.literal("")),
  status: z.enum(["nuevo", "contactado", "comprado"]).optional(),
  paymentMethod: z.enum(["hotmart", "transferencia", "tiendanube"]).optional(),
  markPaymentConfirmed: z.boolean().optional(),
});

export const sendMailSchema = z.object({
  leadId: z.string().uuid(),
  templateId: z.string().uuid(),
});

// Lo manda el sitio público cuando el visitante clickea una opción de compra
// (Hotmart, Tiendanube o "pagar por transferencia"), para saber qué eligió
// antes incluso de que el pago se confirme.
export const paymentChoiceSchema = z.object({
  paymentMethod: z.enum(["hotmart", "transferencia", "tiendanube"]),
});

export const ebookUpdateSchema = z.object({
  title: z.string().trim().min(1).max(200).optional(),
  short_description: z.string().trim().min(1).max(300).optional(),
  long_description: z.string().trim().min(1).max(5000).optional(),
  promo_message: z.string().trim().max(400).optional().or(z.literal("")),
  free_chapter: z.string().trim().max(20000).optional().or(z.literal("")),
  category: z.string().trim().min(1).max(100).optional(),
  original_price: z.number().nonnegative().optional(),
  current_price: z.number().nonnegative().optional(),
  hotmart_sale_url: z.string().trim().max(500).optional().or(z.literal("")),
  hotmart_affiliate_url: z.string().trim().max(500).optional().or(z.literal("")),
  tiendanube_sale_url: z.string().trim().max(500).optional().or(z.literal("")),
  bank_alias: z.string().trim().max(200).optional().or(z.literal("")),
  bank_cbu: z.string().trim().max(50).optional().or(z.literal("")),
  bank_name: z.string().trim().max(100).optional().or(z.literal("")),
  featured: z.boolean().optional(),
  published: z.boolean().optional(),
});

export const discountCodeSchema = z.object({
  code: z
    .string()
    .trim()
    .min(3)
    .max(50)
    .regex(/^[a-zA-Z0-9_-]+$/, "Solo letras, números, guiones y guion bajo"),
  discount_percent: z.coerce.number().gt(0).max(100),
  active: z.boolean().default(true),
  ebook_id: z.string().uuid().nullable().optional(),
  // formato "YYYY-MM-DD" (de un <input type="date">) o null/"" para sin vencimiento
  expires_at: z.string().trim().max(40).nullable().optional().or(z.literal("")),
});

export const ebookCreateSchema = z.object({
  title: z.string().trim().min(1).max(200),
  short_description: z.string().trim().min(1).max(300),
  long_description: z.string().trim().min(1).max(5000),
  promo_message: z.string().trim().max(400).optional().or(z.literal("")),
  category: z.string().trim().min(1).max(100),
  original_price: z.coerce.number().nonnegative(),
  current_price: z.coerce.number().nonnegative(),
});

const contentItemSchema = z.object({
  title: z.string().trim().min(1).max(150),
  description: z.string().trim().min(1).max(500),
});

export const siteSettingsSchema = z.object({
  hero_kicker: z.string().trim().max(100),
  hero_heading: z.string().trim().min(1).max(100),
  hero_tagline: z.string().trim().min(1).max(300),
  hero_cta_label: z.string().trim().min(1).max(50),
  hero_image_style: z.enum(["circle", "banner"]),

  marquee_visible: z.boolean(),
  featured_ebook_visible: z.boolean(),
  why_visible: z.boolean(),
  also_interested_visible: z.boolean(),
  about_visible: z.boolean(),

  lead_topics: z.array(z.string().trim().min(1).max(60)).min(1).max(20),

  free_chapter_email_subject: z.string().trim().min(1).max(200),
  free_chapter_email_body: z.string().trim().min(1).max(5000),

  why_heading: z.string().trim().min(1).max(100),
  why_reasons: z.array(contentItemSchema).max(8),

  about_heading: z.string().trim().min(1).max(100),
  about_text: z.string().trim().min(1).max(1000),

  custom_solution_enabled: z.boolean(),
  custom_solution_text: z.string().trim().min(1).max(500),
  custom_solution_url: z.string().trim().url().max(500),

  footer_text: z.string().trim().min(1).max(200),

  contact_heading: z.string().trim().min(1).max(100),
  contact_text: z.string().trim().min(1).max(1000),
  contact_email: z.string().trim().email().max(200),
  contact_whatsapp: z
    .string()
    .trim()
    .max(20)
    .regex(/^\d*$/, "Solo números, sin +, espacios ni guiones")
    .optional()
    .or(z.literal("")),

  email_footer_note: z.string().trim().min(1).max(500),

  buy_heading: z.string().trim().min(1).max(100),
  transfer_instructions: z.string().trim().min(1).max(500),
  chapter_heading: z.string().trim().min(1).max(100),
  chapter_missing_text: z.string().trim().min(1).max(300),
  chapter_email_note: z.string().trim().min(1).max(200),

  discount_field_label: z.string().trim().min(1).max(150),
  discount_field_hint: z.string().trim().max(150).optional().or(z.literal("")),
  discount_field_placeholder: z.string().trim().max(50).optional().or(z.literal("")),
  transfer_amount_label: z.string().trim().min(1).max(100),
  discount_applied_note: z.string().trim().max(100).optional().or(z.literal("")),

  terms_notice_text: z.string().trim().min(1).max(200),

  terms_heading: z.string().trim().min(1).max(100),
  terms_content: z.string().trim().min(1).max(10000),

  affiliates_heading: z.string().trim().min(1).max(100),
  affiliates_intro: z.string().trim().min(1).max(1000),
  affiliates_steps: z.array(contentItemSchema).max(8),
});
