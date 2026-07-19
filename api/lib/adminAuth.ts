import { createHmac, randomBytes, timingSafeEqual } from "crypto";
import { getCookie, setCookie, deleteCookie } from "hono/cookie";
import type { Context } from "hono";
import { TRPCError } from "@trpc/server";
import { and, eq, gt } from "drizzle-orm";
import { getDb } from "../queries/connection";
import { adminSessions } from "@db/schema";
import { env } from "./env";
import path from "path";

export const UPLOADS_DIR = path.resolve(process.cwd(), "uploads");

const COOKIE_NAME = "mdb_admin";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

function sign(value: string): string {
  return createHmac("sha256", env.appSecret).update(value).digest("hex");
}

export function verifyAdminPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD || "mahoney1985";
  const a = Buffer.from(password);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function createAdminSession(c: Context): Promise<void> {
  const raw = randomBytes(32).toString("hex");
  const token = `${raw}.${sign(raw)}`;
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
  await getDb().insert(adminSessions).values({ token, expiresAt });
  setCookie(c, COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "Lax",
    path: "/",
    maxAge: SESSION_TTL_MS / 1000,
    secure: env.isProduction,
  });
}

export async function destroyAdminSession(c: Context): Promise<void> {
  const token = getCookie(c, COOKIE_NAME);
  if (token) {
    await getDb().delete(adminSessions).where(eq(adminSessions.token, token));
  }
  deleteCookie(c, COOKIE_NAME, { path: "/" });
}

export async function isValidToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const [raw, sig] = token.split(".");
  if (!raw || !sig) return false;
  const a = Buffer.from(sign(raw));
  const b = Buffer.from(sig);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return false;
  const rows = await getDb()
    .select({ id: adminSessions.id })
    .from(adminSessions)
    .where(and(eq(adminSessions.token, token), gt(adminSessions.expiresAt, new Date())))
    .limit(1);
  return rows.length > 0;
}

/** Hono middleware for admin-protected REST endpoints (uploads) */
export async function requireAdminHono(c: Context, next: () => Promise<void>) {
  const token = getCookie(c, COOKIE_NAME);
  if (!(await isValidToken(token))) {
    return c.json({ error: "Unauthorized" }, 401);
  }
  await next();
}

/** tRPC context check — throws unless admin cookie is valid */
export async function requireAdminTrpc(req: Request): Promise<void> {
  const cookie = req.headers.get("cookie") ?? "";
  const match = cookie.match(new RegExp(`(?:^|;\\s*)${COOKIE_NAME}=([^;]+)`));
  const token = match ? decodeURIComponent(match[1]) : undefined;
  if (!(await isValidToken(token))) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Admin login required" });
  }
}
