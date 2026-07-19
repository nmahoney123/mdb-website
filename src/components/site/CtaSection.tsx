import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { Reveal } from "./motion";

export default function CtaSection({
  title = "Have a project? Let's build it.",
  sub = "Tell us what you're planning. You'll hear back from a decision-maker within one business day.",
}: {
  title?: string;
  sub?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-ink py-20 text-white sm:py-24">
      <span className="absolute left-0 top-0 h-1 w-full bg-mahoney" aria-hidden />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_85%_50%,rgba(200,16,46,0.15),transparent_55%)]" aria-hidden />
      <div className="container-site relative flex flex-wrap items-center justify-between gap-8">
        <Reveal className="max-w-2xl">
          <h2 className="display-2 text-3xl sm:text-5xl">{title}</h2>
          <p className="mt-4 text-base leading-relaxed text-white/60">{sub}</p>
        </Reveal>
        <Reveal delay={0.15}>
          <Link to="/contact" className="btn-primary">
            Start a Project <ArrowRight className="arrow h-4 w-4" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
