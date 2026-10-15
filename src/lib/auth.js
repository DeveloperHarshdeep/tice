import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "ti_session";
const SESSION_MAX_AGE_SEC = 60 * 60 * 24 * 7; // 7 days

function getSessionSecret() {
  const secret = process.env.SESSION_SECRET || "talent-institute-production-secure-session-secret-key-32chars";
  return new TextEncoder().encode(secret);
}

export async function hashPassword(password) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}

export async function createSessionToken(adminId) {
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(String(adminId))
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE_SEC}s`)
    .sign(getSessionSecret());
}

export async function verifySessionToken(token) {
  try {
    const { payload } = await jwtVerify(token, getSessionSecret());
    if (payload.role !== "admin" || !payload.sub) return null;
    return { adminId: payload.sub, role: "admin" };
  } catch {
    return null;
  }
}

export function sessionCookieOptions(maxAge = SESSION_MAX_AGE_SEC) {
  const secure = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge,
  };
}

export async function setSessionCookie(token) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, sessionCookieOptions());
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, "", { ...sessionCookieOptions(0), maxAge: 0 });
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export async function getSessionFromRequest(request) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export async function requireAdmin(request) {
  const session = await getSessionFromRequest(request);
  if (!session) {
    return { error: "unauthorized", session: null };
  }
  return { error: null, session };
}
