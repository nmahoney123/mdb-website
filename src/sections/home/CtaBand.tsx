import { Link } from "react-router";
import { Phone, Mail, MapPin, ArrowRight } from "lucide-react";
import LeadForm from "@/components/site/LeadForm";
import { Reveal } from "@/components/site/motion";
import { COMPANY } from "@/data/content";
import { useSettings } from "@/hooks/useCms";

export default function CtaBand() {
  const s = useSettings();
  const PHONE = s.phone || COMPANY.phone;
  const EMAIL = s.email || COMPANY.email;
  const ADDRESS = s.address || COMPANY.address;
  return (
    <section className="relative overflow-hidden bg-ink py-24 text-white sm:py-32">
      <span className="absolute left-0 top-0 h-1 w-full bg-mahoney" aria-hidden />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,rgba(200,16,46,0.14),transparent_55%)]" aria-hidden />
      <div className="container-site relative grid gap-16 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
        <div>
          <Reveal>
            <p className="eyebrow">Start a Project</p>
            <div className="rule-red mt-4" />
            <h2 className="display-2 mt-6 text-4xl sm:text-6xl">
              Have a project? Let's build it.
            </h2>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-white/60">
              Tell us what you're planning — a storage facility, a flagged
              hotel, a residential community. You'll hear back from a decision-
              maker, not a call center, within one business day.
            </p>
          </Reveal>

          <Reveal delay={0.15} className="mt-10 space-y-5">
            <a
              href={`tel:${PHONE.replace(/[^0-9]/g, "")}`}
              className="group flex items-center gap-4"
            >
              <span className="flex h-12 w-12 items-center justify-center border border-white/15 transition-colors group-hover:border-mahoney group-hover:bg-mahoney">
                <Phone className="h-5 w-5" />
              </span>
              <span>
                <span className="block font-display text-[10px] font-semibold uppercase tracking-[0.24em] text-white/45">
                  Direct Line
                </span>
                <span className="text-lg font-medium">{PHONE}</span>
              </span>
            </a>
            <a href={`mailto:${EMAIL}`} className="group flex items-center gap-4">
              <span className="flex h-12 w-12 items-center justify-center border border-white/15 transition-colors group-hover:border-mahoney group-hover:bg-mahoney">
                <Mail className="h-5 w-5" />
              </span>
              <span>
                <span className="block font-display text-[10px] font-semibold uppercase tracking-[0.24em] text-white/45">
                  Email
                </span>
                <span className="break-all text-lg font-medium">{EMAIL}</span>
              </span>
            </a>
            <div className="flex items-center gap-4">
              <span className="flex h-12 w-12 items-center justify-center border border-white/15">
                <MapPin className="h-5 w-5" />
              </span>
              <span>
                <span className="block font-display text-[10px] font-semibold uppercase tracking-[0.24em] text-white/45">
                  Headquarters
                </span>
                <span className="text-lg font-medium">{ADDRESS}</span>
              </span>
            </div>
          </Reveal>

          <Reveal delay={0.25} className="relative mt-10 overflow-hidden border border-white/15">
            {/* [MAP SLOT] Google Map embed centered on 559 Fitch Street, Oneida, NY 13421 */}
            <div className="slot-hatch absolute inset-0 flex flex-col items-center justify-center bg-charcoal text-center">
              <MapPin className="h-5 w-5 text-mahoney" />
              <p className="mt-2 font-display text-[10px] font-bold uppercase tracking-[0.25em] text-white/50">
                Map Slot — Google Maps embed
              </p>
              <p className="mt-1 text-xs text-white/35">559 Fitch Street, Oneida, NY 13421</p>
            </div>
            <iframe
              title="Map — Mahoney Design & Build, 559 Fitch Street, Oneida, NY 13421"
              src="https://www.google.com/maps?q=559+Fitch+Street,+Oneida,+NY+13421&output=embed"
              className="relative h-56 w-full grayscale-[35%]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </Reveal>

          <Reveal delay={0.3} className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
            <Link
              to="/subcontractors"
              className="group inline-flex items-center gap-2 font-display text-[11px] font-bold uppercase tracking-[0.2em] text-white/70 transition-colors hover:text-white"
            >
              Subcontractor Prequalification
              <ArrowRight className="h-3.5 w-3.5 text-mahoney transition-transform group-hover:translate-x-1.5" />
            </Link>
            <Link
              to="/contact"
              className="group inline-flex items-center gap-2 font-display text-[11px] font-bold uppercase tracking-[0.2em] text-white/70 transition-colors hover:text-white"
            >
              Bid Inquiries
              <ArrowRight className="h-3.5 w-3.5 text-mahoney transition-transform group-hover:translate-x-1.5" />
            </Link>
          </Reveal>
        </div>

        <Reveal delay={0.2}>
          <div className="border border-white/10 bg-white/[0.04] p-7 backdrop-blur-sm sm:p-10">
            <LeadForm dark />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
