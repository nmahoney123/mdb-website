import { useMemo, useState } from "react";
import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import PageHero from "@/components/site/PageHero";
import CtaSection from "@/components/site/CtaSection";
import CmsImage from "@/components/site/CmsImage";
import { Reveal } from "@/components/site/motion";
import { useProjects, usePageContent } from "@/hooks/useCms";
import { useSeo, breadcrumbLd } from "@/lib/useSeo";
import { cn } from "@/lib/utils";

const INDUSTRY_FILTERS = ["All Industries", "Self Storage", "Hotels & Hospitality", "Multifamily", "Custom Homes"];

export default function Portfolio() {
  const projects = useProjects();
  const t = usePageContent("portfolio");
  const [industry, setIndustry] = useState(INDUSTRY_FILTERS[0]);
  const [location, setLocation] = useState("All Locations");
  const reduce = useReducedMotion();

  useSeo({
    title: "Portfolio — Self Storage, Hotel & Multifamily Projects | Mahoney Design & Build",
    description:
      "Explore ground-up and renovation projects across self storage, hospitality, multifamily, and select custom homes delivered by Mahoney Design & Build.",
    path: "/portfolio",
    jsonLd: breadcrumbLd([
      { name: "Home", path: "/" },
      { name: "Portfolio", path: "/portfolio" },
    ]),
  });

  const locations = useMemo(
    () => ["All Locations", ...Array.from(new Set(projects.map((p) => p.location)))],
    []
  );

  const list = projects.filter(
    (p) =>
      (industry === INDUSTRY_FILTERS[0] || p.industry === industry) &&
      (location === "All Locations" || p.location === location)
  );

  return (
    <>
      <Header />
      <main>
        <PageHero
          eyebrow={t("hero.eyebrow", "Portfolio")}
          title={t("hero.title", "Built to last. Delivered to spec.")}
          sub={t(
            "hero.sub",
            "A selection of ground-up and renovation work across Self Storage, Hospitality, Multifamily, and select custom homes."
          )}
          shot="Cinematic aerial montage of completed MDB projects — storage facility, hotel, and apartment community exteriors at dusk"
        />

        <section className="bg-bone py-16 sm:py-24">
          <div className="container-site">
            <Reveal className="flex flex-col gap-6 border-b border-fog pb-8 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="field-label">Industry</p>
                <div className="flex flex-wrap gap-2">
                  {INDUSTRY_FILTERS.map((f) => (
                    <button
                      key={f}
                      onClick={() => setIndustry(f)}
                      aria-pressed={industry === f}
                      className={cn(
                        "border px-4 py-2 font-display text-[11px] font-semibold uppercase tracking-[0.16em] transition-all",
                        industry === f
                          ? "border-mahoney bg-mahoney text-white"
                          : "border-ink/15 text-concrete hover:border-ink/40 hover:text-ink"
                      )}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label htmlFor="loc-filter" className="field-label">Location</label>
                <select
                  id="loc-filter"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="field-input !w-auto min-w-[220px]"
                >
                  {locations.map((l) => (
                    <option key={l}>{l}</option>
                  ))}
                </select>
              </div>
            </Reveal>

            <motion.div layout className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {list.map((p) => (
                  <motion.article
                    layout
                    key={p.slug}
                    initial={reduce ? false : { opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduce ? undefined : { opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Link to={`/portfolio/${p.slug}`} className="group relative block aspect-[4/5] overflow-hidden bg-charcoal">
                      <div className="h-full w-full transition-transform duration-700 group-hover:scale-[1.07]">
                        <CmsImage url={p.cardImage} shot={p.cardShot} alt={p.name} className="h-full w-full" />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/50 to-ink/10" />
                      <div className="absolute inset-x-0 bottom-0 p-6">
                        <p className="font-display text-[10px] font-bold uppercase tracking-[0.24em] text-mahoney">
                          {p.industry} · {p.year}
                        </p>
                        <h2 className="mt-2 font-display text-xl font-bold uppercase text-white">
                          {p.name}
                        </h2>
                        <p className="mt-1 text-sm text-white/60">{p.location}</p>
                        <p className="mt-4 flex max-h-0 items-center gap-2 overflow-hidden font-display text-[11px] font-bold uppercase tracking-[0.2em] text-white opacity-0 transition-all duration-500 group-hover:max-h-8 group-hover:opacity-100">
                          View Project <ArrowRight className="h-3.5 w-3.5 text-mahoney" />
                        </p>
                      </div>
                      <span className="absolute left-0 top-0 h-0 w-[3px] bg-mahoney transition-all duration-500 group-hover:h-full" />
                    </Link>
                  </motion.article>
                ))}
              </AnimatePresence>
            </motion.div>

            {list.length === 0 && (
              <p className="py-20 text-center text-concrete">
                No projects match those filters. Try widening your selection.
              </p>
            )}
          </div>
        </section>

        {/* Delivery stats */}
        <section className="border-t border-fog bg-white py-16">
          <div className="container-site">
            <Reveal className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
              {[
                { v: "1.2M+", l: "Storage Sq Ft Delivered" },
                { v: "20+", l: "Hotel Projects Completed" },
                { v: "800+", l: "Residential Units Built" },
                { v: "106 hrs", l: "Extreme Makeover Build" },
              ].map((st) => (
                <div key={st.l}>
                  <p className="font-display text-4xl font-extrabold text-mahoney sm:text-5xl">{st.v}</p>
                  <p className="mt-2 font-display text-[10px] font-semibold uppercase tracking-[0.22em] text-concrete">
                    {st.l}
                  </p>
                </div>
              ))}
            </Reveal>
            <Reveal delay={0.15}>
              <p className="mt-10 text-center text-[11px] tracking-wide text-concrete/70">
                * Figures illustrative — confirm final numbers before publish.
              </p>
            </Reveal>
          </div>
        </section>

        <CtaSection />
      </main>
      <Footer />
    </>
  );
}
