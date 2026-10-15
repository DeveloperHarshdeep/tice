import { connectDB } from "@/lib/db";
import Admin from "@/models/Admin";
import { getSessionFromRequest } from "@/lib/auth";
import { jsonError, jsonSuccess } from "@/lib/api-response";

export async function GET(request) {
  const session = await getSessionFromRequest(request);
  if (!session) {
    return jsonSuccess({ authenticated: false, admin: null });
  }

  try {
    await connectDB();
    const admin = await Admin.findById(session.adminId).select("email name");
    if (!admin) {
      return jsonSuccess({ authenticated: false, admin: null });
    }
    return jsonSuccess({
      authenticated: true,
      admin: {
        id: admin._id.toString(),
        email: admin.email,
        name: admin.name,
      },
    });
  } catch {
    return jsonError("Unable to load session.", 500);
  }
}
