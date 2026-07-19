import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import CmsImage from "./CmsImage";
import { AnimatedWords } from "./motion";

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
  return (
    <section className="relative flex min-h-[62vh] items-end overflow-hidden bg-ink pt-40 pb-16 sm:pb-20">
      <div className="absolute inset-0">
        <CmsImage url={imageUrl} shot={shot} label="Hero Image Slot" className="h-full w-full opacity-60" loading="eager" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-ink/30" />
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
