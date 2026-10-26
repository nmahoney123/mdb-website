import fs from "fs";
import path from "path";
import { asc, desc, eq } from "drizzle-orm";
import { getDb } from "../queries/connection";
import { industries, offices, posts, projects, settings } from "@db/schema";
import { INDUSTRIES, OFFICES, PROJECTS } from "@/data/content";
import { parseFrontmatter } from "@/lib/frontmatter";
import {
  ADMIN_SEO,
  NOT_FOUND_SEO,
  SITE_URL,
  STATIC_PAGE_SEO,
  articleSeo,
  escAttr,
  industrySeo,
  officeSeo,
  projectSeo,
  renderSeoHead,
  type SeoInput,
} from "@/lib/seo";

/**
 * Server-side page heads, real 404s, and the sitemap.
 *
 * The site is a client-rendered SPA, so without this every URL would ship the
 * homepage's <title>, description, canonical, and share card, and unknown
 * URLs would return 200 (a "soft 404"). Crawlers and social scrapers that don't
 * run JavaScript (Facebook, LinkedIn, Slack, iMessage, and Google's first pass)
 * would only ever see the homepage.
 *
 * Here we resolve each request path against the same content the SPA renders —
 * the CMS database with the static content as fallback, plus the markdown blog
 * — and write that page's head (shared definitions in src/lib/seo.ts) into
 * index.html with the correct status code.
 */

export type PageResolution = { status: 200 | 404; seo: SeoInput };

/* ------------------------------------------------------------------------ */
/*  Content loaders — DB first, static fallback (mirrors src/hooks/useCms)   */
/* ------------------------------------------------------------------------ */

async function loadProjects() {
  try {
    const rows = await getDb()
      .select()
      .from(projects)
      .where(eq(projects.published, true))
      .orderBy(asc(projects.sortOrder), desc(projects.createdAt));
    if (rows.length) return rows;
  } catch (err) {
    console.error("[pageHead] projects query failed:", err);
  }
  return PROJECTS.map((p) => ({ ...p, heroImage: null }));
}

async function loadIndustries() {
  try {
    const rows = await getDb()
      .select()
      .from(industries)
      .where(eq(industries.published, true))
      .orderBy(asc(industries.sortOrder), asc(industries.id));
    if (rows.length) return rows;
  } catch (err) {
    console.error("[pageHead] industries query failed:", err);
  }
  return INDUSTRIES.map((i) => ({ ...i, heroImage: null }));
}

async function loadOffices() {
  try {
    const rows = await getDb()
      .select()
      .from(offices)
      .orderBy(asc(offices.sortOrder), asc(offices.id));
    if (rows.length) return rows;
  } catch (err) {
    console.error("[pageHead] offices query failed:", err);
  }
  return OFFICES;
}

type Article = {
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string | null;
  /** Anything `new Date()` parses — used for JSON-LD and sitemap lastmod. */
  date: string;
};

let markdownCache: Map<string, Article> | null = null;

/** Git-committed markdown posts (content/blog/*.md). They ship with each deploy, so read once. */
function markdownPosts(): Map<string, Article> {
  if (markdownCache) return markdownCache;
  const map = new Map<string, Article>();
  const dir = path.resolve(process.cwd(), "content", "blog");
  try {
    for (const file of fs.readdirSync(dir)) {
      if (!file.endsWith(".md")) continue;
      const { data } = parseFrontmatter(fs.readFileSync(path.join(dir, file), "utf-8"));
      // Same derivations as src/lib/blog.ts buildPost().
      const slug = data.slug || file.replace(/\.md$/, "");
      const cover = data.coverImage?.trim();
      map.set(slug, {
        slug,
        title: data.title || slug,
        excerpt: data.excerpt || "",
        coverImage: cover ? cover : null,
        date: data.date || "",
      });
    }
  } catch (err) {
    console.error("[pageHead] reading markdown posts failed:", err);
  }
  markdownCache = map;
  return map;
}

/** Published posts: markdown wins on a slug collision, like the Article page. */
async function loadArticles(): Promise<Map<string, Article>> {
  const all = new Map<string, Article>();
  try {
    const rows = await getDb()
      .select()
      .from(posts)
      .where(eq(posts.status, "published"))
      .orderBy(desc(posts.publishedAt), desc(posts.createdAt));
    for (const p of rows) {
      all.set(p.slug, {
        slug: p.slug,
        title: p.title,
        excerpt: p.excerpt,
        coverImage: p.coverImage ?? null,
        date: p.publishedAt ? p.publishedAt.toISOString() : "",
      });
    }
  } catch (err) {
    console.error("[pageHead] posts query failed:", err);
  }
  for (const [slug, post] of markdownPosts()) all.set(slug, post);
  return all;
}

/* ------------------------------------------------------------------------ */
/*  Route resolution (mirrors the <Routes> in src/App.tsx)                   */
/* ------------------------------------------------------------------------ */

const DETAIL_ROUTE = /^\/(industries|portfolio|locations|news)\/([^/]+)$/i;

export async function resolvePage(pathname: string): Promise<PageResolution> {
  // React Router matches paths case-insensitively; slugs are compared exactly.
  const lower = pathname.toLowerCase();

  const fixed = STATIC_PAGE_SEO[lower];
  if (fixed) return { status: 200, seo: fixed };

  if (lower === "/admin" || lower.startsWith("/admin/")) {
    return { status: 200, seo: ADMIN_SEO };
  }

  const m = DETAIL_ROUTE.exec(pathname);
  if (m) {
    const section = m[1].toLowerCase();
    const slug = m[2];
    let seo: SeoInput | undefined;
    if (section === "industries") {
      const i = (await loadIndustries()).find((x) => x.slug === slug);
      if (i) seo = industrySeo(i);
    } else if (section === "portfolio") {
      const p = (await loadProjects()).find((x) => x.slug === slug);
      if (p) seo = projectSeo(p);
    } else if (section === "locations") {
      const o = (await loadOffices()).find((x) => x.slug === slug);
      if (o) seo = officeSeo(o);
    } else {
      const a = (await loadArticles()).get(slug);
      if (a) seo = articleSeo(a);
    }
    if (seo) return { status: 200, seo };
  }

  return { status: 404, seo: NOT_FOUND_SEO };
}

/* ------------------------------------------------------------------------ */
/*  HTML                                                                     */
/* ------------------------------------------------------------------------ */

/** The default head in index.html sits between these markers. */
const SEO_BLOCK = /<!--\s*seo:start\b[\s\S]*?-->[\s\S]*?<!--\s*seo:end\s*-->/;

/** Google Search Console "HTML tag" verification, from Admin → Settings. */
async function verificationTag(): Promise<string> {
  try {
    const rows = await getDb()
      .select()
      .from(settings)
      .where(eq(settings.key, "googleVerification"))
      .limit(1);
    const token = rows[0]?.value?.trim();
    return token ? `<meta name="google-site-verification" content="${escAttr(token)}" />` : "";
  } catch {
    return "";
  }
}

const PUBLIC_DIR = path.resolve(process.cwd(), "dist", "public");
const shareTwinCache = new Map<string, string | null>();

/**
 * Site images are WebP, which LinkedIn and some other link-preview scrapers
 * don't render. Shared images have 1200×630 JPEG twins under /media/og/
 * (e.g. /media/projects/x.webp → /media/og/projects/x.jpg); use the twin when
 * it exists, otherwise the original (e.g. a newly uploaded CMS image).
 */
function shareImage(image: string | undefined): string | undefined {
  const m = image ? /^\/media\/(.+)\.webp$/i.exec(image) : null;
  if (!image || !m) return image;
  let twin = shareTwinCache.get(image);
  if (twin === undefined) {
    const candidate = `/media/og/${m[1]}.jpg`;
    twin = fs.existsSync(path.join(PUBLIC_DIR, candidate)) ? candidate : null;
    shareTwinCache.set(image, twin);
  }
  return twin ?? image;
}

export async function renderPageHtml(template: string, seo: SeoInput): Promise<string> {
  if (!SEO_BLOCK.test(template)) {
    console.error("[pageHead] index.html is missing the <!-- seo:start/end --> markers");
    return template;
  }
  const verify = await verificationTag();
  const head =
    renderSeoHead({ ...seo, image: shareImage(seo.image) }) + (verify ? `\n    ${verify}` : "");
  // Function replacement so "$" in CMS text isn't treated as a backreference.
  return template.replace(SEO_BLOCK, () => head);
}

/* ------------------------------------------------------------------------ */
/*  Sitemap                                                                  */
/* ------------------------------------------------------------------------ */

function isoDay(date: string): string | undefined {
  const t = Date.parse(date);
  return Number.isNaN(t) ? undefined : new Date(t).toISOString().slice(0, 10);
}

function xmlEscape(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/**
 * Built from live content on each request, so it always lists exactly the
 * pages that resolve with a 200 above. Only posts carry <lastmod>: the CMS
 * re-seeds projects/industries on every boot, so their updatedAt reflects
 * deploys, not edits, and an inaccurate lastmod teaches Google to ignore it.
 */
export async function buildSitemap(): Promise<string> {
  const [inds, projs, offs, articles] = await Promise.all([
    loadIndustries(),
    loadProjects(),
    loadOffices(),
    loadArticles(),
  ]);
  const entries: { path: string; lastmod?: string }[] = [
    ...Object.keys(STATIC_PAGE_SEO).map((p) => ({ path: p })),
    ...inds.map((i) => ({ path: `/industries/${i.slug}` })),
    ...projs.map((p) => ({ path: `/portfolio/${p.slug}` })),
    ...offs.map((o) => ({ path: `/locations/${o.slug}` })),
    ...[...articles.values()].map((a) => ({ path: `/news/${a.slug}`, lastmod: isoDay(a.date) })),
  ];
  const urls = entries
    .map(
      (e) =>
        `  <url>\n    <loc>${xmlEscape(SITE_URL + e.path)}</loc>${
          e.lastmod ? `\n    <lastmod>${e.lastmod}</lastmod>` : ""
        }\n  </url>`,
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}
