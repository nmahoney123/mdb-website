/**
 * Minimal dependency-free in-memory rate limiter (fixed window).
 *
 * Suitable for a single-process deployment (this app runs one Node process).
 * For a multi-instance / horizontally-scaled deployment, replace the Map with
 * a shared store (e.g. Redis) — see SECURITY.md residual notes.
 */

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

// Opportunistic cleanup so the Map can't grow unbounded from unique keys.
let lastSweep = Date.now();
function sweep(now: number) {
  if (now - lastSweep < 60_000) return;
  lastSweep = now;
  for (const [key, b] of buckets) {
    if (b.resetAt <= now) buckets.delete(key);
  }
}

export type RateLimitResult = {
  ok: boolean;
  /** Seconds until the window resets (for a Retry-After header). */
  retryAfter: number;
  remaining: number;
};

/**
 * Records a hit against `key` and reports whether it is within `limit`
 * requests per `windowMs` milliseconds.
 */
export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  sweep(now);

  let bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    bucket = { count: 0, resetAt: now + windowMs };
    buckets.set(key, bucket);
  }

  bucket.count += 1;
  const retryAfter = Math.max(1, Math.ceil((bucket.resetAt - now) / 1000));

  if (bucket.count > limit) {
    return { ok: false, retryAfter, remaining: 0 };
  }
  return { ok: true, retryAfter, remaining: Math.max(0, limit - bucket.count) };
}

/**
 * Best-effort client IP extraction. Behind Render's proxy the real client IP
 * is the first entry of X-Forwarded-For. Falls back to a shared bucket key so
 * that, even without a resolvable IP, a global cap still applies.
 */
export function clientIpFromHeaders(headers: Headers, fallbackIp?: string): string {
  const xff = headers.get("x-forwarded-for");
  if (xff) {
    const first = xff.split(",")[0]?.trim();
    if (first) return first;
  }
  const real = headers.get("x-real-ip");
  if (real) return real.trim();
  return fallbackIp && fallbackIp.length > 0 ? fallbackIp : "unknown";
}
