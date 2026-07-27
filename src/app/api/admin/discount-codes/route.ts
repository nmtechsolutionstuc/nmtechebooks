import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { discountCodeSchema } from "@/lib/validation";

export async function GET() {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("discount_codes")
    .select("*, ebooks(id, title)")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: "No pudimos cargar los códigos." }, { status: 500 });
  }

  return NextResponse.json({ codes: data });
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Solicitud inválida" }, { status: 400 });
  }

  const parsed = discountCodeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Datos inválidos" },
      { status: 400 }
    );
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("discount_codes")
    .insert({
      ...parsed.data,
      code: parsed.data.code.toUpperCase(),
      ebook_id: parsed.data.ebook_id || null,
      expires_at: parsed.data.expires_at || null,
    })
    .select("*")
    .maybeSingle();

  if (error) {
    const message = error.code === "23505" ? "Ya existe un código con ese nombre." : "No pudimos crear el código.";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  return NextResponse.json({ code: data }, { status: 201 });
}
