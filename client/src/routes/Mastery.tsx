import { useMastery } from "../hooks/useMastery";
import { Card } from "../components/ui/Card";
import { Radar } from "../components/ui/Radar";
import { ProgressBar } from "../components/ui/ProgressBar";
import { TOPICS } from "../data/dsa-problems";

export default function Mastery() {
  const { map } = useMastery();

  // include all DSA topics; missing → 0
  const allTopics = Array.from(new Set([...TOPICS, ...Object.keys(map)]));
  const radarPoints = allTopics.map((t) => ({
    label: t.length > 14 ? t.slice(0, 14) + "…" : t,
    value: map[t]?.score ?? 0,
  }));
  const sorted = [...allTopics].sort((a, b) => (map[a]?.score ?? 0) - (map[b]?.score ?? 0));

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
      <div className="mono text-xs uppercase tracking-[0.3em] text-[var(--color-neon)] mb-2">// mastery map</div>
      <h1 className="display text-5xl sm:text-7xl mb-3">MASTERY.</h1>
      <p className="text-white/60 max-w-3xl mb-8">
        Per-topic EWMA mastery score (α=0.25). Updates after every check question, quiz answer, and DSA solve.
      </p>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <div className="mono text-xs uppercase tracking-widest text-white/50 mb-3">Radar</div>
          {radarPoints.length >= 3 ? (
            <Radar points={radarPoints} size={420} />
          ) : (
            <div className="text-white/40 text-sm py-12 text-center">Need more data — solve some problems first.</div>
          )}
        </Card>
        <Card>
          <div className="mono text-xs uppercase tracking-widest text-white/50 mb-3">Per topic</div>
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
            {sorted.map((t) => (
              <div key={t}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <div className="font-semibold text-white/80">{t}</div>
                  <div className="mono text-white/40">
                    {((map[t]?.score ?? 0) * 100).toFixed(0)}% · {map[t]?.samples ?? 0} samples
                  </div>
                </div>
                <ProgressBar
                  value={map[t]?.score ?? 0}
                  height={6}
                  color={(map[t]?.score ?? 0) > 0.7 ? "#c8ff3d" : (map[t]?.score ?? 0) > 0.4 ? "#ffe87a" : "#ff8a7a"}
                />
                {map[t]?.lastUpdatedAt && (
                  <div className="mono text-[10px] text-white/30 mt-0.5">
                    last updated {new Date(map[t].lastUpdatedAt).toLocaleString()}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
