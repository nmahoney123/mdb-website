import type { Hono } from "hono";
import type { HttpBindings } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import fs from "fs";
import path from "path";
import { NOT_FOUND_SEO } from "@/lib/seo";
import { renderPageHtml, resolvePage } from "./pageHead";
import { legacyRedirectTarget } from "./legacyRedirects";
import { trimSlashes } from "./paths";

type App = Hono<{ Bindings: HttpBindings }>;

/** A request for a file (has an extension) rather than a page route. */
const FILE_PATH = /\.[a-z0-9]+$/i;

export function serveStaticFiles(app: App) {
  const distPath = path.resolve(import.meta.dirname, "../dist/public");
  const template = fs.readFileSync(path.resolve(distPath, "index.html"), "utf-8");

  // Page routes: send the SPA shell with this page's real <head> and status
  // (404 for unknown URLs instead of a soft-404 200). Files fall through to
  // the static handler below.
  app.get("*", async (c, next) => {
    const pathname = c.req.path;

    // Old-site URLs (including .php/.html files) go straight to their new
    // page — one hop, and without old query strings like Wix's ?lightbox=….
    const legacy = legacyRedirectTarget(pathname);
    if (legacy) return c.redirect(legacy, 301);

    if (pathname.startsWith("/api/") || FILE_PATH.test(pathname)) return next();

    // One URL per page: drop trailing slashes (/about/ → /about). Built from
    // the still-percent-encoded path, so decoded characters (tabs, control
    // bytes) never reach the Location header, and trimSlashes keeps the
    // target on this site ("//evil.com/" → "/evil.com").
    if (pathname.length > 1 && pathname.endsWith("/")) {
      const url = new URL(c.req.url);
      return c.redirect(trimSlashes(url.pathname) + url.search, 301);
    }

    const page = await resolvePage(pathname);
    // HTML must revalidate so a new deploy's asset hashes are picked up.
    c.header("Cache-Control", "no-cache");
    return c.html(await renderPageHtml(template, page.seo), page.status);
  });

  app.use("*", serveStatic({ root: "./dist/public" }));

  // Missing files: a browser asking for a page (e.g. an unmapped old .html URL)
  // gets the branded 404 page; assets and API clients get plain text.
  app.notFound(async (c) => {
    const accept = c.req.header("accept") ?? "";
    if (c.req.method === "GET" && accept.includes("text/html")) {
      c.header("Cache-Control", "no-cache");
      return c.html(await renderPageHtml(template, NOT_FOUND_SEO), 404);
    }
    return c.text("Not Found", 404);
  });
}
