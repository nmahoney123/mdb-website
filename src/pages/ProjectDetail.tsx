import { Link, Navigate, useParams } from "react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import PageHero from "@/components/site/PageHero";
import CtaSection from "@/components/site/CtaSection";
import CmsImage from "@/components/site/CmsImage";
import { Reveal, Stagger, StaggerItem } from "@/components/site/motion";
import { useProjects } from "@/hooks/useCms";

export default function ProjectDetail() {
  const { slug } = useParams();
  const PROJECTS = useProjects();
  const project = PROJECTS.find((p) => p.slug === slug);
  if (!project) return <Navigate to="/portfolio" replace />;

  const idx = PROJECTS.findIndex((p) => p.slug === slug);
  const next = PROJECTS[(idx + 1) % PROJECTS.length];

  const facts = [
    { label: "Project Type", value: project.industry },
    { label: "Size", value: project.size },
    { label: "Location", value: project.location },
    { label: "Year", value: project.year },
    { label: "Scope", value: project.scope },
    { label: "Services", value: project.services.join(" · ") },
  ];

  return (
    <>
      <Header />
      <main>
        <PageHero
          eyebrow={`${project.industry} — ${project.location}`}
          title={project.name}
          sub={project.scope}
          shot={project.heroShot}
          imageUrl={project.heroImage}
        />

        <section className="bg-bone py-20 sm:py-28">
          <div className="container-site grid gap-14 lg:grid-cols-[1.4fr_1fr] lg:gap-20">
            <div>
              <Reveal>
                <p className="eyebrow">The Story</p>
                <div className="rule-red mt-4" />
                <div className="mt-8 space-y-5 text-base leading-relaxed text-concrete">
                  {project.narrative.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </Reveal>
              <Stagger className="mt-12 grid gap-6 sm:grid-cols-2">
                <StaggerItem>
                  <div className="aspect-[4/3] overflow-hidden">
                    <CmsImage
                      url={project.heroImage}
                      shot={`${project.name} — gallery shot 1: progress photo during construction, structure rising`}
                      alt={project.name}
                      label="Gallery Slot 1"
                      className="h-full w-full"
                    />
                  </div>
                </StaggerItem>
                <StaggerItem>
                  <div className="aspect-[4/3] overflow-hidden sm:mt-10">
                    <CmsImage
                      url={project.cardImage}
                      shot={`${project.name} — gallery shot 2: finished detail, completed exterior in golden light`}
                      alt={project.name}
                      label="Gallery Slot 2"
                      className="h-full w-full"
                    />
                  </div>
                </StaggerItem>
              </Stagger>
            </div>

            <Reveal delay={0.15}>
              <aside className="border border-fog bg-white lg:sticky lg:top-28">
                <div className="border-b border-fog bg-ink p-6">
                  <h2 className="font-display text-sm font-bold uppercase tracking-[0.22em] text-white">
                    Project Facts
                  </h2>
                </div>
                <dl className="divide-y divide-fog p-6">
                  {facts.map((f) => (
                    <div key={f.label} className="py-4 first:pt-0 last:pb-0">
                      <dt className="font-display text-[10px] font-semibold uppercase tracking-[0.22em] text-concrete">
                        {f.label}
                      </dt>
                      <dd className="mt-1.5 text-sm font-medium leading-relaxed text-ink">
                        {f.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </aside>
            </Reveal>
          </div>
        </section>

        <section className="border-t border-fog bg-white py-14">
          <div className="container-site flex flex-wrap items-center justify-between gap-6">
            <Link
              to="/portfolio"
              className="group inline-flex items-center gap-2 font-display text-[11px] font-bold uppercase tracking-[0.2em] text-concrete transition-colors hover:text-ink"
            >
              <ArrowLeft className="h-3.5 w-3.5 text-mahoney transition-transform group-hover:-translate-x-1.5" />
              Full Portfolio
            </Link>
            <Link to={`/portfolio/${next.slug}`} className="group text-right">
              <p className="font-display text-[10px] font-semibold uppercase tracking-[0.24em] text-concrete">
                Next Project
              </p>
              <p className="mt-1 flex items-center gap-2 font-display text-xl font-bold uppercase text-ink transition-colors group-hover:text-mahoney">
                {next.name}
                <ArrowRight className="h-4 w-4 text-mahoney transition-transform group-hover:translate-x-1.5" />
              </p>
            </Link>
          </div>
        </section>

        <CtaSection title="Want results like this?" sub="Bring us your site and your pro forma. We'll tell you honestly what it takes to build it." />
      </main>
      <Footer />
    </>
  );
}
