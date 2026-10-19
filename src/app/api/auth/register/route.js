import { connectDB } from "@/lib/db";
import { hashPassword } from "@/lib/auth";
import { jsonError, jsonSuccess } from "@/lib/api-response";
import { parseJsonBody, adminRegistrationSchema } from "@/lib/validation";
import { getAdminRegistrationEnabled } from "@/lib/admin-settings";
import { getClientIp, rateLimit, verifySameOrigin } from "@/lib/rate-limit";
import Admin from "@/models/Admin";

export async function POST(request) {
  if (!verifySameOrigin(request)) {
    return jsonError("Invalid request origin.", 403);
  }

  const limit = await rateLimit(`admin-register:${getClientIp(request)}`, {
    limit: 5,
    windowMs: 60 * 60_000,
  });
  if (!limit.success) {
    return jsonError("Too many registration attempts. Please try again later.", 429);
  }

  const parsed = await parseJsonBody(request, adminRegistrationSchema);
  if (!parsed.success) return jsonError(parsed.error, 400);

  try {
    await connectDB();
    if (!(await getAdminRegistrationEnabled())) {
      return jsonError("Administrator registration is currently closed.", 403);
    }

    const { name, email, password } = parsed.data;
    const passwordHash = await hashPassword(password);
    const admin = await Admin.create({ name, email, passwordHash });

    return jsonSuccess(
      {
        admin: {
          id: admin._id.toString(),
          name: admin.name,
          email: admin.email,
        },
      },
      201,
    );
  } catch (error) {
    if (error?.code === 11000) {
      return jsonError("An administrator with that email already exists.", 409);
    }
    console.error("[auth/register] Registration failed", {
      errorType: error?.name || "Error",
    });
    return jsonError("Unable to register right now. Please try again later.", 500);
  }
}
