import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { discountCodeSchema } from "@/lib/validation";

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

  const parsed = discountCodeSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Datos inválidos" },
      { status: 400 }
    );
  }

  const updates: Record<string, unknown> = { ...parsed.data };
  if (updates.code) updates.code = String(updates.code).toUpperCase();
  if ("ebook_id" in updates) updates.ebook_id = updates.ebook_id || null;
  if ("expires_at" in updates) updates.expires_at = updates.expires_at || null;

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("discount_codes")
    .update(updates)
    .eq("id", id)
    .select("*")
    .maybeSingle();

  if (error || !data) {
    const message =
      error?.code === "23505" ? "Ya existe un código con ese nombre." : "No pudimos actualizar el código.";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  return NextResponse.json({ code: data });
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const { id } = await params;
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("discount_codes").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: "No pudimos borrar el código." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
