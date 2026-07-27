import "server-only";
import { SignJWT, jwtVerify } from "jose";

const SESSION_COOKIE = "admin_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 7; // 7 días

function getSecretKey() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error(
      "ADMIN_SESSION_SECRET no está configurado (o es muy corto). Generá uno con: openssl rand -base64 32"
    );
  }
  return new TextEncoder().encode(secret);
}

export interface AdminSessionPayload {
  sub: string;
  username: string;
}

export async function createSessionToken(payload: AdminSessionPayload) {
  return new SignJWT({ username: payload.username })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(getSecretKey());
}

export async function verifySessionToken(
  token: string
): Promise<AdminSessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    if (typeof payload.sub !== "string" || typeof payload.username !== "string") {
      return null;
    }
    return { sub: payload.sub, username: payload.username };
  } catch {
    return null;
  }
}

export const ADMIN_SESSION_COOKIE = SESSION_COOKIE;
export const ADMIN_SESSION_MAX_AGE = SESSION_DURATION_SECONDS;
