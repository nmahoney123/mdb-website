import { COMPANY, INDUSTRIES, SOCIAL_LINKS, type Office } from "@/data/content";

/**
 * Shared, framework-free SEO definitions.
 *
 * Imported by both the browser (`useSeo`, which updates the head after each
 * client-side navigation) and the server (`api/lib/pageHead.ts`, which writes
 * the same tags into the HTML it sends). Crawlers and social-card scrapers that
 * don't run JavaScript therefore see the right title, description, canonical,
 * Open Graph tags, and structured data for every page — and the two can never
 * drift, because both read from here.
 *
 * Nothing in this module may touch React, the DOM, or Vite-only APIs.
 */

/** Canonical production origin — no trailing slash. */
export const SITE_URL = "https://www.mahoneydesignandbuild.com";

/** Default social share image. */
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.jpg`;

export type JsonLd = Record<string, unknown>;

export interface SeoInput {
  /** Full <title> text for the page. */
  title: string;
  /** Meta description (~150–160 chars). */
  description?: string;
  /** Share-card (Open Graph / Twitter) title, when it should differ from <title>. */
  ogTitle?: string;
  /** Share-card description, when it should differ from the meta description. */
  ogDescription?: string;
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

export function absoluteUrl(pathOrUrl: string): string {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  return `${SITE_URL}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;
}

/* -------------------------------------------------------------------------- */
/*  Structured-data builders (schema.org)                                     */
/* -------------------------------------------------------------------------- */

// Single source of truth: the footer's social profiles feed `sameAs`.
const SOCIAL_URLS: string[] = SOCIAL_LINKS.map((s) => s.href);

/**
 * Organization / GeneralContractor (a LocalBusiness subtype) describing MDB.
 * Address, phone, email and founding year are sourced from the shared COMPANY
 * record.
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
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "07:00",
        closes: "17:00",
      },
    ],
    priceRange: "$$$$",
    ...(SOCIAL_URLS.length ? { sameAs: SOCIAL_URLS } : {}),
  };
}

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

/* -------------------------------------------------------------------------- */
/*  Per-page SEO                                                              */
/* -------------------------------------------------------------------------- */

function crumbs(name: string, path: string): JsonLd {
  return breadcrumbLd([
    { name: "Home", path: "/" },
    { name, path },
  ]);
}

/** SEO for every fixed-path page, keyed by its canonical path. */
export const STATIC_PAGE_SEO: Record<string, SeoInput> = {
  "/": {
    title:
      "Mahoney Design & Build — Design-Build General Contractor | Self Storage, Hospitality, Multifamily",
    description:
      "Family-owned design-build general contractor delivering ground-up Self Storage, Hotel, and Multifamily construction across the Northeast. Building since 1985.",
    ogTitle: "Mahoney Design & Build — A Better Way to Build.",
    ogDescription:
      "Ground-up commercial construction for Self Storage, Hospitality, and Multifamily — the precision of a national firm, the accountability of a family business. Since 1985.",
    path: "/",
    jsonLd: [organizationLd(), websiteLd()],
  },
  "/industries": {
    title:
      "Industries We Build — Multifamily, Hotels, Self Storage, Industrial & More | Mahoney Design & Build",
    description:
      "Ground-up commercial construction across multifamily, hotels, residential, self storage, industrial, and specialty commercial. Design-build delivery from a family-owned GC.",
    path: "/industries",
    jsonLd: crumbs("Industries", "/industries"),
  },
  "/portfolio": {
    title: "Portfolio — Self Storage, Hotel & Multifamily Projects | Mahoney Design & Build",
    description:
      "Explore ground-up and renovation projects across self storage, hospitality, multifamily, and select custom homes delivered by Mahoney Design & Build.",
    path: "/portfolio",
    jsonLd: crumbs("Portfolio", "/portfolio"),
  },
  "/about": {
    title: "About — Family-Built Since 1985 | Mahoney Design & Build",
    description:
      "Founded in Oneida, New York in 1985, Mahoney Design & Build grew from a family homebuilder into a regional design-build commercial general contractor. Meet the team.",
    path: "/about",
    jsonLd: crumbs("About", "/about"),
  },
  "/careers": {
    title: "Careers — Build With Mahoney Design & Build | Central NY Construction Jobs",
    description:
      "Join a design-build general contractor that promotes from the field. Superintendent, project manager, estimator, and intern roles in Central New York. Apply today.",
    path: "/careers",
    jsonLd: crumbs("Careers", "/careers"),
  },
  "/news": {
    title: "News & Insights — Projects, Market & Cost Intelligence | Mahoney Design & Build",
    description:
      "Project milestones, self storage cost outlooks, and market intelligence for storage, hospitality, and multifamily owners from Mahoney Design & Build.",
    path: "/news",
    jsonLd: crumbs("News & Insights", "/news"),
  },
  "/contact": {
    title: "Contact — Start a Project | Mahoney Design & Build",
    description:
      "Start a self storage, hotel, multifamily, or custom home project, prequalify as a subcontractor, or submit a bid inquiry. Reach a decision-maker within one business day.",
    path: "/contact",
    jsonLd: [organizationLd(), crumbs("Contact", "/contact")],
  },
  "/subcontractors": {
    title: "Subcontractor Prequalification — Join Our Bid List | Mahoney Design & Build",
    description:
      "Trade partners: get on the Mahoney Design & Build bid list. Submit your safety record, insurance, licensing, and references to prequalify for commercial projects.",
    path: "/subcontractors",
    jsonLd: crumbs("Subcontractors", "/subcontractors"),
  },
  "/locations": {
    title: "Locations — Oneida NY, Chicago IL & Bend OR | Mahoney Design & Build",
    description:
      "Mahoney Design & Build operates from three offices — headquarters in Oneida, New York, plus Chicago, Illinois and Bend, Oregon — delivering design-build commercial construction nationwide.",
    path: "/locations",
    jsonLd: [organizationLd(), crumbs("Locations", "/locations")],
  },
};

export const NOT_FOUND_SEO: SeoInput = {
  title: "Page Not Found | Mahoney Design & Build",
  description: "The page you're looking for doesn't exist or has moved.",
  path: "/404",
  noindex: true,
};

export const ADMIN_SEO: SeoInput = {
  title: "Admin | Mahoney Design & Build",
  path: "/admin",
  noindex: true,
};

// Industry pages share the brand card: several markets don't have a photo of
// their own yet (Multifamily's hero is a single-family home).
export function industrySeo(industry: { slug: string; name: string; blurb: string }): SeoInput {
  const path = `/industries/${industry.slug}`;
  return {
    title: `${industry.name} Construction — Design-Build GC | Mahoney Design & Build`,
    description: industry.blurb,
    path,
    jsonLd: breadcrumbLd([
      { name: "Home", path: "/" },
      { name: "Industries", path: "/industries" },
      { name: industry.name, path },
    ]),
  };
}

export function projectSeo(project: {
  slug: string;
  name: string;
  industry: string;
  scope: string;
  location: string;
  year: string;
  size: string;
  heroImage?: string | null;
}): SeoInput {
  const path = `/portfolio/${project.slug}`;
  return {
    title: `${project.name} — ${project.industry} | Mahoney Design & Build`,
    description: `${project.scope}. ${project.location} · ${project.year} · ${project.size}. Built by Mahoney Design & Build.`,
    path,
    image: project.heroImage ?? undefined,
    jsonLd: breadcrumbLd([
      { name: "Home", path: "/" },
      { name: "Portfolio", path: "/portfolio" },
      { name: project.name, path },
    ]),
  };
}

/** CMS rows use null where the static Office type uses undefined. */
type OfficeLike = Omit<Office, "hq" | "address" | "phone" | "email"> & {
  hq?: boolean | null;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
};

export function officeSeo(office: OfficeLike): SeoInput {
  const path = `/locations/${office.slug}`;
  return {
    title: `${office.city}, ${office.state} Office — Design-Build General Contractor | ${COMPANY.name}`,
    description: `Mahoney Design & Build in ${office.city}, ${office.state} — ground-up design-build construction for self storage, hospitality, and multifamily across ${office.serves}.`,
    path,
    jsonLd: [
      officeLd({
        ...office,
        hq: office.hq ?? undefined,
        address: office.address ?? undefined,
        phone: office.phone ?? undefined,
        email: office.email ?? undefined,
      }),
      breadcrumbLd([
        { name: "Home", path: "/" },
        { name: "Locations", path: "/locations" },
        { name: `${office.city}, ${office.state}`, path },
      ]),
    ],
  };
}

export function articleSeo(article: {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  coverImage?: string | null;
}): SeoInput {
  const path = `/news/${article.slug}`;
  return {
    title: `${article.title} | Mahoney Design & Build`,
    description: article.excerpt,
    path,
    type: "article",
    image: article.coverImage ?? undefined,
    jsonLd: [
      articleLd({
        title: article.title,
        path,
        date: article.date,
        image: article.coverImage,
        description: article.excerpt,
      }),
      breadcrumbLd([
        { name: "Home", path: "/" },
        { name: "News & Insights", path: "/news" },
        { name: article.title, path },
      ]),
    ],
  };
}

/* -------------------------------------------------------------------------- */
/*  Server-side head rendering                                                */
/* -------------------------------------------------------------------------- */

/** Escape text for use inside an HTML attribute or element. */
export function escAttr(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Serialize JSON-LD for inline <script>. `<` is escaped so CMS-authored text
 * containing "</script>" can't break out of the tag.
 */
export function jsonLdText(block: JsonLd): string {
  return JSON.stringify(block)
    .replace(/</g, "\\u003c")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

/**
 * Render the SEO head tags for a page as an HTML string — the same set of tags
 * `useSeo` maintains in the browser, so hydration only ever overwrites values.
 */
export function renderSeoHead(seo: SeoInput): string {
  const url = absoluteUrl(seo.path);
  const img = absoluteUrl(seo.image ?? DEFAULT_OG_IMAGE);
  const type = seo.type ?? "website";
  const cardTitle = seo.ogTitle ?? seo.title;
  const cardDescription = seo.ogDescription ?? seo.description;
  const lines: string[] = [
    `<title>${escAttr(seo.title)}</title>`,
  ];
  if (seo.description) {
    lines.push(`<meta name="description" content="${escAttr(seo.description)}" />`);
  }
  lines.push(
    `<meta name="robots" content="${seo.noindex ? "noindex, nofollow" : "index, follow"}" />`,
  );
  // A noindexed page (404, admin) shouldn't advertise itself as canonical.
  if (!seo.noindex) {
    lines.push(`<link rel="canonical" href="${escAttr(url)}" />`);
  }
  lines.push(
    `<meta property="og:type" content="${type}" />`,
    `<meta property="og:site_name" content="${escAttr(COMPANY.name)}" />`,
    `<meta property="og:locale" content="en_US" />`,
    `<meta property="og:title" content="${escAttr(cardTitle)}" />`,
  );
  if (cardDescription) {
    lines.push(`<meta property="og:description" content="${escAttr(cardDescription)}" />`);
  }
  lines.push(
    `<meta property="og:url" content="${escAttr(url)}" />`,
    `<meta property="og:image" content="${escAttr(img)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escAttr(cardTitle)}" />`,
  );
  if (cardDescription) {
    lines.push(`<meta name="twitter:description" content="${escAttr(cardDescription)}" />`);
  }
  lines.push(`<meta name="twitter:image" content="${escAttr(img)}" />`);

  const blocks = seo.jsonLd ? (Array.isArray(seo.jsonLd) ? seo.jsonLd : [seo.jsonLd]) : [];
  for (const block of blocks) {
    lines.push(`<script type="application/ld+json" data-seo-jsonld>${jsonLdText(block)}</script>`);
  }
  return lines.join("\n    ");
}
