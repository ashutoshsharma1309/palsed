import { useState } from "react";
import { Filter, X, Settings2 } from "lucide-react";
import { useStudentProfile, BRANCHES } from "../hooks/useStudentProfile";
import { Card } from "./ui/Card";
import { Chip } from "./ui/Chip";

// Slim row that sits above the Companies grid. When eligibility filter is OFF,
// shows a single CTA pill: "Filter to my profile". When ON, shows the active
// criteria as chips with a clear-button. Clicking the cog opens an inline
// editor for CGPA / branch / backlogs.
export function EligibilityBar() {
  const { profile, update } = useStudentProfile();
  const [editing, setEditing] = useState(false);

  const hasAnyProfile = profile.cgpa != null || profile.branch != null || profile.hasBacklogs;

  return (
    <Card className="mb-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-[var(--color-neon)]" />
          <span className="mono text-[11px] uppercase tracking-widest text-[var(--color-text-dim)]">Eligibility</span>

          {profile.filterEnabled && hasAnyProfile ? (
            <div className="flex items-center gap-2 flex-wrap">
              {profile.cgpa != null && (
                <Chip tone="neon" active>CGPA ≥ {profile.cgpa}</Chip>
              )}
              {profile.branch && (
                <Chip tone="neon" active>{profile.branch}</Chip>
              )}
              {profile.hasBacklogs && (
                <Chip tone="neon" active>With backlogs</Chip>
              )}
              <button
                onClick={() => update({ filterEnabled: false })}
                className="text-[11px] text-[var(--color-text-faint)] hover:text-[var(--color-text)] inline-flex items-center gap-1"
              >
                <X className="w-3 h-3" /> Show all
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                if (hasAnyProfile) update({ filterEnabled: true });
                else setEditing(true);
              }}
              className="text-[11px] px-3 py-1 rounded-full border border-[var(--color-neon)]/40 text-[var(--color-neon)] hover:bg-[var(--color-neon)]/10"
            >
              {hasAnyProfile ? "Filter to my profile" : "Set my profile →"}
            </button>
          )}
        </div>

        <button
          onClick={() => setEditing((v) => !v)}
          className="text-[11px] text-[var(--color-text-faint)] hover:text-[var(--color-text)] inline-flex items-center gap-1"
          aria-label="Edit eligibility profile"
        >
          <Settings2 className="w-3.5 h-3.5" />
          {editing ? "Done" : "Edit"}
        </button>
      </div>

      {editing && (
        <div className="mt-4 pt-4 border-t border-[var(--color-line)] grid sm:grid-cols-4 gap-3">
          <div>
            <label className="mono text-[10px] uppercase tracking-widest text-[var(--color-text-faint)]">CGPA (/10)</label>
            <input
              type="number"
              step={0.01}
              min={0}
              max={10}
              value={profile.cgpa ?? ""}
              onChange={(e) =>
                update({ cgpa: e.target.value === "" ? null : Number(e.target.value) })
              }
              placeholder="8.5"
              className="w-full mt-1 bg-[var(--color-card-soft)] border border-[var(--color-line)] rounded-lg px-3 py-1.5 text-sm outline-none focus:border-[var(--color-neon)]"
            />
          </div>
          <div>
            <label className="mono text-[10px] uppercase tracking-widest text-[var(--color-text-faint)]">10th %</label>
            <input
              type="number"
              min={0}
              max={100}
              value={profile.tenthPct ?? ""}
              onChange={(e) =>
                update({ tenthPct: e.target.value === "" ? null : Number(e.target.value) })
              }
              placeholder="80"
              className="w-full mt-1 bg-[var(--color-card-soft)] border border-[var(--color-line)] rounded-lg px-3 py-1.5 text-sm outline-none focus:border-[var(--color-neon)]"
            />
          </div>
          <div>
            <label className="mono text-[10px] uppercase tracking-widest text-[var(--color-text-faint)]">12th %</label>
            <input
              type="number"
              min={0}
              max={100}
              value={profile.twelfthPct ?? ""}
              onChange={(e) =>
                update({ twelfthPct: e.target.value === "" ? null : Number(e.target.value) })
              }
              placeholder="75"
              className="w-full mt-1 bg-[var(--color-card-soft)] border border-[var(--color-line)] rounded-lg px-3 py-1.5 text-sm outline-none focus:border-[var(--color-neon)]"
            />
          </div>
          <div>
            <label className="mono text-[10px] uppercase tracking-widest text-[var(--color-text-faint)]">Branch</label>
            <select
              value={profile.branch ?? ""}
              onChange={(e) => update({ branch: e.target.value || null })}
              className="w-full mt-1 bg-[var(--color-card-soft)] border border-[var(--color-line)] rounded-lg px-3 py-1.5 text-sm outline-none focus:border-[var(--color-neon)]"
            >
              <option value="">— Select —</option>
              {BRANCHES.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-4 flex items-center justify-between gap-3 pt-2">
            <label className="inline-flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={profile.hasBacklogs}
                onChange={(e) => update({ hasBacklogs: e.target.checked })}
                className="accent-[var(--color-neon)]"
              />
              <span>I have active backlogs</span>
            </label>
            <button
              onClick={() => {
                update({ filterEnabled: true });
                setEditing(false);
              }}
              className="text-xs px-3 py-1.5 rounded-full bg-[var(--color-neon)] text-black font-semibold hover:opacity-90"
            >
              Apply filter →
            </button>
          </div>
        </div>
      )}
    </Card>
  );
}
