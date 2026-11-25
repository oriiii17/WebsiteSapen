import { createHmac, timingSafeEqual } from "node:crypto";

export const ADMIN_COOKIE = "sapen_admin_auth";
const SESSION_MAX_AGE = 60 * 60 * 24 * 14;

export interface AdminSession {
  isAdmin: true;
  username: string;
  nama: string;
  role: "ADMIN";
  exp: number;
}

function sign(value: string) {
  const secret = process.env.ADMIN_PASSWORD;
  if (!secret) throw new Error("ADMIN_PASSWORD is required.");
  return createHmac("sha256", secret).update(value).digest("base64url");
}

export function createAdminSession(username: string, nama: string) {
  const payload: AdminSession = {
    isAdmin: true,
    username,
    nama,
    role: "ADMIN",
    exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE,
  };
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return { token: `${encoded}.${sign(encoded)}`, session: payload, maxAge: SESSION_MAX_AGE };
}

export function verifyAdminSession(token?: string | null): AdminSession | null {
  if (!token) return null;
  const [encoded, signature, extra] = token.split(".");
  if (!encoded || !signature || extra) return null;
  try {
    const expected = Buffer.from(sign(encoded));
    const received = Buffer.from(signature);
    if (expected.length !== received.length || !timingSafeEqual(expected, received)) return null;
    const session = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as AdminSession;
    if (session.isAdmin !== true || session.role !== "ADMIN" || !session.username || session.exp <= Date.now() / 1000) return null;
    return session;
  } catch {
    return null;
  }
}

export function hasAdminRequest(request: Request) {
  const cookieHeader = request.headers.get("cookie") || "";
  const cookie = cookieHeader.split(";").map((part) => part.trim()).find((part) => part.startsWith(`${ADMIN_COOKIE}=`));
  return verifyAdminSession(cookie ? decodeURIComponent(cookie.slice(ADMIN_COOKIE.length + 1)) : null);
}
