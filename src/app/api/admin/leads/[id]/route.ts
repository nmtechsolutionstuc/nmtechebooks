import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { leadUpdateSchema } from "@/lib/validation";
import { notifyPaymentConfirmed } from "@/lib/notify";
import { getEbookUrl } from "@/lib/mail";
import { sendMetaCapiEvent } from "@/lib/meta-capi";
import { validateDiscountCode } from "@/lib/discount";
import type { Ebook, Lead } from "@/lib/types";

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

  const parsed = leadUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  const { name, email, topic, interests, status, paymentMethod, markPaymentConfirmed } =
    parsed.data;
  const supabase = getSupabaseAdmin();

  const updates: Record<string, unknown> = {};
  if (name !== undefined) updates.name = name;
  if (email !== undefined) updates.email = email;
  if (topic !== undefined) updates.topic = topic;
  if (interests !== undefined) updates.interests = interests;
  if (status) updates.status = status;
  if (paymentMethod) updates.payment_method = paymentMethod;
  if (markPaymentConfirmed) {
    updates.payment_confirmed_at = new Date().toISOString();
    updates.status = "comprado";
  }

  const { data: updatedLead, error: updateError } = await supabase
    .from("leads")
    .update(updates)
    .eq("id", id)
    .select("*")
    .maybeSingle<Lead>();

  if (updateError || !updatedLead) {
    console.error("update lead failed", updateError);
    return NextResponse.json({ error: "No pudimos actualizar el lead." }, { status: 500 });
  }

  if (markPaymentConfirmed) {
    if (!updatedLead.ebook_id) {
      return NextResponse.json(
        { error: "El lead no tiene un ebook asociado, no se pudo enviar el mail." },
        { status: 400 }
      );
    }

    const { data: ebook } = await supabase
      .from("ebooks")
      .select("*")
      .eq("id", updatedLead.ebook_id)
      .maybeSingle<Ebook>();

    if (!ebook) {
      return NextResponse.json(
        { error: "No se encontró el ebook asociado al lead." },
        { status: 404 }
      );
    }

    try {
      await notifyPaymentConfirmed(updatedLead, ebook);
    } catch (err) {
      console.error("notifyPaymentConfirmed failed", err);
      return NextResponse.json(
        {
          lead: updatedLead,
          warning:
            "El lead se marcó como pagado pero no pudimos mandar el mail automático. Revisá la configuración de Gmail o el archivo del ebook.",
        },
        { status: 207 }
      );
    }

    // Evento Purchase a Meta, solo para transferencia: es el único canal sin
    // un checkout externo que lo dispare solo (Hotmart/Tiendanube ya lo
    // hacen desde su propia plataforma — mandarlo también acá para esos dos
    // duplicaría la conversión). No hay sesión del comprador en este momento
    // (esto lo confirma el admin, no el comprador), así que va sin IP/UA,
    // marcado como "system_generated".
    if (updatedLead.payment_method === "transferencia") {
      const discount = await validateDiscountCode(updatedLead.discount_code, ebook);
      await sendMetaCapiEvent({
        eventName: "Purchase",
        eventSourceUrl: getEbookUrl(ebook.slug),
        email: updatedLead.email,
        fullName: updatedLead.name,
        externalId: updatedLead.id,
        value: discount.finalPrice,
        channel: "transferencia",
        contentName: ebook.slug,
        actionSource: "system_generated",
      });
    }
  }

  return NextResponse.json({ lead: updatedLead });
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const { id } = await params;
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("leads").delete().eq("id", id);

  if (error) {
    console.error("delete lead failed", error);
    return NextResponse.json({ error: "No pudimos borrar el lead." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
