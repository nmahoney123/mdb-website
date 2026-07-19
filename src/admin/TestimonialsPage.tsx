import { Link } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import { trpc } from "@/providers/trpc";
import { ABtn, ALoading, AError, PublishToggle, ReorderButtons, reorderPayload } from "./ui";
import { Plus, Pencil, Trash2 } from "lucide-react";

export default function TestimonialsPage() {
  const { data, isLoading, isError } = trpc.testimonials.listAll.useQuery();
  const upsert = trpc.testimonials.upsert.useMutation();
  const reorder = trpc.testimonials.reorder.useMutation();
  const del = trpc.testimonials.delete.useMutation();
  const qc = useQueryClient();

  if (isLoading) return <ALoading />;
  if (isError) return <AError />;

  const rows = data ?? [];

  const togglePublished = async (t: (typeof rows)[number]) => {
    await upsert.mutateAsync({ ...t, published: !t.published });
    await qc.invalidateQueries();
  };
  const move = async (idx: number, dir: -1 | 1) => {
    const payload = reorderPayload(rows, idx, dir);
    if (!payload) return;
    await reorder.mutateAsync(payload);
    await qc.invalidateQueries();
  };
  const remove = async (id: number, name: string) => {
    if (!confirm(`Delete the testimonial from "${name}" permanently?`)) return;
    await del.mutateAsync({ id });
    await qc.invalidateQueries();
  };

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="display-2 text-2xl text-ink sm:text-3xl">Testimonials</h1>
          <p className="mt-2 text-sm text-concrete">Client quotes shown across the site. Reorder with the arrows.</p>
        </div>
        <Link to="/admin/testimonials/new"><ABtn><Plus className="h-3.5 w-3.5" /> New Testimonial</ABtn></Link>
      </div>

      <div className="mt-8 divide-y divide-fog border border-fog bg-white">
        {rows.map((t, idx) => (
          <div key={t.id} className="flex items-start gap-4 p-4 hover:bg-bone/60">
            <ReorderButtons onUp={() => move(idx, -1)} onDown={() => move(idx, 1)} isFirst={idx === 0} isLast={idx === rows.length - 1} />
            <div className="min-w-0 flex-1">
              <p className="text-sm italic text-ink">“{t.quote}”</p>
              <p className="mt-2 text-xs text-concrete">
                <span className="font-semibold text-ink">{t.name}</span> · {t.role} · {t.project}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <PublishToggle published={t.published} onToggle={() => togglePublished(t)} />
              <Link to={`/admin/testimonials/${t.id}`} className="p-2 text-concrete hover:text-ink" aria-label="Edit"><Pencil className="h-4 w-4" /></Link>
              <button onClick={() => remove(t.id, t.name)} className="p-2 text-concrete hover:text-red-600" aria-label="Delete"><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
        ))}
        {rows.length === 0 && <p className="p-10 text-center text-sm text-concrete">No testimonials yet — add your first client quote.</p>}
      </div>
    </div>
  );
}
