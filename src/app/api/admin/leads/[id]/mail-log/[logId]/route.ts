import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

interface RouteParams {
  params: Promise<{ id: string; logId: string }>;
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const { id, logId } = await params;
  const supabase = getSupabaseAdmin();

  const { error } = await supabase
    .from("mail_log")
    .delete()
    .eq("id", logId)
    .eq("lead_id", id);

  if (error) {
    console.error("delete mail_log entry failed", error);
    return NextResponse.json({ error: "No pudimos borrar el registro." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
