import { ShieldCheck, BadgeCheck, HardHat, Users } from "lucide-react";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import PageHero from "@/components/site/PageHero";
import CtaSection from "@/components/site/CtaSection";
import CmsImage from "@/components/site/CmsImage";
import Gallery from "@/components/site/Gallery";
import { useGallery } from "@/hooks/useCms";
import { useSeo, breadcrumbLd } from "@/lib/useSeo";
import { Reveal, Stagger, StaggerItem, CountUp, Parallax } from "@/components/site/motion";

const VALUES = [
  {
    icon: HardHat,
    title: "Do It Right",
    body: "The schedule matters. So does the detail nobody sees until year ten. We build for both.",
  },
  {
    icon: Users,
    title: "Answer Your Phone",
    body: "Owners reach decision-makers here. Problems get solved in hours, not email chains.",
  },
  {
    icon: BadgeCheck,
    title: "Own the Outcome",
    body: "Design-build means one point of accountability. When it's ours, we own it — all of it.",
  },
  {
    icon: ShieldCheck,
    title: "Send Everyone Home",
    body: "Safety is a culture, not a binder. Every worker on our sites can stop work, no questions asked.",
  },
];

const TEAM = [
  { name: "[Name] Mahoney", role: "President", shot: "Portrait — company president in office with project drawings, natural window light" },
  { name: "[Name] Mahoney", role: "Vice President / Operations", shot: "Portrait — VP of operations on a jobsite in a branded hard hat" },
  { name: "[Name]", role: "Director of Preconstruction", shot: "Portrait — precon director at estimating station with plan sets" },
  { name: "[Name]", role: "Senior Superintendent", shot: "Portrait — senior superintendent in the field, steel behind" },
  { name: "[Name]", role: "Senior Project Manager", shot: "Portrait — PM at trailer desk with schedule on screen" },
  { name: "[Name]", role: "Safety Director", shot: "Portrait — safety director leading a site stand-down meeting" },
];

export default function About() {
  const emGallery = useGallery("extreme-makeover");
  useSeo({
    title: "About — Family-Built Since 1985 | Mahoney Design & Build",
    description:
      "Founded in Oneida, New York in 1985, Mahoney Design & Build grew from a family homebuilder into a regional design-build commercial general contractor. Meet the team.",
    path: "/about",
    jsonLd: breadcrumbLd([
      { name: "Home", path: "/" },
      { name: "About", path: "/about" },
    ]),
  });
  return (
    <>
      <Header />
      <main>
        <PageHero
          eyebrow="About MDB"
          title="Four decades. Family-built."
          sub="Founded in Oneida, New York in 1985. Grown from a family homebuilder into a regional commercial general contractor — without losing what made clients call in the first place."
          shot="The Mahoney family and leadership team on an active jobsite — three generations, branded hard hats, steel structure behind"
        />

        {/* Story */}
        <section className="bg-bone py-20 sm:py-28">
          <div className="container-site grid items-start gap-14 lg:grid-cols-2 lg:gap-20">
            <Reveal>
              <p className="eyebrow">Our Story</p>
              <div className="rule-red mt-4" />
              <h2 className="display-2 mt-6 text-3xl text-ink sm:text-4xl">
                From Oneida to the Northeast — the name stayed the same.
              </h2>
              <div className="mt-8 space-y-5 text-base leading-relaxed text-concrete">
                <p>
                  Mahoney Design &amp; Build started in 1985 as a family
                  homebuilding company in Central New York. The reputation was
                  simple: precise work, honest numbers, and a phone that always
                  got answered.
                </p>
                <p>
                  Clients grew, and asked us to grow with them — first into
                  renovations and small commercial work, then into ground-up
                  Self Storage, Hospitality, and Multifamily projects across the
                  Northeast. Today MDB operates as a design-build general
                  contractor with the systems of a national firm and the
                  accountability of the family business we still are.
                </p>
                <p>
                  More than 90% of our work comes from repeat and referral
                  clients. That number is the whole strategy.
                </p>
              </div>
              <div className="mt-10 grid grid-cols-3 gap-6 border-t border-fog pt-8">
                {[
                  { v: 1985, l: "Founded", raw: true },
                  { v: 40, l: "Years Building" },
                  { v: 90, s: "%", l: "Repeat & Referral" },
                ].map((s) => (
                  <div key={s.l}>
                    <p className="font-display text-3xl font-extrabold text-mahoney sm:text-4xl">
                      {s.raw ? s.v : <CountUp value={s.v} suffix={s.s ?? ""} />}
                    </p>
                    <p className="mt-1 font-display text-[10px] font-semibold uppercase tracking-[0.2em] text-concrete">
                      {s.l}
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>
            <Parallax amount={20}>
              <Reveal delay={0.15}>
                <div className="aspect-[4/5] overflow-hidden">
                  <CmsImage
                    url="/media/gallery/extreme-makeover/extreme-makeover-volunteer-crew.webp"
                    shot="Archival photo treatment — young crew on a 1980s MDB home build, faded film look; pairs with a modern matching shot"
                    alt="MDB crew on a build site"
                    label="Heritage Photo Slot"
                    className="h-full w-full"
                  />
                </div>
              </Reveal>
            </Parallax>
          </div>
        </section>

        {/* Extreme Makeover credential */}
        <section className="relative overflow-hidden bg-ink py-20 text-white sm:py-28">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_15%_50%,rgba(200,16,46,0.15),transparent_50%)]" aria-hidden />
          <div className="container-site relative grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
            <Reveal>
              <div className="aspect-video overflow-hidden border border-white/10">
                <CmsImage
                  url="/media/gallery/extreme-makeover/extreme-makeover-move-that-bus.webp"
                  shot="The Extreme Makeover: Home Edition build — wide shot of the framed house surrounded by 2,000+ volunteers, cranes, and the 'move that bus' crowd"
                  alt="Extreme Makeover: Home Edition reveal day with MDB volunteers"
                  label="Signature Photo Slot"
                  className="h-full w-full"
                />
              </div>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="eyebrow">Signature Credential</p>
              <div className="rule-red mt-4" />
              <h2 className="display-2 mt-6 text-3xl sm:text-4xl">
                A 3,200 sq ft home. Under five days. 2,000+ volunteers.
              </h2>
              <p className="mt-6 text-base leading-relaxed text-white/65">
                For ABC's <em>Extreme Makeover: Home Edition</em>, MDB planned,
                sequenced, and led the complete construction of a custom home in
                under five days — coordinating more than 2,000 volunteers around
                the clock. National television called it a miracle. We call it
                preconstruction.
              </p>
              <p className="mt-4 text-base leading-relaxed text-white/65">
                The same discipline that made those 106 hours work is what we
                bring to every storage facility, hotel, and community we build.
              </p>
              <div className="mt-8 flex gap-10">
                <div>
                  <p className="font-display text-4xl font-extrabold text-mahoney">&lt;5</p>
                  <p className="mt-1 font-display text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50">
                    Days to complete
                  </p>
                </div>
                <div>
                  <p className="font-display text-4xl font-extrabold text-mahoney">2,000+</p>
                  <p className="mt-1 font-display text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50">
                    Volunteers led
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Extreme Makeover gallery */}
        {emGallery.length > 0 && (
          <section className="border-t border-white/10 bg-ink pb-20 text-white sm:pb-24">
            <div className="container-site">
              <Reveal className="max-w-2xl">
                <p className="eyebrow">From the Build</p>
                <div className="rule-red mt-4" />
                <h2 className="display-2 mt-6 text-2xl sm:text-3xl">2,000+ volunteers. One deadline.</h2>
              </Reveal>
              <div className="mt-10">
                <Gallery images={emGallery} />
              </div>
            </div>
          </section>
        )}

        {/* Values */}
        <section className="bg-bone py-20 sm:py-28">
          <div className="container-site">
            <Reveal className="max-w-2xl">
              <p className="eyebrow">Values</p>
              <div className="rule-red mt-4" />
              <h2 className="display-2 mt-6 text-3xl text-ink sm:text-4xl">
                How we've operated since 1985.
              </h2>
            </Reveal>
            <Stagger className="mt-12 grid gap-px border border-fog bg-fog sm:grid-cols-2 lg:grid-cols-4">
              {VALUES.map((v) => (
                <StaggerItem key={v.title}>
                  <div className="h-full bg-white p-8">
                    <v.icon className="h-7 w-7 text-mahoney" strokeWidth={1.5} />
                    <h3 className="mt-5 font-display text-base font-bold uppercase tracking-[0.08em] text-ink">
                      {v.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-concrete">{v.body}</p>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>

        {/* Team */}
        <section className="border-t border-fog bg-white py-20 sm:py-28">
          <div className="container-site">
            <Reveal className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="eyebrow">Leadership</p>
                <div className="rule-red mt-4" />
                <h2 className="display-2 mt-6 text-3xl text-ink sm:text-4xl">
                  The people behind the name.
                </h2>
              </div>
              <p className="max-w-sm text-sm leading-relaxed text-concrete">
                Field-grown leadership. Most of our team leads started on the
                tools — and never lost the standard.
              </p>
            </Reveal>
            <Stagger className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {TEAM.map((t) => (
                <StaggerItem key={t.role}>
                  <div className="group">
                    <div className="aspect-[4/5] overflow-hidden">
                      <CmsImage url={null} shot={t.shot} dark={false} label="Headshot Slot" className="h-full w-full transition-transform duration-700 group-hover:scale-[1.04]" />
                    </div>
                    <h3 className="mt-4 font-display text-base font-bold uppercase tracking-[0.06em] text-ink">
                      {t.name}
                    </h3>
                    <p className="mt-1 font-display text-[11px] font-semibold uppercase tracking-[0.2em] text-mahoney">
                      {t.role}
                    </p>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
            <Reveal delay={0.2}>
              <p className="mt-10 text-sm text-concrete">
                Licensed &amp; insured general contractor. {`NY GC License #000000 — confirm before publish.`} OSHA-trained field leadership; written safety and quality programs on every project.
              </p>
            </Reveal>
          </div>
        </section>

        <CtaSection title="Build with a team that answers." sub="Forty years of owners have. Join them." />
      </main>
      <Footer />
    </>
  );
}
