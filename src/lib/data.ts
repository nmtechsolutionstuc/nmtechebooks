import "server-only";
import { getSupabaseAdmin } from "@/lib/supabase";
import { toPublicEbook, type Ebook, type PublicEbook, type SiteSettings } from "@/lib/types";
import { DEFAULT_SITE_SETTINGS } from "@/lib/default-site-settings";

export async function getPublicEbooks(): Promise<PublicEbook[]> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("ebooks")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getPublicEbooks failed", error);
    return [];
  }

  return (data as Ebook[]).map(toPublicEbook);
}

export async function getEbookBySlugPublic(slug: string): Promise<PublicEbook | null> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("ebooks")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (error || !data) return null;
  return toPublicEbook(data as Ebook);
}

/**
 * Para el form de leads (POST /api/leads): también filtra por published,
 * así un borrador no se puede "comprar" ni recibir leads posteando
 * directo a la API, aunque su página pública ya dé 404.
 */
export async function getEbookBySlugFull(slug: string): Promise<Ebook | null> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("ebooks")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (error || !data) return null;
  return data as Ebook;
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", 1)
    .maybeSingle();

  if (error || !data) {
    return DEFAULT_SITE_SETTINGS;
  }

  // Merge con los defaults por si todavía no se corrió la migración que agrega
  // las columnas nuevas (así no rompe si falta alguna).
  return { ...DEFAULT_SITE_SETTINGS, ...(data as Partial<SiteSettings>) } as SiteSettings;
}
