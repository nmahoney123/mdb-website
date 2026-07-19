import { useEffect, useRef, type ReactNode } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import { cn } from "@/lib/utils";

/* ---------- Reveal: fade + rise on scroll into view ---------- */

const revealVariants: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
  }),
};

export function Reveal({
  children,
  className,
  delay = 0,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section" | "span" | "li";
}) {
  const reduce = useReducedMotion();
  const Comp = (motion as any)[as] ?? motion.div;
  return (
    <Comp
      className={className}
      variants={reduce ? undefined : revealVariants}
      custom={delay}
      initial={reduce ? false : "hidden"}
      whileInView={reduce ? undefined : "visible"}
      viewport={{ once: true, margin: "-60px" }}
    >
      {children}
    </Comp>
  );
}

/* ---------- Stagger container + item ---------- */

export const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
};

export function Stagger({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      variants={reduce ? undefined : staggerContainer}
      initial={reduce ? false : "hidden"}
      whileInView={reduce ? undefined : "visible"}
      viewport={{ once: true, margin: "-60px" }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div className={className} variants={reduce ? undefined : staggerItem}>
      {children}
    </motion.div>
  );
}

/* ---------- Word-by-word animated headline ---------- */

export function AnimatedWords({
  text,
  className,
  wordClassName,
  delay = 0,
}: {
  text: string;
  className?: string;
  wordClassName?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  const words = text.split(" ");
  if (reduce) {
    return (
      <span className={className}>
        <span className={wordClassName}>{text}</span>
      </span>
    );
  }
  return (
    <span className={cn("inline", className)} aria-label={text}>
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.08em] -mb-[0.08em] align-bottom" aria-hidden>
          <motion.span
            className={cn("inline-block", wordClassName)}
            initial={{ y: "110%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              duration: 0.75,
              delay: delay + i * 0.09,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {w}
            {i < words.length - 1 ? "\u00A0" : ""}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/* ---------- Count-up number on scroll into view ---------- */

export function CountUp({
  value,
  suffix = "",
  prefix = "",
  duration = 1.8,
  className,
}: {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { duration: duration * 1000, bounce: 0 });
  const display = useTransform(spring, (v) =>
    `${prefix}${Math.round(v).toLocaleString()}${suffix}`
  );

  useEffect(() => {
    if (inView && !reduce) mv.set(value);
  }, [inView, value, mv, reduce]);

  if (reduce) {
    return (
      <span ref={ref} className={className}>
        {prefix}
        {value.toLocaleString()}
        {suffix}
      </span>
    );
  }
  return (
    <motion.span ref={ref} className={className}>
      {inView ? display : `${prefix}0${suffix}`}
    </motion.span>
  );
}

/* ---------- Marquee (CSS animation, duplicated content) ---------- */

export function Marquee({
  children,
  className,
  slow = false,
}: {
  children: ReactNode;
  className?: string;
  slow?: boolean;
}) {
  return (
    <div className={cn("group relative overflow-hidden", className)}>
      <div
        className={cn(
          "flex w-max items-center",
          slow ? "animate-marquee-slow" : "animate-marquee",
          "group-hover:[animation-play-state:paused]"
        )}
      >
        <div className="flex items-center">{children}</div>
        <div className="flex items-center" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}

/* ---------- Subtle parallax wrapper (≤20px) ---------- */

export function Parallax({
  children,
  className,
  amount = 20,
}: {
  children: ReactNode;
  className?: string;
  amount?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const y = useMotionValue(0);

  useEffect(() => {
    if (reduce) return;
    let raf = 0;
    const onScroll = () => {
      if (!ref.current) return;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = ref.current!;
        const rect = el.getBoundingClientRect();
        const vh = window.innerHeight;
        const progress = (rect.top + rect.height / 2 - vh / 2) / vh; // -~1..~1
        y.set(Math.max(-amount, Math.min(amount, progress * amount * -1)));
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [amount, y, reduce]);

  return (
    <motion.div ref={ref} className={className} style={reduce ? undefined : { y }}>
      {children}
    </motion.div>
  );
}
