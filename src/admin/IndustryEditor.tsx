import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import { trpc } from "@/providers/trpc";
import { ABtn, ACard, AField, ImagePicker, LinesEditor } from "./ui";
import { ArrowLeft, Check, Loader2 } from "lucide-react";

const EMPTY = {
  slug: "", name: "", short: "", blurb: "",
  overview: [] as string[], capabilities: [] as string[],
  heroImage: null as string | null, cardImage: null as string | null,
  statValue: "" as string, statLabel: "" as string,
  sortOrder: 0, published: true,
};

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export default function IndustryEditor() {
  const { id } = useParams();
  const isNew = id === "new";
  const { data: all } = trpc.industries.listAll.useQuery();
  const upsert = trpc.industries.upsert.useMutation();
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!isNew && all) {
      const i = all.find((x) => x.id === Number(id));
      if (i) setForm({
        slug: i.slug, name: i.name, short: i.short, blurb: i.blurb,
        overview: i.overview, capabilities: i.capabilities,
        heroImage: i.heroImage ?? null, cardImage: i.cardImage ?? null,
        statValue: i.statValue ?? "", statLabel: i.statLabel ?? "",
        sortOrder: i.sortOrder, published: i.published,
      });
    }
  }, [all, id, isNew]);

  const upd = <K extends keyof typeof EMPTY>(k: K, v: (typeof EMPTY)[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const save = async () => {
    if (!form.name || !form.short || !form.blurb) {
      alert("Name, short label, and blurb are required.");
      return;
    }
    setSaved(false);
    const payload = {
      ...form,
      slug: form.slug || slugify(form.name),
      statValue: form.statValue || null,
      statLabel: form.statLabel || null,
      ...(isNew ? {} : { id: Number(id) }),
    };
    const r = await upsert.mutateAsync(payload);
    await qc.invalidateQueries();
    setSaved(true);
    if (isNew) navigate(`/admin/industries/${r.id}`, { replace: true });
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-4xl">
      <Link to="/admin/industries" className="group inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-concrete hover:text-ink">
        <ArrowLeft className="h-3.5 w-3.5 text-mahoney transition-transform group-hover:-translate-x-1" /> All Industries
      </Link>
      <div className="mt-4 flex items-center justify-between">
        <h1 className="display-2 text-2xl text-ink sm:text-3xl">{isNew ? "New Industry" : form.name || "Edit Industry"}</h1>
        <ABtn onClick={save} disabled={upsert.isPending}>
          {upsert.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : saved ? <Check className="h-3.5 w-3.5" /> : null}
          {saved ? "Saved" : "Save Industry"}
        </ABtn>
      </div>

      <div className="mt-8 space-y-6">
        <ACard className="grid gap-5 sm:grid-cols-2">
          <AField label="Name *"><input className="field-input" value={form.name} onChange={(e) => { upd("name", e.target.value); if (isNew) upd("slug", slugify(e.target.value)); }} placeholder="Self Storage" /></AField>
          <AField label="URL Slug *"><input className="field-input font-mono text-[13px]" value={form.slug} onChange={(e) => upd("slug", slugify(e.target.value))} /></AField>
          <AField label="Short Label *" hint="Compact label used in nav/cards (max 80 chars)."><input className="field-input" value={form.short} onChange={(e) => upd("short", e.target.value)} placeholder="Storage" /></AField>
          <div className="sm:col-span-2">
            <AField label="Blurb *" hint="One or two sentences summarizing the sector.">
              <textarea className="field-input resize-y" rows={2} value={form.blurb} onChange={(e) => upd("blurb", e.target.value)} />
            </AField>
          </div>
          <div className="sm:col-span-2">
            <LinesEditor label="Overview" value={form.overview} onChange={(v) => upd("overview", v)} rows={5} hint="One paragraph per line — the sector story on the detail page." />
          </div>
          <div className="sm:col-span-2">
            <LinesEditor label="Capabilities" value={form.capabilities} onChange={(v) => upd("capabilities", v)} rows={4} hint="One capability per line." />
          </div>
        </ACard>

        <ACard>
          <h2 className="font-display text-sm font-bold uppercase tracking-[0.18em] text-ink">Stat</h2>
          <p className="mt-1 text-xs text-concrete">Optional headline figure shown on the sector card (e.g. “40+” / “projects delivered”).</p>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <AField label="Stat Value"><input className="field-input" value={form.statValue} onChange={(e) => upd("statValue", e.target.value)} placeholder="40+" /></AField>
            <AField label="Stat Label"><input className="field-input" value={form.statLabel} onChange={(e) => upd("statLabel", e.target.value)} placeholder="facilities built" /></AField>
          </div>
        </ACard>

        <ACard>
          <h2 className="font-display text-sm font-bold uppercase tracking-[0.18em] text-ink">Images</h2>
          <div className="mt-5 grid gap-6 sm:grid-cols-2">
            <ImagePicker label="Card Image (industries grid)" value={form.cardImage} onChange={(v) => upd("cardImage", v)} />
            <ImagePicker label="Hero Image (detail page)" value={form.heroImage} onChange={(v) => upd("heroImage", v)} />
          </div>
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
