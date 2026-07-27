import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { sendMailSchema } from "@/lib/validation";
import { sendMail, applyTemplateVariables } from "@/lib/mail";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import type { Lead, MailTemplate } from "@/lib/types";

export async function POST(request: Request) {
  // Protege la cuota diaria/mensual de Resend ante un envío masivo por error o abuso.
  const rateLimit = await checkRateLimit(`send-mail:${getClientIp(request)}`, {
    limit: 30,
    windowSeconds: 60 * 60,
  });
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Demasiados mails enviados. Probá de nuevo en un rato." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Solicitud inválida" }, { status: 400 });
  }

  const parsed = sendMailSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();

  const { data: lead } = await supabase
    .from("leads")
    .select("*, ebooks(title)")
    .eq("id", parsed.data.leadId)
    .maybeSingle<Lead & { ebooks: { title: string } | null }>();

  if (!lead) {
    return NextResponse.json({ error: "Lead no encontrado" }, { status: 404 });
  }

  const { data: template } = await supabase
    .from("mail_templates")
    .select("*")
    .eq("id", parsed.data.templateId)
    .maybeSingle<MailTemplate>();

  if (!template) {
    return NextResponse.json({ error: "Plantilla no encontrada" }, { status: 404 });
  }

  const vars = { nombre: lead.name, ebook: lead.ebooks?.title ?? "" };
  const subject = applyTemplateVariables(template.subject, vars);
  const html = applyTemplateVariables(template.body, vars).replaceAll("\n", "<br />");

  try {
    await sendMail({ to: lead.email, subject, html });
  } catch (err) {
    console.error("send-mail failed", err);
    return NextResponse.json(
      { error: "No pudimos enviar el mail. Revisá la configuración de Resend." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
