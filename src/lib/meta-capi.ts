import "server-only";
import { createHash } from "node:crypto";

/**
 * Envío server-side de eventos a la API de Conversiones de Meta, en espejo
 * de los mismos eventos que dispara el Píxel del navegador (ver
 * lib/meta-pixel.ts). Mejora la confiabilidad del tracking (funciona aunque
 * el visitante tenga ad-blockers o Safari con ITP), y usa el mismo eventId
 * que el evento del navegador para que Meta los deduplique en vez de
 * contarlos dos veces.
 *
 * No hace nada (no-op) si META_CONVERSIONS_API_TOKEN o el pixel ID no están
 * configurados: el Píxel del navegador sigue funcionando igual sin esto.
 */

function sha256(value: string): string {
  return createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

/**
 * No tenemos nombre/apellido por separado (el form solo pide "nombre
 * completo"), así que partimos por el primer espacio: mejor esto —le suma
 * puntos de calidad de coincidencia a Meta— que no mandar nada.
 */
function splitName(fullName: string): { firstName: string; lastName: string } {
  const trimmed = fullName.trim();
  const spaceIndex = trimmed.indexOf(" ");
  if (spaceIndex === -1) return { firstName: trimmed, lastName: "" };
  return { firstName: trimmed.slice(0, spaceIndex), lastName: trimmed.slice(spaceIndex + 1) };
}

export async function sendMetaCapiEvent({
  eventName,
  eventId,
  eventSourceUrl,
  clientIp,
  userAgent,
  email,
  fullName,
  externalId,
  value,
  currency = "ARS",
  channel,
  contentName,
  contentType = "product",
  actionSource = "website",
}: {
  eventName: string;
  eventId?: string;
  eventSourceUrl: string;
  /** Solo tiene sentido si el evento se origina en una request real del comprador (ver actionSource). */
  clientIp?: string;
  userAgent?: string;
  email?: string;
  /** Nombre completo del lead — se parte en nombre/apellido para sumar señales de coincidencia además del mail. */
  fullName?: string;
  /** Id propio del lead (nuestra base), como identificador estable adicional para Meta. */
  externalId?: string;
  value?: number;
  currency?: string;
  /** hotmart / tiendanube / transferencia — mismo parámetro custom que manda el Píxel del navegador. */
  channel?: string;
  /** Slug del ebook — mismo dato que manda el Píxel del navegador en InitiateCheckout, para que Meta sepa qué producto fue. */
  contentName?: string;
  contentType?: string;
  /**
   * "website" para eventos con una request real del comprador de por medio
   * (ver payment-choice). "system_generated" para eventos que dispara
   * nuestro propio backend sin que el comprador esté navegando en ese
   * momento (ej. Purchase al confirmar una transferencia desde /admin) —
   * ahí no correspondería mandar IP/user-agent del admin como si fueran del comprador.
   */
  actionSource?: "website" | "system_generated";
}) {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const token = process.env.META_CONVERSIONS_API_TOKEN;
  if (!pixelId || !token) return;

  const userData: Record<string, unknown> = {};
  if (clientIp) userData.client_ip_address = clientIp;
  if (userAgent) userData.client_user_agent = userAgent;
  if (email) userData.em = [sha256(email)];
  if (fullName) {
    const { firstName, lastName } = splitName(fullName);
    if (firstName) userData.fn = [sha256(firstName)];
    if (lastName) userData.ln = [sha256(lastName)];
  }
  if (externalId) userData.external_id = [sha256(externalId)];

  const customData: Record<string, unknown> = {};
  if (typeof value === "number") {
    customData.value = value;
    customData.currency = currency;
  }
  if (channel) customData.channel = channel;
  if (contentName) {
    customData.content_name = contentName;
    customData.content_type = contentType;
  }

  const payload = {
    data: [
      {
        event_name: eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_id: eventId,
        event_source_url: eventSourceUrl,
        action_source: actionSource,
        user_data: userData,
        custom_data: customData,
      },
    ],
  };

  try {
    const res = await fetch(
      `https://graph.facebook.com/v21.0/${pixelId}/events?access_token=${token}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );
    if (!res.ok) {
      console.error("Meta CAPI event failed", res.status, await res.text());
    }
  } catch (err) {
    // Nunca debe romper el flujo de compra del visitante por un problema con Meta.
    console.error("Meta CAPI request failed", err);
  }
}
