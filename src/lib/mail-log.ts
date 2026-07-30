import "server-only";
import { getSupabaseAdmin } from "@/lib/supabase";

/**
 * Registra un mail ya enviado (manual o automático) para poder mostrarlo
 * como historial en la ficha del lead. Nunca debe hacer fallar el envío del
 * mail en sí: si el log falla, solo lo dejamos en consola.
 */
export async function logMailSent(leadId: string, subject: string, templateName: string) {
  try {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase
      .from("mail_log")
      .insert({ lead_id: leadId, subject, template_name: templateName });
    if (error) console.error("logMailSent failed", error);
  } catch (err) {
    console.error("logMailSent failed", err);
  }
}
