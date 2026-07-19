import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import { trpc } from "@/providers/trpc";
import { ABtn, ACard, AField, ALoading, AError } from "./ui";
import { Check, Loader2, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

type FieldDef = { key: string; label: string; multiline?: boolean; hint?: string };
type PageDef = { page: string; title: string; blurb: string; fields: FieldDef[] };

/** Seeded pages & keys — mirrors the public site sections. Any key can still be
 *  edited/added below; these just provide friendly labelled starter fields. */
const HERO_FIELDS: FieldDef[] = [
  { key: "hero.eyebrow", label: "Hero Eyebrow", hint: "Small label above the headline." },
  { key: "hero.title", label: "Hero Title" },
  { key: "hero.sub", label: "Hero Subtext", multiline: true },
];

const PAGES: PageDef[] = [
  {
    page: "home", title: "Home", blurb: "Homepage hero copy and call-to-action buttons.",
    fields: [
      { key: "hero.eyebrow", label: "Hero Eyebrow" },
      { key: "hero.title.line1", label: "Hero Title — Line 1" },
      { key: "hero.title.line2", label: "Hero Title — Line 2" },
      { key: "hero.sub", label: "Hero Subtext", multiline: true },
      { key: "hero.ctaPrimary.label", label: "Primary Button — Label" },
      { key: "hero.ctaPrimary.to", label: "Primary Button — Link", hint: "Path, e.g. /portfolio" },
      { key: "hero.ctaSecondary.label", label: "Secondary Button — Label" },
      { key: "hero.ctaSecondary.to", label: "Secondary Button — Link", hint: "Path, e.g. /contact" },
    ],
  },
  {
    page: "about", title: "About", blurb: "About page hero and company story.",
    fields: [
      { key: "hero.eyebrow", label: "Hero Eyebrow" },
      { key: "hero.title", label: "Hero Title" },
      { key: "hero.sub", label: "Hero Subtext", multiline: true },
      { key: "story.eyebrow", label: "Story Eyebrow" },
      { key: "story.heading", label: "Story Heading" },
      { key: "story.p1", label: "Story Paragraph 1", multiline: true },
      { key: "story.p2", label: "Story Paragraph 2", multiline: true },
      { key: "story.p3", label: "Story Paragraph 3", multiline: true },
    ],
  },
  { page: "industries", title: "Industries", blurb: "Industries page hero copy.", fields: HERO_FIELDS },
  { page: "portfolio", title: "Portfolio", blurb: "Portfolio page hero copy.", fields: HERO_FIELDS },
  { page: "locations", title: "Locations", blurb: "Locations page hero copy.", fields: HERO_FIELDS },
  { page: "careers", title: "Careers", blurb: "Careers page hero copy.", fields: HERO_FIELDS },
  { page: "news", title: "News", blurb: "News page hero copy.", fields: HERO_FIELDS },
  { page: "contact", title: "Contact", blurb: "Contact page hero copy.", fields: HERO_FIELDS },
  { page: "subcontractors", title: "Subcontractors", blurb: "Subcontractors page hero copy.", fields: HERO_FIELDS },
];

export default function PageContentPage() {
  const { page: routePage } = useParams();
  const navigate = useNavigate();
  const active = PAGES.find((p) => p.page === routePage) ?? PAGES[0];

  const { data, isLoading, isError } = trpc.pageContent.getByPage.useQuery({ page: active.page });
  const setMutation = trpc.pageContent.set.useMutation();
  const qc = useQueryClient();

  const [form, setForm] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);
  const [newKey, setNewKey] = useState("");

  // Seed labelled fields (empty), then overlay any stored values — including
  // custom keys saved earlier that aren't in the labelled starter set.
  useEffect(() => {
    const seed: Record<string, string> = {};
    for (const f of active.fields) seed[f.key] = "";
    setForm({ ...seed, ...(data ?? {}) });
  }, [data, active]);

  // Keys present in the data/form but not in the labelled starter set.
  const extraKeys = useMemo(() => {
    const known = new Set(active.fields.map((f) => f.key));
    return Object.keys(form).filter((k) => !known.has(k)).sort();
  }, [form, active]);

  if (isLoading) return <ALoading />;
  if (isError) return <AError />;

  const upd = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const addKey = () => {
    const k = newKey.trim();
    if (!k) return;
    if (!(k in form)) setForm((f) => ({ ...f, [k]: "" }));
    setNewKey("");
  };

  const save = async () => {
    setSaved(false);
    // Only write keys that changed from what's stored (avoids needless writes).
    const stored = data ?? {};
    const changed = Object.entries(form).filter(([k, v]) => (stored[k] ?? "") !== v);
    for (const [key, value] of changed) {
      await setMutation.mutateAsync({ page: active.page, key, value });
    }
    await qc.invalidateQueries();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="display-2 text-2xl text-ink sm:text-3xl">Page Content</h1>
          <p className="mt-2 text-sm text-concrete">Edit the editable copy on each public page. Pick a page, edit its fields, and save.</p>
        </div>
        <ABtn onClick={save} disabled={setMutation.isPending}>
          {setMutation.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : saved ? <Check className="h-3.5 w-3.5" /> : null}
          {saved ? "Saved" : "Save Changes"}
        </ABtn>
      </div>

      {/* Page switcher */}
      <div className="mt-6 flex flex-wrap gap-2">
        {PAGES.map((p) => (
          <button
            key={p.page}
            onClick={() => navigate(`/admin/pages/${p.page}`)}
            className={cn(
              "border px-4 py-2 font-display text-[11px] font-semibold uppercase tracking-[0.16em] transition-all",
              p.page === active.page ? "border-mahoney bg-mahoney text-white" : "border-ink/15 text-concrete hover:border-ink/40 hover:text-ink"
            )}
          >
            {p.title}
          </button>
        ))}
      </div>

      <div className="mt-8 space-y-6">
        <ACard>
          <h2 className="font-display text-sm font-bold uppercase tracking-[0.18em] text-ink">{active.title}</h2>
          <p className="mt-1 text-xs text-concrete">{active.blurb}</p>
          <div className="mt-5 grid gap-5">
            {active.fields.map((f) => (
              <AField key={f.key} label={f.label} hint={f.hint}>
                {f.multiline ? (
                  <textarea className="field-input resize-y" rows={3} value={form[f.key] ?? ""} onChange={(e) => upd(f.key, e.target.value)} />
                ) : (
                  <input className="field-input" value={form[f.key] ?? ""} onChange={(e) => upd(f.key, e.target.value)} />
                )}
                <p className="mt-1 font-mono text-[10px] text-concrete/50">{f.key}</p>
              </AField>
            ))}
          </div>
        </ACard>

        {extraKeys.length > 0 && (
          <ACard>
            <h2 className="font-display text-sm font-bold uppercase tracking-[0.18em] text-ink">Other Keys</h2>
            <p className="mt-1 text-xs text-concrete">Custom keys stored for this page.</p>
            <div className="mt-5 grid gap-5">
              {extraKeys.map((k) => (
                <AField key={k} label={k}>
                  <textarea className="field-input resize-y" rows={2} value={form[k] ?? ""} onChange={(e) => upd(k, e.target.value)} />
                </AField>
              ))}
            </div>
          </ACard>
        )}

        <ACard>
          <h2 className="font-display text-sm font-bold uppercase tracking-[0.18em] text-ink">Add a Field</h2>
          <p className="mt-1 text-xs text-concrete">Add a custom content key for this page (advanced). Use the site’s dotted key scheme, e.g. <span className="font-mono">cta.heading</span>.</p>
          <div className="mt-4 flex flex-wrap items-end gap-3">
            <div className="flex-1 min-w-[220px]">
              <label className="field-label">Key</label>
              <input className="field-input font-mono text-[13px]" value={newKey} onChange={(e) => setNewKey(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addKey(); } }} placeholder="section.key" />
            </div>
            <ABtn variant="ghost" onClick={addKey} disabled={!newKey.trim()}><Plus className="h-3.5 w-3.5" /> Add Field</ABtn>
          </div>
        </ACard>
      </div>
    </div>
  );
}
