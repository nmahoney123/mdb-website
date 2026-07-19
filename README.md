# Mahoney Design & Build — Website

Marketing website and content-management system for **Mahoney Design & Build**, a
family-owned design-build general contractor (Self Storage · Hospitality ·
Multifamily) operating since 1985 from Oneida, NY, with offices in Chicago, IL and
Bend, OR.

## Tech stack

- **Frontend:** React 19, Vite 7, TypeScript, Tailwind CSS 3 (shadcn-style theme), Framer Motion, React Router 7 (BrowserRouter)
- **Backend:** Hono + tRPC (type-safe API), served by `@hono/node-server`
- **Database:** embedded SQLite via better-sqlite3 + Drizzle ORM (file-based, zero external services)
- **Content:** hybrid CMS — most content is DB-backed and editable in the admin dashboard, with `src/data/content.ts` as the seed/fallback source; the blog is git-committed markdown in `content/blog/`.

## Quick start (development)

Requires **Node.js 20+**.

```bash
npm install
npm run db:seed     # one-time: populate the local SQLite DB with launch content
npm run dev         # http://localhost:3000  (frontend + API, hot reload)
```

- **Website:** http://localhost:3000
- **Admin dashboard:** http://localhost:3000/admin/login (default dev password `mahoney1985` — override with `ADMIN_PASSWORD`)

## Admin dashboard

The admin is organized to mirror the site. Log in to edit, per page/section:

- **Site pages** — Home, About, Industries, Portfolio (Projects), Locations (Offices), Careers (Jobs), News
- **Content** — Testimonials, Partners, Galleries, Media library
- **Page Content** — arbitrary page copy (headings, hero text) by key
- **Settings** — company info, logo/favicon, hero video, homepage stats, SEO meta, Google tag (GA4/Ads) + Search Console verification

The **blog** (`/news`) merges git-committed markdown posts (`content/blog/*.md`,
which take priority on slug collision) with any posts created in the admin.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Vite dev server (frontend + tRPC API) with HMR |
| `npm run build` | Generate sitemap → build frontend → bundle the server (`dist/`) |
| `npm start` | Run the production server (`node dist/boot.js`) |
| `npm run db:seed` | Seed/refresh the SQLite DB from `src/data/content.ts` (idempotent) |
| `npm run sitemap` | Regenerate `public/sitemap.xml` from the data + blog files |
| `npm run check` | Type-check (`tsc -b`) |
| `npm run lint` / `npm run format` | ESLint / Prettier |

## Configuration

Copy `.env.example` to `.env` and set values. Key variables:

- `ADMIN_PASSWORD` — **required in production** (admin login fails closed if unset)
- `APP_SECRET` — HMAC key for admin sessions (`openssl rand -hex 32`)
- `SQLITE_PATH` — optional override for the DB file location

## Deployment notes

Runtime data lives on the local filesystem: the SQLite DB (`data/`) and uploaded
media (`uploads/`). On hosts with an **ephemeral filesystem (e.g. Render's default)
these are wiped on every deploy** — attach a persistent disk (and point
`SQLITE_PATH`/uploads at it) or migrate to a hosted database + object storage.

A fresh deploy starts with an **empty database** — run `npm run db:seed` as part of
the deploy/release step (the included `Dockerfile` does this automatically). Set
`ADMIN_PASSWORD` and `APP_SECRET` as host secrets, and ensure HTTPS is enforced.

## Project structure

```
api/            Hono + tRPC backend (routes, queries, auth, middleware)
db/             Drizzle schema + seed script
content/blog/   Git-committed markdown blog posts
src/
  pages/        Route pages
  sections/     Home-page sections
  components/   Shared UI (site/ + shadcn ui/)
  admin/        Admin dashboard (CMS editors)
  hooks/        CMS data hooks (DB with content.ts fallback)
  lib/          SEO, blog loader, utilities
  data/         content.ts — seed/fallback content
scripts/        Build-time sitemap generator
public/         Static assets (media, favicons, robots.txt, sitemap.xml)
```
