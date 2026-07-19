import { cn } from "@/lib/utils";
import { Link } from "react-router";
import { useSettings } from "@/hooks/useCms";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden>
      <path d="M4 40V24l14-9v25H4Z" fill="#C8102E" />
      <path d="M20 40V11l9-6v35h-9Z" fill="#8E1B22" />
      <path d="M31 40V8l13-7v39H31Z" fill="#C8102E" />
    </svg>
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
      <LogoMark className="h-9 w-9 shrink-0 sm:h-10 sm:w-10" />
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
        <span className="block font-display text-[9px] font-semibold uppercase tracking-[0.42em] text-mahoney sm:text-[10px]">
          Design &amp; Build
        </span>
      </span>
    </Link>
  );
}
