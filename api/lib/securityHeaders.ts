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
    // The Contact page embeds a Google Maps iframe for the HQ address.
    frameSrc: ["https://www.google.com"],
    // Google-tag domains below are allow-listed so the optional GA4/Google Ads
    // tag (enabled via the `gaId` setting) works; no requests occur until it loads.
    imgSrc: [
      "'self'",
      "data:",
      "blob:",
      "https://www.google-analytics.com",
      "https://www.googletagmanager.com",
      "https://www.google.com",
      "https://googleads.g.doubleclick.net",
    ],
    mediaSrc: ["'self'", "blob:"],
    objectSrc: ["'none'"],
    scriptSrc: [
      "'self'",
      "https://www.googletagmanager.com",
      "https://www.googleadservices.com",
    ],
    styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
    connectSrc: [
      "'self'",
      "https://*.google-analytics.com",
      "https://*.analytics.google.com",
      "https://www.googletagmanager.com",
      "https://www.google.com",
    ],
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
