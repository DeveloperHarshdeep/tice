import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/db";
import Admin from "@/models/Admin";
import AdminSession from "@/models/AdminSession";

export const SESSION_COOKIE = "ti_session";
const SESSION_MAX_AGE_SEC = 60 * 60 * 24 * 7; // 7 days

function getSessionSecret() {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    const error = new Error(
      "SESSION_SECRET must contain at least 32 characters.",
    );
    error.name = "SessionConfigurationError";
    throw error;
  }
  return new TextEncoder().encode(secret);
}

export function assertSessionSecretConfigured() {
  getSessionSecret();
}

export async function hashPassword(password) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}

export async function createSessionToken(adminId) {
  const secret = getSessionSecret();
  await connectDB();
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE_SEC * 1000);
  const session = await AdminSession.create({ adminId, expiresAt });

  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(String(adminId))
    .setJti(session._id.toString())
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE_SEC}s`)
    .sign(secret);
}

export async function verifySessionToken(token) {
  try {
    const { payload } = await jwtVerify(token, getSessionSecret());
    if (payload.role !== "admin" || !payload.sub || !payload.jti) return null;
    return { adminId: payload.sub, sessionId: payload.jti, role: "admin" };
  } catch {
    return null;
  }
}

async function getActiveSession(token) {
  const claims = await verifySessionToken(token);
  if (!claims) return null;

  await connectDB();
  const [session, admin] = await Promise.all([
    AdminSession.findOne({
      _id: claims.sessionId,
      adminId: claims.adminId,
      expiresAt: { $gt: new Date() },
    }).lean(),
    Admin.findById(claims.adminId).select("email name").lean(),
  ]);
  if (!session || !admin) return null;

  return {
    ...claims,
    email: admin.email,
    name: admin.name,
  };
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
  return getActiveSession(token);
}

export async function getSessionFromRequest(request) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return getActiveSession(token);
}

export async function requireAdmin(request) {
  try {
    const session = await getSessionFromRequest(request);
    if (!session) {
      return { error: "unauthorized", session: null };
    }
    return { error: null, session };
  } catch (error) {
    console.error("[auth] Unable to verify admin session", {
      errorType: error?.name || "Error",
    });
    return { error: "unavailable", session: null };
  }
}

export async function revokeSessionFromRequest(request) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return;
  const claims = await verifySessionToken(token);
  if (!claims) return;

  await connectDB();
  await AdminSession.deleteOne({
    _id: claims.sessionId,
    adminId: claims.adminId,
  });
}
