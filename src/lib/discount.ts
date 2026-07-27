import "server-only";
import { getSupabaseAdmin } from "@/lib/supabase";
import type { Ebook } from "@/lib/types";

export interface DiscountResult {
  applied: boolean;
  percent: number | null;
  error: string | null;
  finalPrice: number;
  /** Código normalizado (mayúsculas) para guardar en el lead, solo si fue válido. */
  appliedCode: string | null;
}

/**
 * Valida un código de descuento contra un ebook puntual. Solo tiene sentido
 * para pagos por transferencia (Hotmart tiene su propio sistema de cupones,
 * ajeno a este).
 */
export async function validateDiscountCode(
  rawCode: string | undefined | null,
  ebook: Pick<Ebook, "id" | "current_price">
): Promise<DiscountResult> {
  const noDiscount: DiscountResult = {
    applied: false,
    percent: null,
    error: null,
    finalPrice: ebook.current_price,
    appliedCode: null,
  };

  const code = rawCode?.trim().toUpperCase();
  if (!code) return noDiscount;

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("discount_codes")
    .select("*")
    .eq("code", code)
    .maybeSingle();

  if (error || !data) {
    return { ...noDiscount, error: "Código de descuento inválido." };
  }
  if (!data.active) {
    return { ...noDiscount, error: "Ese código ya no está activo." };
  }
  if (data.expires_at && new Date(data.expires_at) < new Date()) {
    return { ...noDiscount, error: "Ese código venció." };
  }
  if (data.ebook_id && data.ebook_id !== ebook.id) {
    return { ...noDiscount, error: "Ese código no es válido para este ebook." };
  }

  const percent = Number(data.discount_percent);
  const finalPrice = Math.round(ebook.current_price * (1 - percent / 100) * 100) / 100;

  return { applied: true, percent, error: null, finalPrice, appliedCode: code };
}
