import { useState } from "react";
import { ArrowRight, MapPin, Briefcase, CheckCircle2, GraduationCap, X, Loader2, Wrench, TrendingUp, HeartHandshake } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import PageHero from "@/components/site/PageHero";
import CmsImage from "@/components/site/CmsImage";
import { Reveal, Stagger, StaggerItem } from "@/components/site/motion";
import { JOBS } from "@/data/content";
import { useSeo, breadcrumbLd } from "@/lib/useSeo";
import { trpc } from "@/providers/trpc";

const BENEFITS = [
  "Competitive pay + performance bonuses",
  "Health, dental & vision coverage",
  "401(k) with company match",
  "Paid time off & holidays",
  "Field-to-leadership growth path",
  "Real project ownership from day one",
  "Ongoing training & certifications",
  "Family culture — names, not numbers",
];

const CULTURE = [
  {
    icon: Wrench,
    title: "Built From the Field",
    body: "Most of our project leads started on the tools. The people checking your work have done your work — for decades.",
  },
  {
    icon: TrendingUp,
    title: "A Path That Leads Somewhere",
    body: "Carpenter → assistant super → superintendent. Engineer → PM. We promote the people who build, and we can prove it.",
  },
  {
    icon: HeartHandshake,
    title: "Family Culture, Real Standards",
    body: "Names, not numbers — but make no mistake: the bar is high. Exceptional work is the job, every day.",
  },
];

function ApplyModal({ job, onClose }: { job: string; onClose: () => void }) {
  const [sent, setSent] = useState(false);
  const create = trpc.inquiries.create.useMutation();

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    try {
      await create.mutateAsync({
        type: "career",
        name: String(fd.get("name") ?? ""),
        email: String(fd.get("email") ?? ""),
        phone: String(fd.get("phone") ?? "") || undefined,
        projectType: "Job Application",
        message: String(fd.get("message") ?? ""),
        meta: { "Position": job },
      });
      setSent(true);
    } catch {
      alert("Something went wrong. Please email info@mahoneydesignandbuild.com directly.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[110] flex items-center justify-center bg-ink/70 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 24 }}
        className="w-full max-w-lg bg-white p-7 sm:p-9"
        onClick={(e) => e.stopPropagation()}
      >
        {sent ? (
          <div className="py-8 text-center">
            <CheckCircle2 className="mx-auto h-10 w-10 text-mahoney" />
            <h3 className="mt-4 font-display text-xl font-bold uppercase text-ink">Application sent.</h3>
            <p className="mt-2 text-sm text-concrete">
              Thanks for your interest in the {job} role. We review every application and will be in touch if there's a fit.
            </p>
            <button onClick={onClose} className="btn-outline-ink mt-6">Close</button>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-display text-lg font-bold uppercase text-ink">Apply — {job}</h3>
                <p className="mt-1 text-xs text-concrete">Takes two minutes. Attach a resume later by email if you have one.</p>
              </div>
              <button onClick={onClose} aria-label="Close" className="p-1 text-concrete hover:text-ink">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={submit} className="mt-6 grid gap-4">
              <div>
                <label className="field-label" htmlFor="ap-name">Name *</label>
                <input id="ap-name" name="name" required className="field-input" placeholder="Your full name" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="field-label" htmlFor="ap-email">Email *</label>
                  <input id="ap-email" name="email" type="email" required className="field-input" placeholder="you@email.com" />
                </div>
                <div>
                  <label className="field-label" htmlFor="ap-phone">Phone</label>
                  <input id="ap-phone" name="phone" type="tel" className="field-input" placeholder="(___) ___-____" />
                </div>
              </div>
              <div>
                <label className="field-label" htmlFor="ap-msg">Experience *</label>
                <textarea id="ap-msg" name="message" required rows={4} className="field-input resize-none"
                  placeholder="Years in the trade, recent projects, certifications — give us the short version." />
              </div>
              <button type="submit" disabled={create.isPending} className="btn-primary justify-center disabled:opacity-60">
                {create.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Submit Application <ArrowRight className="arrow h-4 w-4" /></>}
              </button>
            </form>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}

export default function Careers() {
  const [applyJob, setApplyJob] = useState<string | null>(null);

  useSeo({
    title: "Careers — Build With Mahoney Design & Build | Central NY Construction Jobs",
    description:
      "Join a design-build general contractor that promotes from the field. Superintendent, project manager, estimator, and intern roles in Central New York. Apply today.",
    path: "/careers",
    jsonLd: breadcrumbLd([
      { name: "Home", path: "/" },
      { name: "Careers", path: "/careers" },
    ]),
  });

  return (
    <>
      <Header />
      <main>
        <PageHero
          eyebrow="Careers"
          title="Exceptional work. Exceptional people."
          sub="Build ground-up commercial projects with a team that promotes from the field. Competitive pay, real ownership, and a path that actually leads somewhere."
          shot="MDB crew huddle at sunrise on an active jobsite — superintendent with drawings, crew in branded gear, crane overhead"
          imageUrl="/media/gallery/self-storage/concrete-pump-pour.webp"
        />

        {/* Culture */}
        <section className="bg-bone py-20 sm:py-28">
          <div className="container-site grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
            <Reveal>
              <p className="eyebrow">Why MDB</p>
              <div className="rule-red mt-4" />
              <h2 className="display-2 mt-6 text-3xl text-ink sm:text-4xl">
                Grow from the field. Lead from the front.
              </h2>
              <p className="mt-6 text-base leading-relaxed text-concrete">
                Our superintendents average 20+ years in the field — and most of
                them built those careers right here. Carpenters become assistant
                supers. Assistant supers run their own sites. Project engineers
                become PMs. The path is real because we've watched it work for
                four decades.
              </p>
              <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                {BENEFITS.map((b) => (
                  <li key={b} className="flex items-start gap-2.5 text-sm text-ink/80">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-mahoney" />
                    {b}
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="aspect-[4/5] overflow-hidden">
                <CmsImage
                  url="/media/gallery/extreme-makeover/extreme-makeover-team-huddle.webp"
                  shot="Young project engineer on site reviewing drawings with a veteran superintendent — mentorship moment, warm light"
                  alt="MDB team on site"
                  label="Culture Photo Slot"
                  className="h-full w-full"
                />
              </div>
            </Reveal>
          </div>

          <Stagger className="mt-16 grid gap-px border border-fog bg-fog md:grid-cols-3">
            {CULTURE.map((c) => (
              <StaggerItem key={c.title}>
                <div className="h-full bg-white p-8">
                  <c.icon className="h-7 w-7 text-mahoney" strokeWidth={1.5} />
                  <h3 className="mt-5 font-display text-base font-bold uppercase tracking-[0.08em] text-ink">
                    {c.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-concrete">{c.body}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </section>

        {/* Open roles */}
        <section id="open-roles" className="border-t border-fog bg-white py-20 sm:py-28">
          <div className="container-site">
            <Reveal className="max-w-2xl">
              <p className="eyebrow">Open Roles</p>
              <div className="rule-red mt-4" />
              <h2 className="display-2 mt-6 text-3xl text-ink sm:text-4xl">
                Current openings.
              </h2>
            </Reveal>
            <Stagger className="mt-12 space-y-4">
              {JOBS.map((j) => (
                <StaggerItem key={j.title}>
                  <div className="group grid gap-6 border border-fog bg-bone p-7 transition-all hover:border-ink/20 sm:p-8 lg:grid-cols-[1.4fr_1fr_auto] lg:items-center">
                    <div>
                      <h3 className="font-display text-lg font-bold uppercase tracking-[0.05em] text-ink">
                        {j.title}
                      </h3>
                      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-concrete">
                        {j.summary}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-concrete">
                      <span className="flex items-center gap-1.5">
                        <Briefcase className="h-3.5 w-3.5 text-mahoney" /> {j.type}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-mahoney" /> {j.location}
                      </span>
                    </div>
                    <button onClick={() => setApplyJob(j.title)} className="btn-primary !px-5 !py-3">
                      Apply <ArrowRight className="arrow h-3.5 w-3.5" />
                    </button>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
            <Reveal delay={0.2}>
              <p className="mt-8 text-sm text-concrete">
                Don't see your role? We keep resumes on file for the right
                people — send yours to{" "}
                <a href="mailto:info@mahoneydesignandbuild.com" className="font-medium text-mahoney hover:underline">
                  info@mahoneydesignandbuild.com
                </a>
                .
              </p>
            </Reveal>
          </div>
        </section>

        {/* Intern / co-op */}
        <section className="bg-ink py-20 text-white sm:py-24">
          <div className="container-site grid items-center gap-12 lg:grid-cols-[auto_1fr_auto]">
            <Reveal>
              <span className="flex h-16 w-16 items-center justify-center border border-mahoney/60 bg-mahoney/10">
                <GraduationCap className="h-8 w-8 text-mahoney" strokeWidth={1.5} />
              </span>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="display-2 text-2xl sm:text-3xl">Intern &amp; co-op program.</h2>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/60">
                Construction management and engineering students get real
                exposure here — a field rotation, estimating support, and a
                mentor who's done it for decades. Paid. Seasonal. Frequently the
                start of a career at MDB.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <button onClick={() => setApplyJob("Construction Intern / Co-op")} className="btn-outline-light">
                Apply for Internship <ArrowRight className="arrow h-4 w-4" />
              </button>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />

      <AnimatePresence>
        {applyJob && <ApplyModal job={applyJob} onClose={() => setApplyJob(null)} />}
      </AnimatePresence>
    </>
  );
}
