import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { paymentChoiceSchema } from "@/lib/validation";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

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
  const { error } = await supabase
    .from("leads")
    .update({ payment_method: parsed.data.paymentMethod })
    .eq("id", id);

  if (error) {
    console.error("payment-choice update failed", error);
    return NextResponse.json({ error: "No pudimos guardar tu elección." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
