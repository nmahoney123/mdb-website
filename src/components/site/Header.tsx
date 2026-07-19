import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router";
import { Menu, X, Phone, ArrowRight, Lock, HardHat } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Logo from "./Logo";
import { NAV_LINKS, COMPANY } from "@/data/content";
import { useSettings } from "@/hooks/useCms";
import { cn } from "@/lib/utils";

export default function Header() {
  const settings = useSettings();
  const PHONE = settings.phone || COMPANY.phone;
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
            <a href="#client-portal" className="flex items-center gap-1.5 transition-colors hover:text-white">
              <Lock className="h-3 w-3" /> Client Portal
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
            {NAV_LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
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
            ))}
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
              {NAV_LINKS.map((l, i) => (
                <motion.div
                  key={l.to}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.05 }}
                >
                  <NavLink
                    to={l.to}
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
