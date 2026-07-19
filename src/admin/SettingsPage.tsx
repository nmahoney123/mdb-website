import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { trpc } from "@/providers/trpc";
import { ABtn, ACard, AField, ImagePicker } from "./ui";
import { DEFAULT_SETTINGS } from "@/hooks/useCms";
import { Check, Loader2 } from "lucide-react";

export default function SettingsPage() {
  const { data, isLoading } = trpc.settings.all.useQuery();
  const setMutation = trpc.settings.set.useMutation();
  const qc = useQueryClient();
  const [form, setForm] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Seed every known field (so the form is complete on a fresh/unseeded DB),
    // then overlay any values already stored in the database.
    if (data) setForm({ ...DEFAULT_SETTINGS, ...data });
  }, [data]);

  if (isLoading) return <Loader2 className="h-6 w-6 animate-spin text-mahoney" />;

  const upd = (k: string, v: string | null) => setForm((f) => ({ ...f, [k]: v ?? "" }));

  const save = async () => {
    setSaved(false);
    await setMutation.mutateAsync({ entries: form });
    await qc.invalidateQueries();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="display-2 text-2xl text-ink sm:text-3xl">Site Settings</h1>
          <p className="mt-2 text-sm text-concrete">Brand assets, homepage hero video, company info, stats, and SEO.</p>
        </div>
        <ABtn onClick={save} disabled={setMutation.isPending}>
          {setMutation.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : saved ? <Check className="h-3.5 w-3.5" /> : null}
          {saved ? "Saved" : "Save Changes"}
        </ABtn>
      </div>

      <div className="mt-8 space-y-6">
        <ACard>
          <h2 className="font-display text-sm font-bold uppercase tracking-[0.18em] text-ink">Brand Assets</h2>
          <div className="mt-5 grid gap-6 sm:grid-cols-2">
            <ImagePicker
              label="Logo (replaces built-in mark)"
              value={form.logoUrl}
              onChange={(v) => upd("logoUrl", v)}
            />
            <ImagePicker
              label="Favicon (.png or .ico, 64×64+)"
              value={form.faviconUrl}
              onChange={(v) => upd("faviconUrl", v)}
            />
          </div>
        </ACard>

        <ACard>
          <h2 className="font-display text-sm font-bold uppercase tracking-[0.18em] text-ink">Homepage Hero Video</h2>
          <p className="mt-1 text-xs text-concrete">
            Upload an MP4/WebM via the picker, or leave as-is. The poster image shows while the video loads and on reduced-motion devices.
          </p>
          <div className="mt-5 grid gap-6 sm:grid-cols-3">
            <ImagePicker label="Hero Video (desktop)" value={form.heroVideoUrl} onChange={(v) => upd("heroVideoUrl", v)} />
            <ImagePicker label="Hero Video (mobile)" value={form.heroVideoMobileUrl} onChange={(v) => upd("heroVideoMobileUrl", v)} />
            <ImagePicker label="Poster Image" value={form.heroPosterUrl} onChange={(v) => upd("heroPosterUrl", v)} />
          </div>
          {form.heroVideoUrl && (
            <video src={form.heroVideoUrl} className="mt-4 aspect-video w-full max-w-md border border-fog object-cover" muted autoPlay loop playsInline />
          )}
        </ACard>

        <ACard>
          <h2 className="font-display text-sm font-bold uppercase tracking-[0.18em] text-ink">Company Info</h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <AField label="Company Name"><input className="field-input" value={form.companyName ?? ""} onChange={(e) => upd("companyName", e.target.value)} /></AField>
            <AField label="Tagline"><input className="field-input" value={form.tagline ?? ""} onChange={(e) => upd("tagline", e.target.value)} /></AField>
            <AField label="Phone"><input className="field-input" value={form.phone ?? ""} onChange={(e) => upd("phone", e.target.value)} /></AField>
            <AField label="Fax"><input className="field-input" value={form.fax ?? ""} onChange={(e) => upd("fax", e.target.value)} /></AField>
            <AField label="Email"><input className="field-input" value={form.email ?? ""} onChange={(e) => upd("email", e.target.value)} /></AField>
            <AField label="License #"><input className="field-input" value={form.license ?? ""} onChange={(e) => upd("license", e.target.value)} /></AField>
            <div className="sm:col-span-2">
              <AField label="Address"><input className="field-input" value={form.address ?? ""} onChange={(e) => upd("address", e.target.value)} /></AField>
            </div>
            <div className="sm:col-span-2">
              <AField label="SEO Meta Description" hint="Shown in Google search results. Keep under 160 characters.">
                <textarea className="field-input resize-none" rows={3} value={form.metaDescription ?? ""} onChange={(e) => upd("metaDescription", e.target.value)} />
              </AField>
            </div>
          </div>
        </ACard>

        <ACard>
          <h2 className="font-display text-sm font-bold uppercase tracking-[0.18em] text-ink">Homepage Stats</h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-4">
            <AField label="Years Building"><input className="field-input" value={form.statYears ?? ""} onChange={(e) => upd("statYears", e.target.value)} /></AField>
            <AField label="Projects Delivered"><input className="field-input" value={form.statProjects ?? ""} onChange={(e) => upd("statProjects", e.target.value)} /></AField>
            <AField label="Sq Ft Constructed"><input className="field-input" value={form.statSqFt ?? ""} onChange={(e) => upd("statSqFt", e.target.value)} /></AField>
            <AField label="Repeat & Referral %"><input className="field-input" value={form.statRepeat ?? ""} onChange={(e) => upd("statRepeat", e.target.value)} /></AField>
          </div>
        </ACard>

        <ACard>
          <h2 className="font-display text-sm font-bold uppercase tracking-[0.18em] text-ink">Marketing &amp; Analytics</h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <AField label="Google Tag ID" hint="GA4 (G-XXXXXXX) or Google Ads (AW-XXXXXXX). Loads analytics + conversion tracking. Leave blank to disable.">
              <input className="field-input" value={form.gaId ?? ""} onChange={(e) => upd("gaId", e.target.value)} placeholder="G-XXXXXXX" />
            </AField>
            <AField label="Google Search Console Verification" hint="The content value from the HTML-tag verification method.">
              <input className="field-input" value={form.googleVerification ?? ""} onChange={(e) => upd("googleVerification", e.target.value)} />
            </AField>
          </div>
        </ACard>
      </div>
    </div>
  );
}
