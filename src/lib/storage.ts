import "server-only";
import {
  getSupabaseAdmin,
  EBOOK_FILES_BUCKET,
  COVERS_BUCKET,
  SITE_ASSETS_BUCKET,
  FREE_CHAPTERS_BUCKET,
} from "@/lib/supabase";

const DEFAULT_EXPIRY_SECONDS = 60 * 60 * 24 * 3; // 3 días

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_IMAGE_TYPES: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
};

/**
 * Sube una imagen a un bucket público y devuelve su URL pública. El nombre
 * del archivo lo generamos nosotros (nunca el que manda el cliente), así
 * evitamos path traversal o extensiones raras.
 */
async function uploadPublicImage(
  bucket: string,
  pathPrefix: string,
  file: File
): Promise<{ url: string } | { error: string }> {
  const extension = ALLOWED_IMAGE_TYPES[file.type];
  if (!extension) {
    return { error: "Formato no soportado. Usá PNG, JPG o WEBP." };
  }
  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return { error: "La imagen no puede pesar más de 5MB." };
  }

  const supabase = getSupabaseAdmin();
  const path = `${pathPrefix}-${Date.now()}.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(path, file, { contentType: file.type, upsert: true });

  if (uploadError) {
    console.error(`upload to ${bucket} failed`, uploadError);
    return { error: "No pudimos subir la imagen." };
  }

  const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(path);
  return { url: publicUrlData.publicUrl };
}

export function uploadCoverImage(slug: string, file: File) {
  return uploadPublicImage(COVERS_BUCKET, `${slug}/cover`, file);
}

export function uploadSiteAsset(key: string, file: File) {
  return uploadPublicImage(SITE_ASSETS_BUCKET, key, file);
}

const MAX_PDF_SIZE_BYTES = 20 * 1024 * 1024; // 20MB

/** Sube el PDF del primer capítulo (gratis) a un bucket público y devuelve su URL. */
export async function uploadFreeChapterPdf(
  slug: string,
  file: File
): Promise<{ url: string } | { error: string }> {
  if (file.type !== "application/pdf") {
    return { error: "Tiene que ser un archivo PDF." };
  }
  if (file.size > MAX_PDF_SIZE_BYTES) {
    return { error: "El PDF no puede pesar más de 20MB." };
  }

  const supabase = getSupabaseAdmin();
  const path = `${slug}/capitulo-gratis-${Date.now()}.pdf`;

  const { error: uploadError } = await supabase.storage
    .from(FREE_CHAPTERS_BUCKET)
    .upload(path, file, { contentType: "application/pdf", upsert: true });

  if (uploadError) {
    console.error("free chapter pdf upload failed", uploadError);
    return { error: "No pudimos subir el PDF." };
  }

  const { data: publicUrlData } = supabase.storage.from(FREE_CHAPTERS_BUCKET).getPublicUrl(path);
  return { url: publicUrlData.publicUrl };
}

/**
 * Genera una URL firmada y temporal para descargar el ebook completo desde
 * el bucket privado. Nunca se expone una URL pública/fija del archivo:
 * esta función sólo debe llamarse después de confirmar que el lead
 * correspondiente tiene el pago confirmado.
 */
export async function createSignedEbookFileUrl(
  privateFilePath: string,
  expiresInSeconds: number = DEFAULT_EXPIRY_SECONDS
): Promise<string> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.storage
    .from(EBOOK_FILES_BUCKET)
    .createSignedUrl(privateFilePath, expiresInSeconds);

  if (error || !data) {
    throw new Error(
      `No se pudo generar el link de descarga: ${error?.message ?? "desconocido"}`
    );
  }

  return data.signedUrl;
}
