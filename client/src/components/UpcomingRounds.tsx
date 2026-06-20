import { Link } from "react-router-dom";
import { Clock, Calendar, ChevronRight, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Card } from "./ui/Card";
import { Chip } from "./ui/Chip";
import { useApplications } from "../hooks/useApplications";
import { getCompany } from "../data/companies";
import { useMemo } from "react";

// Daily-open habit driver — shows the next 5 OA/interview dates with urgency-
// coded countdowns. Yellow at 3-7 days, red under 3 days, green > 7 days.
// Empty state CTAs the user toward /applications to add a date.

export function UpcomingRounds({ limit = 5 }: { limit?: number }) {
  const { upcoming } = useApplications();
  const now = Date.now();

  const items = useMemo(() => {
    return upcoming.slice(0, limit).map((a) => {
      const t = new Date(a.nextActionAt!).getTime();
      const msDelta = t - now;
      const dayDelta = Math.round(msDelta / 86_400_000);
      const company = getCompany(a.companySlug);
      let urgency: "now" | "critical" | "soon" | "later";
      if (dayDelta <= 0) urgency = "now";
      else if (dayDelta < 3) urgency = "critical";
      else if (dayDelta < 8) urgency = "soon";
      else urgency = "later";
      return { app: a, dayDelta, urgency, company };
    });
  }, [upcoming, limit, now]);

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="mono text-[10px] uppercase tracking-widest text-[var(--color-neon)] mb-1">
            · upcoming ·
          </div>
          <h3 className="display text-xl">Next rounds</h3>
        </div>
        <Link
          to="/applications"
          className="text-[11px] text-[var(--color-text-faint)] hover:text-[var(--color-text)] inline-flex items-center gap-1"
        >
          Kanban <ChevronRight className="w-3 h-3" />
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-8">
          <Calendar className="w-8 h-8 text-[var(--color-text-faint)] mx-auto mb-2" />
          <div className="text-sm text-[var(--color-text-faint)] mb-1">No scheduled rounds yet.</div>
          <Link
            to="/applications"
            className="text-xs text-[var(--color-neon)] underline"
          >
            Add OA or interview date →
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map(({ app, dayDelta, urgency, company }) => (
            <div
              key={app.id}
              className="border border-[var(--color-line)] rounded-xl p-3 flex items-center gap-3 hover:border-[var(--color-neon)]/30 transition-colors"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 display text-base"
                style={{
                  background: company?.brandColor || "#1a1a1a",
                  color: company?.brandColor ? "#fff" : "#c8ff3d",
                }}
              >
                {company?.logoLetter || "?"}
              </div>

              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold truncate">
                  {company?.name || app.companySlug}{" "}
                  <span className="text-[var(--color-text-faint)] font-normal">· {app.role}</span>
                </div>
                <div className="text-[11px] text-[var(--color-text-faint)] truncate flex items-center gap-1.5">
                  <Clock className="w-3 h-3" />
                  {app.nextActionLabel || "Next round"} ·{" "}
                  {new Date(app.nextActionAt!).toLocaleDateString("en-IN", {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                  })}
                </div>
              </div>

              <UrgencyPill urgency={urgency} dayDelta={dayDelta} />
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

function UrgencyPill({
  urgency,
  dayDelta,
}: {
  urgency: "now" | "critical" | "soon" | "later";
  dayDelta: number;
}) {
  if (urgency === "now") {
    return (
      <Chip tone="neon" active className="!gap-1">
        <AlertTriangle className="w-3 h-3" /> TODAY
      </Chip>
    );
  }
  if (urgency === "critical") {
    return (
      <span className="text-[10px] mono uppercase tracking-widest px-2.5 py-1 rounded-full bg-[#ff5247]/15 text-[var(--severity-crit-text)] border border-[#ff5247]/30 inline-flex items-center gap-1">
        <AlertTriangle className="w-3 h-3" /> {dayDelta}d
      </span>
    );
  }
  if (urgency === "soon") {
    return (
      <span className="text-[10px] mono uppercase tracking-widest px-2.5 py-1 rounded-full bg-[#ffe87a]/15 text-[var(--severity-warn-text)] border border-[#ffe87a]/30">
        {dayDelta}d
      </span>
    );
  }
  return (
    <span className="text-[10px] mono uppercase tracking-widest px-2.5 py-1 rounded-full bg-[var(--color-card-soft)] text-[var(--color-text-dim)] border border-[var(--color-line)] inline-flex items-center gap-1">
      <CheckCircle2 className="w-3 h-3" /> {dayDelta}d
    </span>
  );
}
