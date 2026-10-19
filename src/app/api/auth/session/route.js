import { getSessionFromRequest } from "@/lib/auth";
import { jsonError, jsonSuccess } from "@/lib/api-response";

export async function GET(request) {
  try {
    const session = await getSessionFromRequest(request);
    if (!session) {
      return jsonSuccess({ authenticated: false, admin: null });
    }
    return jsonSuccess({
      authenticated: true,
      admin: {
        id: session.adminId,
        email: session.email,
        name: session.name,
      },
    });
  } catch {
    return jsonError("Unable to load session.", 500);
  }
}
