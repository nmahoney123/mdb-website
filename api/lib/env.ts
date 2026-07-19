import "dotenv/config";
import crypto from "crypto";

const isProduction = process.env.NODE_ENV === "production";

/**
 * Session-signing secret.
 * - If APP_SECRET is set, sessions survive process restarts.
 * - Otherwise a cryptographically-random per-process secret is generated. This
 *   is secure but ephemeral: existing admin cookies are invalidated on restart.
 *
 * Note: we deliberately do NOT fall back to ADMIN_PASSWORD here — reusing the
 * login password as an HMAC key is a credential-reuse weakness.
 */
function resolveAppSecret(): string {
  const provided = process.env.APP_SECRET;
  if (provided && provided.length > 0) return provided;
  if (isProduction) {
    console.warn(
      "[security] APP_SECRET is not set in production. Using an ephemeral " +
        "random secret — admin sessions will be invalidated on every restart. " +
        "Set APP_SECRET to a long random value for stable sessions.",
    );
  }
  return crypto.randomBytes(32).toString("hex");
}

export const env = {
  appId: process.env.APP_ID ?? "",
  appSecret: resolveAppSecret(),
  isProduction,
};
