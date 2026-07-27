import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { uploadFreeChapterPdf } from "@/lib/storage";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(request: Request, { params }: RouteParams) {
  const rateLimit = await checkRateLimit(`upload-pdf:${getClientIp(request)}`, {
    limit: 20,
    windowSeconds: 10 * 60,
  });
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Demasiadas subidas. Probá de nuevo en unos minutos." },
      { status: 429 }
    );
  }

  const { id } = await params;

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Solicitud inválida" }, { status: 400 });
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Falta el archivo PDF." }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();

  const { data: ebook, error: findError } = await supabase
    .from("ebooks")
    .select("id, slug")
    .eq("id", id)
    .maybeSingle();

  if (findError || !ebook) {
    return NextResponse.json({ error: "Ebook no encontrado" }, { status: 404 });
  }

  const uploadResult = await uploadFreeChapterPdf(ebook.slug, file);
  if ("error" in uploadResult) {
    return NextResponse.json({ error: uploadResult.error }, { status: 400 });
  }

  const { data: updatedEbook, error: updateError } = await supabase
    .from("ebooks")
    .update({ free_chapter_pdf_url: uploadResult.url, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("*")
    .maybeSingle();

  if (updateError || !updatedEbook) {
    return NextResponse.json(
      { error: "Subimos el PDF pero no pudimos guardar el cambio en el ebook." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ebook: updatedEbook });
}
