import { NextResponse } from "next/server";

export function jsonSuccess(data, status = 200) {
  return NextResponse.json({ ok: true, data }, { status });
}

export function jsonError(message, status = 400, code) {
  return NextResponse.json(
    { ok: false, error: { message, ...(code ? { code } : {}) } },
    { status },
  );
}

export function adminAuthErrorResponse(error) {
  if (error === "unavailable") {
    return jsonError("Authentication service is unavailable.", 503);
  }
  return jsonError("Unauthorized.", 401);
}
