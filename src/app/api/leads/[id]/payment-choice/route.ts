import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { getSiteUrl } from "@/lib/mail";
import { paymentChoiceSchema } from "@/lib/validation";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { sendMetaCapiEvent } from "@/lib/meta-capi";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * Endpoint público (sin auth de admin): lo llama LeadCaptureFlow cuando el
 * visitante clickea una opción de compra (Hotmart, Tiendanube o
 * "transferencia"), para dejar registrado qué eligió, antes incluso de que
 * se confirme el pago. Solo actualiza payment_method, nunca status ni el
 * resto de los datos del lead.
 */
export async function POST(request: Request, { params }: RouteParams) {
  const rateLimit = await checkRateLimit(`payment-choice:${getClientIp(request)}`, {
    limit: 20,
    windowSeconds: 10 * 60,
  });
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "Demasiadas solicitudes." }, { status: 429 });
  }

  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Solicitud inválida" }, { status: 400 });
  }

  const parsed = paymentChoiceSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { data: lead, error } = await supabase
    .from("leads")
    .update({ payment_method: parsed.data.paymentMethod })
    .eq("id", id)
    .select("name, email")
    .maybeSingle();

  if (error) {
    console.error("payment-choice update failed", error);
    return NextResponse.json({ error: "No pudimos guardar tu elección." }, { status: 500 });
  }

  // Espejo server-side del evento InitiateCheckout que ya disparó el Píxel
  // en el navegador (mismo eventId, para que Meta los deduplique). Se espera
  // (no "void") porque en una función serverless el request puede cortarse
  // apenas se manda la respuesta, matando un fetch que quedó pendiente.
  await sendMetaCapiEvent({
    eventName: "InitiateCheckout",
    eventId: parsed.data.eventId,
    eventSourceUrl: parsed.data.pageUrl || getSiteUrl(),
    clientIp: getClientIp(request),
    userAgent: request.headers.get("user-agent") ?? "",
    email: lead?.email,
    fullName: lead?.name,
    externalId: id,
    value: parsed.data.value,
    channel: parsed.data.paymentMethod,
    contentName: parsed.data.ebookSlug,
  });

  return NextResponse.json({ ok: true });
}
