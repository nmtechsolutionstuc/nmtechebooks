import "server-only";
import nodemailer, { type Transporter } from "nodemailer";
import { getSiteSettings } from "@/lib/data";
import { wrapEmailHtml } from "@/lib/email-template";

/**
 * Se manda todo desde la cuenta de Gmail real de nmtech solutions (así los
 * mails llegan con el remitente que la gente ya conoce, no desde un dominio
 * desconocido). Gratis, usando el SMTP de Gmail con una "contraseña de
 * aplicación" (no la contraseña normal de la cuenta).
 *
 * Límite del plan gratuito de Gmail: ~500 mails cada 24hs (cuenta personal).
 * Si algún día se supera (ej. pico de ventas), esos mails puntuales se
 * mandan a mano desde la casilla normal, usando el mismo texto de la
 * plantilla que se ve en /admin.
 */

let cachedTransporter: Transporter | null = null;

function getTransporter(): Transporter {
  if (cachedTransporter) return cachedTransporter;

  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) {
    throw new Error("Faltan las variables de entorno GMAIL_USER / GMAIL_APP_PASSWORD");
  }

  cachedTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });
  return cachedTransporter;
}

/** Escapa HTML para evitar que un dato variable (nombre del lead, título del ebook) inyecte markup en el mail. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function applyTemplateVariables(text: string, vars: Record<string, string>): string {
  return Object.entries(vars).reduce(
    (result, [key, value]) => result.replaceAll(`{${key}}`, escapeHtml(value)),
    text
  );
}

/**
 * Dominio público del sitio, para armar links absolutos dentro de los mails
 * (una URL relativa como "/ebooks/x" no funciona en un cliente de mail).
 * En producción hay que setear SITE_URL a la URL real (ver .env.example).
 */
function getSiteUrl(): string {
  return (process.env.SITE_URL || "http://localhost:3000").replace(/\/$/, "");
}

/** Link absoluto a la página de venta de un ebook, para la variable {link} de las plantillas. */
export function getEbookUrl(slug: string): string {
  return `${getSiteUrl()}/ebooks/${slug}`;
}

/**
 * Envuelve el cuerpo de CUALQUIER mail que manda el sitio (capítulo gratis,
 * pago confirmado, o los que se mandan a mano con plantilla desde /admin) en
 * un header y footer con la marca del sitio — así no hace falta agregarlo a
 * mano en cada plantilla. Colores, nombre y datos de contacto salen de
 * /admin → Configuración (mismo componente que usa la vista previa de
 * /admin/plantillas, para que se vea igual a lo que termina llegando).
 */
async function buildBrandedHtml(bodyHtml: string): Promise<string> {
  const settings = await getSiteSettings();
  const footerNote = applyTemplateVariables(settings.email_footer_note, {
    contact_email: settings.contact_email,
  });
  return wrapEmailHtml(bodyHtml, {
    brandName: settings.hero_kicker || "nmtech solutions",
    contactEmail: settings.contact_email,
    contactWhatsapp: settings.contact_whatsapp,
    siteUrl: getSiteUrl(),
    footerNote,
  });
}

export async function sendMail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  const transporter = getTransporter();
  const user = process.env.GMAIL_USER;
  const displayName = process.env.GMAIL_FROM_NAME || "nmtech solutions";

  let fullHtml = html;
  try {
    fullHtml = await buildBrandedHtml(html);
  } catch (err) {
    // Si por lo que sea falla traer la configuración, mandamos el mail
    // igual sin el diseño, en vez de no mandarlo.
    console.error("buildBrandedHtml failed", err);
  }

  await transporter.sendMail({
    from: `"${displayName}" <${user}>`,
    to,
    subject,
    html: fullHtml,
  });
}
