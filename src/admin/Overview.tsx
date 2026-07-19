import { Link } from "react-router";
import { trpc } from "@/providers/trpc";
import { ACard } from "./ui";
import { Inbox, Building2, Newspaper, Images, ArrowRight } from "lucide-react";

export default function Overview() {
  const { data: counts } = trpc.inquiries.counts.useQuery();
  const { data: projects } = trpc.projects.listAll.useQuery();
  const { data: posts } = trpc.posts.listAll.useQuery();
  const { data: galleryKeys } = trpc.galleries.keys.useQuery();
  const { data: recent } = trpc.inquiries.list.useQuery({ unreadOnly: false });

  const stats = [
    { label: "Unread Inquiries", value: counts?.unread ?? "—", icon: Inbox, to: "/admin/inquiries", accent: true },
    { label: "Projects", value: projects?.length ?? "—", icon: Building2, to: "/admin/projects" },
    { label: "News Articles", value: posts?.length ?? "—", icon: Newspaper, to: "/admin/news" },
    { label: "Galleries", value: galleryKeys?.length ?? "—", icon: Images, to: "/admin/galleries" },
  ];

  return (
    <div className="max-w-5xl">
      <h1 className="display-2 text-2xl text-ink sm:text-3xl">Dashboard</h1>
      <p className="mt-2 text-sm text-concrete">
        Manage everything on mahoneydesignandbuild.com from here — content, projects, articles, images, and incoming inquiries.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} to={s.to} className="group">
            <ACard className="flex items-center justify-between transition-all group-hover:border-mahoney/50 group-hover:shadow-[0_16px_40px_-28px_rgba(200,16,46,0.4)]">
              <div>
                <p className={`font-display text-3xl font-extrabold ${s.accent ? "text-mahoney" : "text-ink"}`}>{s.value}</p>
                <p className="mt-1 font-display text-[10px] font-semibold uppercase tracking-[0.2em] text-concrete">{s.label}</p>
              </div>
              <s.icon className="h-6 w-6 text-concrete/40 transition-colors group-hover:text-mahoney" />
            </ACard>
          </Link>
        ))}
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <ACard>
          <div className="flex items-center justify-between">
            <h2 className="font-display text-sm font-bold uppercase tracking-[0.18em] text-ink">Latest Inquiries</h2>
            <Link to="/admin/inquiries" className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-mahoney hover:underline">
              View All <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <ul className="mt-4 divide-y divide-fog">
            {(recent ?? []).slice(0, 5).map((inq) => (
              <li key={inq.id} className="flex items-center justify-between gap-4 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-ink">
                    {!inq.read && <span className="mr-2 inline-block h-2 w-2 rounded-full bg-mahoney" />}
                    {inq.name} <span className="font-normal text-concrete">· {inq.type}</span>
                  </p>
                  <p className="truncate text-xs text-concrete">{inq.message}</p>
                </div>
                <p className="shrink-0 text-[11px] text-concrete/60">
                  {new Date(inq.createdAt).toLocaleDateString()}
                </p>
              </li>
            ))}
            {(recent ?? []).length === 0 && (
              <li className="py-6 text-center text-sm text-concrete">No inquiries yet. Forms on the site feed this inbox.</li>
            )}
          </ul>
        </ACard>

        <ACard>
          <h2 className="font-display text-sm font-bold uppercase tracking-[0.18em] text-ink">Quick Actions</h2>
          <div className="mt-4 grid gap-3">
            {[
              { to: "/admin/news/new", label: "Publish a news article", desc: "Write and publish a blog post or press item" },
              { to: "/admin/projects/new", label: "Add a project", desc: "Showcase new work in the portfolio" },
              { to: "/admin/galleries", label: "Update a gallery", desc: "Add photos to self-storage, homes, and more" },
              { to: "/admin/settings", label: "Change logo / hero video", desc: "Brand assets, homepage video, company info" },
            ].map((a) => (
              <Link
                key={a.to + a.label}
                to={a.to}
                className="group flex items-center justify-between border border-fog p-4 transition-all hover:border-mahoney/40 hover:bg-mahoney/[0.03]"
              >
                <div>
                  <p className="font-display text-[13px] font-bold uppercase tracking-wide text-ink group-hover:text-mahoney">{a.label}</p>
                  <p className="mt-0.5 text-xs text-concrete">{a.desc}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-concrete/40 transition-transform group-hover:translate-x-1 group-hover:text-mahoney" />
              </Link>
            ))}
          </div>
        </ACard>
      </div>
    </div>
  );
}
