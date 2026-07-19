import { Link, Navigate, useParams } from "react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import CtaSection from "@/components/site/CtaSection";
import CmsImage from "@/components/site/CmsImage";
import { Reveal, AnimatedWords } from "@/components/site/motion";
import { usePosts } from "@/hooks/useCms";
import { useSeo, articleLd, breadcrumbLd } from "@/lib/useSeo";
import { motion, useReducedMotion } from "framer-motion";

export default function Article() {
  const { slug } = useParams();
  const NEWS = usePosts();
  const article = NEWS.find((n) => n.slug === slug);
  const reduce = useReducedMotion();

  useSeo(
    article
      ? {
          title: `${article.title} | Mahoney Design & Build`,
          description: article.excerpt,
          path: `/news/${article.slug}`,
          type: "article",
          image: article.coverImage ?? undefined,
          jsonLd: [
            articleLd({
              title: article.title,
              path: `/news/${article.slug}`,
              date: article.date,
              image: article.coverImage,
              description: article.excerpt,
            }),
            breadcrumbLd([
              { name: "Home", path: "/" },
              { name: "News & Insights", path: "/news" },
              { name: article.title, path: `/news/${article.slug}` },
            ]),
          ],
        }
      : { title: "News & Insights | Mahoney Design & Build", path: "/news" },
  );

  if (!article) return <Navigate to="/news" replace />;

  const others = NEWS.filter((n) => n.slug !== slug).slice(0, 2);

  return (
    <>
      <Header />
      <main>
        <section className="bg-ink pb-16 pt-44 text-white">
          <div className="container-site max-w-4xl">
            <motion.p
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="eyebrow"
            >
              {article.category} · {article.date}
            </motion.p>
            <h1 className="display-2 mt-6 text-3xl sm:text-5xl">
              <AnimatedWords text={article.title} delay={0.15} />
            </h1>
          </div>
        </section>

        <section className="bg-bone py-16 sm:py-20">
          <div className="container-site max-w-4xl">
            <Reveal>
              <div className="aspect-video overflow-hidden border border-fog">
                <CmsImage url={article.coverImage} shot={article.shot} alt={article.title} dark={false} label="Article Hero Slot" className="h-full w-full" />
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="prose-mdb mt-12 space-y-6 text-lg leading-relaxed text-ink/85">
                {article.body.map((p, i) => (
                  <p key={i} className={i === 0 ? "text-xl font-medium text-ink" : ""}>
                    {p}
                  </p>
                ))}
              </div>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="mt-14 border-t border-fog pt-8">
                <Link
                  to="/news"
                  className="group inline-flex items-center gap-2 font-display text-[11px] font-bold uppercase tracking-[0.2em] text-concrete transition-colors hover:text-ink"
                >
                  <ArrowLeft className="h-3.5 w-3.5 text-mahoney transition-transform group-hover:-translate-x-1.5" />
                  All News &amp; Insights
                </Link>
              </div>
            </Reveal>
          </div>
        </section>

        {others.length > 0 && (
          <section className="border-t border-fog bg-white py-16">
            <div className="container-site">
              <Reveal>
                <h2 className="display-2 text-2xl text-ink">Keep reading.</h2>
              </Reveal>
              <div className="mt-8 grid gap-6 md:grid-cols-2">
                {others.map((n) => (
                  <Reveal key={n.slug} delay={0.1}>
                    <Link to={`/news/${n.slug}`} className="group flex h-full flex-col border border-fog bg-bone p-7">
                      <p className="font-display text-[11px] font-semibold uppercase tracking-[0.2em] text-concrete">
                        {n.category} · {n.date}
                      </p>
                      <h3 className="mt-3 font-display text-lg font-bold leading-snug text-ink transition-colors group-hover:text-mahoney">
                        {n.title}
                      </h3>
                      <p className="mt-4 flex items-center gap-2 font-display text-[11px] font-bold uppercase tracking-[0.2em] text-ink">
                        Read Article <ArrowRight className="h-3.5 w-3.5 text-mahoney transition-transform group-hover:translate-x-1.5" />
                      </p>
                    </Link>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        )}

        <CtaSection />
      </main>
      <Footer />
    </>
  );
}
