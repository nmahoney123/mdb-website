import { Link } from "react-router";
import { ArrowUpRight } from "lucide-react";
import { useSeo, breadcrumbLd } from "@/lib/useSeo";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import PageHero from "@/components/site/PageHero";
import CtaSection from "@/components/site/CtaSection";
import ImageSlot from "@/components/site/ImageSlot";
import { Reveal, Stagger, StaggerItem, CountUp } from "@/components/site/motion";
import { INDUSTRIES } from "@/data/content";

export default function Industries() {
  useSeo({
    title: "Industries We Build — Self Storage, Hospitality & Multifamily | Mahoney Design & Build",
    description:
      "Ground-up commercial construction across self storage, hotels & hospitality, and multifamily — plus select custom homes. Design-build delivery from a family-owned GC.",
    path: "/industries",
    jsonLd: breadcrumbLd([
      { name: "Home", path: "/" },
      { name: "Industries", path: "/industries" },
    ]),
  });
  return (
    <>
      <Header />
      <main>
        <PageHero
          eyebrow="Industries"
          title="What we build."
          sub="Ground-up commercial construction across three core markets — plus select custom homes for longstanding clients. Each one gets the same discipline: scope early, budgets locked, execution without excuses."
          shot="Split-frame aerial of three MDB project types — storage facility, hotel, apartment community — shot from a drone at golden hour"
        />
        <section className="bg-bone py-20 sm:py-28">
          <div className="container-site space-y-8">
            {INDUSTRIES.map((ind, i) => (
              <Reveal key={ind.slug} delay={i * 0.05}>
                <Link
                  to={`/industries/${ind.slug}`}
                  className="group grid overflow-hidden border border-fog bg-white transition-shadow hover:shadow-[0_30px_60px_-40px_rgba(20,20,20,0.4)] md:grid-cols-[1fr_1.2fr]"
                >
                  <div className="relative aspect-[16/10] overflow-hidden md:aspect-auto md:min-h-[280px]">
                    <div className="h-full w-full transition-transform duration-700 group-hover:scale-[1.06]">
                      <ImageSlot shot={ind.cardShot} className="h-full w-full" />
                    </div>
                    <span className="absolute left-5 top-5 font-display text-[11px] font-bold uppercase tracking-[0.3em] text-white/60">
                      0{i + 1}
                    </span>
                  </div>
                  <div className="relative flex flex-col justify-center p-8 sm:p-12">
                    <span className="absolute left-0 top-0 h-full w-[3px] bg-mahoney opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <div className="flex items-start justify-between gap-4">
                      <h2 className="font-display text-2xl font-bold uppercase tracking-[0.05em] text-ink sm:text-3xl">
                        {ind.name}
                      </h2>
                      <ArrowUpRight className="h-6 w-6 shrink-0 text-mahoney transition-transform duration-300 group-hover:rotate-45" />
                    </div>
                    <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-concrete">
                      {ind.blurb}
                    </p>
                    <p className="mt-6 font-display text-sm font-bold text-ink">
                      <span className="text-2xl font-extrabold text-mahoney">{ind.stat.value}</span>{" "}
                      <span className="ml-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-concrete">
                        {ind.stat.label}
                      </span>
                    </p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="border-t border-fog bg-white py-16">
          <div className="container-site">
            {/* TODO(owner): confirm real figures — years, projects, sq ft, repeat/referral rate */}
            <Stagger className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
              {[
                { v: 40, s: "", l: "Years Building" },
                { v: 500, s: "+", l: "Projects Delivered" },
                { v: 3, s: "M+", l: "Sq Ft Constructed" },
                { v: 90, s: "%", l: "Repeat & Referral Clients" },
              ].map((st) => (
                <StaggerItem key={st.l}>
                  <p className="font-display text-4xl font-extrabold text-ink sm:text-5xl">
                    <CountUp value={st.v} suffix={st.s} />
                  </p>
                  <p className="mt-2 font-display text-[10px] font-semibold uppercase tracking-[0.22em] text-concrete">
                    {st.l}
                  </p>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>

        <CtaSection />
      </main>
      <Footer />
    </>
  );
}
