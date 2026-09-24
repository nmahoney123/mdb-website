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

// Host canonicalization + indexing control.
// - Alternate hostnames (www, and the mahoney.build domain) 301-redirect to the
//   single canonical host, so every page has one indexable URL. These hosts only
//   receive traffic once their DNS points at Render, so this is safe to ship
//   before the cutover.
// - The temporary *.onrender.com host stays reachable (useful for testing) but is
//   kept out of search indexes. Once the real domain is primary we can 301 it too.
const CANONICAL_HOST = "mahoneydesignandbuild.com";
const REDIRECT_TO_CANONICAL = new Set([
  "www.mahoneydesignandbuild.com",
  "mahoney.build",
  "www.mahoney.build",
]);
app.use(async (c, next) => {
  const host = (c.req.header("host") || "").toLowerCase().split(":")[0];
  if (REDIRECT_TO_CANONICAL.has(host)) {
    const url = new URL(c.req.url);
    url.protocol = "https:";
    url.host = CANONICAL_HOST;
    return c.redirect(url.toString(), 301);
  }
  await next();
  if (host.endsWith(".onrender.com")) {
    c.header("X-Robots-Tag", "noindex, nofollow");
  }
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
