import { cn } from "@/lib/utils";
import { Link } from "react-router";
import { useSettings } from "@/hooks/useCms";

/** The building mark. Use `light` on dark backgrounds (renders the white version). */
export function LogoMark({ className, light = false }: { className?: string; light?: boolean }) {
  return (
    <img
      src={light ? "/media/logo-mark-white.png" : "/media/logo-mark.png"}
      alt=""
      aria-hidden
      className={cn("object-contain", className)}
    />
  );
}

export default function Logo({
  light = false,
  className,
}: {
  light?: boolean;
  className?: string;
}) {
  const settings = useSettings();
  return (
    <Link
      to="/"
      aria-label="Mahoney Design & Build — home"
      className={cn("flex items-center gap-3", className)}
    >
      {settings.logoUrl ? (
        <img src={settings.logoUrl} alt="" className="h-9 max-w-[180px] shrink-0 object-contain sm:h-10" />
      ) : (
      <LogoMark light={light} className="h-9 w-9 shrink-0 sm:h-10 sm:w-10" />
      )}
      <span className="leading-none">
        <span
          className={cn(
            "block font-display text-lg font-extrabold uppercase tracking-[0.06em] sm:text-xl",
            light ? "text-white" : "text-ink"
          )}
        >
          Mahoney
        </span>
        <span
          className={cn(
            "block font-display text-[9px] font-semibold uppercase tracking-[0.42em] sm:text-[10px]",
            light ? "text-white/55" : "text-mahoney"
          )}
        >
          Design &amp; Build
        </span>
      </span>
    </Link>
  );
}
