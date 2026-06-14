import { useEngagement } from "../components/adaptive/EngagementProvider";
import { Card } from "../components/ui/Card";

export default function Engagement() {
  const { log, streakDays } = useEngagement();

  // build last 14 days
  const today = new Date();
  const cells: Array<{ key: string; date: Date; ms: number }> = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const ms = log.days.find((x) => x.date === key)?.activeMs ?? 0;
    cells.push({ key, date: d, ms });
  }

  // focus-time histogram by hour-of-day across last 14 days (rough proxy via timestamps in interventions)
  const buckets = new Array(24).fill(0);
  log.interventions.forEach((ev) => {
    buckets[new Date(ev.at).getHours()]++;
  });
  const maxB = Math.max(...buckets, 1);

  // routes total
  const routesAgg: Record<string, number> = {};
  log.days.forEach((d) => Object.entries(d.routes || {}).forEach(([r, v]) => {
    routesAgg[r] = (routesAgg[r] || 0) + v;
  }));
  const topRoutes = Object.entries(routesAgg).sort((a, b) => b[1] - a[1]).slice(0, 6);

  const totalMs = cells.reduce((a, c) => a + c.ms, 0);
  const peakHour = buckets.indexOf(Math.max(...buckets));

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
      <div className="mono text-xs uppercase tracking-[0.3em] text-[var(--color-neon)] mb-2">// engagement</div>
      <h1 className="display text-5xl sm:text-7xl mb-8">ENGAGEMENT.</h1>

      <div className="grid lg:grid-cols-3 gap-5 mb-6">
        <Card>
          <div className="mono text-xs uppercase tracking-widest text-white/50">Streak</div>
          <div className="display text-6xl neon-text">{streakDays}d</div>
        </Card>
        <Card>
          <div className="mono text-xs uppercase tracking-widest text-white/50">14-day total focus</div>
          <div className="display text-6xl">{Math.floor(totalMs / 60000)}<span className="text-3xl">min</span></div>
        </Card>
        <Card>
          <div className="mono text-xs uppercase tracking-widest text-white/50">Peak hour</div>
          <div className="display text-6xl">{peakHour}:00</div>
          <div className="text-xs text-white/40 mt-2">based on intervention timestamps</div>
        </Card>
      </div>

      <Card className="mb-6">
        <div className="mono text-xs uppercase tracking-widest text-white/50 mb-3">Heatmap (last 14 days)</div>
        <div className="grid grid-cols-7 lg:grid-cols-14 gap-2">
          {cells.map((c) => {
            const intensity = Math.min(1, c.ms / (30 * 60 * 1000));
            return (
              <div
                key={c.key}
                className="rounded-md aspect-square flex flex-col items-center justify-center"
                title={`${c.key} · ${Math.floor(c.ms / 60000)} min`}
                style={{ background: intensity > 0 ? `rgba(200,255,61,${0.15 + 0.85 * intensity})` : "#1a1a1a" }}
              >
                <div className="mono text-[9px] text-black/70">{c.date.getDate()}</div>
              </div>
            );
          })}
        </div>
      </Card>

      <div className="grid lg:grid-cols-2 gap-5 mb-6">
        <Card>
          <div className="mono text-xs uppercase tracking-widest text-white/50 mb-3">Intervention hour histogram</div>
          <div className="flex items-end gap-1 h-32">
            {buckets.map((b, h) => (
              <div key={h} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full rounded-sm bg-[var(--color-neon)]"
                  style={{ height: `${(b / maxB) * 100}%`, minHeight: b > 0 ? 4 : 1, opacity: b > 0 ? 1 : 0.2 }}
                />
                {h % 4 === 0 && <div className="mono text-[9px] text-white/40 mt-1">{h}</div>}
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <div className="mono text-xs uppercase tracking-widest text-white/50 mb-3">Top routes by time spent</div>
          {topRoutes.length === 0 ? (
            <div className="text-white/40 text-sm">No data yet.</div>
          ) : (
            <ul className="space-y-2 text-sm">
              {topRoutes.map(([r, v]) => (
                <li key={r} className="flex items-center justify-between">
                  <span className="mono text-white/70 truncate">{r}</span>
                  <span className="mono text-[var(--color-neon)]">{Math.floor(v / 60000)}min</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <Card>
        <div className="mono text-xs uppercase tracking-widest text-white/50 mb-3">Recent interventions</div>
        {log.interventions.length === 0 ? (
          <div className="text-white/40 text-sm">None yet — PrepNext hasn't needed to nudge you.</div>
        ) : (
          <ul className="space-y-1 text-xs">
            {log.interventions.slice(-20).reverse().map((iv, i) => (
              <li key={i} className="mono text-white/70 flex gap-3">
                <span className="text-white/40">{new Date(iv.at).toLocaleString()}</span>
                <span className="text-[var(--color-neon)]">{iv.action}</span>
                <span className="text-white/40 truncate">on {iv.route}</span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
