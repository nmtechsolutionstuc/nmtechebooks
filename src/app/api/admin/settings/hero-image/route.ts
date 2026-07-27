import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { uploadSiteAsset } from "@/lib/storage";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const rateLimit = await checkRateLimit(`upload-hero:${getClientIp(request)}`, {
    limit: 20,
    windowSeconds: 10 * 60,
  });
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Demasiadas subidas. Probá de nuevo en unos minutos." },
      { status: 429 }
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Solicitud inválida" }, { status: 400 });
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Falta el archivo." }, { status: 400 });
  }

  const uploadResult = await uploadSiteAsset("hero", file);
  if ("error" in uploadResult) {
    return NextResponse.json({ error: uploadResult.error }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("site_settings")
    .upsert({ id: 1, hero_image_url: uploadResult.url, updated_at: new Date().toISOString() })
    .select("*")
    .maybeSingle();

  if (error || !data) {
    return NextResponse.json(
      { error: "Subimos la imagen pero no pudimos guardar el cambio." },
      { status: 500 }
    );
  }

  return NextResponse.json({ settings: data });
}
