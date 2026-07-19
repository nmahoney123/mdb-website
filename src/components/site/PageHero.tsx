import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import CmsImage from "./CmsImage";
import { AnimatedWords } from "./motion";
import { useSettings } from "@/hooks/useCms";

export default function PageHero({
  eyebrow,
  title,
  sub,
  shot,
  imageUrl,
  children,
}: {
  eyebrow: string;
  title: string;
  sub?: string;
  shot: string;
  imageUrl?: string | null;
  children?: ReactNode;
}) {
  const reduce = useReducedMotion();
  const settings = useSettings();
  return (
    <section className="relative flex min-h-[62vh] items-end overflow-hidden bg-ink pt-40 pb-16 sm:pb-20">
      <div className="absolute inset-0">
        {imageUrl ? (
          // Page provided a specific image — use it.
          <CmsImage url={imageUrl} shot={shot} className="h-full w-full opacity-55" loading="eager" />
        ) : reduce ? (
          // Reduced motion — the hero poster still (no autoplay video).
          <img
            src={settings.heroPosterUrl}
            alt=""
            aria-hidden
            loading="eager"
            fetchPriority="high"
            decoding="async"
            className="h-full w-full object-cover opacity-45"
          />
        ) : (
          // Default — the shared construction hero video plays on every page.
          <video
            className="h-full w-full object-cover opacity-45"
            autoPlay
            muted
            loop
            playsInline
            poster={settings.heroPosterUrl}
            aria-hidden
          >
            <source src={settings.heroVideoMobileUrl} type="video/mp4" media="(max-width: 768px)" />
            <source src={settings.heroVideoUrl} type="video/mp4" />
          </video>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/40" />
      </div>
      <div className="container-site relative z-10">
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="eyebrow"
        >
          {eyebrow}
        </motion.p>
        <h1 className="display-1 mt-4 max-w-4xl text-4xl text-white sm:text-6xl lg:text-7xl">
          <AnimatedWords text={title} delay={0.15} />
        </h1>
        {sub && (
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="mt-6 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg"
          >
            {sub}
          </motion.p>
        )}
        {children}
      </div>
    </section>
  );
}
