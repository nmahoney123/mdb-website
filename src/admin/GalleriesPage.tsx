import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { trpc } from "@/providers/trpc";
import { ABtn, ACard, ImagePicker, uploadFile } from "./ui";
import { Loader2, Trash2, Upload, ChevronUp, ChevronDown, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const GALLERY_TABS = [
  { key: "self-storage", label: "Self Storage" },
  { key: "custom-homes", label: "Custom Homes" },
  { key: "extreme-makeover", label: "Extreme Makeover" },
];

export default function GalleriesPage() {
  const [tab, setTab] = useState(GALLERY_TABS[0].key);
  const [newUrl, setNewUrl] = useState<string | null>(null);
  const [newCaption, setNewCaption] = useState("");
  const [uploading, setUploading] = useState(false);
  const qc = useQueryClient();

  const { data: images, isLoading } = trpc.galleries.list.useQuery({ key: tab });
  const add = trpc.galleries.add.useMutation();
  const update = trpc.galleries.update.useMutation();
  const del = trpc.galleries.delete.useMutation();

  const refresh = async () => {
    setNewUrl(null);
    setNewCaption("");
    await qc.invalidateQueries();
  };

  const addImage = async () => {
    if (!newUrl) return;
    await add.mutateAsync({ galleryKey: tab, url: newUrl, caption: newCaption || undefined, sortOrder: (images?.length ?? 0) });
    await refresh();
  };

  const quickUpload = async (file: File) => {
    setUploading(true);
    const r = await uploadFile(file);
    setUploading(false);
    if (r) {
      await add.mutateAsync({ galleryKey: tab, url: r.url, sortOrder: (images?.length ?? 0) });
      await refresh();
    }
  };

  const move = async (idx: number, dir: -1 | 1) => {
    if (!images) return;
    const other = idx + dir;
    if (other < 0 || other >= images.length) return;
    const a = images[idx], b = images[other];
    await update.mutateAsync({ id: a.id, sortOrder: b.sortOrder });
    await update.mutateAsync({ id: b.id, sortOrder: a.sortOrder });
    await qc.invalidateQueries();
  };

  return (
    <div className="max-w-5xl">
      <h1 className="display-2 text-2xl text-ink sm:text-3xl">Galleries</h1>
      <p className="mt-2 text-sm text-concrete">
        Photo galleries shown on the industry pages. Upload images, set captions, reorder, or remove.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {GALLERY_TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              "border px-4 py-2 font-display text-[11px] font-semibold uppercase tracking-[0.16em] transition-all",
              tab === t.key ? "border-mahoney bg-mahoney text-white" : "border-ink/15 text-concrete hover:border-ink/40 hover:text-ink"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <Loader2 className="mt-10 h-6 w-6 animate-spin text-mahoney" />
      ) : (
        <>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {(images ?? []).map((img, idx) => (
              <div key={img.id} className="group border border-fog bg-white">
                <div className="relative aspect-[4/3] overflow-hidden bg-bone">
                  <img src={img.url} alt={img.caption ?? ""} className="h-full w-full object-cover" loading="lazy" />
                  <div className="absolute right-1 top-1 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <button onClick={() => move(idx, -1)} className="bg-ink/80 p-1.5 text-white hover:bg-ink" aria-label="Move up"><ChevronUp className="h-3.5 w-3.5" /></button>
                    <button onClick={() => move(idx, 1)} className="bg-ink/80 p-1.5 text-white hover:bg-ink" aria-label="Move down"><ChevronDown className="h-3.5 w-3.5" /></button>
                    <button
                      onClick={async () => { if (confirm("Remove this image from the gallery?")) { await del.mutateAsync({ id: img.id }); await qc.invalidateQueries(); } }}
                      className="bg-mahoney p-1.5 text-white hover:bg-oxblood" aria-label="Delete"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
                <input
                  className="w-full border-t border-fog px-3 py-2 text-xs text-ink placeholder:text-concrete/50 focus:outline-none"
                  defaultValue={img.caption ?? ""}
                  placeholder="Add a caption…"
                  onBlur={async (e) => {
                    if (e.target.value !== (img.caption ?? "")) {
                      await update.mutateAsync({ id: img.id, caption: e.target.value });
                      await qc.invalidateQueries();
                    }
                  }}
                />
              </div>
            ))}

            {/* Quick upload tile */}
            <label className={cn("flex aspect-[4/3] cursor-pointer flex-col items-center justify-center gap-2 border-2 border-dashed border-ink/20 bg-white text-concrete transition-colors hover:border-mahoney hover:text-mahoney", uploading && "opacity-50")}>
              {uploading ? <Loader2 className="h-6 w-6 animate-spin" /> : <Upload className="h-6 w-6" />}
              <span className="font-display text-[10px] font-bold uppercase tracking-[0.2em]">Upload Photo</span>
              <input type="file" accept="image/*" className="hidden" disabled={uploading} onChange={(e) => e.target.files?.[0] && quickUpload(e.target.files[0])} />
            </label>
          </div>

          <ACard className="mt-8">
            <h2 className="font-display text-sm font-bold uppercase tracking-[0.18em] text-ink">Add from Media Library</h2>
            <div className="mt-4 flex flex-wrap items-end gap-4">
              <ImagePicker label="Image" value={newUrl} onChange={setNewUrl} />
              <div className="flex-1 min-w-[200px]">
                <label className="field-label">Caption</label>
                <input className="field-input" value={newCaption} onChange={(e) => setNewCaption(e.target.value)} placeholder="Describe the photo…" />
              </div>
              <ABtn onClick={addImage} disabled={!newUrl || add.isPending}>
                <Plus className="h-3.5 w-3.5" /> Add to Gallery
              </ABtn>
            </div>
          </ACard>
        </>
      )}
    </div>
  );
}
