/**
 * Minimal YAML-style frontmatter parser for the markdown blog
 * (content/blog/*.md). Pure and dependency-free so both the browser bundle
 * (src/lib/blog.ts) and the server (api/lib/pageHead.ts) can use it.
 */

type Frontmatter = Record<string, string>;

export function parseFrontmatter(raw: string): { data: Frontmatter; body: string } {
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
