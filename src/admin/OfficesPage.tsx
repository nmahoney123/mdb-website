import { Link } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import { trpc } from "@/providers/trpc";
import { ABtn, ALoading, AError, ReorderButtons, reorderPayload } from "./ui";
import { Plus, Pencil, Trash2, Star } from "lucide-react";

export default function OfficesPage() {
  const { data, isLoading, isError } = trpc.offices.listAll.useQuery();
  const reorder = trpc.offices.reorder.useMutation();
  const del = trpc.offices.delete.useMutation();
  const qc = useQueryClient();

  if (isLoading) return <ALoading />;
  if (isError) return <AError />;

  const rows = data ?? [];

  const move = async (idx: number, dir: -1 | 1) => {
    const payload = reorderPayload(rows, idx, dir);
    if (!payload) return;
    await reorder.mutateAsync(payload);
    await qc.invalidateQueries();
  };
  const remove = async (id: number, city: string) => {
    if (!confirm(`Delete the ${city} location permanently?`)) return;
    await del.mutateAsync({ id });
    await qc.invalidateQueries();
  };

  return (
    <div className="max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="display-2 text-2xl text-ink sm:text-3xl">Locations</h1>
          <p className="mt-2 text-sm text-concrete">Offices shown on the Locations page and map. Reorder with the arrows.</p>
        </div>
        <Link to="/admin/locations/new"><ABtn><Plus className="h-3.5 w-3.5" /> New Location</ABtn></Link>
      </div>

      <div className="mt-8 overflow-x-auto border border-fog bg-white">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead>
            <tr className="border-b border-fog bg-bone">
              <th className="w-10 px-2 py-3" />
              <th className="px-4 py-3 font-display text-[10px] font-bold uppercase tracking-[0.18em] text-concrete">City</th>
              <th className="px-4 py-3 font-display text-[10px] font-bold uppercase tracking-[0.18em] text-concrete">Region</th>
              <th className="px-4 py-3 font-display text-[10px] font-bold uppercase tracking-[0.18em] text-concrete">Coords</th>
              <th className="px-4 py-3 text-center font-display text-[10px] font-bold uppercase tracking-[0.18em] text-concrete">HQ</th>
              <th className="px-4 py-3 text-right font-display text-[10px] font-bold uppercase tracking-[0.18em] text-concrete">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-fog">
            {rows.map((o, idx) => (
              <tr key={o.id} className="hover:bg-bone/60">
                <td className="px-2 py-3">
                  <ReorderButtons onUp={() => move(idx, -1)} onDown={() => move(idx, 1)} isFirst={idx === 0} isLast={idx === rows.length - 1} />
                </td>
                <td className="px-4 py-3">
                  <p className="font-semibold text-ink">{o.city}, {o.state}</p>
                  <p className="font-mono text-[11px] text-concrete/70">{o.slug}</p>
                </td>
                <td className="px-4 py-3 text-concrete">{o.region}</td>
                <td className="px-4 py-3 font-mono text-[12px] text-concrete">{o.lat}, {o.lng}</td>
                <td className="px-4 py-3 text-center">
                  {o.hq ? <Star className="mx-auto h-4 w-4 text-mahoney" fill="currentColor" /> : <span className="text-concrete/30">—</span>}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    <Link to={`/admin/locations/${o.id}`} className="p-1.5 text-concrete hover:text-ink" aria-label="Edit"><Pencil className="h-4 w-4" /></Link>
                    <button onClick={() => remove(o.id, o.city)} className="p-1.5 text-concrete hover:text-red-600" aria-label="Delete"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td colSpan={6} className="p-10 text-center text-sm text-concrete">No locations yet — add your first office.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
