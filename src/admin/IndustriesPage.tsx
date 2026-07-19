import { Link } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import { trpc } from "@/providers/trpc";
import { ABtn, ALoading, AError, PublishToggle, ReorderButtons, reorderPayload } from "./ui";
import { Plus, Pencil, Trash2, ImageIcon } from "lucide-react";

export default function IndustriesPage() {
  const { data, isLoading, isError } = trpc.industries.listAll.useQuery();
  const upsert = trpc.industries.upsert.useMutation();
  const reorder = trpc.industries.reorder.useMutation();
  const del = trpc.industries.delete.useMutation();
  const qc = useQueryClient();

  if (isLoading) return <ALoading />;
  if (isError) return <AError />;

  const rows = data ?? [];

  const togglePublished = async (i: (typeof rows)[number]) => {
    await upsert.mutateAsync({ ...i, published: !i.published });
    await qc.invalidateQueries();
  };
  const move = async (idx: number, dir: -1 | 1) => {
    const payload = reorderPayload(rows, idx, dir);
    if (!payload) return;
    await reorder.mutateAsync(payload);
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
          <h1 className="display-2 text-2xl text-ink sm:text-3xl">Industries</h1>
          <p className="mt-2 text-sm text-concrete">Market sectors shown on the Industries page and detail pages. Drag order with the arrows.</p>
        </div>
        <Link to="/admin/industries/new"><ABtn><Plus className="h-3.5 w-3.5" /> New Industry</ABtn></Link>
      </div>

      <div className="mt-8 overflow-x-auto border border-fog bg-white">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-fog bg-bone">
              <th className="w-10 px-2 py-3" />
              <th className="px-4 py-3 font-display text-[10px] font-bold uppercase tracking-[0.18em] text-concrete">Industry</th>
              <th className="px-4 py-3 font-display text-[10px] font-bold uppercase tracking-[0.18em] text-concrete">Short</th>
              <th className="px-4 py-3 font-display text-[10px] font-bold uppercase tracking-[0.18em] text-concrete">Stat</th>
              <th className="px-4 py-3 text-center font-display text-[10px] font-bold uppercase tracking-[0.18em] text-concrete">Live</th>
              <th className="px-4 py-3 text-right font-display text-[10px] font-bold uppercase tracking-[0.18em] text-concrete">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-fog">
            {rows.map((i, idx) => (
              <tr key={i.id} className="hover:bg-bone/60">
                <td className="px-2 py-3">
                  <ReorderButtons onUp={() => move(idx, -1)} onDown={() => move(idx, 1)} isFirst={idx === 0} isLast={idx === rows.length - 1} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-16 shrink-0 items-center justify-center overflow-hidden bg-bone">
                      {i.cardImage ? <img src={i.cardImage} alt="" className="h-full w-full object-cover" /> : <ImageIcon className="h-4 w-4 text-concrete/40" />}
                    </div>
                    <div>
                      <p className="font-semibold text-ink">{i.name}</p>
                      <p className="font-mono text-[11px] text-concrete/70">{i.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-concrete">{i.short}</td>
                <td className="px-4 py-3 text-concrete">{i.statValue ? `${i.statValue} ${i.statLabel ?? ""}` : "—"}</td>
                <td className="px-4 py-3 text-center"><PublishToggle published={i.published} onToggle={() => togglePublished(i)} /></td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    <Link to={`/admin/industries/${i.id}`} className="p-1.5 text-concrete hover:text-ink" aria-label="Edit"><Pencil className="h-4 w-4" /></Link>
                    <button onClick={() => remove(i.id, i.name)} className="p-1.5 text-concrete hover:text-red-600" aria-label="Delete"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td colSpan={6} className="p-10 text-center text-sm text-concrete">No industries yet — add your first sector.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
