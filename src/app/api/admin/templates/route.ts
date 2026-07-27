import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { mailTemplateSchema } from "@/lib/validation";

export async function GET() {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("mail_templates")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: "No pudimos cargar las plantillas." }, { status: 500 });
  }

  return NextResponse.json({ templates: data });
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Solicitud inválida" }, { status: 400 });
  }

  const parsed = mailTemplateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("mail_templates")
    .insert(parsed.data)
    .select("*")
    .maybeSingle();

  if (error || !data) {
    return NextResponse.json({ error: "No pudimos crear la plantilla." }, { status: 500 });
  }

  return NextResponse.json({ template: data }, { status: 201 });
}
