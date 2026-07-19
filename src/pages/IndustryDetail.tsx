import { Link, Navigate, useParams } from "react-router";
import { ArrowLeft, ArrowRight, Check, Thermometer, Building, Layers, FileCheck2, MapPinned, HandCoins, PhoneCall } from "lucide-react";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import PageHero from "@/components/site/PageHero";
import CtaSection from "@/components/site/CtaSection";
import CmsImage from "@/components/site/CmsImage";
import Gallery from "@/components/site/Gallery";
import { Reveal, Stagger, StaggerItem } from "@/components/site/motion";
import { INDUSTRIES } from "@/data/content";
import { useProjects, useGallery } from "@/hooks/useCms";
import { useSeo, breadcrumbLd } from "@/lib/useSeo";

/** Static hero images per industry (real photos where we have them) */
const INDUSTRY_HEROES: Record<string, string | null> = {
  "self-storage": "/media/gallery/self-storage/climate-controlled-complete.webp",
  "hotels-hospitality": "/media/projects/microtel-inn-suites.webp",
  multifamily: null,
  "custom-homes": "/media/gallery/custom-homes/custom-home-estate-exterior.webp",
};

const GALLERY_BY_INDUSTRY: Record<string, string> = {
  "self-storage": "self-storage",
  "custom-homes": "custom-homes",
};

/* ---------- Self-storage deep-dive content ---------- */

function StorageDeepDive() {
  return (
    <>
      {/* Construction expertise */}
      <section className="border-t border-fog bg-white py-20 sm:py-24">
        <div className="container-site">
          <Reveal className="max-w-3xl">
            <p className="eyebrow">Storage Construction Expertise</p>
            <div className="rule-red mt-4" />
            <h2 className="display-2 mt-6 text-2xl text-ink sm:text-4xl">
              Built sturdy, secure, and fast to lease.
            </h2>
            <p className="mt-6 text-base leading-relaxed text-concrete">
              Every storage facility has different requirements — unit mix,
              climate zones, drive aisles, gate systems, retail frontage. Our
              team works with you from initial design through completion, using
              current techniques and materials to build structures that are
              sturdy and secure, photograph well for your marketing, and
              operate cheap for decades. Expanding an existing facility or
              breaking ground on a new one, we design around one goal:
              maximizing rentable square feet per dollar.
            </p>
          </Reveal>

          <Stagger className="mt-14 grid gap-px border border-fog bg-fog md:grid-cols-3">
            {[
              {
                icon: Building,
                title: "Ground-Up Facilities",
                body: "Single-story drive-up campuses and multi-story buildings — site selection support, feasibility, and full design-build delivery. We help you evaluate parcels before you close on them.",
              },
              {
                icon: Thermometer,
                title: "Climate-Controlled Construction",
                body: "Valuable antiques, documents, electronics — your tenants pay a premium for protection. We engineer HVAC zoning, insulation packages, and vapor barriers to hit your temperature and humidity targets efficiently.",
              },
              {
                icon: Layers,
                title: "Expansions & Conversions",
                body: "Adding buildings to an operating facility, or converting retail and warehouse boxes into storage. Phased so your existing tenants never feel the construction.",
              },
            ].map((b) => (
              <StaggerItem key={b.title}>
                <div className="h-full bg-white p-8 sm:p-10">
                  <b.icon className="h-7 w-7 text-mahoney" strokeWidth={1.5} />
                  <h3 className="mt-5 font-display text-base font-bold uppercase tracking-[0.08em] text-ink">
                    {b.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-concrete">{b.body}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-fog bg-white py-20 sm:py-24">
        <div className="container-site max-w-4xl">
          <Reveal className="text-center">
            <p className="eyebrow">Common Questions</p>
            <div className="rule-red mx-auto mt-4" />
            <h2 className="display-2 mt-6 text-2xl text-ink sm:text-4xl">
              Storage construction, answered.
            </h2>
          </Reveal>
          <div className="mt-12 divide-y divide-fog border-y border-fog">
            {[
              {
                q: "How long does a ground-up storage facility take?",
                a: "A single-story drive-up campus typically runs 7–10 months from mobilization; a multi-story climate-controlled building 12–16 months. Sitework complexity and utility lead times are the biggest variables — we quantify both in preconstruction before you commit.",
              },
              {
                q: "What does self-storage construction cost per square foot?",
                a: "It depends on structure type, climate systems, and site conditions — drive-up buildings and multi-story climate-controlled facilities price very differently. Bring us your site and pro forma and we'll build a real budget instead of a guess-per-square-foot.",
              },
              {
                q: "Can you help with site selection and zoning?",
                a: "Yes — we assist with site selection, feasibility studies, and guidance on zoning regulations and permits before you close on a parcel, so the construction process stays smooth and hassle-free.",
              },
              {
                q: "Do you build expansions to operating facilities?",
                a: "Absolutely. We phase expansion work so your existing tenants keep full access — separate entrances, dust and noise control, and clear communication with your office staff throughout.",
              },
              {
                q: "Who is my point of contact during construction?",
                a: "A dedicated project manager from design through completion, plus a superintendent on site every day. One call reaches the person who can actually answer.",
              },
            ].map((f) => (
              <details key={f.q} className="group py-6">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-display text-base font-bold text-ink transition-colors hover:text-mahoney sm:text-lg">
                  {f.q}
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center border border-fog font-body text-lg text-mahoney transition-all group-open:rotate-45 group-open:border-mahoney">
                    +
                  </span>
                </summary>
                <p className="mt-4 max-w-3xl text-[15px] leading-relaxed text-concrete">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Ancillary services */}
      <section className="bg-bone py-20 sm:py-24">
        <div className="container-site grid items-start gap-14 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <p className="eyebrow">Beyond Construction</p>
            <div className="rule-red mt-4" />
            <h2 className="display-2 mt-6 text-2xl text-ink sm:text-4xl">
              The best solutions for our customers.
            </h2>
            <p className="mt-6 text-base leading-relaxed text-concrete">
              Building the facility is only part of the job. We support storage
              owners through everything around the build — because the right
              site, the right permits, and the right budget matter as much as
              the steel.
            </p>
            <p className="mt-4 text-base leading-relaxed text-concrete">
              And because storage construction is a significant investment, we
              leverage our supplier and subcontractor network to bring you
              competitive pricing without compromising quality. Value for
              money is a design input, not an afterthought.
            </p>
          </Reveal>
          <Stagger className="space-y-4">
            {[
              {
                icon: MapPinned,
                title: "Site Selection & Feasibility",
                body: "We assess parcels for visibility, access, utilities, stormwater, and achievable unit count — before you commit capital.",
              },
              {
                icon: FileCheck2,
                title: "Zoning & Permitting Guidance",
                body: "Storage zoning is local and political. We guide special-use permits, variances, and site-plan review for a smooth, hassle-free process.",
              },
              {
                icon: PhoneCall,
                title: "A Dedicated Project Manager",
                body: "One point of contact from design through completion. You always know what's happening, what's next, and what it costs.",
              },
              {
                icon: HandCoins,
                title: "Cost-Effective Delivery",
                body: "Our network of storage-specialist suppliers and trades keeps pricing competitive — and our preconstruction process keeps it locked.",
              },
            ].map((s) => (
              <StaggerItem key={s.title}>
                <div className="flex gap-5 border border-fog bg-white p-6">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center bg-mahoney/10">
                    <s.icon className="h-6 w-6 text-mahoney" strokeWidth={1.5} />
                  </span>
                  <div>
                    <h3 className="font-display text-sm font-bold uppercase tracking-[0.1em] text-ink">
                      {s.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-concrete">{s.body}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>
    </>
  );
}

/* ---------- Page ---------- */

export default function IndustryDetail() {
  const { slug } = useParams();
  const industry = INDUSTRIES.find((i) => i.slug === slug);
  const projects = useProjects();
  const galleryKey = slug ? GALLERY_BY_INDUSTRY[slug] : undefined;
  const gallery = useGallery(galleryKey ?? "__none__");

  useSeo(
    industry
      ? {
          title: `${industry.name} Construction — Design-Build GC | Mahoney Design & Build`,
          description: industry.blurb,
          path: `/industries/${industry.slug}`,
          jsonLd: breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Industries", path: "/industries" },
            { name: industry.name, path: `/industries/${industry.slug}` },
          ]),
        }
      : { title: "Industries | Mahoney Design & Build", path: "/industries" },
  );

  if (!industry) return <Navigate to="/industries" replace />;

  const relevant = projects.filter((p) => p.industrySlug === industry.slug);
  const heroImage = INDUSTRY_HEROES[industry.slug] ?? null;

  return (
    <>
      <Header />
      <main>
        <PageHero
          eyebrow={`Industry — ${industry.name}`}
          title={industry.name}
          sub={industry.blurb}
          shot={industry.heroShot}
          imageUrl={heroImage}
        />

        {/* Overview + capabilities */}
        <section className="bg-bone py-20 sm:py-28">
          <div className="container-site grid gap-14 lg:grid-cols-[1.2fr_1fr] lg:gap-20">
            <Reveal>
              <p className="eyebrow">Overview</p>
              <div className="rule-red mt-4" />
              <div className="mt-8 space-y-5 text-base leading-relaxed text-concrete">
                {industry.overview.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
              <p className="mt-10 font-display text-sm font-bold text-ink">
                <span className="text-4xl font-extrabold text-mahoney">{industry.stat.value}</span>{" "}
                <span className="ml-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-concrete">
                  {industry.stat.label}
                </span>
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="border border-fog bg-white p-8 sm:p-10">
                <h2 className="font-display text-sm font-bold uppercase tracking-[0.22em] text-ink">
                  Capabilities
                </h2>
                <Stagger className="mt-6 space-y-4">
                  {industry.capabilities.map((c) => (
                    <StaggerItem key={c} className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center bg-mahoney">
                        <Check className="h-3 w-3 text-white" strokeWidth={3} />
                      </span>
                      <span className="text-sm leading-relaxed text-ink/80">{c}</span>
                    </StaggerItem>
                  ))}
                </Stagger>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Deep-dive content for self storage */}
        {industry.slug === "self-storage" && <StorageDeepDive />}

        {/* Photo gallery */}
        {galleryKey && gallery.length > 0 && (
          <section className="border-t border-white/10 bg-ink py-20 text-white sm:py-24">
            <div className="container-site">
              <Reveal className="flex flex-wrap items-end justify-between gap-6">
                <div>
                  <p className="eyebrow">Project Gallery</p>
                    <div className="rule-red mt-4" />
                  <h2 className="display-2 mt-6 text-2xl sm:text-4xl">
                    {industry.name} — in the field &amp; finished.
                  </h2>
                </div>
                <p className="max-w-sm text-sm leading-relaxed text-white/50">
                  Real MDB projects — construction through completion. Click any
                  photo to enlarge.
                </p>
              </Reveal>
              <div className="mt-12">
                <Gallery images={gallery} />
              </div>
            </div>
          </section>
        )}

        {/* Relevant projects */}
        {relevant.length > 0 && (
          <section className="border-t border-fog bg-white py-20 sm:py-24">
            <div className="container-site">
              <Reveal className="flex flex-wrap items-end justify-between gap-6">
                <div>
                  <p className="eyebrow">Relevant Work</p>
                  <div className="rule-red mt-4" />
                  <h2 className="display-2 mt-6 text-2xl text-ink sm:text-4xl">
                    {industry.name} projects
                  </h2>
                </div>
                <Link to="/portfolio" className="btn-outline-ink">
                  Full Portfolio <ArrowRight className="arrow h-4 w-4" />
                </Link>
              </Reveal>
              <Stagger className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {relevant.map((p) => (
                  <StaggerItem key={p.slug}>
                    <Link to={`/portfolio/${p.slug}`} className="group relative block aspect-[4/3] overflow-hidden bg-charcoal">
                      <div className="h-full w-full transition-transform duration-700 group-hover:scale-[1.06]">
                        <CmsImage url={p.cardImage} shot={p.cardShot} alt={p.name} className="h-full w-full" />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/25 to-transparent" />
                      <div className="absolute inset-x-0 bottom-0 p-6">
                        <p className="font-display text-[10px] font-bold uppercase tracking-[0.24em] text-mahoney">
                          {p.location} · {p.year}
                        </p>
                        <h3 className="mt-1.5 font-display text-lg font-bold uppercase text-white">
                          {p.name}
                        </h3>
                      </div>
                    </Link>
                  </StaggerItem>
                ))}
              </Stagger>
            </div>
          </section>
        )}

        <div className="container-site py-10">
          <Link
            to="/industries"
            className="group inline-flex items-center gap-2 font-display text-[11px] font-bold uppercase tracking-[0.2em] text-concrete transition-colors hover:text-ink"
          >
            <ArrowLeft className="h-3.5 w-3.5 text-mahoney transition-transform group-hover:-translate-x-1.5" />
            All Industries
          </Link>
        </div>

        <CtaSection
          title={`Planning a ${industry.short.toLowerCase()} project?`}
          sub="Bring us in at feasibility. The earlier we're at the table, the more money and schedule we can protect."
        />
      </main>
      <Footer />
    </>
  );
}
