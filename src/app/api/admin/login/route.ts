import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { verifyPassword, hashPassword } from "@/lib/password";
import { createSessionToken, ADMIN_SESSION_COOKIE, ADMIN_SESSION_MAX_AGE } from "@/lib/auth";
import { adminLoginSchema } from "@/lib/validation";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import type { AdminUser } from "@/lib/types";

// Hash "dummy" fijo para comparar contra algo aunque el usuario no exista,
// así el tiempo de respuesta no delata si el username es válido o no.
const DUMMY_HASH_PROMISE = hashPassword("dummy-password-never-used");

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const rateLimit = await checkRateLimit(`admin-login:${ip}`, {
    limit: 8,
    windowSeconds: 15 * 60,
  });

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Demasiados intentos. Probá de nuevo en unos minutos." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Solicitud inválida" }, { status: 400 });
  }

  const parsed = adminLoginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Usuario o contraseña inválidos" }, { status: 400 });
  }

  const { username, password } = parsed.data;

  const supabase = getSupabaseAdmin();
  const { data: user } = await supabase
    .from("admin_users")
    .select("*")
    .eq("username", username)
    .maybeSingle<AdminUser>();

  const hashToCheck = user?.password_hash ?? (await DUMMY_HASH_PROMISE);
  const passwordOk = await verifyPassword(password, hashToCheck);

  if (!user || !passwordOk) {
    return NextResponse.json(
      { error: "Usuario o contraseña incorrectos" },
      { status: 401 }
    );
  }

  const token = await createSessionToken({ sub: user.id, username: user.username });

  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: ADMIN_SESSION_MAX_AGE,
  });

  return response;
}
