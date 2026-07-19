import { useState, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { trpc } from "@/providers/trpc";
import { ImageIcon, Upload, X, Check, Loader2, ChevronUp, ChevronDown, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

/* ---------- Upload helper ---------- */
export async function uploadFile(file: File): Promise<{ url: string } | null> {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch("/api/admin/upload", { method: "POST", body: fd, credentials: "include" });
  if (!res.ok) {
    const j = await res.json().catch(() => ({}));
    alert(j.error || "Upload failed");
    return null;
  }
  const j = await res.json();
  return { url: j.media.url as string };
}

/* ---------- Buttons / fields ---------- */
export function ABtn({
  children, onClick, variant = "primary", disabled, type = "button", className,
}: {
  children: ReactNode; onClick?: () => void; variant?: "primary" | "ghost" | "danger";
  disabled?: boolean; type?: "button" | "submit"; className?: string;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex items-center gap-2 px-4 py-2.5 font-display text-[11px] font-bold uppercase tracking-[0.16em] transition-all disabled:opacity-50 rounded-[2px]",
        variant === "primary" && "bg-mahoney text-white hover:bg-oxblood",
        variant === "ghost" && "border border-ink/20 text-ink hover:border-ink hover:bg-ink hover:text-white",
        variant === "danger" && "border border-red-300 text-red-700 hover:bg-red-50",
        className
      )}
    >
      {children}
    </button>
  );
}

export function AField({
  label, children, hint,
}: { label: string; children: ReactNode; hint?: string }) {
  return (
    <div>
      <label className="field-label">{label}</label>
      {children}
      {hint && <p className="mt-1 text-[11px] text-concrete/70">{hint}</p>}
    </div>
  );
}

export function ACard({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("border border-fog bg-white p-6", className)}>{children}</div>;
}

/* ---------- Image picker (media library + upload) ---------- */
export function ImagePicker({
  value, onChange, label = "Image",
}: {
  value: string | null | undefined;
  onChange: (url: string | null) => void;
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const qc = useQueryClient();
  const { data: library } = trpc.media.list.useQuery(undefined, { enabled: open });

  const doUpload = async (file: File) => {
    setUploading(true);
    const r = await uploadFile(file);
    setUploading(false);
    if (r) {
      await qc.invalidateQueries();
      onChange(r.url);
      setOpen(false);
    }
  };

  return (
    <div>
      <p className="field-label">{label}</p>
      <div className="flex items-start gap-3">
        <div className="flex h-24 w-36 shrink-0 items-center justify-center overflow-hidden border border-fog bg-bone">
          {value ? (
            <img src={value} alt="" className="h-full w-full object-cover" />
          ) : (
            <ImageIcon className="h-5 w-5 text-concrete/50" />
          )}
        </div>
        <div className="flex flex-col gap-2">
          <ABtn variant="ghost" onClick={() => setOpen(true)}>Choose / Upload</ABtn>
          {value && (
            <button onClick={() => onChange(null)} className="text-left text-[11px] font-medium text-red-600 hover:underline">
              Remove
            </button>
          )}
          {value && <p className="max-w-[220px] truncate text-[10px] text-concrete/60">{value}</p>}
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/70 p-4" onClick={() => setOpen(false)}>
          <div className="max-h-[85vh] w-full max-w-3xl overflow-y-auto bg-white p-6" onClick={(e) => e.stopPropagation()}>
            <div className="mb-5 flex items-center justify-between">
              <h3 className="font-display text-lg font-bold uppercase tracking-wide">Media Library</h3>
              <div className="flex items-center gap-2">
                <label className={cn("inline-flex cursor-pointer items-center gap-2 bg-mahoney px-4 py-2.5 font-display text-[11px] font-bold uppercase tracking-[0.16em] text-white hover:bg-oxblood", uploading && "opacity-60")}>
                  {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
                  Upload New
                  <input type="file" accept="image/*,video/mp4,video/webm" className="hidden" disabled={uploading}
                    onChange={(e) => e.target.files?.[0] && doUpload(e.target.files[0])} />
                </label>
                <button onClick={() => setOpen(false)} className="p-2 text-concrete hover:text-ink" aria-label="Close">
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
              {(library ?? []).map((m) => (
                <button
                  key={m.id}
                  onClick={() => { onChange(m.url); setOpen(false); }}
                  className={cn(
                    "group relative aspect-[4/3] overflow-hidden border-2 bg-bone",
                    value === m.url ? "border-mahoney" : "border-transparent hover:border-ink/40"
                  )}
                >
                  {m.kind === "video" ? (
                    <video src={m.url} className="h-full w-full object-cover" muted />
                  ) : (
                    <img src={m.url} alt={m.alt ?? m.filename} className="h-full w-full object-cover" loading="lazy" />
                  )}
                  {value === m.url && (
                    <span className="absolute right-1 top-1 bg-mahoney p-1 text-white"><Check className="h-3 w-3" /></span>
                  )}
                  <span className="absolute inset-x-0 bottom-0 truncate bg-ink/70 px-1.5 py-1 text-left text-[9px] text-white/80 opacity-0 group-hover:opacity-100">
                    {m.filename}
                  </span>
                </button>
              ))}
              {(library ?? []).length === 0 && (
                <p className="col-span-full py-10 text-center text-sm text-concrete">
                  No uploads yet — use Upload New to add images or video.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- Reorder helper ----------
   Move item at `idx` by `dir` (-1 up / +1 down) within `list`, then
   renumber every item's sortOrder to its new index. Returns the payload
   for a `reorder` mutation ({ items }), or null if the move is a no-op.
   Renumbering (rather than swapping) is robust to duplicate/zero sortOrders. */
export function reorderPayload<T extends { id: number }>(
  list: T[],
  idx: number,
  dir: -1 | 1
): { items: { id: number; sortOrder: number }[] } | null {
  const other = idx + dir;
  if (other < 0 || other >= list.length) return null;
  const next = [...list];
  const [moved] = next.splice(idx, 1);
  next.splice(other, 0, moved);
  return { items: next.map((it, i) => ({ id: it.id, sortOrder: i })) };
}

/* ---------- Reusable reorder buttons for table/list rows ---------- */
export function ReorderButtons({
  onUp, onDown, isFirst, isLast,
}: { onUp: () => void; onDown: () => void; isFirst: boolean; isLast: boolean }) {
  return (
    <div className="flex flex-col">
      <button
        type="button"
        onClick={onUp}
        disabled={isFirst}
        className="text-concrete/50 hover:text-ink disabled:opacity-25 disabled:hover:text-concrete/50"
        aria-label="Move up"
      >
        <ChevronUp className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={onDown}
        disabled={isLast}
        className="text-concrete/50 hover:text-ink disabled:opacity-25 disabled:hover:text-concrete/50"
        aria-label="Move down"
      >
        <ChevronDown className="h-4 w-4" />
      </button>
    </div>
  );
}

/* ---------- Toggle (published / boolean) ---------- */
export function PublishToggle({
  published, onToggle,
}: { published: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label="Toggle published"
      className={cn("p-1.5", published ? "text-green-600" : "text-concrete/30 hover:text-concrete")}
    >
      {published ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
    </button>
  );
}

/* ---------- Empty / error / loading states ---------- */
export function ALoading() {
  return <Loader2 className="mt-10 h-6 w-6 animate-spin text-mahoney" />;
}

export function AError({ message }: { message?: string }) {
  return (
    <div className="mt-8 border border-red-200 bg-red-50 p-6 text-sm text-red-700">
      {message ?? "Something went wrong loading this content. Please refresh and try again."}
    </div>
  );
}

/* ---------- List/array text editor (one item per line) ---------- */
export function LinesEditor({
  label, value, onChange, rows = 4, hint,
}: {
  label: string; value: string[]; onChange: (v: string[]) => void; rows?: number; hint?: string;
}) {
  return (
    <AField label={label} hint={hint ?? "One item per line."}>
      <textarea
        className="field-input resize-y font-mono text-[13px]"
        rows={rows}
        value={value.join("\n")}
        onChange={(e) => onChange(e.target.value.split("\n").map((s) => s.trim()).filter(Boolean))}
      />
    </AField>
  );
}
