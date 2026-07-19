import { Link } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import { trpc } from "@/providers/trpc";
import { ABtn, ALoading, AError, PublishToggle, ReorderButtons, reorderPayload } from "./ui";
import { Plus, Pencil, Trash2, ImageIcon } from "lucide-react";

export default function PartnersPage() {
  const { data, isLoading, isError } = trpc.partners.listAll.useQuery();
  const upsert = trpc.partners.upsert.useMutation();
  const reorder = trpc.partners.reorder.useMutation();
  const del = trpc.partners.delete.useMutation();
  const qc = useQueryClient();

  if (isLoading) return <ALoading />;
  if (isError) return <AError />;

  const rows = data ?? [];

  const togglePublished = async (p: (typeof rows)[number]) => {
    await upsert.mutateAsync({ ...p, published: !p.published });
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
    <div className="max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="display-2 text-2xl text-ink sm:text-3xl">Partners</h1>
          <p className="mt-2 text-sm text-concrete">Partner &amp; client logos shown on the site. Reorder with the arrows.</p>
        </div>
        <Link to="/admin/partners/new"><ABtn><Plus className="h-3.5 w-3.5" /> New Partner</ABtn></Link>
      </div>

      <div className="mt-8 divide-y divide-fog border border-fog bg-white">
        {rows.map((p, idx) => (
          <div key={p.id} className="flex items-center gap-4 p-4 hover:bg-bone/60">
            <ReorderButtons onUp={() => move(idx, -1)} onDown={() => move(idx, 1)} isFirst={idx === 0} isLast={idx === rows.length - 1} />
            <div className="flex h-12 w-24 shrink-0 items-center justify-center overflow-hidden border border-fog bg-white">
              {p.logo ? <img src={p.logo} alt={p.name} className="h-full w-full object-contain p-1" /> : <ImageIcon className="h-4 w-4 text-concrete/40" />}
            </div>
            <p className="min-w-0 flex-1 truncate font-semibold text-ink">{p.name}</p>
            <div className="flex shrink-0 items-center gap-1">
              <PublishToggle published={p.published} onToggle={() => togglePublished(p)} />
              <Link to={`/admin/partners/${p.id}`} className="p-2 text-concrete hover:text-ink" aria-label="Edit"><Pencil className="h-4 w-4" /></Link>
              <button onClick={() => remove(p.id, p.name)} className="p-2 text-concrete hover:text-red-600" aria-label="Delete"><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
        ))}
        {rows.length === 0 && <p className="p-10 text-center text-sm text-concrete">No partners yet — add your first logo.</p>}
      </div>
    </div>
  );
}
