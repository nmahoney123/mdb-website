import { useEffect, useState } from "react";
import { Routes, Route, NavLink, useNavigate, Link, Navigate } from "react-router";
import { trpc } from "@/providers/trpc";
import { LogoMark } from "@/components/site/Logo";
import {
  LayoutDashboard, Settings, Building2, Newspaper, Images,
  FolderOpen, Inbox, LogOut, ExternalLink, Loader2,
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

const NAV = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/admin/inquiries", label: "Inquiries", icon: Inbox },
  { to: "/admin/projects", label: "Projects", icon: Building2 },
  { to: "/admin/news", label: "News & Blog", icon: Newspaper },
  { to: "/admin/galleries", label: "Galleries", icon: Images },
  { to: "/admin/media", label: "Media Library", icon: FolderOpen },
  { to: "/admin/settings", label: "Site Settings", icon: Settings },
];

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
          <LogoMark className="h-8 w-8" />
          <div>
            <p className="font-display text-sm font-extrabold uppercase tracking-wide">MDB Admin</p>
            <p className="font-display text-[9px] font-semibold uppercase tracking-[0.3em] text-white/40">Content Manager</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-4 py-3 font-display text-[12px] font-semibold uppercase tracking-[0.14em] transition-colors",
                  isActive ? "bg-mahoney text-white" : "text-white/60 hover:bg-white/5 hover:text-white"
                )
              }
            >
              <n.icon className="h-4 w-4" /> {n.label}
            </NavLink>
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
          <LogoMark className="h-7 w-7" />
          <span className="font-display text-sm font-extrabold uppercase text-white">MDB Admin</span>
        </div>
        <div className="flex gap-1 overflow-x-auto">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              className={({ isActive }) =>
                cn("p-2", isActive ? "text-mahoney" : "text-white/60")
              }
              aria-label={n.label}
            >
              <n.icon className="h-5 w-5" />
            </NavLink>
          ))}
          <button onClick={logout} className="p-2 text-white/60" aria-label="Log out">
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 p-6 pt-20 sm:p-8 sm:pt-20 lg:ml-60 lg:p-10">
        <Routes>
          <Route index element={<Overview />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="projects/:id" element={<ProjectEditor />} />
          <Route path="news" element={<NewsPage />} />
          <Route path="news/:id" element={<NewsEditor />} />
          <Route path="galleries" element={<GalleriesPage />} />
          <Route path="media" element={<MediaPage />} />
          <Route path="inquiries" element={<InquiriesPage />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </main>
    </div>
  );
}
