import { clearSessionCookie } from "@/lib/auth";
import { jsonSuccess } from "@/lib/api-response";
import { verifySameOrigin } from "@/lib/rate-limit";

export async function POST(request) {
  if (!verifySameOrigin(request)) {
    return jsonSuccess({ loggedOut: true });
  }
  await clearSessionCookie();
  return jsonSuccess({ loggedOut: true });
}
