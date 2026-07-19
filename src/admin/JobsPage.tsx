import { Link } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import { trpc } from "@/providers/trpc";
import { ABtn, ALoading, AError, PublishToggle, ReorderButtons, reorderPayload } from "./ui";
import { Plus, Pencil, Trash2 } from "lucide-react";

export default function JobsPage() {
  const { data, isLoading, isError } = trpc.jobs.listAll.useQuery();
  const upsert = trpc.jobs.upsert.useMutation();
  const reorder = trpc.jobs.reorder.useMutation();
  const del = trpc.jobs.delete.useMutation();
  const qc = useQueryClient();

  if (isLoading) return <ALoading />;
  if (isError) return <AError />;

  const rows = data ?? [];

  const togglePublished = async (j: (typeof rows)[number]) => {
    await upsert.mutateAsync({ ...j, published: !j.published });
    await qc.invalidateQueries();
  };
  const move = async (idx: number, dir: -1 | 1) => {
    const payload = reorderPayload(rows, idx, dir);
    if (!payload) return;
    await reorder.mutateAsync(payload);
    await qc.invalidateQueries();
  };
  const remove = async (id: number, title: string) => {
    if (!confirm(`Delete "${title}" permanently?`)) return;
    await del.mutateAsync({ id });
    await qc.invalidateQueries();
  };

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="display-2 text-2xl text-ink sm:text-3xl">Careers</h1>
          <p className="mt-2 text-sm text-concrete">Open positions shown on the Careers page. Reorder with the arrows.</p>
        </div>
        <Link to="/admin/careers/new"><ABtn><Plus className="h-3.5 w-3.5" /> New Opening</ABtn></Link>
      </div>

      <div className="mt-8 divide-y divide-fog border border-fog bg-white">
        {rows.map((j, idx) => (
          <div key={j.id} className="flex items-start gap-4 p-4 hover:bg-bone/60">
            <ReorderButtons onUp={() => move(idx, -1)} onDown={() => move(idx, 1)} isFirst={idx === 0} isLast={idx === rows.length - 1} />
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-ink">{j.title}</p>
              <p className="mt-1 flex flex-wrap items-center gap-2 text-xs text-concrete">
                <span className="bg-bone px-2 py-0.5 font-display text-[10px] font-bold uppercase tracking-wider">{j.type}</span>
                <span>{j.location}</span>
              </p>
              <p className="mt-1 truncate text-xs text-concrete">{j.summary}</p>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <PublishToggle published={j.published} onToggle={() => togglePublished(j)} />
              <Link to={`/admin/careers/${j.id}`} className="p-2 text-concrete hover:text-ink" aria-label="Edit"><Pencil className="h-4 w-4" /></Link>
              <button onClick={() => remove(j.id, j.title)} className="p-2 text-concrete hover:text-red-600" aria-label="Delete"><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
        ))}
        {rows.length === 0 && <p className="p-10 text-center text-sm text-concrete">No openings yet — post your first role.</p>}
      </div>
    </div>
  );
}
