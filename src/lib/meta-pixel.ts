"use client";

/**
 * Utilidades del lado del cliente para el Píxel de Meta. El Píxel solo se
 * carga (ver MetaPixel.tsx) si el visitante aceptó el banner de cookies —
 * este archivo guarda esa elección en localStorage y expone trackMetaEvent
 * para disparar eventos desde cualquier componente cliente (botones de
 * compra, etc.) sin acoplarlos al componente que carga el script.
 */

export const CONSENT_STORAGE_KEY = "cookie_consent";
export const CONSENT_EVENT = "cookie-consent-changed";

export type ConsentValue = "accepted" | "rejected";

export function getStoredConsent(): ConsentValue | null {
  if (typeof window === "undefined") return null;
  const value = window.localStorage.getItem(CONSENT_STORAGE_KEY);
  return value === "accepted" || value === "rejected" ? value : null;
}

export function setStoredConsent(value: ConsentValue) {
  window.localStorage.setItem(CONSENT_STORAGE_KEY, value);
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: value }));
}

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

/**
 * Dispara un evento del Píxel de Meta, sin efecto si el visitante no aceptó
 * cookies (fbq no está cargado). `eventId` es opcional: si se pasa, se manda
 * el mismo id al servidor (Conversions API) para que Meta deduplique el
 * evento de navegador y el de servidor en vez de contarlo dos veces.
 */
export function trackMetaEvent(
  eventName: string,
  params?: Record<string, unknown>,
  eventId?: string
) {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;
  if (eventId) {
    window.fbq("track", eventName, params ?? {}, { eventID: eventId });
  } else {
    window.fbq("track", eventName, params ?? {});
  }
}
