import { Link } from "react-router";
import { ArrowUpRight } from "lucide-react";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import PageHero from "@/components/site/PageHero";
import CtaSection from "@/components/site/CtaSection";
import CmsImage from "@/components/site/CmsImage";
import { Reveal, Stagger, StaggerItem } from "@/components/site/motion";
import { usePosts } from "@/hooks/useCms";
import { getAllPosts } from "@/lib/blog";
import { useSeo, breadcrumbLd } from "@/lib/useSeo";

export default function News() {
  useSeo({
    title: "News & Insights — Projects, Market & Cost Intelligence | Mahoney Design & Build",
    description:
      "Project milestones, self storage cost outlooks, and market intelligence for storage, hospitality, and multifamily owners from Mahoney Design & Build.",
    path: "/news",
    jsonLd: breadcrumbLd([
      { name: "Home", path: "/" },
      { name: "News & Insights", path: "/news" },
    ]),
  });
  const dbPosts = usePosts();
  const mdPosts = getAllPosts();
  // Markdown (git-committed) posts lead, then DB posts that don't collide by slug.
  const mdSlugs = new Set(mdPosts.map((p) => p.slug));
  const NEWS = [
    ...mdPosts.map((p) => ({
      slug: p.slug,
      title: p.title,
      category: p.category,
      excerpt: p.excerpt,
      coverImage: p.coverImage,
      shot: p.shot,
      date: p.date,
    })),
    ...dbPosts.filter((p) => !mdSlugs.has(p.slug)),
  ];
  return (
    <>
      <Header />
      <main>
        <PageHero
          eyebrow="News & Insights"
          title="From the field & the market."
          sub="Project milestones, market and cost intelligence, and company news from Mahoney Design & Build."
          shot="Editorial-style photo of an MDB jobsite meeting — drawings on a tailgate, team reviewing progress, golden hour"
        />
        <section className="bg-bone py-20 sm:py-28">
          <div className="container-site">
            <Stagger className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
                      <h2 className="mt-3 font-display text-base font-bold leading-snug text-ink transition-colors group-hover:text-mahoney">
                        {n.title}
                      </h2>
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
            <Reveal delay={0.2}>
              <p className="mt-10 text-[11px] tracking-wide text-concrete/70">
                * Articles are placeholders — replace with final editorial before publish.
              </p>
            </Reveal>
          </div>
        </section>
        {/* Subscribe band */}
        <section className="border-t border-fog bg-white py-16">
          <div className="container-site grid items-center gap-8 lg:grid-cols-[1fr_auto]">
            <Reveal>
              <h2 className="display-2 text-2xl text-ink">Get these in your inbox.</h2>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-concrete">
                Quarterly — project milestones, cost outlooks, and market
                intelligence for storage, hospitality, and multifamily owners.
                No noise.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <form onSubmit={(e) => e.preventDefault()} className="flex w-full max-w-md" aria-label="Newsletter signup">
                <input
                  type="email"
                  required
                  placeholder="Work email"
                  aria-label="Email address"
                  className="w-full border border-fog bg-bone px-4 py-3.5 text-sm text-ink placeholder:text-concrete/60 focus:border-mahoney focus:outline-none"
                />
                <button type="submit" className="btn-primary shrink-0 !px-5 !py-3.5">
                  Subscribe
                </button>
              </form>
            </Reveal>
          </div>
        </section>

        <CtaSection />
      </main>
      <Footer />
    </>
  );
}
