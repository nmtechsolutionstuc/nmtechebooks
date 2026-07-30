import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import type { MailLogEntry } from "@/lib/types";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
  const { id } = await params;
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from("mail_log")
    .select("*")
    .eq("lead_id", id)
    .order("sent_at", { ascending: false })
    .returns<MailLogEntry[]>();

  if (error) {
    console.error("fetch mail_log failed", error);
    return NextResponse.json({ error: "No pudimos traer el historial de mails." }, { status: 500 });
  }

  return NextResponse.json({ mailLog: data ?? [] });
}
