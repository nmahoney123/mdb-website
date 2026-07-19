import { Link } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import { trpc } from "@/providers/trpc";
import { ABtn } from "./ui";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function NewsPage() {
  const { data, isLoading } = trpc.posts.listAll.useQuery();
  const del = trpc.posts.delete.useMutation();
  const qc = useQueryClient();

  if (isLoading) return <Loader2 className="h-6 w-6 animate-spin text-mahoney" />;

  const remove = async (id: number, title: string) => {
    if (!confirm(`Delete "${title}" permanently?`)) return;
    await del.mutateAsync({ id });
    await qc.invalidateQueries();
  };

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="display-2 text-2xl text-ink sm:text-3xl">News &amp; Blog</h1>
          <p className="mt-2 text-sm text-concrete">Publish project news, market insights, and company updates to the site.</p>
        </div>
        <Link to="/admin/news/new"><ABtn><Plus className="h-3.5 w-3.5" /> New Article</ABtn></Link>
      </div>

      <div className="mt-6 border-l-2 border-mahoney bg-bone/70 p-4 text-xs leading-relaxed text-concrete">
        <span className="font-semibold text-ink">Heads up:</span> the site&apos;s main blog
        posts are stored as version-controlled markdown files (in <code>content/blog/</code>)
        and are edited in code, so they don&apos;t appear in this list. Articles you create
        here are stored in the database and show up on <code>/news</code> alongside them.
      </div>

      <div className="mt-6 divide-y divide-fog border border-fog bg-white">
        {(data ?? []).map((p) => (
          <div key={p.id} className="flex items-center gap-4 p-4 hover:bg-bone/60">
            <div className="flex h-14 w-20 shrink-0 items-center justify-center overflow-hidden bg-bone">
              {p.coverImage ? <img src={p.coverImage} alt="" className="h-full w-full object-cover" /> : <span className="text-[9px] uppercase tracking-wider text-concrete/50">No image</span>}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold text-ink">{p.title}</p>
              <p className="mt-1 flex flex-wrap items-center gap-2 text-xs text-concrete">
                <span className="bg-bone px-2 py-0.5 font-display text-[10px] font-bold uppercase tracking-wider">{p.category}</span>
                <span className={cn("px-2 py-0.5 font-display text-[10px] font-bold uppercase tracking-wider", p.status === "published" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800")}>
                  {p.status}
                </span>
                <span>{p.publishedAt ? new Date(p.publishedAt).toLocaleDateString() : new Date(p.createdAt).toLocaleDateString()}</span>
              </p>
            </div>
            <div className="flex shrink-0 gap-1">
              <Link to={`/admin/news/${p.id}`} className="p-2 text-concrete hover:text-ink" aria-label="Edit"><Pencil className="h-4 w-4" /></Link>
              <button onClick={() => remove(p.id, p.title)} className="p-2 text-concrete hover:text-red-600" aria-label="Delete"><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
        ))}
        {(data ?? []).length === 0 && (
          <p className="p-10 text-center text-sm text-concrete">No articles yet — write your first one.</p>
        )}
      </div>
    </div>
  );
}
