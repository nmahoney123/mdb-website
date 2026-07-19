import { useState } from "react";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { trpc } from "@/providers/trpc";

const PROJECT_TYPES = [
  "Self Storage",
  "Hotel / Hospitality",
  "Multifamily",
  "Custom Home",
  "Other",
];

export default function LeadForm({ dark = false }: { dark?: boolean }) {
  const [sent, setSent] = useState(false);
  const create = trpc.inquiries.create.useMutation();

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    try {
      await create.mutateAsync({
        type: "project",
        name: String(fd.get("name") ?? ""),
        company: String(fd.get("company") ?? "") || undefined,
        email: String(fd.get("email") ?? ""),
        phone: String(fd.get("phone") ?? "") || undefined,
        projectType: String(fd.get("projectType") ?? "") || undefined,
        message: String(fd.get("message") ?? ""),
      });
      setSent(true);
    } catch {
      alert("Something went wrong sending your inquiry. Please call us at (315) 697-2829.");
    }
  };

  if (sent) {
    return (
      <div className="flex h-full min-h-[320px] flex-col items-center justify-center border border-mahoney/40 bg-mahoney/5 p-10 text-center">
        <CheckCircle2 className="h-10 w-10 text-mahoney" />
        <h3 className="mt-4 font-display text-xl font-bold uppercase tracking-wide text-inherit">
          Message received.
        </h3>
        <p className="mt-2 max-w-xs text-sm opacity-70">
          A member of our team will follow up within one business day. For urgent
          inquiries, call (315) 697-2829.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="grid gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor={`name-${dark ? "d" : "l"}`} className="field-label">Name *</label>
          <input id={`name-${dark ? "d" : "l"}`} name="name" required className="field-input" placeholder="Your full name" />
        </div>
        <div>
          <label htmlFor={`company-${dark ? "d" : "l"}`} className="field-label">Company</label>
          <input id={`company-${dark ? "d" : "l"}`} name="company" className="field-input" placeholder="Company or organization" />
        </div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor={`email-${dark ? "d" : "l"}`} className="field-label">Email *</label>
          <input id={`email-${dark ? "d" : "l"}`} name="email" type="email" required className="field-input" placeholder="you@company.com" />
        </div>
        <div>
          <label htmlFor={`phone-${dark ? "d" : "l"}`} className="field-label">Phone</label>
          <input id={`phone-${dark ? "d" : "l"}`} name="phone" type="tel" className="field-input" placeholder="(___) ___-____" />
        </div>
      </div>
      <div>
        <label htmlFor={`ptype-${dark ? "d" : "l"}`} className="field-label">Project Type *</label>
        <select id={`ptype-${dark ? "d" : "l"}`} name="projectType" required className="field-input" defaultValue="">
          <option value="" disabled>
            Select a project type
          </option>
          {PROJECT_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor={`msg-${dark ? "d" : "l"}`} className="field-label">Message *</label>
        <textarea
          id={`msg-${dark ? "d" : "l"}`}
          name="message"
          required
          rows={4}
          className="field-input resize-none"
          placeholder="Location, approximate size, target timeline — the more we know, the faster we can help."
        />
      </div>
      <button type="submit" disabled={create.isPending} className="btn-primary justify-center disabled:opacity-60 sm:justify-self-start">
        {create.isPending ? (
          <>Sending <Loader2 className="h-4 w-4 animate-spin" /></>
        ) : (
          <>Send Inquiry <ArrowRight className="arrow h-4 w-4" /></>
        )}
      </button>
    </form>
  );
}
