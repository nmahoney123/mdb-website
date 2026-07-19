import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import { trpc } from "@/providers/trpc";
import { ABtn, ACard, AField } from "./ui";
import { ArrowLeft, Check, Loader2 } from "lucide-react";

const EMPTY = {
  quote: "", name: "", role: "", project: "",
  sortOrder: 0, published: true,
};

export default function TestimonialEditor() {
  const { id } = useParams();
  const isNew = id === "new";
  const { data: all } = trpc.testimonials.listAll.useQuery();
  const upsert = trpc.testimonials.upsert.useMutation();
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!isNew && all) {
      const t = all.find((x) => x.id === Number(id));
      if (t) setForm({ quote: t.quote, name: t.name, role: t.role, project: t.project, sortOrder: t.sortOrder, published: t.published });
    }
  }, [all, id, isNew]);

  const upd = <K extends keyof typeof EMPTY>(k: K, v: (typeof EMPTY)[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const save = async () => {
    if (!form.quote || !form.name || !form.role || !form.project) {
      alert("Quote, name, role, and project are all required.");
      return;
    }
    setSaved(false);
    const r = await upsert.mutateAsync({ ...form, ...(isNew ? {} : { id: Number(id) }) });
    await qc.invalidateQueries();
    setSaved(true);
    if (isNew) navigate(`/admin/testimonials/${r.id}`, { replace: true });
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-3xl">
      <Link to="/admin/testimonials" className="group inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-concrete hover:text-ink">
        <ArrowLeft className="h-3.5 w-3.5 text-mahoney transition-transform group-hover:-translate-x-1" /> All Testimonials
      </Link>
      <div className="mt-4 flex items-center justify-between">
        <h1 className="display-2 text-2xl text-ink sm:text-3xl">{isNew ? "New Testimonial" : form.name || "Edit Testimonial"}</h1>
        <ABtn onClick={save} disabled={upsert.isPending}>
          {upsert.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : saved ? <Check className="h-3.5 w-3.5" /> : null}
          {saved ? "Saved" : "Save Testimonial"}
        </ABtn>
      </div>

      <div className="mt-8 space-y-6">
        <ACard className="grid gap-5">
          <AField label="Quote *">
            <textarea className="field-input resize-y" rows={4} value={form.quote} onChange={(e) => upd("quote", e.target.value)} placeholder="Mahoney delivered our facility ahead of schedule…" />
          </AField>
          <div className="grid gap-5 sm:grid-cols-2">
            <AField label="Name *"><input className="field-input" value={form.name} onChange={(e) => upd("name", e.target.value)} placeholder="Jane Developer" /></AField>
            <AField label="Role *"><input className="field-input" value={form.role} onChange={(e) => upd("role", e.target.value)} placeholder="Managing Partner, Acme Storage" /></AField>
          </div>
          <AField label="Project *" hint="Which project this quote relates to."><input className="field-input" value={form.project} onChange={(e) => upd("project", e.target.value)} placeholder="Syracuse Self Storage" /></AField>
        </ACard>

        <ACard className="flex flex-wrap items-center gap-8">
          <label className="flex cursor-pointer items-center gap-3">
            <input type="checkbox" checked={form.published} onChange={(e) => upd("published", e.target.checked)} className="h-4 w-4 accent-mahoney" />
            <span className="font-display text-[12px] font-bold uppercase tracking-[0.14em] text-ink">Published (live on site)</span>
          </label>
          <AField label="Sort Order">
            <input type="number" className="field-input !w-28" value={form.sortOrder} onChange={(e) => upd("sortOrder", Number(e.target.value))} />
          </AField>
        </ACard>
      </div>
    </div>
  );
}
