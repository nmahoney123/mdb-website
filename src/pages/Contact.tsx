import { Link } from "react-router";
import { Phone, Mail, MapPin, Clock, ArrowRight, HardHat, FileText, Building2 } from "lucide-react";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import PageHero from "@/components/site/PageHero";
import LeadForm from "@/components/site/LeadForm";
import { Reveal, Stagger, StaggerItem } from "@/components/site/motion";
import { COMPANY } from "@/data/content";
import { useSettings } from "@/hooks/useCms";

const PATHS = [
  {
    icon: Building2,
    title: "New Projects",
    body: "Storage, hotel, multifamily, or a select custom home — start the conversation here.",
    action: "Use the form below",
    href: "#lead-form",
  },
  {
    icon: HardHat,
    title: "Subcontractor Prequalification",
    body: "Trade partners: get on our bid list. Safety record and references required.",
    action: "Prequalify your firm",
    href: "/subcontractors",
  },
  {
    icon: FileText,
    title: "Bid Inquiries",
    body: "Requesting drawings, specs, or a bid package for a current opportunity? Reach our estimating team directly.",
    action: "Email our estimating team",
    href: "mailto:info@mahoneydesignandbuild.com?subject=Bid%20Inquiry",
  },
];

export default function Contact() {
  const s = useSettings();
  return (
    <>
      <Header />
      <main>
        <PageHero
          eyebrow="Contact"
          title="Let's build it."
          sub="New projects, subcontractor prequalification, or bid inquiries — three clear paths, one team that answers."
          shot="MDB office exterior in Oneida, NY — signage, flag, and project trailers; or team member answering the phone at a plan table"
        />

        {/* Three paths */}
        <section className="bg-bone py-16 sm:py-20">
          <div className="container-site">
            <Stagger className="grid gap-px border border-fog bg-fog md:grid-cols-3">
              {PATHS.map((p) => (
                <StaggerItem key={p.title}>
                  <div className="flex h-full flex-col bg-white p-8">
                    <p.icon className="h-7 w-7 text-mahoney" strokeWidth={1.5} />
                    <h2 className="mt-5 font-display text-base font-bold uppercase tracking-[0.08em] text-ink">
                      {p.title}
                    </h2>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-concrete">{p.body}</p>
                    {p.href.startsWith("/") ? (
                      <Link
                        to={p.href}
                        className="group mt-6 inline-flex items-center gap-2 font-display text-[11px] font-bold uppercase tracking-[0.2em] text-ink transition-colors hover:text-mahoney"
                      >
                        {p.action}
                        <ArrowRight className="h-3.5 w-3.5 text-mahoney transition-transform group-hover:translate-x-1.5" />
                      </Link>
                    ) : (
                      <a
                        href={p.href}
                        className="group mt-6 inline-flex items-center gap-2 font-display text-[11px] font-bold uppercase tracking-[0.2em] text-ink transition-colors hover:text-mahoney"
                      >
                        {p.action}
                        <ArrowRight className="h-3.5 w-3.5 text-mahoney transition-transform group-hover:translate-x-1.5" />
                      </a>
                    )}
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>

        {/* Form + details */}
        <section id="lead-form" className="border-t border-fog bg-white py-20 sm:py-28">
          <div className="container-site grid gap-16 lg:grid-cols-[1.15fr_1fr] lg:gap-20">
            <Reveal>
              <p className="eyebrow">Start a Project</p>
              <div className="rule-red mt-4" />
              <h2 className="display-2 mt-6 text-3xl text-ink sm:text-4xl">
                Tell us what you're planning.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-concrete">
                You'll hear back from a decision-maker within one business day.
              </p>
              <div className="mt-10">
                <LeadForm />
              </div>
            </Reveal>

            <Reveal delay={0.15}>
              <div className="space-y-8">
                <div className="border border-fog bg-bone p-8">
                  <h3 className="font-display text-sm font-bold uppercase tracking-[0.22em] text-ink">
                    Office
                  </h3>
                  <ul className="mt-6 space-y-5 text-sm">
                    <li className="flex items-start gap-3">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-mahoney" />
                      <span className="text-ink/80">{s.address || COMPANY.address}</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Phone className="h-4 w-4 shrink-0 text-mahoney" />
                      <a href={`tel:${(s.phone || COMPANY.phone).replace(/[^0-9]/g, "")}`} className="text-ink/80 hover:text-mahoney">
                        {s.phone || COMPANY.phone}
                      </a>
                    </li>
                    <li className="flex items-center gap-3">
                      <FileText className="h-4 w-4 shrink-0 text-mahoney" />
                      <span className="text-ink/80">Fax: {s.fax || COMPANY.fax}</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Mail className="h-4 w-4 shrink-0 text-mahoney" />
                      <a href={`mailto:${s.email || COMPANY.email}`} className="break-all text-ink/80 hover:text-mahoney">
                        {s.email || COMPANY.email}
                      </a>
                    </li>
                    <li className="flex items-start gap-3">
                      <Clock className="mt-0.5 h-4 w-4 shrink-0 text-mahoney" />
                      <span className="text-ink/80">
                        Mon–Fri, 7:00 AM – 5:00 PM ET
                        <span className="block text-xs text-concrete">
                          Field crews mobilize earlier — supers reachable on site lines.
                        </span>
                      </span>
                    </li>
                  </ul>
                </div>
                <div className="relative overflow-hidden border border-fog">
                  {/* [MAP SLOT] Google Map embed centered on 559 Fitch Street, Oneida, NY 13421 */}
                  <div className="slot-hatch-light absolute inset-0 flex flex-col items-center justify-center bg-fog text-center">
                    <MapPin className="h-5 w-5 text-mahoney" />
                    <p className="mt-2 font-display text-[10px] font-bold uppercase tracking-[0.25em] text-ink/50">
                      Map Slot — Google Maps embed
                    </p>
                    <p className="mt-1 text-xs text-concrete">559 Fitch Street, Oneida, NY 13421</p>
                  </div>
                  <iframe
                    title="Map — Mahoney Design & Build, 559 Fitch Street, Oneida, NY 13421"
                    src="https://www.google.com/maps?q=559+Fitch+Street,+Oneida,+NY+13421&output=embed"
                    className="relative h-72 w-full grayscale-[35%]"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
