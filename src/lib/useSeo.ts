import { useEffect } from "react";
import { DEFAULT_OG_IMAGE, absoluteUrl, jsonLdText, type SeoInput } from "./seo";

/**
 * Lightweight, dependency-free document-head manager.
 *
 * The server already sends each page with its correct head (see src/lib/seo.ts
 * and api/lib/pageHead.ts). This hook keeps the head in sync as the SPA
 * navigates client-side: it sets the title, upserts the SEO <meta> tags,
 * maintains a single <link rel="canonical">, and swaps JSON-LD blocks.
 * Mount it once per page component.
 *
 * Meta/canonical tags are upserted (never duplicated) so the head always holds
 * exactly one of each. JSON-LD blocks — including the server-rendered ones —
 * are replaced on each page and removed on unmount, so structured data never
 * leaks from one route onto another.
 */

export {
  SITE_URL,
  organizationLd,
  websiteLd,
  breadcrumbLd,
  officeLd,
  articleLd,
  type SeoInput,
} from "./seo";

function upsertMeta(
  attr: "name" | "property",
  key: string,
  content: string,
): void {
  const selector = `meta[${attr}="${key}"]`;
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

export function useSeo({
  title,
  description,
  ogTitle,
  ogDescription,
  path,
  image,
  type = "website",
  jsonLd,
  noindex = false,
}: SeoInput): void {
  useEffect(() => {
    const url = absoluteUrl(path);
    const img = absoluteUrl(image ?? DEFAULT_OG_IMAGE);
    const cardTitle = ogTitle ?? title;
    const cardDescription = ogDescription ?? description;

    document.title = title;

    if (description) {
      upsertMeta("name", "description", description);
    }

    upsertMeta("name", "robots", noindex ? "noindex, nofollow" : "index, follow");

    // Canonical link (single instance). Noindexed pages (404) carry none,
    // matching the server-rendered head.
    let canonical = document.head.querySelector<HTMLLinkElement>(
      'link[rel="canonical"]',
    );
    if (noindex) {
      canonical?.remove();
    } else {
      if (!canonical) {
        canonical = document.createElement("link");
        canonical.setAttribute("rel", "canonical");
        document.head.appendChild(canonical);
      }
      canonical.setAttribute("href", url);
    }

    // Open Graph.
    upsertMeta("property", "og:title", cardTitle);
    if (cardDescription) upsertMeta("property", "og:description", cardDescription);
    upsertMeta("property", "og:url", url);
    upsertMeta("property", "og:type", type);
    upsertMeta("property", "og:image", img);

    // Twitter card.
    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", cardTitle);
    if (cardDescription) upsertMeta("name", "twitter:description", cardDescription);
    upsertMeta("name", "twitter:image", img);

    // JSON-LD structured data. Drop whatever is there first (the server-rendered
    // blocks on first load, or a previous page's), then inject this page's.
    document.head
      .querySelectorAll("script[data-seo-jsonld]")
      .forEach((node) => node.remove());
    const blocks = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];
    const nodes = blocks.map((block) => {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.setAttribute("data-seo-jsonld", "");
      script.text = jsonLdText(block);
      document.head.appendChild(script);
      return script;
    });

    return () => {
      nodes.forEach((node) => node.remove());
    };
    // jsonLd is compared by value; primitives cover the rest.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, description, ogTitle, ogDescription, path, image, type, noindex, JSON.stringify(jsonLd)]);
}
