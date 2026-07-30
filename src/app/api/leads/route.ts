import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { leadFormSchema } from "@/lib/validation";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { getEbookBySlugFull, getSiteSettings } from "@/lib/data";
import { toPostLeadEbookData } from "@/lib/types";
import { sendFreeChapterEmail } from "@/lib/notify";
import { validateDiscountCode } from "@/lib/discount";

// Un payload legítimo (nombre, mail, temática, comentario opcional) nunca se
// acerca a esto; cortamos temprano para no gastar CPU parseando basura.
const MAX_BODY_BYTES = 6_000;

export async function POST(request: Request) {
  const ip = getClientIp(request);

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "Solicitud inválida" }, { status: 413 });
  }

  const rateLimit = await checkRateLimit(`lead:${ip}`, {
    limit: 8,
    windowSeconds: 10 * 60,
  });
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Demasiadas solicitudes. Probá de nuevo en unos minutos." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Solicitud inválida" }, { status: 400 });
  }

  const parsed = leadFormSchema.safeParse(body);
  if (!parsed.success) {
    // Si vino con el honeypot (website) completo, tratamos como bot igual.
    return NextResponse.json(
      { error: "Revisá los datos ingresados." },
      { status: 400 }
    );
  }

  const { name, email, topic, interests, intent, ebookSlug, website, renderedAt, discountCode } =
    parsed.data;
  if (website) {
    // Honeypot: un bot completó un campo que un humano nunca ve.
    return NextResponse.json(
      { error: "Revisá los datos ingresados." },
      { status: 400 }
    );
  }

  // Un humano tarda al menos un par de segundos en completar el formulario;
  // un envío casi instantáneo es casi seguro un bot con el form autocompletado.
  if (renderedAt && Date.now() - renderedAt < 1500) {
    return NextResponse.json(
      { error: "Revisá los datos ingresados." },
      { status: 400 }
    );
  }

  const ebook = await getEbookBySlugFull(ebookSlug);
  if (!ebook) {
    return NextResponse.json({ error: "Ebook no encontrado" }, { status: 404 });
  }

  const discount = await validateDiscountCode(discountCode, ebook);

  const supabase = getSupabaseAdmin();
  const { data: insertedLead, error: insertError } = await supabase
    .from("leads")
    .insert({
      name,
      email,
      topic,
      interests: interests ?? "",
      intent,
      discount_code: discount.appliedCode,
      ebook_id: ebook.id,
      status: "nuevo",
    })
    .select("id")
    .single();

  if (insertError || !insertedLead) {
    console.error("insert lead failed", insertError);
    return NextResponse.json(
      { error: "No pudimos guardar tu solicitud. Probá de nuevo en un rato." },
      { status: 500 }
    );
  }

  // Si eligió ir directo a comprar, no le mandamos el capítulo gratis: no lo pidió.
  if (intent === "leer" && (ebook.free_chapter || ebook.free_chapter_pdf_url)) {
    try {
      const settings = await getSiteSettings();
      await sendFreeChapterEmail({ id: insertedLead.id, name, email }, ebook, settings);
    } catch (err) {
      // El capítulo ya se muestra en pantalla igual: que falle el mail no
      // debe hacer fallar la respuesta al usuario.
      console.error("sendFreeChapterEmail failed", err);
    }
  }

  return NextResponse.json({ ebook: toPostLeadEbookData(insertedLead.id, ebook, discount) });
}
