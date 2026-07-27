import "server-only";
import { getSupabaseAdmin } from "@/lib/supabase";

/**
 * Rate limiting simple basado en Supabase (sin depender de un servicio extra
 * como Redis). Registra un intento por `key` (ej. "lead:<ip>") y cuenta
 * cuántos hubo en la ventana de tiempo dada.
 */
export async function checkRateLimit(
  key: string,
  { limit, windowSeconds }: { limit: number; windowSeconds: number }
): Promise<{ allowed: boolean; remaining: number }> {
  const supabase = getSupabaseAdmin();
  const since = new Date(Date.now() - windowSeconds * 1000).toISOString();

  const { count, error } = await supabase
    .from("rate_limit_log")
    .select("id", { count: "exact", head: true })
    .eq("key", key)
    .gte("created_at", since);

  if (error) {
    // Si falla la consulta, no bloqueamos al usuario legítimo por un error
    // nuestro, pero sí lo dejamos registrado en logs del servidor.
    console.error("rate-limit check failed", error);
    return { allowed: true, remaining: limit };
  }

  const used = count ?? 0;
  if (used >= limit) {
    return { allowed: false, remaining: 0 };
  }

  await supabase.from("rate_limit_log").insert({ key });
  return { allowed: true, remaining: limit - used - 1 };
}

export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}
