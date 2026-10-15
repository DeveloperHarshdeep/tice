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
