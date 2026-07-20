import { ShieldCheck, BadgeCheck, Leaf } from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "@/components/site/motion";

const BLOCKS = [
  {
    icon: ShieldCheck,
    title: "Safety",
    body: "A proactive, incident-free culture — every worker on an MDB site is empowered to stop work, no questions asked.",
  },
  {
    icon: BadgeCheck,
    title: "Quality",
    body: "A written quality plan tied to each owner's expectations — inspected, documented, and verified at every milestone.",
  },
  {
    icon: Leaf,
    title: "Sustainability",
    body: "Responsible building that lasts — durable assets, efficient envelopes, lower operating cost for decades.",
  },
];

export default function Credibility() {
  return (
    <section className="bg-bone py-24 sm:py-32">
      <div className="container-site">
        <Reveal className="max-w-2xl">
          <p className="eyebrow">How We Work</p>
          <div className="rule-red mt-4" />
          <h2 className="display-2 mt-6 text-3xl text-ink sm:text-5xl">
            Standards you can hold us to.
          </h2>
        </Reveal>
        <Stagger className="mt-14 grid gap-px border border-fog bg-fog md:grid-cols-3">
          {BLOCKS.map((b) => (
            <StaggerItem key={b.title}>
              <div className="group flex h-full flex-col bg-white p-8 sm:p-10">
                <b.icon className="h-8 w-8 text-mahoney" strokeWidth={1.5} />
                <h3 className="mt-6 font-display text-lg font-bold uppercase tracking-[0.08em] text-ink">
                  {b.title}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-concrete">{b.body}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
