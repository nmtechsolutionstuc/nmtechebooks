import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { siteSettingsSchema } from "@/lib/validation";
import { getSiteSettings } from "@/lib/data";

export async function GET() {
  const settings = await getSiteSettings();
  return NextResponse.json({ settings });
}

export async function PUT(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Solicitud inválida" }, { status: 400 });
  }

  const parsed = siteSettingsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("site_settings")
    .upsert({ id: 1, ...parsed.data, updated_at: new Date().toISOString() })
    .select("*")
    .maybeSingle();

  if (error || !data) {
    return NextResponse.json({ error: "No pudimos guardar la configuración." }, { status: 500 });
  }

  return NextResponse.json({ settings: data });
}
