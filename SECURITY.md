# Security Review — Mahoney Design & Build Website

Authorized defensive hardening of the owner's own site. Stack: Hono + tRPC +
better-sqlite3, with a password-protected admin dashboard.

This document lists findings (severity-ranked), what was fixed in this pass, and
residual recommendations for deployment.

---

## Summary of fixes applied

| # | Area | Severity | Status |
|---|------|----------|--------|
| 1 | Hardcoded admin password fallback (`mahoney1985`) | High | Fixed |
| 2 | Session-signing secret reused the admin password | Medium | Fixed |
| 3 | No brute-force throttle on admin login | Medium | Fixed |
| 4 | No spam throttle on public inquiry form | Medium | Fixed |
| 5 | Missing HTTP security headers / CSP | Medium | Fixed |
| 6 | Upload size not scoped per file type | Low | Fixed |
| 7 | Path-traversal defense-in-depth on file writes/deletes | Low | Fixed |
| 8 | Unbounded growth of expired admin sessions | Low | Fixed |
| 9 | Stale/incorrect `.env.example` (MySQL, undocumented secrets) | Low | Fixed |

Type-check (`tsc -b`) passes for all `api/**` changes. (Pre-existing frontend
type errors in `src/**` are unrelated and out of scope.)

---

## Findings & fixes (detail)

### 1. Hardcoded admin password fallback — HIGH
**Before:** `verifyAdminPassword` used `process.env.ADMIN_PASSWORD || "mahoney1985"`.
A production deploy that forgot to set `ADMIN_PASSWORD` would silently accept a
password that is documented publicly in `HOW-TO-RUN.md` / README — full admin
takeover.

**Fix (`api/lib/adminAuth.ts`):** the password now resolves through
`resolveAdminPassword()`:
- **Production:** must come from `ADMIN_PASSWORD`. If unset, auth **fails closed**
  (every login is rejected) instead of using a known default.
- **Development:** keeps the documented `mahoney1985` convenience default.

`assertAdminPasswordConfigured()` runs at boot (`api/boot.ts`) and logs a loud
`console.error` when `ADMIN_PASSWORD` is missing in production.

### 2. Session-signing secret reused the admin password — MEDIUM
**Before (`api/lib/env.ts`):** `appSecret` fell back to
`APP_SECRET || ADMIN_PASSWORD || random`. Using the login password as the HMAC
key is credential reuse: anyone who guesses/leaks the password can also forge
session cookies.

**Fix:** removed the `ADMIN_PASSWORD` fallback. `appSecret` is now
`APP_SECRET` if set, otherwise a cryptographically-random per-process value
(secure, but ephemeral — a warning is logged in production because sessions
won't survive a restart).

### 3. Admin login brute-force throttle — MEDIUM
**Before:** unlimited password attempts against `/api/admin/login`.

**Fix (`api/adminRoutes.ts` + `api/lib/rateLimit.ts`):** in-memory fixed-window
limiter — **10 attempts / 15 min per client IP**. Over the limit returns `429`
with a `Retry-After` header. Client IP is taken from `X-Forwarded-For` /
`X-Real-IP` (Render sets these) with a socket-address fallback.

### 4. Public inquiry-form spam throttle — MEDIUM
**Before:** the public `inquiries.create` tRPC mutation had no abuse limit —
open to automated spam / DB flooding.

**Fix (`api/router.ts`):** **5 submissions / 10 min per client IP**, returning
tRPC `TOO_MANY_REQUESTS` when exceeded.

### 5. HTTP security headers + Content-Security-Policy — MEDIUM
**Before:** no security response headers.

**Fix (`api/lib/securityHeaders.ts`, wired in `api/boot.ts`):** global Hono
`secureHeaders` middleware sets:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY` (+ CSP `frame-ancestors 'none'`)
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Strict-Transport-Security: max-age=15552000; includeSubDomains` — **production only**
- A **Content-Security-Policy** tailored to the app so it does not break:
  - `default-src 'self'`, `object-src 'none'`, `base-uri 'self'`, `form-action 'self'`
  - `script-src 'self'` (prod bundle is same-origin — no `unsafe-inline`/`unsafe-eval`)
  - `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com` (React + framer-motion inline styles; Google Fonts stylesheet)
  - `font-src 'self' https://fonts.gstatic.com data:`
  - `img-src 'self' data: blob:`, `media-src 'self' blob:`, `connect-src 'self'`

Note: in **dev**, Vite serves the HTML and this middleware only runs for
`/api/*`, so the strict `script-src` does not interfere with Vite HMR. The CSP
takes real effect in **production**, where Hono serves the built SPA. The
`style-src 'unsafe-inline'` is a deliberate, low-risk allowance required by the
React/framer-motion styling model; tightening it would require nonces/hashes on
the build output (see residual notes).

### 6. Per-type upload size limits — LOW
**Before:** a single 50 MB cap for every upload, matching the global body limit.

**Fix (`api/adminRoutes.ts`):** images ≤ 10 MB, PDFs ≤ 15 MB, video ≤ 50 MB.
The existing MIME allowlist and the global `bodyLimit` (50 MB) remain as the
hard ceiling.

### 7. Path-traversal defense-in-depth — LOW
The existing `sanitizeFilename` already strips path separators, so traversal was
not directly exploitable, but writes/deletes now additionally verify the
resolved path stays inside `UPLOADS_DIR`:
- **Upload (`api/adminRoutes.ts`):** rejects if the destination normalizes
  differently or escapes `UPLOADS_DIR`.
- **Media delete (`api/router.ts`):** `path.basename()` on the stored URL plus a
  containment check before `fs.unlinkSync`.

### 8. Expired-session cleanup — LOW
`admin_sessions` rows were never pruned. `createAdminSession` now deletes expired
rows on each login so the table can't grow unbounded. (Token generation was
already sound: 256-bit `randomBytes`, HMAC-signed, `timingSafeEqual` comparison,
7-day expiry enforced in the query.)

### 9. `.env.example` corrected — LOW
Replaced the stale MySQL `DATABASE_URL` (the app uses embedded better-sqlite3)
with the variables that are actually read: `NODE_ENV`, `PORT`, `ADMIN_PASSWORD`,
`APP_SECRET`, `APP_ID`, `SQLITE_PATH`, each with generation guidance
(`openssl rand ...`) and a note that both secrets are required in production.

---

## Dependency audit (`npm audit`, read-only — no lockfile changes)

`15 vulnerabilities: 1 low, 8 moderate, 6 high` at time of review.

**Vast majority are build/dev-time tooling**, not the deployed runtime: `vite`,
`rollup`, `esbuild`, `drizzle-kit`, `@babel/core`, `postcss`, `minimatch`,
`picomatch`, `flatted`, `js-yaml`, `ajv`, `brace-expansion`. These affect the
local dev server / build pipeline; the production artifact is a bundled Hono
server and does not run the Vite dev server.

**Runtime-relevant:** `lodash` (HIGH — code injection via `_.template`,
prototype pollution) appears as a transitive dependency. The app code does not
call `_.template` on untrusted input, so exploitability is low, but it should be
resolved.

**Recommendation:** run `npm audit fix` (and re-test) in a normal dev cycle —
intentionally **not** done here per task constraints (no lockfile changes). Most
fixes are non-breaking; `--force` upgrades (e.g. a major Vite bump) should be
validated separately.

---

## Residual recommendations (not changed in this pass)

1. **HTTPS enforcement on Render.** HSTS is now emitted in production, but ensure
   Render terminates TLS and that HTTP→HTTPS redirect is enabled at the platform
   level. HSTS only protects clients after a first successful HTTPS visit.
2. **Secrets management.** Set `ADMIN_PASSWORD` and `APP_SECRET` as Render
   environment secrets (never commit them). Rotate `APP_SECRET` if you suspect
   exposure — this invalidates all existing admin sessions.
3. **Uploaded SVGs.** `image/svg+xml` is in the allowlist; SVGs can embed
   scripts. The CSP (`script-src 'self'`) blocks inline script execution even on
   direct navigation, and `nosniff` is set. For stronger isolation, consider
   serving `/api/uploads/*` with `Content-Disposition: attachment` (or dropping
   SVG from the allowlist if not needed).
4. **Rate limiting is per-process, in-memory.** Fine for the current single-Node
   deployment. If the app is ever scaled to multiple instances, move the limiter
   to a shared store (e.g. Redis), or enforce limits at the platform/CDN edge.
5. **Tighten CSP further (optional).** `style-src 'unsafe-inline'` is required by
   the current React/framer-motion setup. Moving to nonce/hash-based styles would
   remove it, at the cost of build-pipeline changes.
6. **Admin password strength & MFA.** A single shared password protects the CMS.
   Consider a longer passphrase and, if the threat model warrants it, a second
   factor or IP allowlist for `/api/admin/*`.
7. **Dependency hygiene.** Schedule periodic `npm audit` / Dependabot and keep
   the Vite/Rollup/esbuild toolchain current, since several advisories concern
   the dev server's file-read behavior.
8. **Backups.** The SQLite DB and `uploads/` directory hold all content — ensure
   Render persistent-disk backups (or an external copy) are configured.
