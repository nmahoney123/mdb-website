import { Link, Navigate, useParams } from "react-router";
import { MapPin, Phone, Mail, ArrowUpRight, ArrowLeft } from "lucide-react";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import PageHero from "@/components/site/PageHero";
import CtaSection from "@/components/site/CtaSection";
import LocationsMap from "@/components/site/LocationsMap";
import { COMPANY } from "@/data/content";
import { useOffices, useIndustries } from "@/hooks/useCms";
import { useSeo, breadcrumbLd, officeLd } from "@/lib/useSeo";
import { Reveal, Stagger, StaggerItem } from "@/components/site/motion";

export default function LocationDetail() {
  const { slug } = useParams();
  const offices = useOffices();
  const industries = useIndustries();
  const office = offices.find((o) => o.slug === slug);

  useSeo(
    office
      ? {
          title: `${office.city}, ${office.state} Office — Design-Build General Contractor | ${COMPANY.name}`,
          description: `Mahoney Design & Build in ${office.city}, ${office.state} — ground-up design-build construction for self storage, hospitality, and multifamily across ${office.serves}.`,
          path: `/locations/${office.slug}`,
          jsonLd: [
            officeLd({
              ...office,
              address: office.address ?? undefined,
              phone: office.phone ?? undefined,
              email: office.email ?? undefined,
            }),
            breadcrumbLd([
              { name: "Home", path: "/" },
              { name: "Locations", path: "/locations" },
              { name: `${office.city}, ${office.state}`, path: `/locations/${office.slug}` },
            ]),
          ],
        }
      : { title: `Locations | ${COMPANY.name}`, path: "/locations" },
  );

  if (!office) return <Navigate to="/locations" replace />;

  return (
    <>
      <Header />
      <main>
        <PageHero
          eyebrow={office.hq ? "Headquarters" : `${office.region} Office`}
          title={`${office.city}, ${office.state}`}
          sub={office.blurb}
          shot={`Regional jobsite photo representing MDB's ${office.city}, ${office.state} office — commercial construction in progress`}
        />

        <section className="bg-bone py-20 sm:py-28">
          <div className="container-site grid items-start gap-14 lg:grid-cols-[1fr_360px] lg:gap-20">
            {/* Narrative */}
            <Reveal>
              <p className="eyebrow">The Office</p>
              <div className="rule-red mt-4" />
              <h2 className="display-2 mt-6 text-3xl text-ink sm:text-4xl">
                Serving {office.serves}.
              </h2>
              <div className="mt-8 space-y-5 text-base leading-relaxed text-concrete">
                <p>
                  {office.hq
                    ? `Our ${office.city} headquarters has anchored Mahoney Design & Build since 1985. It's where preconstruction, estimating, and field leadership sit at the same table — the design-build model that gives owners one contract and one point of accountability.`
                    : `Our ${office.city} office extends that same design-build model — single-contract delivery, cost certainty locked in preconstruction, and superintendents who own the schedule — to owners and developers across ${office.serves}.`}
                </p>
                <p>
                  Every project runs on the discipline that has kept more than
                  90% of our work coming from repeat and referral clients:
                  define scope before pricing it, lock the budget before
                  mobilizing, and report progress until the keys change hands.
                </p>
              </div>

              {/* Markets served */}
              <div className="mt-10">
                <p className="font-display text-[11px] font-semibold uppercase tracking-[0.2em] text-concrete">
                  Markets we build here
                </p>
                <Stagger className="mt-4 grid gap-3 sm:grid-cols-2">
                  {industries.map((ind) => (
                    <StaggerItem key={ind.slug}>
                      <Link
                        to={`/industries/${ind.slug}`}
                        className="group flex items-center justify-between border border-fog bg-white px-5 py-4 transition-colors hover:border-mahoney/50"
                      >
                        <span className="font-display text-sm font-bold uppercase tracking-[0.06em] text-ink">
                          {ind.name}
                        </span>
                        <ArrowUpRight className="h-4 w-4 text-concrete transition-colors group-hover:text-mahoney" />
                      </Link>
                    </StaggerItem>
                  ))}
                </Stagger>
              </div>
            </Reveal>

            {/* Contact card */}
            <Reveal delay={0.1}>
              <div className="border border-fog bg-white p-8">
                <p className="font-display text-[11px] font-semibold uppercase tracking-[0.2em] text-mahoney">
                  {office.hq ? "Headquarters" : `${office.region} Office`}
                </p>
                <h3 className="mt-2 font-display text-xl font-extrabold text-ink">
                  {office.city}, {office.state}
                </h3>
                <div className="mt-6 space-y-4 text-sm text-concrete">
                  <p className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-mahoney" strokeWidth={1.5} />
                    <span>{office.address ?? `Serving ${office.serves}`}</span>
                  </p>
                  {office.phone && (
                    <p className="flex items-center gap-3">
                      <Phone className="h-4 w-4 shrink-0 text-mahoney" strokeWidth={1.5} />
                      <a href={`tel:${office.phone.replace(/[^\d+]/g, "")}`} className="hover:text-ink">
                        {office.phone}
                      </a>
                    </p>
                  )}
                  {office.email && (
                    <p className="flex items-center gap-3">
                      <Mail className="h-4 w-4 shrink-0 text-mahoney" strokeWidth={1.5} />
                      <a href={`mailto:${office.email}`} className="hover:text-ink">
                        {office.email}
                      </a>
                    </p>
                  )}
                </div>
                <Link
                  to="/contact"
                  className="mt-8 inline-flex w-full items-center justify-center gap-2 bg-mahoney px-6 py-3 font-display text-xs font-bold uppercase tracking-[0.15em] text-white transition-opacity hover:opacity-90"
                >
                  Start a Project <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </Reveal>
          </div>
        </section>

        {/* National map */}
        <section className="bg-ink py-16 text-white sm:py-20">
          <div className="container-site">
            <Reveal className="mb-10 max-w-2xl">
              <p className="eyebrow">National Reach</p>
              <div className="rule-red mt-4" />
              <h2 className="display-2 mt-6 text-2xl sm:text-3xl">
                One team, three regions.
              </h2>
            </Reveal>
            <LocationsMap />
            <div className="mt-8">
              <Link
                to="/locations"
                className="inline-flex items-center gap-2 font-display text-[11px] font-semibold uppercase tracking-[0.2em] text-white/70 transition-colors hover:text-mahoney"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> All locations
              </Link>
            </div>
          </div>
        </section>

        <CtaSection title={`Building in ${office.serves}?`} sub="Tell us about your project — we'll get the right team on it." />
      </main>
      <Footer />
    </>
  );
}
