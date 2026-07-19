import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import { trpc } from "@/providers/trpc";
import { ABtn, ACard, AField } from "./ui";
import { ArrowLeft, Check, Loader2 } from "lucide-react";

const TYPES = ["Full-time", "Part-time", "Contract", "Seasonal", "Internship"];

const EMPTY = {
  title: "", type: "Full-time", location: "", summary: "",
  sortOrder: 0, published: true,
};

export default function JobEditor() {
  const { id } = useParams();
  const isNew = id === "new";
  const { data: all } = trpc.jobs.listAll.useQuery();
  const upsert = trpc.jobs.upsert.useMutation();
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!isNew && all) {
      const j = all.find((x) => x.id === Number(id));
      if (j) setForm({ title: j.title, type: j.type, location: j.location, summary: j.summary, sortOrder: j.sortOrder, published: j.published });
    }
  }, [all, id, isNew]);

  const upd = <K extends keyof typeof EMPTY>(k: K, v: (typeof EMPTY)[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const save = async () => {
    if (!form.title || !form.type || !form.location || !form.summary) {
      alert("Title, type, location, and summary are all required.");
      return;
    }
    setSaved(false);
    const r = await upsert.mutateAsync({ ...form, ...(isNew ? {} : { id: Number(id) }) });
    await qc.invalidateQueries();
    setSaved(true);
    if (isNew) navigate(`/admin/careers/${r.id}`, { replace: true });
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-3xl">
      <Link to="/admin/careers" className="group inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-concrete hover:text-ink">
        <ArrowLeft className="h-3.5 w-3.5 text-mahoney transition-transform group-hover:-translate-x-1" /> All Openings
      </Link>
      <div className="mt-4 flex items-center justify-between">
        <h1 className="display-2 text-2xl text-ink sm:text-3xl">{isNew ? "New Opening" : form.title || "Edit Opening"}</h1>
        <ABtn onClick={save} disabled={upsert.isPending}>
          {upsert.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : saved ? <Check className="h-3.5 w-3.5" /> : null}
          {saved ? "Saved" : "Save Opening"}
        </ABtn>
      </div>

      <div className="mt-8 space-y-6">
        <ACard className="grid gap-5">
          <AField label="Title *"><input className="field-input" value={form.title} onChange={(e) => upd("title", e.target.value)} placeholder="Project Manager" /></AField>
          <div className="grid gap-5 sm:grid-cols-2">
            <AField label="Type *">
              <select className="field-input" value={form.type} onChange={(e) => upd("type", e.target.value)}>
                {TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </AField>
            <AField label="Location *"><input className="field-input" value={form.location} onChange={(e) => upd("location", e.target.value)} placeholder="Syracuse, NY" /></AField>
          </div>
          <AField label="Summary *" hint="A short description of the role shown on the Careers page.">
            <textarea className="field-input resize-y" rows={5} value={form.summary} onChange={(e) => upd("summary", e.target.value)} />
          </AField>
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
