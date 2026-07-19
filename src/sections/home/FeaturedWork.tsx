import { useState } from "react";
import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import CmsImage from "@/components/site/CmsImage";
import { Reveal } from "@/components/site/motion";
import { useProjects } from "@/hooks/useCms";
import { cn } from "@/lib/utils";

const FILTERS = ["All", "Self Storage", "Hotels & Hospitality", "Multifamily", "Custom Homes"];

export default function FeaturedWork() {
  const [filter, setFilter] = useState("All");
  const reduce = useReducedMotion();
  const projects = useProjects();
  const featured = projects.filter((p) => p.featured);
  const list = filter === "All" ? featured : featured.filter((p) => p.industry === filter);

  return (
    <section className="bg-bone py-24 sm:py-32">
      <div className="container-site">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow">Selected Work</p>
            <div className="rule-red mt-4" />
            <h2 className="display-2 mt-6 text-3xl text-ink sm:text-5xl">
              Built to last. Delivered to spec.
            </h2>
          </div>
          <Link to="/portfolio" className="btn-outline-ink">
            View Full Portfolio <ArrowRight className="arrow h-4 w-4" />
          </Link>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mt-12 flex flex-wrap gap-2" role="tablist" aria-label="Filter projects">
            {FILTERS.map((f) => (
              <button
                key={f}
                role="tab"
                aria-selected={filter === f}
                onClick={() => setFilter(f)}
                className={cn(
                  "border px-4 py-2 font-display text-[11px] font-semibold uppercase tracking-[0.16em] transition-all duration-300",
                  filter === f
                    ? "border-mahoney bg-mahoney text-white"
                    : "border-ink/15 bg-transparent text-concrete hover:border-ink/40 hover:text-ink"
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </Reveal>

        <motion.div layout className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {list.map((p) => (
              <motion.article
                layout
                key={p.slug}
                initial={reduce ? false : { opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link
                  to={`/portfolio/${p.slug}`}
                  className="group relative block aspect-[4/5] overflow-hidden bg-charcoal"
                >
                  <div className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.07]">
                    <CmsImage url={p.cardImage} shot={p.cardShot} alt={p.name} className="h-full w-full" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/50 to-ink/10 opacity-85 transition-opacity duration-500 group-hover:opacity-100" />
                  <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7">
                    <p className="font-display text-[10px] font-bold uppercase tracking-[0.24em] text-mahoney">
                      {p.industry} · {p.year}
                    </p>
                    <h3 className="mt-2 font-display text-xl font-bold uppercase tracking-wide text-white">
                      {p.name}
                    </h3>
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
      </div>
    </section>
  );
}
