import { connectDB } from "@/lib/db";
import Admin from "@/models/Admin";
import {
  createSessionToken,
  setSessionCookie,
  verifyPassword,
  hashPassword,
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
    await connectDB();

    // Check if any administrator exists in the database
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
      // Standard authentication against MongoDB stored password hash
      admin = await Admin.findOne({ email: normalizedEmail }).select(
        "+passwordHash email name",
      );

      if (!admin) {
        return jsonError("Invalid email or password.", 401);
      }

      const valid = await verifyPassword(password, admin.passwordHash);
      if (!valid) {
        return jsonError("Invalid email or password.", 401);
      }
    }

    const token = await createSessionToken(admin._id.toString());
    await setSessionCookie(token);

    return jsonSuccess({
      admin: { id: admin._id.toString(), email: admin.email, name: admin.name },
    });
  } catch (error) {
    console.error("Login error:", error.message);
    return jsonError("Unable to sign in right now. Please verify database connectivity.", 500);
  }
}
