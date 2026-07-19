import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import CmsImage from "@/components/site/CmsImage";
import { Reveal, Stagger, StaggerItem, Parallax } from "@/components/site/motion";

const QUOTES = [
  {
    quote:
      "You're not a number here. You're running real scope on real projects in your first year — and the person checking your work has done it for three decades.",
    name: "[Placeholder] Site Supervisor quote — replace with approved employee quote",
    role: "Project Superintendent, 14 years at MDB",
  },
  {
    quote:
      "I started in the field. Now I run my own projects. The path is real here — they promote the people who build.",
    name: "[Placeholder] PM quote — replace with approved employee quote",
    role: "Project Manager, started as a carpenter",
  },
];

export default function CareersTeaser() {
  return (
    <section className="bg-bone py-24 sm:py-32">
      <div className="container-site grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <div>
          <Reveal>
            <p className="eyebrow">Build Your Career</p>
            <div className="rule-red mt-4" />
            <h2 className="display-2 mt-6 text-3xl text-ink sm:text-5xl">
              Exceptional work. Exceptional people.
            </h2>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-concrete">
              Family culture, field-to-leadership growth, competitive pay, and
              real project ownership from day one. Our superintendents average
              two decades in the field — most of them built that career right
              here.
            </p>
          </Reveal>
          <Stagger className="mt-10 space-y-6">
            {QUOTES.map((q) => (
              <StaggerItem key={q.role}>
                <figure className="border-l-[3px] border-mahoney bg-white p-6 shadow-[0_16px_40px_-28px_rgba(20,20,20,0.3)]">
                  <blockquote className="text-sm leading-relaxed text-ink/85">
                    "{q.quote}"
                  </blockquote>
                  <figcaption className="mt-4">
                    <p className="font-display text-xs font-bold uppercase tracking-[0.12em] text-ink">
                      {q.role}
                    </p>
                    <p className="mt-1 text-[11px] text-concrete/70">{q.name}</p>
                  </figcaption>
                </figure>
              </StaggerItem>
            ))}
          </Stagger>
          <Reveal delay={0.2} className="mt-10">
            <Link to="/careers" className="btn-primary">
              See Open Roles <ArrowRight className="arrow h-4 w-4" />
            </Link>
          </Reveal>
        </div>
        <Parallax amount={20} className="relative">
          <Reveal delay={0.1}>
            <div className="aspect-[4/5] overflow-hidden">
              <CmsImage
                url="/media/gallery/extreme-makeover/extreme-makeover-team-huddle.webp"
                shot="MDB field team on an active jobsite — superintendent with drawings talking to crew, steel rising behind, morning light"
                alt="MDB team coordinating on a build site"
                label="Team Photo Slot"
                className="h-full w-full"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 hidden bg-mahoney p-6 text-white sm:block">
              <p className="font-display text-4xl font-extrabold">20+ yrs</p>
              <p className="mt-1 font-display text-[10px] font-semibold uppercase tracking-[0.22em] text-white/80">
                Avg. superintendent field experience
              </p>
            </div>
          </Reveal>
        </Parallax>
      </div>
    </section>
  );
}
