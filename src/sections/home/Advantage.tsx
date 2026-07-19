import { Users, ClipboardCheck, HardHat } from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "@/components/site/motion";

const PILLARS = [
  {
    icon: Users,
    title: "Exceptional Team",
    body: "Superintendents who average 20+ years in the field; project managers who live the schedule.",
  },
  {
    icon: ClipboardCheck,
    title: "Precise Planning",
    body: "Disciplined preconstruction: scope defined early, budgets locked, surprises engineered out.",
  },
  {
    icon: HardHat,
    title: "Expert Execution",
    body: "Real-time reporting and relentless safety — from mobilization to turnover.",
  },
];

export default function Advantage() {
  return (
    <section className="bg-bone py-24 sm:py-32">
      <div className="container-site">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <Reveal>
            <p className="eyebrow">The MDB Advantage</p>
            <div className="rule-red mt-4" />
            <h2 className="display-2 mt-6 text-3xl text-ink sm:text-5xl">
              From concept to certificate of occupancy, we optimize every step.
            </h2>
          </Reveal>
          <Reveal delay={0.15} className="flex flex-col justify-end gap-5 text-[15px] leading-relaxed text-concrete sm:text-base">
            <p>
              Design-build means one contract, one team, one point of
              accountability. Architecture, estimating, and construction sit at
              the same table from day one — so decisions get made once, in the
              right order, with cost attached.
            </p>
            <p>
              The result is cost certainty you can underwrite. We define scope
              before we price it, lock budgets before we mobilize, and report
              progress in real time until the keys change hands. Four decades of
              owners have come back for exactly that.
            </p>
          </Reveal>
        </div>

        <Stagger className="mt-16 grid gap-px overflow-hidden border border-fog bg-fog sm:mt-20 md:grid-cols-3">
          {PILLARS.map((p, i) => (
            <StaggerItem key={p.title}>
              <div className="group h-full bg-white p-8 transition-colors duration-300 hover:bg-ink sm:p-10">
                <div className="flex items-center justify-between">
                  <p.icon className="h-7 w-7 text-mahoney" strokeWidth={1.5} />
                  <span className="font-display text-5xl font-extrabold text-fog transition-colors group-hover:text-charcoal">
                    0{i + 1}
                  </span>
                </div>
                <h3 className="mt-8 font-display text-lg font-bold uppercase tracking-[0.08em] text-ink transition-colors group-hover:text-white">
                  {p.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-concrete transition-colors group-hover:text-white/60">
                  {p.body}
                </p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
