import { useState } from "react";
import { ArrowRight, CheckCircle2, ShieldCheck, ClipboardList, FileCheck } from "lucide-react";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import PageHero from "@/components/site/PageHero";
import { Reveal, Stagger, StaggerItem } from "@/components/site/motion";
import { COMPANY } from "@/data/content";
import { usePageContent } from "@/hooks/useCms";
import { useSeo, breadcrumbLd } from "@/lib/useSeo";
import { trpc } from "@/providers/trpc";

const REQUIREMENTS = [
  {
    icon: ShieldCheck,
    title: "Safety Record",
    body: "EMR documentation and OSHA history. Our sites run a stop-work culture — every trade partner upholds it.",
  },
  {
    icon: FileCheck,
    title: "Insurance & Licensing",
    body: "Current COI meeting project requirements, plus applicable state licensing for your trade.",
  },
  {
    icon: ClipboardList,
    title: "References & Capacity",
    body: "Three recent project references and the crew capacity to staff the schedule you sign up for.",
  },
];

const TRADES = [
  "Sitework & Excavation", "Concrete", "Structural Steel", "Masonry",
  "Framing & Carpentry", "Roofing", "Plumbing", "HVAC",
  "Electrical", "Fire Protection", "Insulation & Drywall", "Finishes & Flooring",
];

export default function Subcontractors() {
  const [sent, setSent] = useState(false);
  const create = trpc.inquiries.create.useMutation();
  const t = usePageContent("subcontractors");

  useSeo({
    title: "Subcontractor Prequalification — Join Our Bid List | Mahoney Design & Build",
    description:
      "Trade partners: get on the Mahoney Design & Build bid list. Submit your safety record, insurance, licensing, and references to prequalify for commercial projects.",
    path: "/subcontractors",
    jsonLd: breadcrumbLd([
      { name: "Home", path: "/" },
      { name: "Subcontractors", path: "/subcontractors" },
    ]),
  });

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const meta: Record<string, string> = {};
    if (fd.get("trade")) meta["Primary Trade"] = String(fd.get("trade"));
    if (fd.get("emr")) meta["EMR Rating"] = String(fd.get("emr"));
    try {
      await create.mutateAsync({
        type: "subcontractor",
        name: String(fd.get("contact") ?? ""),
        company: String(fd.get("company") ?? "") || undefined,
        email: String(fd.get("email") ?? ""),
        phone: String(fd.get("phone") ?? "") || undefined,
        projectType: "Subcontractor Prequalification",
        message: String(fd.get("notes") ?? ""),
        meta,
      });
      setSent(true);
    } catch {
      alert("Something went wrong. Please email info@mahoneydesignandbuild.com directly.");
    }
  };

  return (
    <>
      <Header />
      <main>
        <PageHero
          eyebrow={t("hero.eyebrow", "Subcontractors")}
          title={t("hero.title", "Build with MDB.")}
          sub={t(
            "hero.sub",
            "We keep a short list of trade partners we trust — and we trust them completely. If you run a safe operation and stand behind your work, we want to hear from you."
          )}
          shot="Subcontractor crew coordinating with an MDB superintendent on an active site — lift in background, morning light"
        />

        {/* Requirements */}
        <section className="bg-bone py-20 sm:py-24">
          <div className="container-site">
            <Reveal className="max-w-2xl">
              <p className="eyebrow">Prequalification</p>
              <div className="rule-red mt-4" />
              <h2 className="display-2 mt-6 text-3xl text-ink sm:text-4xl">
                What it takes to get on our bid list.
              </h2>
            </Reveal>
            <Stagger className="mt-12 grid gap-px border border-fog bg-fog md:grid-cols-3">
              {REQUIREMENTS.map((r) => (
                <StaggerItem key={r.title}>
                  <div className="h-full bg-white p-8">
                    <r.icon className="h-7 w-7 text-mahoney" strokeWidth={1.5} />
                    <h3 className="mt-5 font-display text-base font-bold uppercase tracking-[0.08em] text-ink">
                      {r.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-concrete">{r.body}</p>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
            <Reveal delay={0.15}>
              <div className="mt-12 border border-fog bg-white p-8">
                <h3 className="font-display text-sm font-bold uppercase tracking-[0.22em] text-ink">
                  Trades We Work With
                </h3>
                <div className="mt-5 flex flex-wrap gap-2">
                  {TRADES.map((t) => (
                    <span
                      key={t}
                      className="border border-fog bg-bone px-4 py-2 font-display text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/75"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Prequal form */}
        <section className="border-t border-fog bg-white py-20 sm:py-28">
          <div className="container-site grid gap-16 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
            <Reveal>
              <p className="eyebrow">Get Prequalified</p>
              <div className="rule-red mt-4" />
              <h2 className="display-2 mt-6 text-3xl text-ink sm:text-4xl">
                Submit your firm.
              </h2>
              <p className="mt-6 text-base leading-relaxed text-concrete">
                Our preconstruction team reviews every submission. Qualified
                firms receive bid invitations matched to their trades and
                geography. Questions first? Email{" "}
                <a href={`mailto:${COMPANY.email}?subject=Subcontractor%20Prequalification`} className="font-medium text-mahoney hover:underline">
                  {COMPANY.email}
                </a>{" "}
                or call {COMPANY.phone}.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              {sent ? (
                <div className="flex min-h-[320px] flex-col items-center justify-center border border-mahoney/40 bg-mahoney/5 p-10 text-center">
                  <CheckCircle2 className="h-10 w-10 text-mahoney" />
                  <h3 className="mt-4 font-display text-xl font-bold uppercase tracking-wide text-ink">
                    Submission received.
                  </h3>
                  <p className="mt-2 max-w-sm text-sm text-concrete">
                    Our preconstruction team will review your firm's information
                    and follow up on next steps.
                  </p>
                </div>
              ) : (
                <form onSubmit={submit} className="grid gap-5 border border-fog bg-bone p-7 sm:p-9">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="sq-company" className="field-label">Company Name *</label>
                      <input id="sq-company" name="company" required className="field-input" placeholder="Your firm" />
                    </div>
                    <div>
                      <label htmlFor="sq-contact" className="field-label">Contact Name *</label>
                      <input id="sq-contact" name="contact" required className="field-input" placeholder="Primary contact" />
                    </div>
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="sq-email" className="field-label">Email *</label>
                      <input id="sq-email" name="email" type="email" required className="field-input" placeholder="you@firm.com" />
                    </div>
                    <div>
                      <label htmlFor="sq-phone" className="field-label">Phone *</label>
                      <input id="sq-phone" name="phone" type="tel" required className="field-input" placeholder="(___) ___-____" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="sq-trade" className="field-label">Primary Trade *</label>
                    <select id="sq-trade" name="trade" required className="field-input" defaultValue="">
                      <option value="" disabled>Select your primary trade</option>
                      {TRADES.map((t) => (
                        <option key={t}>{t}</option>
                      ))}
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="sq-emr" className="field-label">EMR Rating</label>
                    <input id="sq-emr" name="emr" className="field-input" placeholder="e.g., 0.85" />
                  </div>
                  <div>
                    <label htmlFor="sq-notes" className="field-label">About Your Firm *</label>
                    <textarea
                      id="sq-notes"
                      name="notes"
                      required
                      rows={4}
                      className="field-input resize-none"
                      placeholder="Service area, crew size, recent projects, references — help us understand where you fit."
                    />
                  </div>
                  <button type="submit" disabled={create.isPending} className="btn-primary justify-center disabled:opacity-60 sm:justify-self-start">
                    Submit for Review <ArrowRight className="arrow h-4 w-4" />
                  </button>
                </form>
              )}
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
