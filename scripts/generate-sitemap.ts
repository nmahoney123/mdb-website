/**
 * Build-time sitemap generator. Reads the site's real data (industries,
 * projects, offices) and the markdown blog posts, then writes
 * public/sitemap.xml so it can never drift from what actually ships.
 *
 * Run via `tsx scripts/generate-sitemap.ts` (wired into the build script).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { INDUSTRIES, PROJECTS, OFFICES } from "../src/data/content";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SITE_URL = "https://mahoneydesignandbuild.com";

type Entry = { path: string; changefreq: string; priority: number };

const staticRoutes: Entry[] = [
  { path: "/", changefreq: "weekly", priority: 1.0 },
  { path: "/industries", changefreq: "monthly", priority: 0.9 },
  { path: "/portfolio", changefreq: "weekly", priority: 0.9 },
  { path: "/about", changefreq: "monthly", priority: 0.7 },
  { path: "/locations", changefreq: "monthly", priority: 0.8 },
  { path: "/careers", changefreq: "weekly", priority: 0.7 },
  { path: "/news", changefreq: "weekly", priority: 0.8 },
  { path: "/contact", changefreq: "monthly", priority: 0.8 },
  { path: "/subcontractors", changefreq: "monthly", priority: 0.6 },
];

/** Pull `slug:` from each markdown post's YAML frontmatter. */
function blogSlugs(): string[] {
  const dir = path.join(ROOT, "content", "blog");
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const raw = fs.readFileSync(path.join(dir, f), "utf-8");
      const m = raw.match(/^\s*slug:\s*["']?([^"'\n]+)["']?\s*$/m);
      return m ? m[1].trim() : path.basename(f, ".md");
    });
}

const entries: Entry[] = [
  ...staticRoutes,
  ...INDUSTRIES.map((i) => ({ path: `/industries/${i.slug}`, changefreq: "monthly", priority: 0.8 })),
  ...PROJECTS.map((p) => ({ path: `/portfolio/${p.slug}`, changefreq: "monthly", priority: 0.7 })),
  ...OFFICES.map((o) => ({ path: `/locations/${o.slug}`, changefreq: "monthly", priority: 0.7 })),
  ...blogSlugs().map((s) => ({ path: `/news/${s}`, changefreq: "monthly", priority: 0.6 })),
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map(
    (e) =>
      `  <url>\n    <loc>${SITE_URL}${e.path}</loc>\n    <changefreq>${e.changefreq}</changefreq>\n    <priority>${e.priority.toFixed(1)}</priority>\n  </url>`,
  )
  .join("\n")}
</urlset>
`;

const out = path.join(ROOT, "public", "sitemap.xml");
fs.writeFileSync(out, xml, "utf-8");
console.log(`sitemap.xml written with ${entries.length} URLs`);
