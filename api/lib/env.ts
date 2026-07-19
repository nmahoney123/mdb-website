import "dotenv/config";
import crypto from "crypto";

export const env = {
  appId: process.env.APP_ID ?? "",
  // Session signing secret — auto-generated per process if not provided.
  // Set APP_SECRET (or it falls back to ADMIN_PASSWORD) for sessions that survive restarts.
  appSecret:
    process.env.APP_SECRET ||
    process.env.ADMIN_PASSWORD ||
    crypto.randomBytes(32).toString("hex"),
  isProduction: process.env.NODE_ENV === "production",
};
