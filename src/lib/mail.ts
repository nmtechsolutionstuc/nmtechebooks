import "server-only";
import { Resend } from "resend";

/**
 * Plan free de Resend (verificado al momento de armar este proyecto):
 *   - 3.000 mails/mes
 *   - 100 mails/día
 * Si en algún mes se supera ese límite (ej. pico de ventas), no hace falta
 * automatizar nada nuevo: esos mails puntuales se mandan a mano desde la
 * casilla normal, usando el mismo texto de la plantilla que se ve en /admin.
 */

let cachedResend: Resend | null = null;

function getResendClient(): Resend {
  if (cachedResend) return cachedResend;
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("Falta la variable de entorno RESEND_API_KEY");
  }
  cachedResend = new Resend(apiKey);
  return cachedResend;
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
  const resend = getResendClient();
  const from = process.env.RESEND_FROM_EMAIL;
  if (!from) {
    throw new Error("Falta la variable de entorno RESEND_FROM_EMAIL");
  }

  const { error } = await resend.emails.send({ from, to, subject, html });
  if (error) {
    throw new Error(`Error enviando mail con Resend: ${error.message}`);
  }
}
