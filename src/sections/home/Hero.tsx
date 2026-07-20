import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { ArrowRight, ChevronDown } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { AnimatedWords } from "@/components/site/motion";
import { useSettings, usePageContent } from "@/hooks/useCms";

/** Words the hero headline cycles through: "A Better Way to __" */
const ROTATING_WORDS = ["Build.", "Design.", "Construct.", "Plan.", "Deliver."];

/** Vertical carousel that rotates through ROTATING_WORDS on its own line. */
function RotatingWord() {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(
      () => setI((v) => (v + 1) % ROTATING_WORDS.length),
      2200
    );
    return () => window.clearInterval(id);
  }, [reduce]);

  if (reduce) {
    return <span className="text-mahoney">{ROTATING_WORDS[0]}</span>;
  }
  return (
    <span
      className="relative inline-block overflow-hidden align-bottom"
      style={{ height: "1em" }}
      aria-label={ROTATING_WORDS[i]}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={i}
          className="inline-block text-mahoney"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          {ROTATING_WORDS[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

/**
 * Background hero video. Mobile browsers autoplay a video only when it is muted,
 * inline, and has an actually-selected source. Two things break that with plain
 * markup: (1) the `media` attribute on <source> is unreliable inside <video>
 * (Chrome dropped it, so responsive source selection silently fails), and (2)
 * React's `muted` prop doesn't always satisfy the browser's muted check at the
 * moment autoplay is evaluated. So we pick the source and drive playback
 * imperatively, re-asserting muted/inline and retrying as the video becomes
 * ready and on first touch. If autoplay is still blocked (e.g. iOS Low Power
 * Mode), the poster remains — no error.
 */
function HeroVideo({
  desktopSrc,
  mobileSrc,
  poster,
}: {
  desktopSrc: string;
  mobileSrc: string;
  poster: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const mq = window.matchMedia("(max-width: 768px)");

    const applySource = () => {
      const next = mq.matches ? mobileSrc || desktopSrc : desktopSrc || mobileSrc;
      if (next && video.getAttribute("src") !== next) {
        video.src = next;
        video.load();
      }
    };
    const play = () => {
      video.muted = true;
      video.defaultMuted = true;
      video.playsInline = true;
      const p = video.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    };
    const onChange = () => {
      applySource();
      play();
    };
    const onFirstTouch = () => play();

    applySource();
    play();
    video.addEventListener("loadeddata", play);
    video.addEventListener("canplay", play);
    mq.addEventListener("change", onChange);
    window.addEventListener("touchstart", onFirstTouch, { once: true, passive: true });

    return () => {
      video.removeEventListener("loadeddata", play);
      video.removeEventListener("canplay", play);
      mq.removeEventListener("change", onChange);
      window.removeEventListener("touchstart", onFirstTouch);
    };
  }, [desktopSrc, mobileSrc]);

  return (
    <video
      ref={ref}
      className="h-full w-full object-cover"
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      poster={poster}
      aria-label="Background video: construction montage — tower cranes, concrete pump trucks, foundation pours, self-storage buildings and a completed hotel"
    />
  );
}

export default function Hero() {
  const reduce = useReducedMotion();
  const settings = useSettings();
  const t = usePageContent("home");

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
          <HeroVideo
            desktopSrc={settings.heroVideoUrl}
            mobileSrc={settings.heroVideoMobileUrl}
            poster={settings.heroPosterUrl}
          />
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

        <h1 className="mt-6 font-anton text-[13vw] uppercase leading-[0.95] tracking-[0.005em] text-white sm:text-[10.5vw] lg:text-[6.5rem]">
          <AnimatedWords text={t("hero.title.line1", "A Better")} delay={0.25} />
          <span className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
            <motion.span
              className="block"
              initial={reduce ? false : { y: "110%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.75, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              Way to
            </motion.span>
          </span>
          <span className="block">
            <RotatingWord />
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
