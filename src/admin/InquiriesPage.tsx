import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { trpc } from "@/providers/trpc";
import { Loader2, MailOpen, Mail, Trash2, Phone, Building, Tag } from "lucide-react";
import { cn } from "@/lib/utils";

const TYPE_LABELS: Record<string, string> = {
  project: "New Project",
  subcontractor: "Subcontractor",
  career: "Careers",
  general: "General",
};

export default function InquiriesPage() {
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [openId, setOpenId] = useState<number | null>(null);
  const { data, isLoading } = trpc.inquiries.list.useQuery({ unreadOnly });
  const setRead = trpc.inquiries.setRead.useMutation();
  const del = trpc.inquiries.delete.useMutation();
  const qc = useQueryClient();

  const toggleOpen = async (id: number, read: boolean) => {
    setOpenId(openId === id ? null : id);
    if (!read) {
      await setRead.mutateAsync({ id, read: true });
      await qc.invalidateQueries();
    }
  };

  return (
    <div className="max-w-4xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="display-2 text-2xl text-ink sm:text-3xl">Inquiries</h1>
          <p className="mt-2 text-sm text-concrete">Every form submission on the site lands here — project leads, subcontractor prequals, and career applications.</p>
        </div>
        <button
          onClick={() => setUnreadOnly(!unreadOnly)}
          className={cn(
            "border px-4 py-2 font-display text-[11px] font-semibold uppercase tracking-[0.16em] transition-all",
            unreadOnly ? "border-mahoney bg-mahoney text-white" : "border-ink/15 text-concrete hover:border-ink/40"
          )}
        >
          {unreadOnly ? "Showing Unread" : "Show Unread Only"}
        </button>
      </div>

      {isLoading ? (
        <Loader2 className="mt-10 h-6 w-6 animate-spin text-mahoney" />
      ) : (
        <div className="mt-8 divide-y divide-fog border border-fog bg-white">
          {(data ?? []).map((inq) => (
            <div key={inq.id} className={cn("transition-colors", !inq.read && "bg-mahoney/[0.03]")}>
              <button
                onClick={() => toggleOpen(inq.id, inq.read)}
                className="flex w-full items-center gap-4 p-4 text-left hover:bg-bone/70"
              >
                <span className={cn("h-2 w-2 shrink-0 rounded-full", inq.read ? "bg-fog" : "bg-mahoney")} />
                <div className="min-w-0 flex-1">
                  <p className="flex flex-wrap items-center gap-2">
                    <span className={cn("text-sm", inq.read ? "font-medium text-ink/80" : "font-bold text-ink")}>{inq.name}</span>
                    <span className="bg-bone px-2 py-0.5 font-display text-[9px] font-bold uppercase tracking-wider text-concrete">
                      {TYPE_LABELS[inq.type] ?? inq.type}
                    </span>
                    {inq.projectType && (
                      <span className="bg-mahoney/10 px-2 py-0.5 font-display text-[9px] font-bold uppercase tracking-wider text-mahoney">
                        {inq.projectType}
                      </span>
                    )}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-concrete">{inq.message}</p>
                </div>
                <span className="shrink-0 text-[11px] text-concrete/60">
                  {new Date(inq.createdAt).toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
                </span>
                {inq.read ? <MailOpen className="h-4 w-4 shrink-0 text-concrete/40" /> : <Mail className="h-4 w-4 shrink-0 text-mahoney" />}
              </button>

              {openId === inq.id && (
                <div className="border-t border-fog bg-bone/50 px-6 py-5">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="field-label">Contact</p>
                      <p className="text-sm font-semibold text-ink">{inq.name}</p>
                      <a href={`mailto:${inq.email}`} className="text-sm text-mahoney hover:underline">{inq.email}</a>
                      <div className="mt-1 flex flex-wrap gap-x-4 text-sm text-concrete">
                        {inq.phone && <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {inq.phone}</span>}
                        {inq.company && <span className="flex items-center gap-1"><Building className="h-3 w-3" /> {inq.company}</span>}
                      </div>
                    </div>
                    {inq.meta && Object.keys(inq.meta).length > 0 && (
                      <div>
                        <p className="field-label">Details</p>
                        <ul className="space-y-1 text-sm text-concrete">
                          {Object.entries(inq.meta as Record<string, string>).map(([k, v]) => (
                            <li key={k} className="flex items-center gap-1.5">
                              <Tag className="h-3 w-3 text-mahoney" /> <span className="font-medium text-ink">{k}:</span> {v}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  <div className="mt-4">
                    <p className="field-label">Message</p>
                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-ink/85">{inq.message}</p>
                  </div>
                  <div className="mt-5 flex gap-3">
                    <a href={`mailto:${inq.email}?subject=Re: Your inquiry to Mahoney Design %26 Build`} className="inline-flex items-center gap-2 bg-mahoney px-4 py-2.5 font-display text-[11px] font-bold uppercase tracking-[0.16em] text-white hover:bg-oxblood">
                      Reply by Email
                    </a>
                    <button
                      onClick={async () => { await setRead.mutateAsync({ id: inq.id, read: !inq.read }); await qc.invalidateQueries(); }}
                      className="border border-ink/20 px-4 py-2.5 font-display text-[11px] font-bold uppercase tracking-[0.16em] text-ink hover:border-ink"
                    >
                      Mark {inq.read ? "Unread" : "Read"}
                    </button>
                    <button
                      onClick={async () => { if (confirm("Delete this inquiry?")) { await del.mutateAsync({ id: inq.id }); setOpenId(null); await qc.invalidateQueries(); } }}
                      className="flex items-center gap-1.5 border border-red-300 px-4 py-2.5 font-display text-[11px] font-bold uppercase tracking-[0.16em] text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
          {(data ?? []).length === 0 && (
            <p className="p-16 text-center text-sm text-concrete">
              {unreadOnly ? "No unread inquiries — you're all caught up." : "No inquiries yet. Forms on the site feed this inbox automatically."}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
