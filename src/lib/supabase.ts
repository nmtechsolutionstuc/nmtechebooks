import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Cliente de Supabase con la service_role key. Bypassa RLS, por eso este
 * módulo tiene "server-only": nunca debe importarse desde un Client Component
 * ni exponer esta key con el prefijo NEXT_PUBLIC_.
 *
 * Se inicializa de forma perezosa (recién en el primer uso, no al importar el
 * módulo) para que `next build` no falle si todavía no están cargadas las
 * variables de entorno de Supabase.
 */
let cachedClient: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  if (cachedClient) return cachedClient;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Faltan las variables de entorno SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY"
    );
  }

  cachedClient = createClient(url, key, {
    auth: { persistSession: false },
    global: {
      // "cache: no-store" es clave: sin esto, Next.js cachea las respuestas
      // de Supabase en su Data Cache indefinidamente (más allá del
      // `revalidate` de la página), y los cambios hechos desde /admin no se
      // reflejan en el sitio hasta un reinicio del server. Sacrificamos algo
      // de cache para que el contenido editado se vea siempre al instante.
      // El timeout evita que una caída de Supabase deje el request colgado.
      fetch: (input, init) =>
        fetch(input, { ...init, cache: "no-store", signal: AbortSignal.timeout(10_000) }),
    },
  });
  return cachedClient;
}

export const COVERS_BUCKET = "covers";
export const EBOOK_FILES_BUCKET = "ebook-files";
export const SITE_ASSETS_BUCKET = "site-assets";
// Público a propósito: es el capítulo GRATIS, no el ebook completo (ese sigue
// siendo privado, ver EBOOK_FILES_BUCKET). El link igual se entrega recién
// después de capturar el lead, nunca antes.
export const FREE_CHAPTERS_BUCKET = "free-chapters";
