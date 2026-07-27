import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { uploadCoverImage } from "@/lib/storage";
import { ebookCreateSchema } from "@/lib/validation";
import { slugify } from "@/lib/slugify";

export async function GET() {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("ebooks")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: "No pudimos cargar los ebooks." }, { status: 500 });
  }

  return NextResponse.json({ ebooks: data });
}

async function generateUniqueSlug(base: string): Promise<string> {
  const supabase = getSupabaseAdmin();
  const baseSlug = slugify(base) || "ebook";

  let candidate = baseSlug;
  let suffix = 2;
  // Con el volumen de ebooks que va a tener este proyecto, un loop secuencial alcanza de sobra.
  while (true) {
    const { data } = await supabase
      .from("ebooks")
      .select("id")
      .eq("slug", candidate)
      .maybeSingle();
    if (!data) return candidate;
    candidate = `${baseSlug}-${suffix}`;
    suffix += 1;
  }
}

export async function POST(request: Request) {
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Solicitud inválida" }, { status: 400 });
  }

  const parsed = ebookCreateSchema.safeParse({
    title: formData.get("title"),
    short_description: formData.get("short_description"),
    long_description: formData.get("long_description"),
    promo_message: formData.get("promo_message") ?? "",
    category: formData.get("category"),
    original_price: formData.get("original_price"),
    current_price: formData.get("current_price"),
  });

  if (!parsed.success) {
    return NextResponse.json({ error: "Revisá los campos del ebook." }, { status: 400 });
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "La portada es obligatoria." }, { status: 400 });
  }

  const slug = await generateUniqueSlug(parsed.data.title);

  const uploadResult = await uploadCoverImage(slug, file);
  if ("error" in uploadResult) {
    return NextResponse.json({ error: uploadResult.error }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("ebooks")
    .insert({
      slug,
      title: parsed.data.title,
      short_description: parsed.data.short_description,
      long_description: parsed.data.long_description,
      promo_message: parsed.data.promo_message ?? "",
      category: parsed.data.category,
      cover_image_url: uploadResult.url,
      original_price: parsed.data.original_price,
      current_price: parsed.data.current_price,
    })
    .select("*")
    .maybeSingle();

  if (error || !data) {
    console.error("create ebook failed", error);
    return NextResponse.json({ error: "No pudimos crear el ebook." }, { status: 500 });
  }

  return NextResponse.json({ ebook: data }, { status: 201 });
}
