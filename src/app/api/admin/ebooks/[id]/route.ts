import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { ebookUpdateSchema } from "@/lib/validation";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
  const { id } = await params;
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("ebooks")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    return NextResponse.json({ error: "Ebook no encontrado" }, { status: 404 });
  }

  return NextResponse.json({ ebook: data });
}

export async function PATCH(request: Request, { params }: RouteParams) {
  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Solicitud inválida" }, { status: 400 });
  }

  const parsed = ebookUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("ebooks")
    .update({ ...parsed.data, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("*")
    .maybeSingle();

  if (error || !data) {
    return NextResponse.json({ error: "No pudimos actualizar el ebook." }, { status: 500 });
  }

  return NextResponse.json({ ebook: data });
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const { id } = await params;
  const supabase = getSupabaseAdmin();
  // Los leads de este ebook no se borran: ebook_id queda en null (on delete
  // set null en el esquema), así no se pierde el historial de leads.
  const { error } = await supabase.from("ebooks").delete().eq("id", id);

  if (error) {
    console.error("delete ebook failed", error);
    return NextResponse.json({ error: "No pudimos borrar el ebook." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
