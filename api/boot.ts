import { Hono } from "hono";
import { bodyLimit } from "hono/body-limit";
import type { HttpBindings } from "@hono/node-server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "./router";
import { createContext } from "./context";
import { env } from "./lib/env";
import { registerAdminRoutes } from "./adminRoutes";
import { securityHeaders } from "./lib/securityHeaders";
import { assertAdminPasswordConfigured } from "./lib/adminAuth";
import { seedDatabase } from "@db/seed";
import { buildSitemap } from "./lib/pageHead";
import { legacyRedirectTarget } from "./lib/legacyRedirects";
import { trimSlashes } from "./lib/paths";

assertAdminPasswordConfigured();

// Seed the CMS in-process on startup. Runs against the same SQLITE_PATH the
// server reads (a persistent disk in production), so content always populates —
// unlike a pre-deploy step, which runs on a separate instance/disk. Idempotent:
// it inserts only when a table is empty. Non-fatal so the server always boots.
await seedDatabase().catch((err) => {
  console.error("[seed] startup seeding failed:", err);
});

const app = new Hono<{ Bindings: HttpBindings }>();

app.use(securityHeaders);

// Host canonicalization: the apex, the mahoney.build domain, and Render's
// *.onrender.com address all 301 to the single canonical host, so every page
// has one indexable URL. Safe for deploys: Render sends health checks with a
// verified custom domain as the Host, and counts a 3xx as healthy regardless.
// Old-site URLs (mostly linked via the apex) resolve to their new page in the
// same hop.
const CANONICAL_HOST = "www.mahoneydesignandbuild.com";
const REDIRECT_TO_CANONICAL = new Set([
  "mahoneydesignandbuild.com",
  "mahoney.build",
  "www.mahoney.build",
]);
app.use(async (c, next) => {
  const host = (c.req.header("host") || "").toLowerCase().split(":")[0];
  if (REDIRECT_TO_CANONICAL.has(host) || host.endsWith(".onrender.com")) {
    const url = new URL(c.req.url);
    url.protocol = "https:";
    url.host = CANONICAL_HOST;
    const legacy = legacyRedirectTarget(c.req.path);
    if (legacy) {
      url.pathname = legacy;
      url.search = "";
    } else if (url.pathname.length > 1 && url.pathname.endsWith("/")) {
      url.pathname = trimSlashes(url.pathname); // /about/ → /about in the same hop
    }
    // 308 keeps the method and body for any non-GET request.
    const status = c.req.method === "GET" || c.req.method === "HEAD" ? 301 : 308;
    return c.redirect(url.toString(), status);
  }
  await next();
});

app.use(bodyLimit({ maxSize: 50 * 1024 * 1024 }));
registerAdminRoutes(app);
app.use("/api/trpc/*", async (c) => {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req: c.req.raw,
    router: appRouter,
    createContext,
  });
});
app.all("/api/*", (c) => c.json({ error: "Not Found" }, 404));

// Built from live CMS content so it always matches the pages that exist.
app.get("/sitemap.xml", async (c) => {
  c.header("Content-Type", "application/xml; charset=utf-8");
  c.header("Cache-Control", "public, max-age=3600");
  return c.body(await buildSitemap());
});

export default app;

if (env.isProduction) {
  const { serve } = await import("@hono/node-server");
  const { serveStaticFiles } = await import("./lib/vite");
  serveStaticFiles(app);

  const port = parseInt(process.env.PORT || "3000");
  serve({ fetch: app.fetch, port }, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}
