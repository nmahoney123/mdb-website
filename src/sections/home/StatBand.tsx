import { CountUp, Stagger, StaggerItem } from "@/components/site/motion";
import { useSettings } from "@/hooks/useCms";

function parseStat(raw: string): { value: number; suffix: string } {
  const m = raw.match(/^(\d+(?:\.\d+)?)(.*)$/);
  return m ? { value: parseFloat(m[1]), suffix: m[2] } : { value: 0, suffix: raw };
}

export default function StatBand() {
  const settings = useSettings();
  const STATS = [
    { ...parseStat(settings.statYears), label: "Years Building" },
    { ...parseStat(settings.statProjects), label: "Projects Delivered" },
    { ...parseStat(settings.statSqFt), label: "Sq Ft Constructed" },
    { ...parseStat(settings.statRepeat), label: "Repeat & Referral Clients" },
  ];
  return (
    <section id="stats" className="border-y border-white/10 bg-ink py-16 sm:py-20">
      <div className="container-site">
        <Stagger className="grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-4">
          {STATS.map((s) => (
            <StaggerItem key={s.label} className="relative pl-6">
              <span className="absolute left-0 top-1 h-full w-[3px] bg-mahoney" aria-hidden />
              <p className="font-display text-5xl font-extrabold tracking-tight text-white sm:text-6xl">
                <CountUp value={s.value} suffix={s.suffix} />
              </p>
              <p className="mt-3 font-display text-[11px] font-semibold uppercase tracking-[0.24em] text-white/50">
                {s.label}
              </p>
            </StaggerItem>
          ))}
        </Stagger>
        <p className="mt-12 text-[11px] tracking-wide text-white/30">
          * Figures illustrative — confirm final numbers before publish.
        </p>
      </div>
    </section>
  );
}
