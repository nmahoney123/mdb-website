import { useEffect } from "react";
import { COMPANY, INDUSTRIES, SOCIAL_LINKS, type Office } from "@/data/content";

/**
 * Lightweight, dependency-free document-head manager.
 *
 * There is no react-helmet in this project, so `useSeo` sets the document
 * title, upserts the SEO-critical <meta> tags, maintains a single
 * <link rel="canonical">, and injects/cleans up JSON-LD <script> blocks
 * from a `useEffect`. Mount it once per page component.
 *
 * Meta/canonical tags are upserted (never removed) so the head always holds
 * exactly one of each — the next page simply overwrites the values.
 * JSON-LD blocks are tagged and removed on unmount so structured data never
 * leaks from one route onto another.
 */

/** Canonical production origin — no trailing slash. */
export const SITE_URL = "https://mahoneydesignandbuild.com";

/** Default social share image (see index.html placeholder note). */
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.jpg`;

type JsonLd = Record<string, unknown>;

export interface SeoInput {
  /** Full <title> text for the page. */
  title: string;
  /** Meta description (~150–160 chars). */
  description?: string;
  /** Canonical path beginning with "/", e.g. "/about" or "/industries/self-storage". */
  path: string;
  /** Root-relative or absolute share image. Falls back to the default OG image. */
  image?: string;
  /** Open Graph object type. */
  type?: "website" | "article";
  /** One or more JSON-LD structured-data objects. */
  jsonLd?: JsonLd | JsonLd[];
  /** When true, emit <meta name="robots" content="noindex,nofollow"> (e.g. 404). */
  noindex?: boolean;
}

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

function absoluteUrl(pathOrUrl: string): string {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  return `${SITE_URL}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;
}

export function useSeo({
  title,
  description,
  path,
  image,
  type = "website",
  jsonLd,
  noindex = false,
}: SeoInput): void {
  useEffect(() => {
    const url = absoluteUrl(path);
    const img = absoluteUrl(image ?? DEFAULT_OG_IMAGE);

    document.title = title;

    if (description) {
      upsertMeta("name", "description", description);
    }

    upsertMeta("name", "robots", noindex ? "noindex, nofollow" : "index, follow");

    // Canonical link (single instance).
    let canonical = document.head.querySelector<HTMLLinkElement>(
      'link[rel="canonical"]',
    );
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", url);

    // Open Graph.
    upsertMeta("property", "og:title", title);
    if (description) upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:url", url);
    upsertMeta("property", "og:type", type);
    upsertMeta("property", "og:image", img);

    // Twitter card.
    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", title);
    if (description) upsertMeta("name", "twitter:description", description);
    upsertMeta("name", "twitter:image", img);

    // JSON-LD structured data — injected fresh, removed on cleanup.
    const blocks = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];
    const nodes = blocks.map((block) => {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.setAttribute("data-seo-jsonld", "");
      script.text = JSON.stringify(block);
      document.head.appendChild(script);
      return script;
    });

    return () => {
      nodes.forEach((node) => node.remove());
    };
    // jsonLd is compared by value; primitives cover the rest.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, description, path, image, type, noindex, JSON.stringify(jsonLd)]);
}

/* -------------------------------------------------------------------------- */
/*  Structured-data builders (schema.org)                                     */
/* -------------------------------------------------------------------------- */

/**
 * Organization / GeneralContractor (a LocalBusiness subtype) describing MDB.
 * Address, phone, email and founding year are sourced from the shared COMPANY
 * record; genuinely-absent values (social profiles) use TODO_OWNER_* strings.
 */
export function organizationLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "GeneralContractor",
    "@id": `${SITE_URL}/#organization`,
    name: COMPANY.name,
    alternateName: COMPANY.short,
    url: `${SITE_URL}/`,
    // Google's logo guidance prefers a square, dedicated logo (not the wide OG image).
    logo: `${SITE_URL}/favicon-512.png`,
    image: DEFAULT_OG_IMAGE,
    slogan: COMPANY.tagline,
    description:
      "Family-owned design-build general contractor delivering ground-up Self Storage, Hospitality, and Multifamily construction across the Northeast since 1985.",
    telephone: COMPANY.phone,
    faxNumber: COMPANY.fax,
    email: COMPANY.email,
    foundingDate: String(COMPANY.founded),
    address: {
      "@type": "PostalAddress",
      streetAddress: "559 Fitch Street",
      addressLocality: "Oneida",
      addressRegion: "NY",
      postalCode: "13421",
      addressCountry: "US",
    },
    areaServed: [
      { "@type": "State", name: "New York" },
      { "@type": "Place", name: "Northeast United States" },
    ],
    knowsAbout: INDUSTRIES.map((industry) => industry.name),
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
        ],
        opens: "07:00",
        closes: "17:00",
      },
    ],
    priceRange: "$$$$",
    ...(SOCIAL_URLS.length ? { sameAs: SOCIAL_URLS } : {}),
  };
}

/** Real, public social profile URLs. Empty until the owner supplies them. */
// Single source of truth: the footer's social profiles feed `sameAs`.
const SOCIAL_URLS: string[] = SOCIAL_LINKS.map((s) => s.href);

/** WebSite node for the site root. */
export function websiteLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: `${SITE_URL}/`,
    name: COMPANY.name,
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}

/** BreadcrumbList from an ordered list of {name, path} crumbs. */
export function breadcrumbLd(items: { name: string; path: string }[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

/**
 * Per-office LocalBusiness / GeneralContractor node. Only emits address fields
 * for offices where they're known (HQ); expansion offices without a confirmed
 * street address still get a valid node scoped to their city/region.
 */
export function officeLd(office: Office): JsonLd {
  const parts = office.address?.split(",").map((s) => s.trim());
  const address = office.address
    ? {
        "@type": "PostalAddress",
        streetAddress: parts?.[0],
        addressLocality: office.city,
        addressRegion: office.state,
        addressCountry: "US",
      }
    : {
        "@type": "PostalAddress",
        addressLocality: office.city,
        addressRegion: office.state,
        addressCountry: "US",
      };
  return {
    "@context": "https://schema.org",
    "@type": "GeneralContractor",
    "@id": `${SITE_URL}/locations/${office.slug}#office`,
    name: `${COMPANY.name} — ${office.city}, ${office.state}`,
    parentOrganization: { "@id": `${SITE_URL}/#organization` },
    url: `${SITE_URL}/locations/${office.slug}`,
    image: DEFAULT_OG_IMAGE,
    ...(office.phone ? { telephone: office.phone } : {}),
    ...(office.email ? { email: office.email } : {}),
    address,
    geo: {
      "@type": "GeoCoordinates",
      latitude: office.lat,
      longitude: office.lng,
    },
    areaServed: { "@type": "Place", name: office.serves },
    priceRange: "$$$$",
  };
}

/** Article (news) structured data. */
export function articleLd(input: {
  title: string;
  path: string;
  date: string;
  image?: string | null;
  description?: string;
}): JsonLd {
  const published = new Date(input.date);
  const iso = Number.isNaN(published.getTime())
    ? undefined
    : published.toISOString();
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${absoluteUrl(input.path)}#article`,
    headline: input.title,
    ...(input.description ? { description: input.description } : {}),
    ...(iso ? { datePublished: iso, dateModified: iso } : {}),
    image: absoluteUrl(input.image || DEFAULT_OG_IMAGE),
    mainEntityOfPage: { "@type": "WebPage", "@id": absoluteUrl(input.path) },
    author: { "@id": `${SITE_URL}/#organization`, name: COMPANY.name },
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}
