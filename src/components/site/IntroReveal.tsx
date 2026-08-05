import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Phase = "playing" | "out" | "done";

const SESSION_KEY = "mdb_intro_seen";

/**
 * First-visit logo reveal. Plays the brand logo-mark animation on a white
 * field (matching the guide's on-white primary logo), then fades away to
 * reveal the site. Shown once per browser session, skippable (click / Skip /
 * Esc), and fully bypassed for `prefers-reduced-motion`. The animation only
 * loads when it actually plays, so returning visitors pay nothing.
 */
export default function IntroReveal() {
  // Decide synchronously on first render so returning/reduced-motion visitors
  // never see a flash of the overlay.
  const [phase, setPhase] = useState<Phase>(() => {
    if (typeof window === "undefined") return "done";
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const seen = sessionStorage.getItem(SESSION_KEY);
    return reduce || seen ? "done" : "playing";
  });
  const videoRef = useRef<HTMLVideoElement>(null);

  // Mark seen + lock scroll while the intro is on screen.
  useEffect(() => {
    if (phase !== "playing") return;
    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      /* private mode — fine, it just replays next load */
    }
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const v = videoRef.current;
    if (v) {
      v.muted = true;
      // The source clip is ~6.5s; play it at ~2x so the full reveal lands in a
      // snappy ~3.3s rather than making every first visit wait.
      v.playbackRate = 2;
      v.play().catch(() => {});
    }
    // Safety net if `ended` never fires (blocked autoplay, decode error).
    const maxT = window.setTimeout(() => setPhase("out"), 5200);
    return () => {
      window.clearTimeout(maxT);
      document.body.style.overflow = prev;
    };
  }, [phase]);

  // After the fade-out transition, remove the overlay entirely.
  useEffect(() => {
    if (phase !== "out") return;
    const t = window.setTimeout(() => setPhase("done"), 700);
    return () => window.clearTimeout(t);
  }, [phase]);

  // Esc to skip.
  useEffect(() => {
    if (phase === "done") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPhase("out");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase]);

  if (phase === "done") return null;

  return (
    <div
      aria-hidden
      onClick={() => setPhase("out")}
      className={cn(
        "fixed inset-0 z-[200] flex items-center justify-center bg-white transition-opacity duration-700 ease-out",
        phase === "out" && "pointer-events-none opacity-0",
      )}
    >
      <video
        ref={videoRef}
        src="/media/logo-intro.mp4"
        muted
        playsInline
        autoPlay
        preload="auto"
        onEnded={() => setPhase("out")}
        className="w-[min(82vw,760px)]"
      />
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setPhase("out");
        }}
        className="absolute bottom-8 right-8 font-display text-[11px] font-semibold uppercase tracking-[0.25em] text-ink/45 transition-colors hover:text-mahoney"
      >
        Skip
      </button>
    </div>
  );
}
