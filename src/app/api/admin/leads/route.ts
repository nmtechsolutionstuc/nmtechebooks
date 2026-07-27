import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ebookId = searchParams.get("ebook");
  const topic = searchParams.get("topic");
  const status = searchParams.get("status");

  const supabase = getSupabaseAdmin();
  let query = supabase
    .from("leads")
    .select("*, ebooks(id, title, slug)")
    .order("created_at", { ascending: false });

  if (ebookId) query = query.eq("ebook_id", ebookId);
  if (topic) query = query.eq("topic", topic);
  if (status) query = query.eq("status", status);

  const { data, error } = await query;

  if (error) {
    console.error("list leads failed", error);
    return NextResponse.json({ error: "No pudimos cargar los leads." }, { status: 500 });
  }

  return NextResponse.json({ leads: data });
}
