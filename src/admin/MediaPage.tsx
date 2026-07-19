import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { trpc } from "@/providers/trpc";
import { uploadFile } from "./ui";
import { Loader2, Upload, Trash2, Copy, Check, Film, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

export default function MediaPage() {
  const { data, isLoading } = trpc.media.list.useQuery();
  const del = trpc.media.delete.useMutation();
  const qc = useQueryClient();
  const [uploading, setUploading] = useState(false);
  const [copied, setCopied] = useState<number | null>(null);

  const doUpload = async (files: FileList) => {
    setUploading(true);
    for (const f of Array.from(files)) await uploadFile(f);
    setUploading(false);
    await qc.invalidateQueries();
  };

  const copy = (id: number, url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(id);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="display-2 text-2xl text-ink sm:text-3xl">Media Library</h1>
          <p className="mt-2 text-sm text-concrete">All uploaded images and videos. Use them anywhere — projects, articles, galleries, settings.</p>
        </div>
        <label className={cn("inline-flex cursor-pointer items-center gap-2 bg-mahoney px-4 py-2.5 font-display text-[11px] font-bold uppercase tracking-[0.16em] text-white hover:bg-oxblood", uploading && "opacity-60")}>
          {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
          Upload Files
          <input type="file" multiple accept="image/*,video/mp4,video/webm,video/quicktime" className="hidden" disabled={uploading}
            onChange={(e) => e.target.files && doUpload(e.target.files)} />
        </label>
      </div>

      {isLoading ? (
        <Loader2 className="mt-10 h-6 w-6 animate-spin text-mahoney" />
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {(data ?? []).map((m) => (
            <div key={m.id} className="group border border-fog bg-white">
              <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-bone">
                {m.kind === "video" ? (
                  <>
                    <video src={m.url} className="h-full w-full object-cover" muted />
                    <Film className="absolute left-2 top-2 h-4 w-4 text-white drop-shadow" />
                  </>
                ) : m.kind === "image" ? (
                  <img src={m.url} alt={m.alt ?? m.filename} className="h-full w-full object-cover" loading="lazy" />
                ) : (
                  <FileText className="h-8 w-8 text-concrete/40" />
                )}
                <div className="absolute right-1 top-1 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <button onClick={() => copy(m.id, m.url)} className="bg-ink/80 p-1.5 text-white hover:bg-ink" aria-label="Copy URL">
                    {copied === m.id ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                  <button
                    onClick={async () => { if (confirm(`Delete "${m.filename}"? This cannot be undone.`)) { await del.mutateAsync({ id: m.id }); await qc.invalidateQueries(); } }}
                    className="bg-mahoney p-1.5 text-white hover:bg-oxblood" aria-label="Delete"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              <div className="border-t border-fog px-3 py-2">
                <p className="truncate text-xs font-medium text-ink">{m.filename}</p>
                <p className="text-[10px] text-concrete/60">
                  {m.kind} · {(m.size / 1024).toFixed(0)} KB · {new Date(m.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
          {(data ?? []).length === 0 && (
            <p className="col-span-full py-16 text-center text-sm text-concrete">
              Nothing uploaded yet. Upload images or videos to use across the site.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
