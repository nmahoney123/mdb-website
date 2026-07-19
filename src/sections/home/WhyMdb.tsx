import { Marquee, Reveal } from "@/components/site/motion";
import { CAPABILITIES_MARQUEE, PARTNER_LOGOS } from "@/data/content";

export default function WhyMdb() {
  return (
    <section className="overflow-hidden border-y border-white/10 bg-ink py-24 text-white sm:py-28">
      <div className="container-site">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="eyebrow">Why MDB</p>
          <h2 className="display-2 mt-6 text-3xl sm:text-5xl">
            Four decades. Family-built.
          </h2>
          {/* TODO(owner): confirm real figure — client recommendation rate */}
          <p className="mt-6 text-base leading-relaxed text-white/60 sm:text-lg">
            Family-owned, licensed &amp; insured, with the same name on the door
            since 1985 — and more than 95% of our clients say they'd recommend
            us. We build like our name is on it, because it is.
          </p>
        </Reveal>
      </div>

      {/* Capabilities marquee */}
      <Reveal delay={0.2} className="mt-16">
        <Marquee slow>
          {CAPABILITIES_MARQUEE.map((c) => (
            <span key={c} className="flex items-center">
              <span className="whitespace-nowrap px-8 font-display text-2xl font-extrabold uppercase tracking-[0.06em] text-white/85 sm:text-4xl">
                {c}
              </span>
              <span className="h-2 w-2 rotate-45 bg-mahoney" aria-hidden />
            </span>
          ))}
        </Marquee>
      </Reveal>

      {/* Logo wall */}
      <div className="container-site mt-20">
        <Reveal>
          <p className="text-center font-display text-[11px] font-semibold uppercase tracking-[0.3em] text-white/40">
            Trusted by Developers &amp; Operators
          </p>
        </Reveal>
        <Reveal delay={0.15} className="mt-8">
          <Marquee>
            {PARTNER_LOGOS.map((logo) => (
              <div
                key={logo}
                className="mx-4 flex h-20 w-56 shrink-0 items-center justify-center border border-white/10 bg-white/[0.03] px-6"
              >
                <p className="text-center text-[11px] leading-snug text-white/35">{logo}</p>
              </div>
            ))}
          </Marquee>
        </Reveal>
      </div>
    </section>
  );
}
