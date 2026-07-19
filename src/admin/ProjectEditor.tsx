import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import { trpc } from "@/providers/trpc";
import { ABtn, ACard, AField, ImagePicker, LinesEditor } from "./ui";
import { ArrowLeft, Check, Loader2 } from "lucide-react";

const INDUSTRIES = [
  { name: "Self Storage", slug: "self-storage" },
  { name: "Hotels & Hospitality", slug: "hotels-hospitality" },
  { name: "Multifamily", slug: "multifamily" },
  { name: "Custom Homes", slug: "custom-homes" },
];

const EMPTY = {
  slug: "", name: "", industry: "Self Storage", industrySlug: "self-storage",
  location: "", year: "", size: "", scope: "",
  services: [] as string[], narrative: [] as string[],
  heroImage: null as string | null, cardImage: null as string | null,
  featured: false, published: true, sortOrder: 0,
};

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export default function ProjectEditor() {
  const { id } = useParams();
  const isNew = id === "new";
  const { data: all } = trpc.projects.listAll.useQuery();
  const upsert = trpc.projects.upsert.useMutation();
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!isNew && all) {
      const p = all.find((x) => x.id === Number(id));
      if (p) setForm({ ...p, heroImage: p.heroImage ?? null, cardImage: p.cardImage ?? null });
    }
  }, [all, id, isNew]);

  const upd = <K extends keyof typeof EMPTY>(k: K, v: (typeof EMPTY)[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const save = async () => {
    if (!form.name || !form.scope || !form.location || !form.year || !form.size) {
      alert("Name, location, year, size, and scope are required.");
      return;
    }
    setSaved(false);
    const payload = {
      ...form,
      slug: form.slug || slugify(form.name),
      ...(isNew ? {} : { id: Number(id) }),
    };
    const r = await upsert.mutateAsync(payload);
    await qc.invalidateQueries();
    setSaved(true);
    if (isNew) navigate(`/admin/projects/${r.id}`, { replace: true });
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-4xl">
      <Link to="/admin/projects" className="group inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-concrete hover:text-ink">
        <ArrowLeft className="h-3.5 w-3.5 text-mahoney transition-transform group-hover:-translate-x-1" /> All Projects
      </Link>
      <div className="mt-4 flex items-center justify-between">
        <h1 className="display-2 text-2xl text-ink sm:text-3xl">{isNew ? "New Project" : form.name || "Edit Project"}</h1>
        <ABtn onClick={save} disabled={upsert.isPending}>
          {upsert.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : saved ? <Check className="h-3.5 w-3.5" /> : null}
          {saved ? "Saved" : "Save Project"}
        </ABtn>
      </div>

      <div className="mt-8 space-y-6">
        <ACard className="grid gap-5 sm:grid-cols-2">
          <AField label="Project Name *">
            <input className="field-input" value={form.name} onChange={(e) => { upd("name", e.target.value); if (isNew) upd("slug", slugify(e.target.value)); }} />
          </AField>
          <AField label="URL Slug *">
            <input className="field-input font-mono text-[13px]" value={form.slug} onChange={(e) => upd("slug", slugify(e.target.value))} />
          </AField>
          <AField label="Industry *">
            <select className="field-input" value={form.industrySlug} onChange={(e) => {
              const ind = INDUSTRIES.find((i) => i.slug === e.target.value)!;
              upd("industry", ind.name); upd("industrySlug", ind.slug);
            }}>
              {INDUSTRIES.map((i) => <option key={i.slug} value={i.slug}>{i.name}</option>)}
            </select>
          </AField>
          <AField label="Location *"><input className="field-input" value={form.location} onChange={(e) => upd("location", e.target.value)} placeholder="Syracuse, NY" /></AField>
          <AField label="Year *"><input className="field-input" value={form.year} onChange={(e) => upd("year", e.target.value)} placeholder="2025" /></AField>
          <AField label="Size *"><input className="field-input" value={form.size} onChange={(e) => upd("size", e.target.value)} placeholder="92,000 sq ft · 640 units" /></AField>
          <div className="sm:col-span-2">
            <AField label="Scope *" hint="One sentence describing the work.">
              <input className="field-input" value={form.scope} onChange={(e) => upd("scope", e.target.value)} />
            </AField>
          </div>
          <div className="sm:col-span-2">
            <LinesEditor label="Services" value={form.services} onChange={(v) => upd("services", v)} rows={3} hint="One per line — e.g., Design-Build, Preconstruction, Sitework." />
          </div>
          <div className="sm:col-span-2">
            <LinesEditor label="Narrative" value={form.narrative} onChange={(v) => upd("narrative", v)} rows={5} hint="One paragraph per line — the project story shown on the detail page." />
          </div>
        </ACard>

        <ACard>
          <h2 className="font-display text-sm font-bold uppercase tracking-[0.18em] text-ink">Images</h2>
          <div className="mt-5 grid gap-6 sm:grid-cols-2">
            <ImagePicker label="Card Image (portfolio grids)" value={form.cardImage} onChange={(v) => upd("cardImage", v)} />
            <ImagePicker label="Hero Image (detail page)" value={form.heroImage} onChange={(v) => upd("heroImage", v)} />
          </div>
        </ACard>

        <ACard className="flex flex-wrap items-center gap-8">
          <label className="flex cursor-pointer items-center gap-3">
            <input type="checkbox" checked={form.featured} onChange={(e) => upd("featured", e.target.checked)} className="h-4 w-4 accent-mahoney" />
            <span className="font-display text-[12px] font-bold uppercase tracking-[0.14em] text-ink">Featured on homepage</span>
          </label>
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
