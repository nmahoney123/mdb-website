import { Camera } from "lucide-react";
import { cn } from "@/lib/utils";

type ImageSlotProps = {
  /** Exact description of the photograph that belongs in this slot */
  shot: string;
  dark?: boolean;
  className?: string;
  ratio?: string;
  label?: string;
};

/**
 * Clearly-labeled placeholder for photography / video.
 * Real assets drop straight in — replace this component's output with an <img>/<video>.
 */
export default function ImageSlot({ shot, dark = true, className, ratio, label }: ImageSlotProps) {
  return (
    <div
      role="img"
      aria-label={`Placeholder image: ${shot}`}
      className={cn(
        "relative flex h-full w-full items-center justify-center overflow-hidden",
        dark ? "bg-charcoal slot-hatch" : "bg-fog slot-hatch-light",
        className
      )}
      style={ratio ? { aspectRatio: ratio } : undefined}
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-0",
          dark
            ? "bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(20,20,20,0.5)_100%)]"
            : "bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(107,107,112,0.15)_100%)]"
        )}
      />
      <div className="relative z-10 max-w-[80%] text-center">
        <div
          className={cn(
            "mx-auto mb-3 flex h-10 w-10 items-center justify-center border",
            dark ? "border-white/25 text-white/60" : "border-ink/25 text-ink/50"
          )}
        >
          <Camera className="h-4 w-4" strokeWidth={1.5} />
        </div>
        <p
          className={cn(
            "font-display text-[10px] font-bold uppercase tracking-[0.25em]",
            dark ? "text-mahoney" : "text-oxblood"
          )}
        >
          {label ?? "Image Slot"}
        </p>
        <p
          className={cn(
            "mt-2 font-body text-xs leading-relaxed sm:text-[13px]",
            dark ? "text-white/55" : "text-concrete"
          )}
        >
          {shot}
        </p>
      </div>
    </div>
  );
}
