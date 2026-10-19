import { connectDB } from "@/lib/db";
import Admin from "@/models/Admin";
import {
  createSessionToken,
  setSessionCookie,
  verifyPassword,
  hashPassword,
  assertSessionSecretConfigured,
} from "@/lib/auth";
import { jsonError, jsonSuccess } from "@/lib/api-response";
import { parseJsonBody, loginSchema } from "@/lib/validation";
import {
  getClientIp,
  rateLimit,
  verifySameOrigin,
} from "@/lib/rate-limit";

export async function POST(request) {
  if (!verifySameOrigin(request)) {
    return jsonError("Invalid request origin.", 403);
  }

  const ip = getClientIp(request);
  const rl = await rateLimit(`login:${ip}`, { limit: 10, windowMs: 15 * 60_000 });
  if (!rl.success) {
    return jsonError("Too many login attempts. Please try again later.", 429);
  }

  const parsed = await parseJsonBody(request, loginSchema);
  if (!parsed.success) return jsonError(parsed.error, 400);

  const { email, password } = parsed.data;
  const normalizedEmail = email.toLowerCase().trim();

  try {
    assertSessionSecretConfigured();
  } catch {
    console.error("[auth/login] Invalid session configuration", {
      setting: "SESSION_SECRET",
      requirement: "at_least_32_characters",
    });
    return jsonError(
      "Sign-in is temporarily unavailable because the server authentication configuration is invalid.",
      503,
      "SESSION_CONFIGURATION_ERROR",
    );
  }

  let stage = "database_connection";
  try {
    await connectDB();

    stage = "admin_lookup";
    const adminCount = await Admin.countDocuments();

    let admin = null;

    if (adminCount === 0) {
      // Initial provisioning fallback: Check server-side environment variables
      const envEmail = process.env.ADMIN_EMAIL?.toLowerCase().trim();
      const envPassword = process.env.ADMIN_PASSWORD;

      if (envEmail && envPassword && normalizedEmail === envEmail && password === envPassword) {
        // Automatically provision the initial administrator account with a secure hash
        const passwordHash = await hashPassword(envPassword);
        admin = await Admin.create({
          email: envEmail,
          passwordHash,
          name: "Administrator",
        });
      } else {
        return jsonError("Invalid email or password.", 401);
      }
    } else {
      admin = await Admin.findOne({ email: normalizedEmail }).select(
        "+passwordHash email name",
      );

      if (!admin) {
        return jsonError("Invalid email or password.", 401);
      }

      stage = "password_verification";
      const valid = await verifyPassword(password, admin.passwordHash);
      if (!valid) {
        return jsonError("Invalid email or password.", 401);
      }
    }

    stage = "session_creation";
    const token = await createSessionToken(admin._id.toString());
    stage = "session_cookie";
    await setSessionCookie(token);

    return jsonSuccess({
      admin: { id: admin._id.toString(), email: admin.email, name: admin.name },
    });
  } catch (error) {
    console.error("[auth/login] Request failed", {
      stage,
      errorType: error?.name || "Error",
      errorCode:
        typeof error?.code === "number" ||
        (typeof error?.code === "string" &&
          /^[A-Z0-9_]{1,40}$/.test(error.code)) ?
          error.code
        : undefined,
    });
    if (stage === "database_connection" || stage === "admin_lookup") {
      return jsonError(
        "The authentication database is currently unavailable.",
        503,
        "DATABASE_UNAVAILABLE",
      );
    }
    return jsonError("Unable to sign in right now. Please verify database connectivity.", 500);
  }
}
