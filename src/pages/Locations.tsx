import { Link } from "react-router";
import { MapPin, Phone, ArrowUpRight } from "lucide-react";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import PageHero from "@/components/site/PageHero";
import CtaSection from "@/components/site/CtaSection";
import LocationsMap from "@/components/site/LocationsMap";
import { useOffices, usePageContent } from "@/hooks/useCms";
import { useSeo, breadcrumbLd, organizationLd } from "@/lib/useSeo";
import { Stagger, StaggerItem } from "@/components/site/motion";

export default function Locations() {
  const offices = useOffices();
  const t = usePageContent("locations");
  useSeo({
    title: "Locations — Oneida NY, Chicago IL & Bend OR | Mahoney Design & Build",
    description:
      "Mahoney Design & Build operates from three offices — headquarters in Oneida, New York, plus Chicago, Illinois and Bend, Oregon — delivering design-build commercial construction nationwide.",
    path: "/locations",
    jsonLd: [
      organizationLd(),
      breadcrumbLd([
        { name: "Home", path: "/" },
        { name: "Locations", path: "/locations" },
      ]),
    ],
  });

  return (
    <>
      <Header />
      <main>
        <PageHero
          eyebrow={t("hero.eyebrow", "Locations")}
          title={t("hero.title", "Three offices. One standard.")}
          sub={t(
            "hero.sub",
            "From our Oneida, New York headquarters to offices in Chicago and Bend, Oregon, MDB delivers the same design-build discipline coast to coast."
          )}
          shot="Map-style graphic of the United States with three highlighted office markers connected by a line"
        />

        <section className="bg-ink py-16 sm:py-20">
          <div className="container-site">
            <LocationsMap />
          </div>
        </section>

        <section className="bg-bone py-20 sm:py-28">
          <div className="container-site">
            <Stagger className="grid gap-6 md:grid-cols-3">
              {offices.map((o) => (
                <StaggerItem key={o.slug}>
                  <Link
                    to={`/locations/${o.slug}`}
                    className="group flex h-full flex-col border border-fog bg-white p-8 transition-colors hover:border-mahoney/50"
                  >
                    <p className="font-display text-[11px] font-semibold uppercase tracking-[0.2em] text-mahoney">
                      {o.hq ? "Headquarters" : o.region}
                    </p>
                    <h2 className="mt-2 font-display text-2xl font-extrabold text-ink">
                      {o.city}, {o.state}
                    </h2>
                    <p className="mt-4 text-sm leading-relaxed text-concrete">{o.blurb}</p>
                    <div className="mt-6 space-y-2 border-t border-fog pt-6 text-sm text-concrete">
                      <p className="flex items-start gap-2">
                        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-mahoney" strokeWidth={1.5} />
                        {o.address ?? `Serving ${o.serves}`}
                      </p>
                      {o.phone && (
                        <p className="flex items-center gap-2">
                          <Phone className="h-4 w-4 shrink-0 text-mahoney" strokeWidth={1.5} />
                          {o.phone}
                        </p>
                      )}
                    </div>
                    <span className="mt-6 inline-flex items-center gap-1 font-display text-[11px] font-semibold uppercase tracking-[0.2em] text-ink transition-colors group-hover:text-mahoney">
                      View office <ArrowUpRight className="h-3.5 w-3.5" />
                    </span>
                  </Link>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>

        <CtaSection title="Wherever you build, we're close." sub="Tell us about your project and we'll route it to the right office." />
      </main>
      <Footer />
    </>
  );
}
