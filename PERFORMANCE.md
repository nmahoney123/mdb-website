# Performance Audit — Mahoney Design & Build

Scope: front-end performance pass on the React 19 + Vite 7 client. Changes are
intentionally conservative — attributes, lazy-loading, build config, and font
hints only. No marketing copy, meta tags, backend logic, or dependencies were
touched.

Branch: `agent/perf`.

---

## 1. Route-level code splitting (`src/App.tsx`)

**Before:** every page and the entire admin app were statically imported at the
top of `App.tsx`, so the first paint of the marketing home page shipped the JS
for Portfolio, Industries, News, Contact, **and the full admin CMS** (editors,
media manager, galleries) in the initial bundle.

**After:** all 13 route components are loaded with `React.lazy(() => import(...))`
and the `<Routes>` tree is wrapped in a single `<Suspense>` with a lightweight
branded spinner fallback (`RouteFallback`). Vite now emits one chunk per route.

**Impact:**
- The initial download for a visitor landing on `/` no longer includes admin
  code or the code for pages they haven't navigated to yet.
- Admin routes (`/admin/login`, `/admin/*`) — the heaviest client code, and code
  no public visitor ever needs — are fully split out and fetched on demand.
- Trade-off: a brief chunk fetch on first navigation to each route. Mitigated by
  the Suspense fallback and by keeping shared vendor code in stable chunks (see
  §4) so navigation only fetches the small page-specific chunk.

## 2. Image performance

Nearly all site imagery is rendered through two shared components, so the fix was
centralized rather than sprinkled across every page/section:

- **`src/components/site/CmsImage.tsx`** (used by every page and home section):
  added `decoding="async"` to all rendered images. The component already
  defaulted to `loading="lazy"`. When a caller opts into `loading="eager"` (for
  an LCP image), it now also emits `fetchPriority="high"`.
- **`src/sections/home/Hero.tsx`** — the reduced-motion `<img>` fallback for the
  background video is the home-page LCP element. Marked `loading="eager"`,
  `fetchPriority="high"`, `decoding="async"` so it is never lazily deferred.
- **`src/components/site/Gallery.tsx`** — grid thumbnails keep `loading="lazy"`
  and gained `decoding="async"`; the lightbox (full-size) image gained
  `decoding="async"`.

**CLS note:** explicit width/height were not force-added because every image is
already wrapped in a fixed-aspect container (`aspect-[4/3]`, `aspect-video`,
`aspect-[4/5]`, etc.) with `object-cover`, so layout is already reserved before
the image loads. Adding intrinsic dimensions on top would be redundant and risk
fighting the existing `h-full w-full` sizing.

**Out of scope / left as-is:** admin-only `<img>` tags (`src/admin/*`) — not on
the public critical path. The Google Maps `<iframe>`s in Contact/CtaBand already
carry `loading="lazy"`.

## 3. Font loading (`index.html`)

The Google Fonts URL already includes `display=swap`, and both `preconnect`
hints (`fonts.googleapis.com` + `fonts.gstatic.com` with `crossorigin`) were
already present. Added a `<link rel="preload" as="style" href="…">` for the
primary font stylesheet ahead of the `rel="stylesheet"` link so the CSS request
starts earlier in the head, shaving a round-trip off first font paint. Kept
simple and valid; no self-hosting and no new dependencies.

## 4. Vite build config (`vite.config.ts`)

Added a `build` block (dev-server plugin config untouched):

- `target: "es2020"` — modern output, less legacy transpilation weight.
- `cssMinify: "esbuild"` — explicit CSS minification via the bundled esbuild
  (chosen over `lightningcss`, which is **not installed** — using it would have
  required a new dependency).
- `chunkSizeWarningLimit: 900` — quiets noise now that vendor libs are
  deliberately grouped.
- `rollupOptions.output.manualChunks` splitting the heavy vendors into
  cacheable, long-lived chunks:
  - `react` → `react`, `react-dom`, `react-router`
  - `vendor-motion` → `framer-motion`
  - `vendor-charts` → `recharts` (admin dashboards only — kept out of the
    public path and cached separately)
  - `vendor-query` → `@tanstack/react-query`, `@trpc/*`, `superjson`

This keeps large third-party code in stable chunks whose hashes don't change
when app code changes, improving repeat-visit cache hit rates.

---

## Build verification

- `npx esbuild` transpiles all modified `.tsx` files cleanly.
- `vite build` reaches "1165 modules transformed" (parsing/transforming all my
  changes successfully) before failing on a **pre-existing, unrelated** error:
  `Could not load src/data/content` (imported by `src/pages/Industries.tsx` and
  ~12 other untouched files). This module is simply absent from this worktree
  checkout. Verified pre-existing by building the stashed baseline — it fails
  identically. Not in scope to fix (would require touching page/content wiring).
- `npx tsc -b` reports errors only in untouched files, all downstream of the same
  missing `@/data/content` module. No new type errors were introduced.

Because of the missing-module blocker, a final bundle-size table could not be
produced from a completed build. Observations below are from the dependency
footprint and the chunking strategy.

## Bundle-size observations

- **Biggest wins are structural, not byte-shaving.** Splitting admin code
  (`recharts`, all the CMS editors, media/gallery managers) out of the initial
  public bundle is the largest single reduction for real visitors — none of that
  code loads on the marketing site.
- **`recharts`** is the single heaviest dependency and is admin-only. Route
  splitting + the `vendor-charts` manual chunk ensure it never enters the public
  critical path.
- **`framer-motion`** is used site-wide (Hero, Reveal, Stagger, Gallery), so it
  legitimately belongs in the initial load; isolating it in `vendor-motion`
  keeps it cached across app-code deploys.
- **Radix UI** — many packages, but tree-shaken per-usage; they ride along in
  the route chunks that actually use them (mostly admin + form pages).

## Prioritized recommendations NOT auto-applied

1. **Hero video optimization (highest impact).** The home hero autoplays an MP4
   montage (`heroVideoUrl` / `heroVideoMobileUrl`) — almost certainly the single
   largest byte cost on the site and a direct LCP/bandwidth concern. Recommend:
   compress/transcode to a modern codec (AV1/H.265 or at least a tuned H.264),
   cap bitrate, serve a genuinely small mobile variant, add `preload="none"` or
   `preload="metadata"`, and ensure the poster image is a lightweight optimized
   still. Consider `IntersectionObserver` to defer play until in view.
2. **Modern image formats + responsive `srcset`.** CMS images are served as-is.
   Serve AVIF/WebP with `<picture>`/`srcset` + `sizes` so cards, thumbnails, and
   heroes each download an appropriately sized asset. Best paired with a CDN /
   image-resizing service.
3. **Image CDN.** Route CMS media through a transforming CDN (Cloudflare Images,
   imgix, Cloudinary, or Vercel/Netlify image opt) for automatic format
   negotiation, on-the-fly resizing, and edge caching.
4. **Resolve the missing `@/data/content` module** so production builds succeed
   in this environment and CI can enforce bundle budgets. (Setup issue, not perf,
   but it currently blocks any real bundle measurement.)
5. **Preload the LCP hero poster** via `<link rel="preload" as="image">` once the
   poster asset URL is static/known at build time.
6. **Route-based prefetch.** Warm likely-next route chunks (e.g. Portfolio from
   Home) on link hover/idle to hide the code-split fetch latency.
7. **Self-host fonts** (future) to remove the third-party `fonts.gstatic.com`
   round-trip entirely and gain full `font-display` / subsetting control. Left
   out here per scope (no new deps / no self-hosting).
8. **Refresh `caniuse-lite`** (`npx update-browserslist-db@latest`) — the build
   warns the browsers data is 7 months old.
