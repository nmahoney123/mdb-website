import { ShieldCheck, BadgeCheck, HardHat, Users, MapPin, Phone } from "lucide-react";
import { Link } from "react-router";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import PageHero from "@/components/site/PageHero";
import CtaSection from "@/components/site/CtaSection";
import CmsImage from "@/components/site/CmsImage";
import Gallery from "@/components/site/Gallery";
import LocationsMap from "@/components/site/LocationsMap";
import { useGallery, useOffices, usePageContent } from "@/hooks/useCms";
import { useSeo, breadcrumbLd } from "@/lib/useSeo";
import { COMPANY } from "@/data/content";
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

export default function About() {
  const emGallery = useGallery("extreme-makeover");
  const offices = useOffices();
  const t = usePageContent("about");
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
          eyebrow={t("hero.eyebrow", "About MDB")}
          title={t("hero.title", "Four decades. Family-built.")}
          sub={t(
            "hero.sub",
            "Founded in Oneida, New York in 1985. Grown from a family homebuilder into a regional commercial general contractor — without losing what made clients call in the first place."
          )}
          shot="The Mahoney family and leadership team on an active jobsite — three generations, branded hard hats, steel structure behind"
        />

        {/* Story */}
        <section className="bg-bone py-20 sm:py-28">
          <div className="container-site grid items-start gap-14 lg:grid-cols-2 lg:gap-20">
            <Reveal>
              <p className="eyebrow">{t("story.eyebrow", "Our Story")}</p>
              <div className="rule-red mt-4" />
              <h2 className="display-2 mt-6 text-3xl text-ink sm:text-4xl">
                {t("story.heading", "From Oneida to the Northeast — the name stayed the same.")}
              </h2>
              <div className="mt-8 space-y-5 text-base leading-relaxed text-concrete">
                <p>
                  {t(
                    "story.p1",
                    "Mahoney Design & Build started in 1985 as a family homebuilding company in Central New York. The reputation was simple: precise work, honest numbers, and a phone that always got answered."
                  )}
                </p>
                <p>
                  {t(
                    "story.p2",
                    "Clients grew, and asked us to grow with them — first into renovations and small commercial work, then into ground-up Self Storage, Hospitality, and Multifamily projects across the Northeast. Today MDB operates as a design-build general contractor with the systems of a national firm and the accountability of the family business we still are."
                  )}
                </p>
                <p>
                  {t(
                    "story.p3",
                    "More than 90% of our work comes from repeat and referral clients. That number is the whole strategy."
                  )}
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

        {/* Leadership (no headshots) */}
        <section className="border-t border-fog bg-white py-20 sm:py-28">
          <div className="container-site grid items-start gap-14 lg:grid-cols-2 lg:gap-20">
            <Reveal>
              <p className="eyebrow">Leadership</p>
              <div className="rule-red mt-4" />
              <h2 className="display-2 mt-6 text-3xl text-ink sm:text-4xl">
                Field-grown leadership.
              </h2>
              <div className="mt-8 space-y-5 text-base leading-relaxed text-concrete">
                <p>
                  Most of our project leads started on the tools — and never lost
                  the standard. Owners here reach decision-makers, not
                  gatekeepers: the people who price your project are the people
                  who build it.
                </p>
                <p>
                  Behind every job is an interdisciplinary team of estimators,
                  project managers, superintendents, and safety leaders who have
                  spent careers delivering commercial work across our three core
                  markets.
                </p>
              </div>
              <p className="mt-8 text-sm text-concrete">
                Licensed &amp; insured general contractor.
                {COMPANY.license ? ` ${COMPANY.license}.` : ""} We contract on
                standard AIA documents. OSHA-trained field leadership; written
                safety and quality programs on every project.
              </p>
            </Reveal>
            <Stagger className="grid gap-px border border-fog bg-fog sm:grid-cols-2">
              {[
                { icon: HardHat, label: "Superintendents", body: "Field leaders who own the schedule, the safety culture, and the quality bar." },
                { icon: BadgeCheck, label: "Preconstruction", body: "Estimators who price scope before it's locked, so budgets hold." },
                { icon: Users, label: "Project Management", body: "One point of contact from buyout through closeout." },
                { icon: ShieldCheck, label: "Safety", body: "Written programs and stop-work authority on every site." },
              ].map((r) => (
                <StaggerItem key={r.label}>
                  <div className="h-full bg-white p-7">
                    <r.icon className="h-6 w-6 text-mahoney" strokeWidth={1.5} />
                    <h3 className="mt-4 font-display text-sm font-bold uppercase tracking-[0.1em] text-ink">
                      {r.label}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-concrete">{r.body}</p>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>

        {/* Locations */}
        <section className="border-t border-white/10 bg-ink py-20 text-white sm:py-28">
          <div className="container-site">
            <Reveal className="max-w-2xl">
              <p className="eyebrow">Locations</p>
              <div className="rule-red mt-4" />
              <h2 className="display-2 mt-6 text-3xl sm:text-4xl">
                Three offices. One standard.
              </h2>
              <p className="mt-6 text-base leading-relaxed text-white/65">
                From our Oneida, New York headquarters to offices in Chicago and
                Bend, Oregon, MDB delivers the same design-build discipline
                coast to coast.
              </p>
            </Reveal>
            <div className="mt-12">
              <LocationsMap />
            </div>
            <Stagger className="mt-10 grid gap-6 md:grid-cols-3">
              {offices.map((o) => (
                <StaggerItem key={o.slug}>
                  <Link
                    to={`/locations/${o.slug}`}
                    className="group block h-full border border-white/10 bg-white/[0.03] p-7 transition-colors hover:border-mahoney/60 hover:bg-white/[0.05]"
                  >
                    <p className="font-display text-[11px] font-semibold uppercase tracking-[0.2em] text-mahoney">
                      {o.hq ? "Headquarters" : o.region}
                    </p>
                    <h3 className="mt-2 font-display text-xl font-bold text-white">
                      {o.city}, {o.state}
                    </h3>
                    <p className="mt-3 flex items-start gap-2 text-sm leading-relaxed text-white/60">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-white/40" strokeWidth={1.5} />
                      {o.address ?? `Serving ${o.serves}`}
                    </p>
                    {o.phone && (
                      <p className="mt-2 flex items-center gap-2 text-sm text-white/60">
                        <Phone className="h-4 w-4 shrink-0 text-white/40" strokeWidth={1.5} />
                        {o.phone}
                      </p>
                    )}
                    <span className="mt-5 inline-block font-display text-[11px] font-semibold uppercase tracking-[0.2em] text-white/70 transition-colors group-hover:text-mahoney">
                      View office →
                    </span>
                  </Link>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>

        <CtaSection title="Build with a team that answers." sub="Four decades of owners have. Join them." />
      </main>
      <Footer />
    </>
  );
}
