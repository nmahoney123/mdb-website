import { Link } from "react-router";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import CmsImage from "@/components/site/CmsImage";
import { Reveal, Stagger, StaggerItem } from "@/components/site/motion";
import { usePosts } from "@/hooks/useCms";

export default function NewsTeaser() {
  const NEWS = usePosts();
  return (
    <section className="bg-bone py-24 sm:py-32">
      <div className="container-site">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow">News &amp; Insights</p>
            <div className="rule-red mt-4" />
            <h2 className="display-2 mt-6 text-3xl text-ink sm:text-5xl">
              From the field &amp; the market.
            </h2>
          </div>
          <Link to="/news" className="btn-outline-ink">
            See All News <ArrowRight className="arrow h-4 w-4" />
          </Link>
        </Reveal>

        <Stagger className="mt-14 grid gap-6 md:grid-cols-3">
          {NEWS.map((n) => (
            <StaggerItem key={n.slug}>
              <Link to={`/news/${n.slug}`} className="group flex h-full flex-col border border-fog bg-white">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <div className="h-full w-full transition-transform duration-700 group-hover:scale-[1.06]">
                    <CmsImage url={n.coverImage} shot={n.shot} alt={n.title} dark={false} className="h-full w-full" />
                  </div>
                  <span className="absolute left-5 top-5 bg-mahoney px-3 py-1.5 font-display text-[10px] font-bold uppercase tracking-[0.18em] text-white">
                    {n.category}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-7">
                  <p className="font-display text-[11px] font-semibold uppercase tracking-[0.2em] text-concrete">
                    {n.date}
                  </p>
                  <h3 className="mt-3 font-display text-base font-bold leading-snug text-ink transition-colors group-hover:text-mahoney">
                    {n.title}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-concrete">{n.excerpt}</p>
                  <p className="mt-5 flex items-center gap-2 font-display text-[11px] font-bold uppercase tracking-[0.2em] text-ink">
                    Read Article
                    <ArrowUpRight className="h-3.5 w-3.5 text-mahoney transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
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
