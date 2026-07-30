/**
 * Arma el HTML final de cualquier mail que manda el sitio: header + footer
 * de marca (colores y textos del sitio) envolviendo el cuerpo específico de
 * cada mail. Sin "server-only": esto también lo usa la vista previa de
 * /admin/plantillas (client component) para mostrar exactamente lo mismo
 * que se termina enviando.
 */

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export interface EmailBrand {
  brandName: string;
  contactEmail: string;
  contactWhatsapp: string;
  siteUrl: string;
  footerNote: string;
}

const COLOR_BG = "#0C0C0C";
const COLOR_FG = "#D7E2EA";
const COLOR_ACCENT = "#FF9500";

export function wrapEmailHtml(bodyHtml: string, brand: EmailBrand): string {
  const year = new Date().getFullYear();
  const siteHost = brand.siteUrl.replace(/^https?:\/\//, "");

  const contactLinks = [
    brand.contactEmail
      ? `<a href="mailto:${escapeHtml(brand.contactEmail)}" style="color:${COLOR_ACCENT};text-decoration:none;">${escapeHtml(brand.contactEmail)}</a>`
      : null,
    brand.contactWhatsapp
      ? `<a href="https://wa.me/${escapeHtml(brand.contactWhatsapp)}" style="color:${COLOR_ACCENT};text-decoration:none;">WhatsApp</a>`
      : null,
    brand.siteUrl
      ? `<a href="${escapeHtml(brand.siteUrl)}" style="color:${COLOR_ACCENT};text-decoration:none;">${escapeHtml(siteHost)}</a>`
      : null,
  ]
    .filter(Boolean)
    .join(' &nbsp;&middot;&nbsp; ');

  return `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f2f2f2;padding:32px 16px;font-family:Arial,Helvetica,sans-serif;">
  <tr>
    <td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e5e5e5;">
        <tr>
          <td style="background:${COLOR_BG};padding:28px 32px;text-align:center;">
            <span style="color:${COLOR_ACCENT};font-size:22px;font-weight:700;letter-spacing:0.5px;">${escapeHtml(brand.brandName)}</span>
            <br />
            <span style="color:${COLOR_FG};font-size:12px;letter-spacing:1px;text-transform:uppercase;">Biblioteca de Ebooks</span>
          </td>
        </tr>
        <tr>
          <td style="padding:32px;color:#1a1a1a;font-size:15px;line-height:1.6;">
            ${bodyHtml}
          </td>
        </tr>
        <tr>
          <td style="background:${COLOR_BG};padding:24px 32px;text-align:center;">
            <p style="color:${COLOR_FG};font-size:13px;margin:0 0 10px;">${contactLinks}</p>
            <p style="color:#8a8a8a;font-size:11px;line-height:1.5;margin:0;">${escapeHtml(brand.footerNote)}</p>
            <p style="color:#555555;font-size:10px;margin:14px 0 0;">&copy; ${year} ${escapeHtml(brand.brandName)}</p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>`.trim();
}
