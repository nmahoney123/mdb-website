import { useEffect } from "react";
import { useSettings } from "@/hooks/useCms";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Fire a lead-conversion event. Safe no-op until a Google tag is configured.
 * For Google Ads conversion tracking, create a "generate_lead" conversion in
 * Ads (or import the GA4 event) — no code change needed here.
 */
export function trackLead(detail: Record<string, unknown> = {}): void {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", "generate_lead", { event_category: "contact", ...detail });
  }
}

/**
 * Settings-driven Google tag (GA4 / Google Ads) + Search Console verification.
 * Inert until the owner sets `gaId` (e.g. "G-XXXXXXX" or "AW-XXXXXXX") in
 * admin → Settings. No third-party requests are made until an ID is present.
 */
export default function Analytics() {
  const settings = useSettings();
  const gaId = settings.gaId?.trim();
  const verify = settings.googleVerification?.trim();

  useEffect(() => {
    if (!gaId || document.getElementById("ga-src")) return;
    window.dataLayer = window.dataLayer || [];
    const gtag = (...args: unknown[]) => {
      window.dataLayer!.push(args);
    };
    window.gtag = gtag;
    gtag("js", new Date());
    gtag("config", gaId);
    const s = document.createElement("script");
    s.id = "ga-src";
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`;
    document.head.appendChild(s);
  }, [gaId]);

  useEffect(() => {
    if (!verify) return;
    let m = document.querySelector<HTMLMetaElement>('meta[name="google-site-verification"]');
    if (!m) {
      m = document.createElement("meta");
      m.name = "google-site-verification";
      document.head.appendChild(m);
    }
    m.content = verify;
  }, [verify]);

  return null;
}
