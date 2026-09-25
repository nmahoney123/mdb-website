/**
 * Inquiry email notifications via Resend (https://resend.com).
 *
 * Sends a formatted email to the business whenever a contact form is submitted,
 * so leads don't sit unseen in the admin inbox. Uses a plain fetch to the Resend
 * REST API — no dependency, no bundle bloat.
 *
 * Fully optional and fail-safe: if RESEND_API_KEY is unset it silently no-ops,
 * and any send error is caught — the inquiry is already saved to the DB either
 * way, so notification problems never break form submission.
 *
 * Env:
 *   RESEND_API_KEY      required to enable email (from resend.com → API Keys)
 *   INQUIRY_NOTIFY_TO   recipient (default info@mahoneydesignandbuild.com)
 *   INQUIRY_NOTIFY_FROM sender  (default "Mahoney Design & Build <onboarding@resend.dev>";
 *                       switch to an address on a Resend-verified domain for production)
 */

export type InquiryPayload = {
  type: string;
  name: string;
  company?: string | null;
  email: string;
  phone?: string | null;
  projectType?: string | null;
  message: string;
};

const RESEND_ENDPOINT = "https://api.resend.com/emails";
const SEND_TIMEOUT_MS = 8000;

const TYPE_LABELS: Record<string, string> = {
  project: "New Project Inquiry",
  subcontractor: "New Subcontractor Prequalification",
  career: "New Careers Inquiry",
  general: "New Inquiry",
  newsletter: "New Newsletter Signup",
};

function esc(s: string): string {
  return s.replace(
    /[&<>"]/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c] as string,
  );
}

/**
 * Send an inquiry notification email. Resolves quietly whether or not email is
 * configured; never throws.
 */
export async function notifyInquiry(input: InquiryPayload): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return; // email not configured — inquiry still lives in the admin inbox

  const to = process.env.INQUIRY_NOTIFY_TO || "info@mahoneydesignandbuild.com";
  const from =
    process.env.INQUIRY_NOTIFY_FROM ||
    // Domain verified in Resend, so send from the domain (delivers to any address).
    "Mahoney Design & Build <noreply@mahoneydesignandbuild.com>";
  const label = TYPE_LABELS[input.type] || "New Inquiry";

  const fields: [string, string | null | undefined][] = [
    ["Name", input.name],
    ["Company", input.company],
    ["Email", input.email],
    ["Phone", input.phone],
    ["Project Type", input.projectType],
  ];
  const rowsHtml = fields
    .filter(([, v]) => v)
    .map(
      ([k, v]) =>
        `<tr><td style="padding:5px 14px 5px 0;color:#6b6b70;font:600 12px/1.4 Arial,sans-serif;text-transform:uppercase;letter-spacing:.06em;vertical-align:top;white-space:nowrap">${k}</td><td style="padding:5px 0;font:14px/1.5 Arial,sans-serif;color:#141414">${esc(String(v))}</td></tr>`,
    )
    .join("");

  const html = `<div style="max-width:560px;margin:0 auto">
  <div style="background:#000;padding:18px 24px">
    <span style="color:#fff;font:800 15px Arial,sans-serif;letter-spacing:.04em">MAHONEY</span>
    <span style="color:#F4B400;font:700 15px Arial,sans-serif"> · ${esc(label)}</span>
  </div>
  <div style="border:1px solid #e8e6e3;border-top:none;padding:22px 24px">
    <table style="border-collapse:collapse;width:100%">${rowsHtml}</table>
    <div style="margin-top:16px;padding-top:16px;border-top:1px solid #e8e6e3">
      <div style="color:#6b6b70;font:600 12px/1.4 Arial,sans-serif;text-transform:uppercase;letter-spacing:.06em">Message</div>
      <div style="margin-top:6px;font:14px/1.6 Arial,sans-serif;color:#141414;white-space:pre-wrap">${esc(input.message)}</div>
    </div>
  </div>
  <div style="padding:12px 24px;color:#9a9aa0;font:12px Arial,sans-serif">Submitted via mahoneydesignandbuild.com — reply to this email to reach ${esc(input.name)} directly.</div>
</div>`;

  const subject = `${label}: ${input.name}${input.company ? " — " + input.company : ""}`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), SEND_TIMEOUT_MS);
  try {
    const res = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: input.email,
        subject,
        html,
      }),
      signal: controller.signal,
    });
    if (!res.ok) {
      console.error("[notify] Resend error", res.status, await res.text().catch(() => ""));
    }
  } catch (e) {
    console.error("[notify] failed to send inquiry email:", e);
  } finally {
    clearTimeout(timer);
  }
}
