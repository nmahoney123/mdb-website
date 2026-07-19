import { Quote } from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "@/components/site/motion";
import { useTestimonials } from "@/hooks/useCms";

export default function Testimonials() {
  const testimonials = useTestimonials();
  // Don't render the section until real, approved client quotes exist (managed in
  // admin → Testimonials). Avoids shipping fabricated endorsements.
  if (!testimonials.length) return null;
  return (
    <section className="bg-fog/60 py-24 sm:py-32">
      <div className="container-site">
        <Reveal className="max-w-2xl">
          <p className="eyebrow">Client Voices</p>
          <div className="rule-red mt-4" />
          <h2 className="display-2 mt-6 text-3xl text-ink sm:text-5xl">
            Owners who build with us, build with us again.
          </h2>
        </Reveal>
        <Stagger className="mt-14 grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <StaggerItem key={t.id ?? t.name}>
              <figure className="flex h-full flex-col border border-fog bg-white p-8 shadow-[0_20px_50px_-30px_rgba(20,20,20,0.25)] sm:p-9">
                <Quote className="h-7 w-7 text-mahoney" strokeWidth={1.5} />
                <blockquote className="mt-5 flex-1 text-[15px] leading-relaxed text-ink/85">
                  "{t.quote}"
                </blockquote>
                <figcaption className="mt-7 border-t border-fog pt-5">
                  <p className="font-display text-sm font-bold uppercase tracking-[0.08em] text-ink">
                    {t.name}
                  </p>
                  <p className="mt-1 text-xs text-concrete">{t.role}</p>
                  <p className="mt-2 font-display text-[10px] font-semibold uppercase tracking-[0.2em] text-mahoney">
                    {t.project}
                  </p>
                </figcaption>
              </figure>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
