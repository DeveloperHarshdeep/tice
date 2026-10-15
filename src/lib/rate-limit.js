/**
 * Rate limiting adapter.
 *
 * Production (multi-instance): set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN.
 * Development / single instance: in-memory fallback (not reliable across replicas).
 */

const memoryStore = new Map();

function memoryRateLimit(key, limit, windowMs) {
  const now = Date.now();
  const bucket = memoryStore.get(key) || { count: 0, resetAt: now + windowMs };

  if (now > bucket.resetAt) {
    bucket.count = 0;
    bucket.resetAt = now + windowMs;
  }

  bucket.count += 1;
  memoryStore.set(key, bucket);

  return {
    success: bucket.count <= limit,
    remaining: Math.max(0, limit - bucket.count),
    resetAt: bucket.resetAt,
  };
}

async function upstashRateLimit(key, limit, windowMs) {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;

  const windowSec = Math.ceil(windowMs / 1000);
  const redisKey = `rl:${key}`;

  const pipeline = [
    ["INCR", redisKey],
    ["EXPIRE", redisKey, windowSec, "NX"],
  ];

  const response = await fetch(`${url}/pipeline`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(pipeline),
  });

  if (!response.ok) {
    return memoryRateLimit(key, limit, windowMs);
  }

  const result = await response.json();
  const count = result?.[0]?.result ?? 1;

  return {
    success: count <= limit,
    remaining: Math.max(0, limit - count),
    resetAt: Date.now() + windowMs,
  };
}

export async function rateLimit(key, { limit = 10, windowMs = 60_000 } = {}) {
  const upstash = await upstashRateLimit(key, limit, windowMs);
  if (upstash) return upstash;
  return memoryRateLimit(key, limit, windowMs);
}

export function getClientIp(request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return request.headers.get("x-real-ip") || "unknown";
}

export function verifySameOrigin(request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  const host = request.headers.get("host");
  if (!host) return false;
  try {
    const originHost = new URL(origin).host;
    return originHost === host;
  } catch {
    return false;
  }
}
