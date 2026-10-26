import { trimSlashes } from "./paths";

/**
 * 301 redirects from the previous sites' URLs to their new equivalents, so old
 * Google results and inbound links land on a real page instead of a 404 — and
 * pass their ranking signal to the new URL.
 *
 * Inventory: the Wix site (2019–2026) from its archived router table, plus the
 * older static/PHP sites (2004–2017) from the Wayback Machine. Pages with no
 * sensible equivalent are deliberately left out — redirecting an unrelated page
 * to the homepage counts as a soft 404 anyway.
 *
 * Keys are lowercase, percent-decoded paths without a trailing slash. Never add
 * a key that is also a live route on the new site (it would shadow the page).
 */
export const LEGACY_REDIRECTS: Record<string, string> = {
  // Wix site (2019–2026)
  "/home": "/",
  "/our-past-work": "/portfolio",
  "/home-exteriors-gallery": "/portfolio",
  "/resident": "/industries/custom-homes",
  "/custom-homes": "/industries/custom-homes",
  "/design-process": "/industries/custom-homes",
  "/home-construction": "/industries/custom-homes",
  "/commercial-construction": "/industries",
  "/self-storage": "/industries/self-storage",
  "/hotels-and-apartment-complexs": "/industries/hotels-hospitality",
  "/extreme-makeover-geneva-ny-edition": "/portfolio/extreme-makeover-home",
  "/meet-the-team": "/about",
  // Client portal hub and its password-protected pages.
  "/customer-design-portal": "/contact",
  "/mahoney-project": "/contact",
  "/copy-of-mahoney-project": "/contact",

  // Static and PHP sites (2004–2017)
  "/index.html": "/",
  "/index.php": "/",
  "/about.php": "/about",
  "/about.html": "/about",
  "/about us.htm": "/about",
  "/story.html": "/about",
  "/why.html": "/about",
  "/why.htm": "/about",
  "/test.html": "/about", // "Testimonials" in the old nav
  "/test.htm": "/about",
  "/contact.html": "/contact",
  "/contact.htm": "/contact",
  "/commercial.php": "/industries",
  "/commercial.html": "/industries",
  "/scomm.html": "/industries",
  "/multi.php": "/industries/multifamily",
  "/resident.php": "/industries/custom-homes",
  "/developments.html": "/portfolio",
  "/clocations.html": "/portfolio", // "Current Locations" = active subdivisions
  "/greenleaf/map.pdf": "/portfolio/green-leaf-station",
  "/photo_gallery/index.html": "/portfolio",
  "/photo_gallery/album1.htm": "/portfolio",
  "/photo_gallery/album2.htm": "/portfolio",
  "/photo_gallery/album3.htm": "/portfolio",
  "/photo_gallery/album4.htm": "/portfolio",
  "/photo_gallery/album5.htm": "/portfolio",
  "/exterior.html": "/portfolio",
  "/exterior2.html": "/portfolio",
  "/interiors.html": "/portfolio",
  "/bathmain.html": "/portfolio",
  "/dinemain.html": "/portfolio",
  "/entrymain.html": "/portfolio",
  "/b2.html": "/portfolio",
  "/d2.html": "/portfolio",
  "/d3.html": "/portfolio",
  "/e2.html": "/portfolio",
  "/e3.html": "/portfolio",
  "/g2.html": "/portfolio",
  "/g4.html": "/portfolio",
  "/g5.html": "/portfolio",
};

/** Longer than any key; lets us skip the lookup for junk paths cheaply. */
const MAX_KEY_LENGTH = 64;

/**
 * The new-site path for an old URL, or undefined. Takes Hono's decoded
 * `c.req.path`; matching ignores case and leading/trailing slashes.
 */
export function legacyRedirectTarget(pathname: string): string | undefined {
  if (pathname.length > MAX_KEY_LENGTH) return undefined;
  const key = trimSlashes(pathname.toLowerCase());
  return Object.hasOwn(LEGACY_REDIRECTS, key) ? LEGACY_REDIRECTS[key] : undefined;
}
