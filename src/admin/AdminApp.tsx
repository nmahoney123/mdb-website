import { useEffect, useState } from "react";
import { Routes, Route, NavLink, useNavigate, Link, Navigate } from "react-router";
import { trpc } from "@/providers/trpc";
import { LogoMark } from "@/components/site/Logo";
import {
  LayoutDashboard, Settings, Building2, Newspaper, Images,
  FolderOpen, Inbox, LogOut, ExternalLink, Loader2,
  Home, Info, Factory, MapPin, Briefcase, Quote, Handshake,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Overview from "./Overview";
import SettingsPage from "./SettingsPage";
import ProjectsPage from "./ProjectsPage";
import ProjectEditor from "./ProjectEditor";
import NewsPage from "./NewsPage";
import NewsEditor from "./NewsEditor";
import GalleriesPage from "./GalleriesPage";
import MediaPage from "./MediaPage";
import InquiriesPage from "./InquiriesPage";
import IndustriesPage from "./IndustriesPage";
import IndustryEditor from "./IndustryEditor";
import TestimonialsPage from "./TestimonialsPage";
import TestimonialEditor from "./TestimonialEditor";
import JobsPage from "./JobsPage";
import JobEditor from "./JobEditor";
import PartnersPage from "./PartnersPage";
import PartnerEditor from "./PartnerEditor";
import OfficesPage from "./OfficesPage";
import OfficeEditor from "./OfficeEditor";
import PageContentPage from "./PageContentPage";

type NavItem = { to: string; label: string; icon: LucideIcon; end?: boolean };
type NavGroup = { heading?: string; items: NavItem[] };

/** Nav mirrors the public website so the owner can click into each page/section. */
const NAV_GROUPS: NavGroup[] = [
  { items: [{ to: "/admin", label: "Overview", icon: LayoutDashboard, end: true }] },
  {
    heading: "Site Pages",
    items: [
      { to: "/admin/pages/home", label: "Home", icon: Home },
      { to: "/admin/pages/about", label: "About", icon: Info },
      { to: "/admin/industries", label: "Industries", icon: Factory },
      { to: "/admin/projects", label: "Portfolio", icon: Building2 },
      { to: "/admin/locations", label: "Locations", icon: MapPin },
      { to: "/admin/careers", label: "Careers", icon: Briefcase },
      { to: "/admin/news", label: "News", icon: Newspaper },
    ],
  },
  {
    heading: "Content",
    items: [
      { to: "/admin/testimonials", label: "Testimonials", icon: Quote },
      { to: "/admin/partners", label: "Partners", icon: Handshake },
      { to: "/admin/galleries", label: "Galleries", icon: Images },
      { to: "/admin/media", label: "Media", icon: FolderOpen },
    ],
  },
  {
    heading: "Manage",
    items: [
      { to: "/admin/inquiries", label: "Inquiries", icon: Inbox },
      { to: "/admin/settings", label: "Settings", icon: Settings },
    ],
  },
];

const ALL_ITEMS = NAV_GROUPS.flatMap((g) => g.items);

const linkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    "flex items-center gap-3 px-4 py-2.5 font-display text-[12px] font-semibold uppercase tracking-[0.14em] transition-colors",
    isActive ? "bg-mahoney text-white" : "text-white/60 hover:bg-white/5 hover:text-white"
  );

export default function AdminApp() {
  const { data, isLoading } = trpc.admin.check.useQuery(undefined, { retry: false });
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    if (data && !data.authed) navigate("/admin/login", { replace: true });
  }, [data, navigate]);

  if (isLoading || !data?.authed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bone">
        <Loader2 className="h-6 w-6 animate-spin text-mahoney" />
      </div>
    );
  }

  const logout = async () => {
    setLoggingOut(true);
    await fetch("/api/admin/logout", { method: "POST", credentials: "include" });
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="flex min-h-screen bg-bone">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 flex w-60 flex-col bg-ink text-white max-lg:hidden">
        <div className="flex items-center gap-3 border-b border-white/10 px-6 py-5">
          <LogoMark light className="h-8 w-8" />
          <div>
            <p className="font-display text-sm font-extrabold uppercase tracking-wide">MDB Admin</p>
            <p className="font-display text-[9px] font-semibold uppercase tracking-[0.3em] text-white/40">Content Manager</p>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto p-4">
          {NAV_GROUPS.map((group, gi) => (
            <div key={group.heading ?? gi} className={cn(gi > 0 && "mt-6")}>
              {group.heading && (
                <p className="px-4 pb-2 font-display text-[9px] font-bold uppercase tracking-[0.24em] text-white/30">{group.heading}</p>
              )}
              <div className="space-y-1">
                {group.items.map((n) => (
                  <NavLink key={n.to} to={n.to} end={n.end} className={linkClass}>
                    <n.icon className="h-4 w-4" /> {n.label}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>
        <div className="space-y-1 border-t border-white/10 p-4">
          <Link to="/" className="flex items-center gap-3 px-4 py-2.5 text-[12px] font-medium text-white/50 hover:text-white">
            <ExternalLink className="h-4 w-4" /> View Website
          </Link>
          <button
            onClick={logout}
            disabled={loggingOut}
            className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-[12px] font-medium text-white/50 hover:text-mahoney"
          >
            <LogOut className="h-4 w-4" /> Log Out
          </button>
        </div>
      </aside>

      {/* Mobile topbar */}
      <div className="fixed inset-x-0 top-0 z-40 flex items-center justify-between bg-ink px-4 py-3 lg:hidden">
        <div className="flex items-center gap-2">
          <LogoMark light className="h-7 w-7" />
          <span className="font-display text-sm font-extrabold uppercase text-white">MDB Admin</span>
        </div>
        <div className="flex gap-1 overflow-x-auto">
          {ALL_ITEMS.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              className={({ isActive }) =>
                cn("shrink-0 p-2", isActive ? "text-mahoney" : "text-white/60")
              }
              aria-label={n.label}
            >
              <n.icon className="h-5 w-5" />
            </NavLink>
          ))}
          <button onClick={logout} className="shrink-0 p-2 text-white/60" aria-label="Log out">
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 p-6 pt-20 sm:p-8 sm:pt-20 lg:ml-60 lg:p-10">
        <Routes>
          <Route index element={<Overview />} />
          <Route path="pages" element={<PageContentPage />} />
          <Route path="pages/:page" element={<PageContentPage />} />
          <Route path="industries" element={<IndustriesPage />} />
          <Route path="industries/:id" element={<IndustryEditor />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="projects/:id" element={<ProjectEditor />} />
          <Route path="locations" element={<OfficesPage />} />
          <Route path="locations/:id" element={<OfficeEditor />} />
          <Route path="careers" element={<JobsPage />} />
          <Route path="careers/:id" element={<JobEditor />} />
          <Route path="news" element={<NewsPage />} />
          <Route path="news/:id" element={<NewsEditor />} />
          <Route path="testimonials" element={<TestimonialsPage />} />
          <Route path="testimonials/:id" element={<TestimonialEditor />} />
          <Route path="partners" element={<PartnersPage />} />
          <Route path="partners/:id" element={<PartnerEditor />} />
          <Route path="galleries" element={<GalleriesPage />} />
          <Route path="media" element={<MediaPage />} />
          <Route path="inquiries" element={<InquiriesPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </main>
    </div>
  );
}
