import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, Plus, Trash2, ExternalLink, ArrowUpRight } from "lucide-react";
import toast from "react-hot-toast";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Chip } from "../components/ui/Chip";
import { useApplications } from "../hooks/useApplications";
import { COMPANIES, getCompany } from "../data/companies";
import { Application, ApplicationStatus, STATUS_COLORS, STATUS_LABELS, STATUS_ORDER, ACTIVE_STATUSES } from "../types/application";

const KANBAN_COLS: ApplicationStatus[] = ["wishlist","applied","oa","tech1","tech2","tech3","hr","offered"];

export default function Applications() {
  const { apps, add, transition, update, remove, offers, upcoming } = useApplications();
  const [companySlug, setCompanySlug] = useState("");
  const [role, setRole] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [edit, setEdit] = useState<Application | null>(null);

  const visibleApps = useMemo(() => {
    if (showAll) return apps;
    return apps.filter((a) => ACTIVE_STATUSES.includes(a.status) || a.status === "offered");
  }, [apps, showAll]);

  const grouped = useMemo(() => {
    const g: Record<ApplicationStatus, Application[]> = {} as any;
    KANBAN_COLS.forEach((c) => (g[c] = []));
    visibleApps.forEach((a) => {
      if (g[a.status]) g[a.status].push(a);
    });
    return g;
  }, [visibleApps]);

  const onAdd = () => {
    if (!companySlug) return toast.error("Pick a company");
    const c = getCompany(companySlug);
    const r = role.trim() || c?.rolesOffered[0] || "SDE";
    add({ companySlug, role: r, source: "campus" });
    toast.success(`Tracking ${c?.name}`);
    setCompanySlug("");
    setRole("");
  };

  const conversionRate = apps.length ? Math.round((offers.length / apps.length) * 100) : 0;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
      <header className="mb-8">
        <div className="mono text-xs uppercase tracking-[0.3em] text-[var(--color-neon)] mb-2">// my placement season</div>
        <h1 className="display text-5xl sm:text-7xl">APPLICATIONS.</h1>
        <p className="text-[var(--color-text-faint)] mt-2 max-w-2xl">
          Every company you applied to. Every round date. Every offer. Drag through the pipeline
          as you progress.
        </p>
      </header>

      {/* QUICK STATS */}
      <div className="grid sm:grid-cols-4 gap-4 mb-6">
        <Card>
          <div className="mono text-[10px] uppercase tracking-widest text-[var(--color-text-faint)]">Total tracked</div>
          <div className="display text-4xl">{apps.length}</div>
        </Card>
        <Card>
          <div className="mono text-[10px] uppercase tracking-widest text-[var(--color-text-faint)]">Active</div>
          <div className="display text-4xl">{apps.filter((a) => ACTIVE_STATUSES.includes(a.status)).length}</div>
        </Card>
        <Card>
          <div className="mono text-[10px] uppercase tracking-widest text-[var(--color-text-faint)]">Offers</div>
          <div className="display text-4xl neon-text">{offers.length}</div>
        </Card>
        <Card>
          <div className="mono text-[10px] uppercase tracking-widest text-[var(--color-text-faint)]">Conversion</div>
          <div className="display text-4xl">{conversionRate}<span className="text-lg text-[var(--color-text-faint)]">%</span></div>
        </Card>
      </div>

      {/* UPCOMING */}
      {upcoming.length > 0 && (
        <Card className="mb-6 border-[var(--color-neon)]/30">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-4 h-4 text-[var(--color-neon)]" />
            <h3 className="font-bold">UPCOMING THIS WEEK</h3>
          </div>
          <div className="space-y-2">
            {upcoming.slice(0, 5).map((a) => {
              const c = getCompany(a.companySlug);
              const days = Math.ceil((new Date(a.nextActionAt!).getTime() - Date.now()) / 86400000);
              return (
                <div key={a.id} className="flex items-center gap-3 text-sm">
                  <span className="display text-2xl text-[var(--color-neon)] w-12 text-right">{days >= 0 ? `+${days}d` : `${days}d`}</span>
                  <span className="font-semibold flex-1">{c?.name} · {a.role}</span>
                  <span className="text-xs text-[var(--color-text-faint)]">{a.nextActionLabel || STATUS_LABELS[a.status]}</span>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* ADD APPLICATION */}
      <Card className="mb-6">
        <h3 className="font-bold mb-3 flex items-center gap-2"><Plus className="w-4 h-4 text-[var(--color-neon)]" /> Add an application</h3>
        <div className="grid sm:grid-cols-[1fr_1fr_auto] gap-3">
          <select
            className="bg-[#1a1a1a] border border-[var(--color-line)] rounded-lg p-3"
            value={companySlug}
            onChange={(e) => setCompanySlug(e.target.value)}
          >
            <option value="">— company —</option>
            {COMPANIES.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
          </select>
          <input
            className="bg-[#1a1a1a] border border-[var(--color-line)] rounded-lg p-3"
            placeholder="Role (e.g. SDE-1)"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          />
          <Button onClick={onAdd}>Track</Button>
        </div>
      </Card>

      {/* TOGGLE */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="display text-3xl">PIPELINE.</h2>
        <button
          className="text-xs text-[var(--color-text-faint)] hover:text-[var(--color-text)]"
          onClick={() => setShowAll((v) => !v)}
        >
          {showAll ? "Hide finished" : "Show all (incl. rejected)"}
        </button>
      </div>

      {/* KANBAN */}
      <div className="overflow-x-auto">
        <div className="grid grid-cols-[repeat(8,260px)] gap-3 pb-4">
          {KANBAN_COLS.map((col) => (
            <div key={col}>
              <div className="flex items-center justify-between mb-2 px-2">
                <div className="mono text-[10px] uppercase tracking-widest" style={{ color: STATUS_COLORS[col] }}>
                  {STATUS_LABELS[col]}
                </div>
                <div className="mono text-[10px] text-[var(--color-text-faint)]">{grouped[col].length}</div>
              </div>
              <div className="space-y-2 min-h-[120px] p-2 rounded-xl bg-[var(--color-card-soft)]">
                {grouped[col].map((a) => (
                  <AppCard
                    key={a.id}
                    app={a}
                    onMove={(to) => transition(a.id, to)}
                    onEdit={() => setEdit(a)}
                    onDelete={() => {
                      if (confirm("Delete this application?")) remove(a.id);
                    }}
                  />
                ))}
                {grouped[col].length === 0 && (
                  <div className="text-[10px] text-[var(--color-text-faint)] mono uppercase tracking-widest text-center py-6">empty</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {showAll && (
        <Card className="mt-6">
          <h3 className="display text-2xl mb-3">ARCHIVED</h3>
          <div className="space-y-2">
            {apps.filter((a) => ["rejected","joined","withdrawn"].includes(a.status)).map((a) => {
              const c = getCompany(a.companySlug);
              return (
                <div key={a.id} className="flex items-center justify-between gap-2 border border-[var(--color-line)] rounded-lg p-3">
                  <div className="text-sm">
                    <span className="font-semibold">{c?.name}</span>
                    <span className="text-[var(--color-text-faint)] ml-2">{a.role}</span>
                  </div>
                  <Chip tone={a.status === "joined" ? "success" : "warn"}>{STATUS_LABELS[a.status]}</Chip>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {edit && <EditDrawer app={edit} onClose={() => setEdit(null)} onSave={(p) => { update(edit.id, p); setEdit(null); toast.success("Saved"); }} />}
    </div>
  );
}

function AppCard({ app, onMove, onEdit, onDelete }: { app: Application; onMove: (to: ApplicationStatus) => void; onEdit: () => void; onDelete: () => void }) {
  const c = getCompany(app.companySlug);
  const nextStatus = STATUS_ORDER[STATUS_ORDER.indexOf(app.status) + 1];
  return (
    <div className="card-base !p-3 group">
      <div className="flex items-start gap-2 mb-1.5">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 display text-base"
          style={{ background: c?.brandColor || "#1a1a1a", color: c?.brandColor ? "#fff" : "#c8ff3d" }}
        >
          {c?.logoLetter}
        </div>
        <div className="flex-1 min-w-0">
          <Link to={`/companies/${c?.slug}`} className="font-semibold text-sm hover:text-[var(--color-neon)] truncate block">{c?.name}</Link>
          <div className="text-[10px] mono text-[var(--color-text-faint)] truncate">{app.role}</div>
        </div>
      </div>
      {app.nextActionAt && (
        <div className="mono text-[10px] text-[var(--color-neon)] flex items-center gap-1">
          <Calendar className="w-3 h-3" /> {new Date(app.nextActionAt).toLocaleDateString()}
        </div>
      )}
      {app.notes && <div className="text-[11px] text-[var(--color-text-faint)] mt-1 line-clamp-2">{app.notes}</div>}
      <div className="flex items-center justify-between mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={onEdit} className="text-[10px] text-[var(--color-text-faint)] hover:text-[var(--color-text)]">edit</button>
        <div className="flex gap-1">
          {nextStatus && (
            <button onClick={() => onMove(nextStatus)} className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--color-neon)]/20 text-[var(--color-neon)]" title={`Move → ${STATUS_LABELS[nextStatus]}`}>
              → {STATUS_LABELS[nextStatus]}
            </button>
          )}
          {app.status !== "rejected" && (
            <button onClick={() => onMove("rejected")} className="text-[10px] text-red-300/70 hover:text-red-300" title="Reject">✕</button>
          )}
          <button onClick={onDelete} className="text-[10px] text-[var(--color-text-faint)] hover:text-red-300" title="Delete"><Trash2 className="w-3 h-3" /></button>
        </div>
      </div>
    </div>
  );
}

function EditDrawer({ app, onClose, onSave }: { app: Application; onClose: () => void; onSave: (patch: Partial<Application>) => void }) {
  const c = getCompany(app.companySlug);
  const [role, setRole] = useState(app.role);
  const [status, setStatus] = useState<ApplicationStatus>(app.status);
  const [nextActionAt, setNextActionAt] = useState(app.nextActionAt?.slice(0, 10) || "");
  const [nextActionLabel, setNextActionLabel] = useState(app.nextActionLabel || "");
  const [ctcOffered, setCtcOffered] = useState(app.ctcOffered?.toString() || "");
  const [notes, setNotes] = useState(app.notes || "");

  return (
    <div className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div className="card-base p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center display text-xl" style={{ background: c?.brandColor || "#1a1a1a", color: c?.brandColor ? "#fff" : "#c8ff3d" }}>{c?.logoLetter}</div>
          <div>
            <div className="font-bold">{c?.name}</div>
            <Link to={`/companies/${c?.slug}`} className="text-xs text-[var(--color-neon)] underline inline-flex items-center gap-1">view prep kit <ArrowUpRight className="w-3 h-3" /></Link>
          </div>
        </div>
        <div className="space-y-4">
          <Field label="Role"><input className="w-full bg-[#1a1a1a] border border-[var(--color-line)] rounded p-2" value={role} onChange={(e) => setRole(e.target.value)} /></Field>
          <Field label="Status">
            <select className="w-full bg-[#1a1a1a] border border-[var(--color-line)] rounded p-2" value={status} onChange={(e) => setStatus(e.target.value as ApplicationStatus)}>
              {STATUS_ORDER.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
            </select>
          </Field>
          <div className="grid grid-cols-2 gap-2">
            <Field label="Next action date"><input type="date" className="w-full bg-[#1a1a1a] border border-[var(--color-line)] rounded p-2" value={nextActionAt} onChange={(e) => setNextActionAt(e.target.value)} /></Field>
            <Field label="Next action"><input className="w-full bg-[#1a1a1a] border border-[var(--color-line)] rounded p-2" placeholder="OA / Tech 2 / HR" value={nextActionLabel} onChange={(e) => setNextActionLabel(e.target.value)} /></Field>
          </div>
          {(status === "offered" || status === "joined") && (
            <Field label="CTC Offered (LPA)"><input type="number" className="w-full bg-[#1a1a1a] border border-[var(--color-line)] rounded p-2" value={ctcOffered} onChange={(e) => setCtcOffered(e.target.value)} /></Field>
          )}
          <Field label="Notes"><textarea rows={3} className="w-full bg-[#1a1a1a] border border-[var(--color-line)] rounded p-2 resize-y" value={notes} onChange={(e) => setNotes(e.target.value)} /></Field>
        </div>
        <div className="flex justify-end gap-2 mt-5">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={() => onSave({
            role,
            status,
            nextActionAt: nextActionAt ? new Date(nextActionAt).toISOString() : undefined,
            nextActionLabel: nextActionLabel || undefined,
            ctcOffered: ctcOffered ? +ctcOffered : undefined,
            notes,
          })}>Save</Button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="text-[10px] uppercase tracking-widest text-[var(--color-text-faint)] mono mb-1">{label}</div>
      {children}
    </label>
  );
}
