import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router";
import { Menu, X, Phone, ArrowRight, HardHat, ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Logo from "./Logo";
import { NAV_LINKS, COMPANY, type NavItem } from "@/data/content";
import { useSettings, useIndustries } from "@/hooks/useCms";
import { cn } from "@/lib/utils";

export default function Header() {
  const settings = useSettings();
  const industries = useIndustries();
  const PHONE = settings.phone || COMPANY.phone;

  // The "Industries" nav item becomes a dropdown of the live CMS industries.
  const navItems: NavItem[] = NAV_LINKS.map((l) =>
    l.label === "Industries"
      ? {
          label: "Industries",
          to: "/industries",
          children: [
            { label: "All Industries", to: "/industries" },
            ...industries.map((i) => ({ label: i.name, to: `/industries/${i.slug}` })),
          ],
        }
      : l
  );
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* Utility bar */}
      <div
        className={cn(
          "hidden bg-ink text-white/70 transition-all duration-300 md:block",
          scrolled ? "max-h-0 overflow-hidden opacity-0" : "max-h-12 opacity-100"
        )}
      >
        <div className="container-site flex h-9 items-center justify-between text-[11px] font-medium tracking-wide">
          <p className="uppercase tracking-[0.2em] text-white/40">
            General Contracting · Design-Build · Since 1985
          </p>
          <div className="flex items-center gap-6">
            <a
              href={`tel:${PHONE.replace(/[^0-9]/g, "")}`}
              className="flex items-center gap-1.5 transition-colors hover:text-white"
            >
              <Phone className="h-3 w-3" /> {PHONE}
            </a>
            <Link
              to="/subcontractors"
              className="flex items-center gap-1.5 transition-colors hover:text-white"
            >
              <HardHat className="h-3 w-3" /> Subcontractors
            </Link>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div
        className={cn(
          "transition-all duration-300",
          scrolled
            ? "bg-ink/95 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.6)] backdrop-blur"
            : "bg-gradient-to-b from-ink/70 to-transparent"
        )}
      >
        <div className="container-site flex h-[72px] items-center justify-between">
          <Logo light />
          <nav aria-label="Primary" className="hidden items-center gap-8 lg:flex">
            {navItems.map((l) =>
              l.children ? (
                <div key={l.label} className="group relative">
                  <button
                    type="button"
                    aria-haspopup="true"
                    className={cn(
                      "flex items-center gap-1 font-display text-[12px] font-semibold uppercase tracking-[0.18em] transition-colors",
                      l.children.some((c) => c.to === location.pathname)
                        ? "text-white"
                        : "text-white/65 hover:text-white"
                    )}
                  >
                    {l.label}
                    <ChevronDown className="h-3.5 w-3.5 transition-transform duration-200 group-hover:rotate-180" />
                  </button>
                  {/* pt-4 bridges the gap so the menu doesn't close on the way to it */}
                  <div className="invisible absolute left-1/2 top-full z-50 -translate-x-1/2 pt-4 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                    <div className="min-w-[190px] border border-white/10 bg-ink/95 p-2 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.8)] backdrop-blur">
                      {l.children.map((c) => (
                        <NavLink
                          key={c.to}
                          to={c.to}
                          className={({ isActive }) =>
                            cn(
                              "block px-4 py-2.5 font-display text-[12px] font-semibold uppercase tracking-[0.14em] transition-colors",
                              isActive
                                ? "bg-white/5 text-mahoney"
                                : "text-white/70 hover:bg-white/5 hover:text-white"
                            )
                          }
                        >
                          {c.label}
                        </NavLink>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <NavLink
                  key={l.to}
                  to={l.to!}
                  className={({ isActive }) =>
                    cn(
                      "group relative font-display text-[12px] font-semibold uppercase tracking-[0.18em] transition-colors",
                      isActive ? "text-white" : "text-white/65 hover:text-white"
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      {l.label}
                      <span
                        className={cn(
                          "absolute -bottom-2 left-0 h-[2px] bg-mahoney transition-all duration-300",
                          isActive ? "w-full" : "w-0 group-hover:w-full"
                        )}
                      />
                    </>
                  )}
                </NavLink>
              )
            )}
            <Link to="/contact" className="btn-primary !px-6 !py-3">
              Start a Project <ArrowRight className="arrow h-3.5 w-3.5" />
            </Link>
          </nav>
          <button
            className="flex h-11 w-11 items-center justify-center text-white lg:hidden"
            onClick={() => setOpen(!open)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 top-[72px] z-40 bg-ink lg:hidden"
          >
            <nav aria-label="Mobile" className="container-site flex flex-col gap-1 py-8">
              {navItems.map((l, i) => (
                <motion.div
                  key={l.to ?? l.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.05 }}
                >
                  {l.children ? (
                    <>
                      <p className="border-b border-white/10 py-4 font-display text-2xl font-bold uppercase tracking-wide text-white/40">
                        {l.label}
                      </p>
                      {l.children.map((c) => (
                        <NavLink
                          key={c.to}
                          to={c.to}
                          className={({ isActive }) =>
                            cn(
                              "flex items-center justify-between border-b border-white/10 py-3.5 pl-5 font-display text-lg font-semibold uppercase tracking-wide",
                              isActive ? "text-mahoney" : "text-white/85"
                            )
                          }
                        >
                          {c.label}
                          <ArrowRight className="h-5 w-5 text-mahoney" />
                        </NavLink>
                      ))}
                    </>
                  ) : (
                    <NavLink
                      to={l.to!}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center justify-between border-b border-white/10 py-4 font-display text-2xl font-bold uppercase tracking-wide",
                          isActive ? "text-mahoney" : "text-white"
                        )
                      }
                    >
                      {l.label}
                      <ArrowRight className="h-5 w-5 text-mahoney" />
                    </NavLink>
                  )}
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-8 flex flex-col gap-4"
              >
                <Link to="/contact" className="btn-primary justify-center">
                  Start a Project <ArrowRight className="arrow h-4 w-4" />
                </Link>
                <a
                  href={`tel:${PHONE.replace(/[^0-9]/g, "")}`}
                  className="flex items-center justify-center gap-2 text-white/70"
                >
                  <Phone className="h-4 w-4" /> {PHONE}
                </a>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
