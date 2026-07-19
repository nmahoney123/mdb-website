import { Link } from "react-router";
import { ArrowRight, ChevronDown } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { AnimatedWords } from "@/components/site/motion";
import { useSettings, usePageContent } from "@/hooks/useCms";

export default function Hero() {
  const reduce = useReducedMotion();
  const settings = useSettings();
  const t = usePageContent("home");
  const line2 = t("hero.title.line2", "Way to Build.");

  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden bg-ink">
      {/* Background video — construction montage (manageable in Admin → Site Settings) */}
      <div className="absolute inset-0">
        {reduce ? (
          <img
            src={settings.heroPosterUrl}
            alt="Construction site montage — cranes, concrete work, and completed MDB buildings"
            loading="eager"
            fetchPriority="high"
            decoding="async"
            className="h-full w-full object-cover"
          />
        ) : (
          <video
            className="h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            poster={settings.heroPosterUrl}
            aria-label="Background video: construction montage — tower cranes, concrete pump trucks, foundation pours, self-storage buildings and a completed hotel"
          >
            <source src={settings.heroVideoMobileUrl} type="video/mp4" media="(max-width: 768px)" />
            <source src={settings.heroVideoUrl} type="video/mp4" />
          </video>
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-ink/95 via-ink/85 to-ink/60" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-ink to-transparent" />
      </div>

      <div className="container-site relative z-10 pb-28 pt-44">
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="eyebrow"
        >
          {t("hero.eyebrow", "General Contracting · Design-Build · Since 1985")}
        </motion.p>

        <h1 className="mt-6 font-anton text-[13vw] uppercase leading-[0.92] tracking-[0.005em] text-white sm:text-[10.5vw] lg:text-[7rem]">
          <AnimatedWords text={t("hero.title.line1", "A Better")} delay={0.25} />
          <br />
          <span className="block overflow-hidden pb-[0.08em] -mb-[0.08em]" aria-label={line2}>
            <motion.span
              className="block"
              initial={reduce ? false : { y: "110%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.75, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              {line2 === "Way to Build." ? (
                <>
                  <span className="text-mahoney">Way to</span> Build.
                </>
              ) : (
                line2
              )}
            </motion.span>
          </span>
        </h1>

        <motion.p
          initial={reduce ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.95 }}
          className="mt-8 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg"
        >
          {t(
            "hero.sub",
            "Ground-up commercial construction for Self Storage, Hospitality, and Multifamily — delivered with the precision of a national firm and the accountability of a family business."
          )}
        </motion.p>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.1 }}
          className="mt-10 flex flex-wrap gap-4"
        >
          <Link to={t("hero.ctaPrimary.to", "/portfolio")} className="btn-primary">
            {t("hero.ctaPrimary.label", "Explore Our Work")} <ArrowRight className="arrow h-4 w-4" />
          </Link>
          <Link to={t("hero.ctaSecondary.to", "/contact")} className="btn-outline-light">
            {t("hero.ctaSecondary.label", "Start a Project")} <ArrowRight className="arrow h-4 w-4" />
          </Link>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.a
        href="#stats"
        aria-label="Scroll to content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-white/50 transition-colors hover:text-white"
      >
        <motion.div
          animate={reduce ? undefined : { y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2"
        >
          <span className="font-display text-[10px] font-semibold uppercase tracking-[0.3em]">
            Scroll
          </span>
          <ChevronDown className="h-4 w-4" />
        </motion.div>
      </motion.a>
    </section>
  );
}
