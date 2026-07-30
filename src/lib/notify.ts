import "server-only";
import { sendMail, applyTemplateVariables, getEbookUrl } from "@/lib/mail";
import { createSignedEbookFileUrl } from "@/lib/storage";
import { logMailSent } from "@/lib/mail-log";
import type { Ebook, Lead, SiteSettings } from "@/lib/types";

/**
 * Se dispara automáticamente cuando se marca un lead como "pago confirmado":
 * genera un link de descarga firmado y temporal (nunca una URL pública fija)
 * y se lo manda por mail.
 */
export async function notifyPaymentConfirmed(lead: Lead, ebook: Ebook) {
  if (!ebook.private_file_path) {
    throw new Error(
      `El ebook "${ebook.title}" todavía no tiene cargado el archivo privado (private_file_path).`
    );
  }

  const downloadUrl = await createSignedEbookFileUrl(ebook.private_file_path);
  const subject = `¡Ya podés descargar "${ebook.title}"!`;

  await sendMail({
    to: lead.email,
    subject,
    html: `
      <p>Hola ${escapeHtml(lead.name)},</p>
      <p>Confirmamos tu pago de <strong>${escapeHtml(ebook.title)}</strong>. Descargalo acá:</p>
      <p><a href="${downloadUrl}">${downloadUrl}</a></p>
      <p>Este link es privado y va a expirar en unos días, así que te recomendamos descargarlo pronto. Cualquier problema, respondé este mail.</p>
      <p>Gracias por tu compra,<br />nmtech solutions</p>
    `,
  });

  await logMailSent(lead.id, subject, "Ebook completo (pago confirmado)");
}

/**
 * Se dispara automáticamente al completar el formulario de captura de lead
 * (si el ebook tiene capítulo gratis cargado): manda el capítulo por mail,
 * además de mostrarlo en pantalla, usando la plantilla editable en
 * /admin → Configuración.
 */
export async function sendFreeChapterEmail(
  lead: Pick<Lead, "id" | "name" | "email">,
  ebook: Ebook,
  settings: SiteSettings
) {
  const vars = {
    nombre: lead.name,
    ebook: ebook.title,
    capitulo: ebook.free_chapter,
    link: getEbookUrl(ebook.slug),
  };
  const subject = applyTemplateVariables(settings.free_chapter_email_subject, vars);
  let html = applyTemplateVariables(settings.free_chapter_email_body, vars).replaceAll(
    "\n",
    "<br />"
  );

  if (ebook.free_chapter_pdf_url) {
    html += `<p><a href="${ebook.free_chapter_pdf_url}">Descargar el capítulo en PDF</a></p>`;
  }

  await sendMail({ to: lead.email, subject, html });
  await logMailSent(lead.id, subject, "Capítulo gratis");
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
