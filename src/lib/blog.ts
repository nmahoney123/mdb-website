/**
 * Git-committed markdown blog.
 *
 * Posts live as `content/blog/*.md` at the repo root and are bundled at build
 * time via Vite's `import.meta.glob`. This module parses their YAML-style
 * frontmatter and renders the markdown body to HTML with a small, dependency
 * free, XSS-safe renderer (all content is HTML-escaped before any formatting
 * is applied, and link URLs are scheme-restricted).
 *
 * Exposes `getAllPosts()` and `getPostBySlug()`. These are independent of the
 * database-backed CMS posts, so the markdown blog renders even when the API /
 * DB is empty or unavailable.
 */

export type BlogPost = {
  /** URL slug (from frontmatter, or derived from the filename). */
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  /** Real cover image URL, or null → the placeholder slot is shown. */
  coverImage: string | null;
  /** Human-readable date string, e.g. "July 14, 2026". */
  date: string;
  author: string;
  /** Placeholder shot description used when there is no coverImage. */
  shot: string;
  /** Rendered, sanitized HTML for the article body. */
  html: string;
  /** Sortable timestamp derived from `date` (ms; 0 if unparseable). */
  timestamp: number;
  /** Discriminator so callers can tell markdown posts from DB posts. */
  source: "markdown";
};

// ---------------------------------------------------------------------------
// Frontmatter parsing
// ---------------------------------------------------------------------------

type Frontmatter = Record<string, string>;

function parseFrontmatter(raw: string): { data: Frontmatter; body: string } {
  const normalized = raw.replace(/\r\n/g, "\n");
  const match = /^---\n([\s\S]*?)\n---\n?([\s\S]*)$/.exec(normalized);
  if (!match) return { data: {}, body: normalized };

  const data: Frontmatter = {};
  for (const line of match[1].split("\n")) {
    if (!line.trim()) continue;
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    let value = line.slice(idx + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (key) data[key] = value;
  }
  return { data, body: match[2] };
}

// ---------------------------------------------------------------------------
// Safe markdown → HTML rendering
// ---------------------------------------------------------------------------

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Allow only safe URL schemes; everything else becomes an inert anchor. */
function sanitizeUrl(url: string): string {
  const trimmed = url.trim();
  if (/^(https?:|mailto:)/i.test(trimmed)) return trimmed;
  if (/^[/#]/.test(trimmed)) return trimmed; // root-relative or in-page anchor
  if (/^[\w.+-]+@[\w.-]+\.[a-z]{2,}$/i.test(trimmed)) return `mailto:${trimmed}`;
  return "#";
}

/**
 * Inline formatting. Operates on text that has ALREADY been HTML-escaped, so
 * no raw markup can slip through — we only ever inject a fixed set of tags.
 */
function renderInline(escaped: string): string {
  let out = escaped;
  // Links: [text](url) — url is re-escaped defensively for the attribute.
  out = out.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_m, label: string, href: string) => {
    const safe = escapeHtml(sanitizeUrl(href.replace(/&amp;/g, "&")));
    const external = /^https?:/i.test(sanitizeUrl(href.replace(/&amp;/g, "&")));
    const attrs = external ? ' target="_blank" rel="noopener noreferrer"' : "";
    return `<a href="${safe}"${attrs}>${label}</a>`;
  });
  // Inline code
  out = out.replace(/`([^`]+)`/g, "<code>$1</code>");
  // Bold before italic so ** is not consumed as two single *.
  out = out.replace(/\*\*([^*]+?)\*\*/g, "<strong>$1</strong>");
  out = out.replace(/__([^_]+?)__/g, "<strong>$1</strong>");
  out = out.replace(/\*([^*]+?)\*/g, "<em>$1</em>");
  out = out.replace(/(?<![\w])_([^_]+?)_(?![\w])/g, "<em>$1</em>");
  return out;
}

function renderMarkdown(markdown: string): string {
  const escaped = escapeHtml(markdown.replace(/\r\n/g, "\n"));
  const lines = escaped.split("\n");
  const html: string[] = [];

  let paragraph: string[] = [];
  let listType: "ul" | "ol" | null = null;
  let listItems: string[] = [];

  const flushParagraph = () => {
    if (paragraph.length) {
      html.push(`<p>${renderInline(paragraph.join(" "))}</p>`);
      paragraph = [];
    }
  };
  const flushList = () => {
    if (listType) {
      const items = listItems.map((li) => `<li>${renderInline(li)}</li>`).join("");
      html.push(`<${listType}>${items}</${listType}>`);
      listType = null;
      listItems = [];
    }
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line) {
      flushParagraph();
      flushList();
      continue;
    }

    const heading = /^(#{1,4})\s+(.*)$/.exec(line);
    if (heading) {
      flushParagraph();
      flushList();
      const level = heading[1].length;
      html.push(`<h${level}>${renderInline(heading[2])}</h${level}>`);
      continue;
    }

    const unordered = /^[-*]\s+(.*)$/.exec(line);
    if (unordered) {
      flushParagraph();
      if (listType && listType !== "ul") flushList();
      listType = "ul";
      listItems.push(unordered[1]);
      continue;
    }

    const ordered = /^\d+\.\s+(.*)$/.exec(line);
    if (ordered) {
      flushParagraph();
      if (listType && listType !== "ol") flushList();
      listType = "ol";
      listItems.push(ordered[1]);
      continue;
    }

    flushList();
    paragraph.push(line);
  }

  flushParagraph();
  flushList();
  return html.join("\n");
}

// ---------------------------------------------------------------------------
// Loading + public API
// ---------------------------------------------------------------------------

const rawFiles = import.meta.glob("/content/blog/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

function slugFromPath(path: string): string {
  return path.split("/").pop()!.replace(/\.md$/, "");
}

function buildPost(path: string, raw: string): BlogPost {
  const { data, body } = parseFrontmatter(raw);
  const slug = data.slug || slugFromPath(path);
  const cover = data.coverImage?.trim();
  const parsed = data.date ? Date.parse(data.date) : NaN;
  return {
    slug,
    title: data.title || slug,
    excerpt: data.excerpt || "",
    category: data.category || "Insights",
    coverImage: cover ? cover : null,
    date: data.date || "",
    author: data.author || "Mahoney Design & Build",
    shot: data.excerpt || `${data.title || slug} — article photograph`,
    html: renderMarkdown(body.trim()),
    timestamp: Number.isNaN(parsed) ? 0 : parsed,
    source: "markdown",
  };
}

const posts: BlogPost[] = Object.entries(rawFiles)
  .map(([path, raw]) => buildPost(path, raw))
  .sort((a, b) => b.timestamp - a.timestamp);

const bySlug = new Map(posts.map((p) => [p.slug, p]));

/** All markdown posts, newest first. */
export function getAllPosts(): BlogPost[] {
  return posts;
}

/** A single markdown post by slug, or undefined if none matches. */
export function getPostBySlug(slug: string | undefined): BlogPost | undefined {
  if (!slug) return undefined;
  return bySlug.get(slug);
}
