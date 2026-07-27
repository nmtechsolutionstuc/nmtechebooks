import "server-only";
import nodemailer, { type Transporter } from "nodemailer";

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

  await transporter.sendMail({
    from: `"${displayName}" <${user}>`,
    to,
    subject,
    html,
  });
}
