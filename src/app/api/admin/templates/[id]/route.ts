import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { mailTemplateSchema } from "@/lib/validation";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, { params }: RouteParams) {
  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Solicitud inválida" }, { status: 400 });
  }

  const parsed = mailTemplateSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("mail_templates")
    .update({ ...parsed.data, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("*")
    .maybeSingle();

  if (error || !data) {
    return NextResponse.json({ error: "No pudimos actualizar la plantilla." }, { status: 500 });
  }

  return NextResponse.json({ template: data });
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const { id } = await params;
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("mail_templates").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: "No pudimos borrar la plantilla." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
