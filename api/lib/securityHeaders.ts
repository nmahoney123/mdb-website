import { secureHeaders } from "hono/secure-headers";
import { env } from "./env";

/**
 * Global security-response-header middleware (Hono built-in `secureHeaders`).
 *
 * CSP notes — the app is a Vite/React SPA that:
 *   - loads its Google Fonts stylesheet from fonts.googleapis.com and the font
 *     files from fonts.gstatic.com,
 *   - injects inline styles (React inline styles + framer-motion) → style-src
 *     needs 'unsafe-inline',
 *   - uses a data: SVG favicon and may render data:/blob: images and blob:
 *     video previews.
 *
 * In production the bundled JS is served from the same origin, so script-src
 * stays 'self' (no 'unsafe-inline'/'unsafe-eval'). In dev, Vite serves the HTML
 * (this middleware only runs for /api/* responses), so the strict script-src
 * does not interfere with HMR.
 */
export const securityHeaders = secureHeaders({
  contentSecurityPolicy: {
    defaultSrc: ["'self'"],
    baseUri: ["'self'"],
    fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
    formAction: ["'self'"],
    frameAncestors: ["'none'"],
    imgSrc: ["'self'", "data:", "blob:"],
    mediaSrc: ["'self'", "blob:"],
    objectSrc: ["'none'"],
    scriptSrc: ["'self'"],
    styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
    connectSrc: ["'self'"],
  },
  // Redundant with frame-ancestors 'none' but kept for legacy browsers.
  xFrameOptions: "DENY",
  xContentTypeOptions: "nosniff",
  referrerPolicy: "strict-origin-when-cross-origin",
  // HSTS only in production (over HTTPS). Sending it on plain-HTTP dev would
  // pin localhost to HTTPS in the browser and break local work.
  strictTransportSecurity: env.isProduction
    ? "max-age=15552000; includeSubDomains"
    : false,
  // Disable header defaults we don't want to advertise incorrectly.
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: false,
});
