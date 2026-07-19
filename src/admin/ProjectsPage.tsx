import { Link } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import { trpc } from "@/providers/trpc";
import { ABtn } from "./ui";
import { Plus, Pencil, Trash2, Star, Eye, EyeOff, Loader2, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ProjectsPage() {
  const { data, isLoading } = trpc.projects.listAll.useQuery();
  const del = trpc.projects.delete.useMutation();
  const upsert = trpc.projects.upsert.useMutation();
  const qc = useQueryClient();

  if (isLoading) return <Loader2 className="h-6 w-6 animate-spin text-mahoney" />;

  const togglePublished = async (p: NonNullable<typeof data>[number]) => {
    await upsert.mutateAsync({ ...p, published: !p.published });
    await qc.invalidateQueries();
  };
  const toggleFeatured = async (p: NonNullable<typeof data>[number]) => {
    await upsert.mutateAsync({ ...p, featured: !p.featured });
    await qc.invalidateQueries();
  };
  const remove = async (id: number, name: string) => {
    if (!confirm(`Delete "${name}" permanently?`)) return;
    await del.mutateAsync({ id });
    await qc.invalidateQueries();
  };

  return (
    <div className="max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="display-2 text-2xl text-ink sm:text-3xl">Projects</h1>
          <p className="mt-2 text-sm text-concrete">Portfolio projects shown across the site. Featured projects appear on the homepage.</p>
        </div>
        <Link to="/admin/projects/new"><ABtn><Plus className="h-3.5 w-3.5" /> New Project</ABtn></Link>
      </div>

      <div className="mt-8 overflow-x-auto border border-fog bg-white">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead>
            <tr className="border-b border-fog bg-bone">
              <th className="px-4 py-3 font-display text-[10px] font-bold uppercase tracking-[0.18em] text-concrete">Project</th>
              <th className="px-4 py-3 font-display text-[10px] font-bold uppercase tracking-[0.18em] text-concrete">Industry</th>
              <th className="px-4 py-3 font-display text-[10px] font-bold uppercase tracking-[0.18em] text-concrete">Location</th>
              <th className="px-4 py-3 font-display text-[10px] font-bold uppercase tracking-[0.18em] text-concrete">Year</th>
              <th className="px-4 py-3 text-center font-display text-[10px] font-bold uppercase tracking-[0.18em] text-concrete">Featured</th>
              <th className="px-4 py-3 text-center font-display text-[10px] font-bold uppercase tracking-[0.18em] text-concrete">Live</th>
              <th className="px-4 py-3 text-right font-display text-[10px] font-bold uppercase tracking-[0.18em] text-concrete">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-fog">
            {(data ?? []).map((p) => (
              <tr key={p.id} className="hover:bg-bone/60">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-16 shrink-0 items-center justify-center overflow-hidden bg-bone">
                      {p.cardImage ? <img src={p.cardImage} alt="" className="h-full w-full object-cover" /> : <ImageIcon className="h-4 w-4 text-concrete/40" />}
                    </div>
                    <span className="font-semibold text-ink">{p.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-concrete">{p.industry}</td>
                <td className="px-4 py-3 text-concrete">{p.location}</td>
                <td className="px-4 py-3 text-concrete">{p.year}</td>
                <td className="px-4 py-3 text-center">
                  <button onClick={() => toggleFeatured(p)} aria-label="Toggle featured" className={cn("p-1.5", p.featured ? "text-mahoney" : "text-concrete/30 hover:text-concrete")}>
                    <Star className="h-4 w-4" fill={p.featured ? "currentColor" : "none"} />
                  </button>
                </td>
                <td className="px-4 py-3 text-center">
                  <button onClick={() => togglePublished(p)} aria-label="Toggle published" className={cn("p-1.5", p.published ? "text-green-600" : "text-concrete/30 hover:text-concrete")}>
                    {p.published ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    <Link to={`/admin/projects/${p.id}`} className="p-1.5 text-concrete hover:text-ink" aria-label="Edit">
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <button onClick={() => remove(p.id, p.name)} className="p-1.5 text-concrete hover:text-red-600" aria-label="Delete">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
