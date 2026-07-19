import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import { trpc } from "@/providers/trpc";
import { ABtn, ACard, AField, ImagePicker, LinesEditor } from "./ui";
import { ArrowLeft, Check, Loader2, Send } from "lucide-react";

const CATEGORIES = ["Project News", "Market Insight", "Company", "Press Release", "Community"];

const EMPTY = {
  slug: "", title: "", category: "Project News", excerpt: "",
  body: [] as string[], coverImage: null as string | null,
  status: "draft" as "draft" | "published",
};

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export default function NewsEditor() {
  const { id } = useParams();
  const isNew = id === "new";
  const { data: all } = trpc.posts.listAll.useQuery();
  const upsert = trpc.posts.upsert.useMutation();
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!isNew && all) {
      const p = all.find((x) => x.id === Number(id));
      if (p) setForm({ slug: p.slug, title: p.title, category: p.category, excerpt: p.excerpt, body: p.body, coverImage: p.coverImage ?? null, status: p.status });
    }
  }, [all, id, isNew]);

  const upd = <K extends keyof typeof EMPTY>(k: K, v: (typeof EMPTY)[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const save = async (status: "draft" | "published") => {
    if (!form.title || !form.excerpt || form.body.length === 0) {
      alert("Title, excerpt, and at least one body paragraph are required.");
      return;
    }
    setSaved(false);
    const r = await upsert.mutateAsync({
      ...form,
      status,
      slug: form.slug || slugify(form.title),
      ...(isNew ? {} : { id: Number(id) }),
    });
    await qc.invalidateQueries();
    setSaved(true);
    if (isNew) navigate(`/admin/news/${r.id}`, { replace: true });
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-4xl">
      <Link to="/admin/news" className="group inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-concrete hover:text-ink">
        <ArrowLeft className="h-3.5 w-3.5 text-mahoney transition-transform group-hover:-translate-x-1" /> All Articles
      </Link>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="display-2 text-2xl text-ink sm:text-3xl">{isNew ? "New Article" : form.title || "Edit Article"}</h1>
        <div className="flex gap-2">
          <ABtn variant="ghost" onClick={() => save("draft")} disabled={upsert.isPending}>
            {saved && form.status === "draft" ? <Check className="h-3.5 w-3.5" /> : null} Save Draft
          </ABtn>
          <ABtn onClick={() => save("published")} disabled={upsert.isPending}>
            {upsert.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
            {form.status === "published" ? "Update (Live)" : "Publish"}
          </ABtn>
        </div>
      </div>

      <div className="mt-8 space-y-6">
        <ACard className="grid gap-5">
          <AField label="Headline *">
            <input className="field-input text-lg font-semibold" value={form.title} onChange={(e) => { upd("title", e.target.value); if (isNew) upd("slug", slugify(e.target.value)); }} placeholder="MDB Breaks Ground on…" />
          </AField>
          <div className="grid gap-5 sm:grid-cols-2">
            <AField label="URL Slug *"><input className="field-input font-mono text-[13px]" value={form.slug} onChange={(e) => upd("slug", slugify(e.target.value))} /></AField>
            <AField label="Category">
              <select className="field-input" value={form.category} onChange={(e) => upd("category", e.target.value)}>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </AField>
          </div>
          <AField label="Excerpt *" hint="1–2 sentences shown on cards and previews.">
            <textarea className="field-input resize-none" rows={2} value={form.excerpt} onChange={(e) => upd("excerpt", e.target.value)} />
          </AField>
          <LinesEditor label="Body *" value={form.body} onChange={(v) => upd("body", v)} rows={10} hint="One paragraph per line." />
          <ImagePicker label="Cover Image" value={form.coverImage} onChange={(v) => upd("coverImage", v)} />
        </ACard>
      </div>
    </div>
  );
}
