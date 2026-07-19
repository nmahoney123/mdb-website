import { Reveal } from "@/components/site/motion";
import { motion, useReducedMotion } from "framer-motion";

const STEPS = [
  {
    n: "01",
    title: "Discovery & Feasibility",
    body: "We pressure-test the site, the pro forma, and the schedule before anyone commits capital.",
  },
  {
    n: "02",
    title: "Design-Build",
    body: "Architecture and engineering under one roof with construction — decisions made once, with cost attached.",
  },
  {
    n: "03",
    title: "Preconstruction & Budget Lock",
    body: "Scope defined, subs bought out, GMP locked. Surprises get engineered out here — not in the field.",
  },
  {
    n: "04",
    title: "Construction",
    body: "A dedicated superintendent on site, real-time reporting to the owner, safety enforced every day.",
  },
  {
    n: "05",
    title: "Turnover & Warranty",
    body: "Punch to zero, documents in hand, and a warranty we actually answer the phone for.",
  },
];

export default function Process() {
  const reduce = useReducedMotion();
  return (
    <section className="border-y border-white/10 bg-charcoal py-24 text-white sm:py-32">
      <div className="container-site">
        <Reveal className="max-w-3xl">
          <p className="eyebrow">The Mahoney Process</p>
          <div className="rule-red mt-4" />
          <h2 className="display-2 mt-6 text-3xl sm:text-5xl">
            Single-source accountability, from first sketch to final walkthrough.
          </h2>
          <p className="mt-6 text-base leading-relaxed text-white/60">
            One team owns your project at every step. No handoffs, no
            finger-pointing, no gap between what was drawn and what gets built.
          </p>
        </Reveal>

        <div className="relative mt-16 sm:mt-20">
          <motion.span
            aria-hidden
            className="absolute left-[19px] top-0 h-full w-px bg-gradient-to-b from-mahoney via-white/25 to-transparent md:left-0 md:top-[19px] md:h-px md:w-full md:bg-gradient-to-r"
            initial={reduce ? undefined : { scaleY: 0, scaleX: 0 }}
            whileInView={reduce ? undefined : { scaleY: 1, scaleX: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
            style={{
              height: undefined,
              transformOrigin: "top left",
              position: "absolute",
            }}
          />
          <ol className="grid gap-12 md:grid-cols-5 md:gap-6">
            {STEPS.map((s, i) => (
              <motion.li
                key={s.n}
                initial={reduce ? false : { opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: 0.15 + i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                className="relative pl-14 md:pl-0 md:pt-14"
              >
                <span className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center border border-mahoney bg-ink font-display text-xs font-bold text-mahoney md:relative md:mb-0">
                  {s.n}
                </span>
                <h3 className="font-display text-base font-bold uppercase tracking-[0.08em]">
                  {s.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-white/55">{s.body}</p>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
