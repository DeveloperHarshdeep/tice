import { clearSessionCookie, revokeSessionFromRequest } from "@/lib/auth";
import { jsonError, jsonSuccess } from "@/lib/api-response";
import { verifySameOrigin } from "@/lib/rate-limit";

export async function POST(request) {
  if (!verifySameOrigin(request)) {
    return jsonError("Invalid request origin.", 403);
  }

  try {
    await revokeSessionFromRequest(request);
  } catch (error) {
    console.error("[auth/logout] Unable to revoke session", {
      errorType: error?.name || "Error",
    });
    await clearSessionCookie();
    return jsonError("Unable to invalidate the session. Please try again.", 503);
  }
  await clearSessionCookie();
  return jsonSuccess({ loggedOut: true });
}
