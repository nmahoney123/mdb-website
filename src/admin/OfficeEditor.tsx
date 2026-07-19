import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import { trpc } from "@/providers/trpc";
import { ABtn, ACard, AField } from "./ui";
import { ArrowLeft, Check, Loader2 } from "lucide-react";

const EMPTY = {
  slug: "", city: "", state: "", region: "", hq: false,
  address: "" as string, phone: "" as string, email: "" as string,
  serves: "", blurb: "", lat: 0, lng: 0, sortOrder: 0,
};

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export default function OfficeEditor() {
  const { id } = useParams();
  const isNew = id === "new";
  const { data: all } = trpc.offices.listAll.useQuery();
  const upsert = trpc.offices.upsert.useMutation();
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!isNew && all) {
      const o = all.find((x) => x.id === Number(id));
      if (o) setForm({
        slug: o.slug, city: o.city, state: o.state, region: o.region, hq: o.hq,
        address: o.address ?? "", phone: o.phone ?? "", email: o.email ?? "",
        serves: o.serves, blurb: o.blurb, lat: o.lat, lng: o.lng, sortOrder: o.sortOrder,
      });
    }
  }, [all, id, isNew]);

  const upd = <K extends keyof typeof EMPTY>(k: K, v: (typeof EMPTY)[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const save = async () => {
    if (!form.city || !form.state || !form.region || !form.serves || !form.blurb) {
      alert("City, state, region, serves, and blurb are all required.");
      return;
    }
    if (Number.isNaN(form.lat) || Number.isNaN(form.lng)) {
      alert("Latitude and longitude must be valid numbers.");
      return;
    }
    setSaved(false);
    const payload = {
      ...form,
      slug: form.slug || slugify(`${form.city}-${form.state}`),
      address: form.address || null,
      phone: form.phone || null,
      email: form.email || null,
      ...(isNew ? {} : { id: Number(id) }),
    };
    const r = await upsert.mutateAsync(payload);
    await qc.invalidateQueries();
    setSaved(true);
    if (isNew) navigate(`/admin/locations/${r.id}`, { replace: true });
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-4xl">
      <Link to="/admin/locations" className="group inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-concrete hover:text-ink">
        <ArrowLeft className="h-3.5 w-3.5 text-mahoney transition-transform group-hover:-translate-x-1" /> All Locations
      </Link>
      <div className="mt-4 flex items-center justify-between">
        <h1 className="display-2 text-2xl text-ink sm:text-3xl">{isNew ? "New Location" : form.city || "Edit Location"}</h1>
        <ABtn onClick={save} disabled={upsert.isPending}>
          {upsert.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : saved ? <Check className="h-3.5 w-3.5" /> : null}
          {saved ? "Saved" : "Save Location"}
        </ABtn>
      </div>

      <div className="mt-8 space-y-6">
        <ACard className="grid gap-5 sm:grid-cols-2">
          <AField label="City *"><input className="field-input" value={form.city} onChange={(e) => { upd("city", e.target.value); if (isNew) upd("slug", slugify(`${e.target.value}-${form.state}`)); }} placeholder="Syracuse" /></AField>
          <AField label="State *"><input className="field-input" value={form.state} onChange={(e) => upd("state", e.target.value)} placeholder="NY" /></AField>
          <AField label="URL Slug *"><input className="field-input font-mono text-[13px]" value={form.slug} onChange={(e) => upd("slug", slugify(e.target.value))} /></AField>
          <AField label="Region *"><input className="field-input" value={form.region} onChange={(e) => upd("region", e.target.value)} placeholder="Central New York" /></AField>
          <div className="sm:col-span-2">
            <AField label="Serves *" hint="Short description of the coverage area.">
              <input className="field-input" value={form.serves} onChange={(e) => upd("serves", e.target.value)} placeholder="Central & Upstate New York" />
            </AField>
          </div>
          <div className="sm:col-span-2">
            <AField label="Blurb *" hint="One or two sentences shown on the location card.">
              <textarea className="field-input resize-y" rows={2} value={form.blurb} onChange={(e) => upd("blurb", e.target.value)} />
            </AField>
          </div>
        </ACard>

        <ACard>
          <h2 className="font-display text-sm font-bold uppercase tracking-[0.18em] text-ink">Contact</h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <AField label="Address"><input className="field-input" value={form.address} onChange={(e) => upd("address", e.target.value)} placeholder="123 Main St, Syracuse, NY 13202" /></AField>
            </div>
            <AField label="Phone"><input className="field-input" value={form.phone} onChange={(e) => upd("phone", e.target.value)} /></AField>
            <AField label="Email"><input className="field-input" value={form.email} onChange={(e) => upd("email", e.target.value)} /></AField>
          </div>
        </ACard>

        <ACard>
          <h2 className="font-display text-sm font-bold uppercase tracking-[0.18em] text-ink">Map Coordinates</h2>
          <p className="mt-1 text-xs text-concrete">Used to place the marker on the Locations map. Decimal degrees.</p>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <AField label="Latitude"><input type="number" step="any" className="field-input" value={form.lat} onChange={(e) => upd("lat", Number(e.target.value))} placeholder="43.0481" /></AField>
            <AField label="Longitude"><input type="number" step="any" className="field-input" value={form.lng} onChange={(e) => upd("lng", Number(e.target.value))} placeholder="-76.1474" /></AField>
          </div>
        </ACard>

        <ACard className="flex flex-wrap items-center gap-8">
          <label className="flex cursor-pointer items-center gap-3">
            <input type="checkbox" checked={form.hq} onChange={(e) => upd("hq", e.target.checked)} className="h-4 w-4 accent-mahoney" />
            <span className="font-display text-[12px] font-bold uppercase tracking-[0.14em] text-ink">Headquarters</span>
          </label>
          <AField label="Sort Order">
            <input type="number" className="field-input !w-28" value={form.sortOrder} onChange={(e) => upd("sortOrder", Number(e.target.value))} />
          </AField>
        </ACard>
      </div>
    </div>
  );
}
