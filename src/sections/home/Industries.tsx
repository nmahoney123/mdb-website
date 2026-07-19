import { Link } from "react-router";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import CmsImage from "@/components/site/CmsImage";
import { useProjects } from "@/hooks/useCms";
import { Reveal, Stagger, StaggerItem } from "@/components/site/motion";
import { INDUSTRIES } from "@/data/content";

export default function Industries() {
  const projects = useProjects();
  const industryImage = (slug: string) =>
    projects.find((p) => p.industrySlug === slug && p.cardImage)?.cardImage ?? null;
  return (
    <section className="bg-ink py-24 text-white sm:py-32">
      <div className="container-site">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Reveal>
            <p className="eyebrow">What We Build</p>
            <div className="rule-red mt-4" />
            <h2 className="display-2 mt-6 max-w-2xl text-3xl sm:text-5xl">
              Three core markets. One standard of delivery.
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <Link to="/industries" className="btn-outline-light">
              All Industries <ArrowRight className="arrow h-4 w-4" />
            </Link>
          </Reveal>
        </div>

        <Stagger className="mt-16 grid gap-6 md:grid-cols-2">
          {INDUSTRIES.map((ind, i) => (
            <StaggerItem key={ind.slug}>
              <Link
                to={`/industries/${ind.slug}`}
                className="group relative block overflow-hidden border border-white/10 bg-charcoal"
              >
                <div className="relative aspect-[16/9] overflow-hidden">
                  <div className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.05]">
                    <CmsImage url={industryImage(ind.slug)} shot={ind.cardShot} alt={ind.name} className="h-full w-full" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
                  <span className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center border border-white/25 bg-ink/50 text-white backdrop-blur-sm transition-all duration-300 group-hover:border-mahoney group-hover:bg-mahoney">
                    <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:rotate-45" />
                  </span>
                  <span className="absolute left-6 top-6 font-display text-[11px] font-bold uppercase tracking-[0.3em] text-white/50">
                    0{i + 1}
                  </span>
                </div>
                <div className="relative p-7 sm:p-9">
                  <span className="absolute left-0 top-0 h-[3px] w-0 bg-mahoney transition-all duration-500 group-hover:w-full" />
                  <h3 className="font-display text-xl font-bold uppercase tracking-[0.06em] sm:text-2xl">
                    {ind.name}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/60">
                    {ind.blurb}
                  </p>
                  <p className="mt-5 flex items-center gap-2 font-display text-[11px] font-bold uppercase tracking-[0.22em] text-mahoney">
                    Explore {ind.short}
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1.5" />
                  </p>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
