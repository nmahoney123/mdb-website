import { Link } from "react-router";
import { ArrowRight, HardHat, TrendingUp, HeartHandshake } from "lucide-react";
import CmsImage from "@/components/site/CmsImage";
import { Reveal, Stagger, StaggerItem, Parallax } from "@/components/site/motion";

const HIGHLIGHTS = [
  {
    icon: TrendingUp,
    title: "Field-to-leadership growth",
    body: "Real project ownership from day one, and a promotion path that rewards the people who build.",
  },
  {
    icon: HardHat,
    title: "Learn from the best",
    body: "Our superintendents average two decades in the field — most of them built that career right here.",
  },
  {
    icon: HeartHandshake,
    title: "Family culture",
    body: "Competitive pay, a team that has your back, and leadership that answers the phone.",
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
          <Stagger className="mt-10 space-y-4">
            {HIGHLIGHTS.map((h) => (
              <StaggerItem key={h.title}>
                <div className="flex gap-4 border-l-[3px] border-mahoney bg-white p-6 shadow-[0_16px_40px_-28px_rgba(20,20,20,0.3)]">
                  <h.icon className="h-6 w-6 shrink-0 text-mahoney" strokeWidth={1.5} />
                  <div>
                    <p className="font-display text-sm font-bold uppercase tracking-[0.08em] text-ink">
                      {h.title}
                    </p>
                    <p className="mt-1.5 text-sm leading-relaxed text-concrete">{h.body}</p>
                  </div>
                </div>
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
