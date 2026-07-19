import { Link } from "react-router";
import { Facebook, Linkedin, Youtube, Instagram, ArrowRight, MapPin, Phone, Mail } from "lucide-react";
import Logo from "./Logo";
import { COMPANY, INDUSTRIES, OFFICES } from "@/data/content";
import { useSettings } from "@/hooks/useCms";

export default function Footer() {
  const s = useSettings();
  return (
    <footer className="bg-ink text-white">
      <div className="container-site grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr] lg:py-20">
        {/* Brand */}
        <div>
          <Logo light />
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-white/55">
            A design-build general contractor delivering ground-up Self Storage,
            Hospitality, and Multifamily projects — the precision of a national
            firm, the accountability of a family business.
          </p>
          <p className="mt-6 font-display text-xs font-semibold uppercase tracking-[0.28em] text-mahoney">
            Building since 1985
          </p>
          <p className="mt-4 text-xs leading-relaxed text-white/45">
            <Link to="/locations" className="transition-colors hover:text-white">
              {OFFICES.map((o) => `${o.city}, ${o.state}`).join("  ·  ")}
            </Link>
          </p>
          <div className="mt-6 flex gap-3">
            {[
              { icon: Facebook, label: "Facebook" },
              { icon: Linkedin, label: "LinkedIn" },
              { icon: Youtube, label: "YouTube" },
              { icon: Instagram, label: "Instagram" },
            ].map(({ icon: Icon, label }) => (
              <a
                key={label}
                href={`#${label.toLowerCase()}`}
                aria-label={label}
                className="flex h-10 w-10 items-center justify-center border border-white/15 text-white/60 transition-all hover:border-mahoney hover:bg-mahoney hover:text-white"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Industries */}
        <nav aria-label="Industries">
          <h3 className="font-display text-xs font-bold uppercase tracking-[0.28em] text-white/40">
            Industries
          </h3>
          <ul className="mt-5 space-y-3 text-sm">
            {INDUSTRIES.map((i) => (
              <li key={i.slug}>
                <Link
                  to={`/industries/${i.slug}`}
                  className="text-white/65 transition-colors hover:text-mahoney"
                >
                  {i.name}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/portfolio" className="text-white/65 transition-colors hover:text-mahoney">
                Portfolio
              </Link>
            </li>
          </ul>
        </nav>

        {/* Company */}
        <nav aria-label="Company">
          <h3 className="font-display text-xs font-bold uppercase tracking-[0.28em] text-white/40">
            Company
          </h3>
          <ul className="mt-5 space-y-3 text-sm">
            {[
              { label: "About MDB", to: "/about" },
              { label: "Locations", to: "/locations" },
              { label: "Careers", to: "/careers" },
              { label: "News & Insights", to: "/news" },
              { label: "Subcontractors", to: "/subcontractors" },
              { label: "Contact", to: "/contact" },
            ].map((l) => (
              <li key={l.label}>
                <Link to={l.to} className="text-white/65 transition-colors hover:text-mahoney">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Contact + newsletter */}
        <div>
          <h3 className="font-display text-xs font-bold uppercase tracking-[0.28em] text-white/40">
            Contact
          </h3>
          <ul className="mt-5 space-y-3 text-sm text-white/65">
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-mahoney" />
              {s.address || COMPANY.address}
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="h-4 w-4 shrink-0 text-mahoney" />
              <a href={`tel:${(s.phone || COMPANY.phone).replace(/[^0-9]/g, "")}`} className="hover:text-white">
                {s.phone || COMPANY.phone}
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="h-4 w-4 shrink-0 text-mahoney" />
              <a href={`mailto:${s.email || COMPANY.email}`} className="break-all hover:text-white">
                {s.email || COMPANY.email}
              </a>
            </li>
          </ul>
          <form
            className="mt-7"
            onSubmit={(e) => e.preventDefault()}
            aria-label="Newsletter signup"
          >
            <label htmlFor="newsletter-email" className="field-label !text-white/40">
              Project insights, quarterly
            </label>
            <div className="mt-2 flex">
              <input
                id="newsletter-email"
                type="email"
                required
                placeholder="Work email"
                className="w-full border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/35 focus:border-mahoney focus:outline-none"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="flex w-12 shrink-0 items-center justify-center bg-mahoney text-white transition-colors hover:bg-oxblood"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-site flex flex-col items-center justify-between gap-3 py-6 text-[11px] tracking-wide text-white/35 sm:flex-row">
          <p>© {new Date().getFullYear()} Mahoney Design &amp; Build. All rights reserved.</p>
          {(s.license || COMPANY.license) && <p>{s.license || COMPANY.license}</p>}
          <div className="flex gap-5">
            {/* TODO(owner): add a Privacy Policy page, then link it here */}
            <a href="/sitemap.xml" className="hover:text-white/70">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
