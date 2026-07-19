import { Hono } from "hono";
import type { HttpBindings } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import fs from "fs";
import path from "path";
import { getDb } from "./queries/connection";
import { media } from "@db/schema";
import {
  createAdminSession,
  destroyAdminSession,
  requireAdminHono,
  verifyAdminPassword,
  UPLOADS_DIR,
} from "./lib/adminAuth";

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ALLOWED = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "image/x-icon",
  "image/vnd.microsoft.icon",
  "video/mp4",
  "video/webm",
  "video/quicktime",
  "application/pdf",
]);

function sanitizeFilename(name: string): string {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9.\-_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return base || "file";
}

export function registerAdminRoutes(app: Hono<{ Bindings: HttpBindings }>) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });

  // Serve uploaded media at /api/uploads/*
  app.use(
    "/api/uploads/*",
    serveStatic({
      root: "./uploads",
      rewriteRequestPath: (p) => p.replace(/^\/api\/uploads/, ""),
    })
  );

  // --- Auth ---
  app.post("/api/admin/login", async (c) => {
    const body = await c.req.json().catch(() => ({}));
    const password = typeof body.password === "string" ? body.password : "";
    if (!verifyAdminPassword(password)) {
      return c.json({ ok: false, error: "Incorrect password" }, 401);
    }
    await createAdminSession(c);
    return c.json({ ok: true });
  });

  app.post("/api/admin/logout", async (c) => {
    await destroyAdminSession(c);
    return c.json({ ok: true });
  });

  // --- Upload (admin only) ---
  app.post("/api/admin/upload", requireAdminHono, async (c) => {
    const body = await c.req.parseBody();
    const file = body.file;
    if (!(file instanceof File)) {
      return c.json({ ok: false, error: "No file provided" }, 400);
    }
    if (file.size > MAX_FILE_SIZE) {
      return c.json({ ok: false, error: "File exceeds 50MB limit" }, 400);
    }
    const type = file.type || "application/octet-stream";
    if (!ALLOWED.has(type)) {
      return c.json({ ok: false, error: `File type not allowed: ${type}` }, 400);
    }
    const safe = `${Date.now()}-${sanitizeFilename(file.name)}`;
    const dest = path.join(UPLOADS_DIR, safe);
    fs.writeFileSync(dest, Buffer.from(await file.arrayBuffer()));

    const kind = type.startsWith("video/") ? "video" : type.startsWith("image/") ? "image" : "file";
    const url = `/api/uploads/${safe}`;
    const [result] = await getDb().insert(media).values({
      url,
      filename: file.name,
      kind,
      size: file.size,
    }).returning({ id: media.id });
    return c.json({ ok: true, media: { id: result.id, url, filename: file.name, kind, size: file.size } });
  });
}
