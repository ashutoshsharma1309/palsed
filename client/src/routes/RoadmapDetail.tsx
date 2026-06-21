import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ChevronLeft, ExternalLink } from "lucide-react";
import { useLocalStorageState, LS_KEYS } from "../hooks/useLocalStorageState";
import { Card } from "../components/ui/Card";
import { Chip } from "../components/ui/Chip";
import type { AIRoadmap } from "../types/roadmap";

const TABS = ["stages", "tools", "certifications", "career"] as const;
type Tab = typeof TABS[number];
const LABELS: Record<Tab, string> = { stages: "Learning Stages", tools: "Tools & Setup", certifications: "Certifications", career: "Career Path" };

export default function RoadmapDetail() {
  const { id } = useParams();
  const [roadmaps] = useLocalStorageState<AIRoadmap[]>(LS_KEYS.roadmaps, []);
  const r = roadmaps.find((x) => x.id === id);
  const [tab, setTab] = useState<Tab>("stages");

  if (!r) {
    return (
      <div className="mx-auto max-w-3xl py-32 text-center">
        <h1 className="display text-4xl">Roadmap not found.</h1>
        <Link to="/roadmaps" className="text-[var(--color-neon)] underline mt-3 inline-block">Back</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
      <Link to="/roadmaps" className="text-xs text-[var(--color-text-faint)] hover:text-[var(--color-text)] inline-flex items-center gap-1 mb-3">
        <ChevronLeft className="w-3 h-3" /> Back to roadmaps
      </Link>
      <h1 className="display text-5xl sm:text-6xl mb-3">{r.title}</h1>
      <p className="text-[var(--color-text-dim)] max-w-3xl">{r.description}</p>

      <div className="flex gap-2 mt-6 mb-8 flex-wrap">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-full text-sm font-semibold ${
              tab === t ? "bg-[var(--color-neon)] text-black" : "border border-[var(--color-line)] text-[var(--color-text-dim)] hover:border-[var(--color-neon)]"
            }`}
          >
            {LABELS[t]}
          </button>
        ))}
      </div>

      {tab === "stages" && (
        <div className="space-y-6">
          {r.stages.map((s, i) => (
            <Card key={i}>
              <div className="mono text-xs text-[var(--color-neon)] uppercase tracking-widest">stage {i + 1} · {s.level} · {s.timeframe}</div>
              <h2 className="display text-3xl mt-1 mb-2">{s.title}</h2>
              <p className="text-[var(--color-text-dim)] mb-5">{s.description}</p>

              <Section title="Skills">
                <div className="grid sm:grid-cols-2 gap-3">
                  {s.skills.map((sk, j) => (
                    <div key={j} className="border border-[var(--color-line)] rounded-lg p-3">
                      <div className="font-semibold flex items-center gap-2">
                        {sk.name}
                        <span className="mono text-[10px] text-[var(--color-neon)] uppercase">{sk.importance}</span>
                      </div>
                      <div className="text-sm text-[var(--color-text-faint)] mt-1">{sk.description}</div>
                    </div>
                  ))}
                </div>
              </Section>

              {s.resources?.length > 0 && (
                <Section title="Resources">
                  <div className="grid sm:grid-cols-2 gap-3">
                    {s.resources.map((res, j) => (
                      <a
                        key={j}
                        href={res.url || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="border border-[var(--color-line)] rounded-lg p-3 hover:border-[var(--color-neon)]"
                      >
                        <div className="flex items-center gap-2 justify-between">
                          <div className="font-semibold text-sm">{res.name}</div>
                          {res.url && <ExternalLink className="w-3 h-3 text-[var(--color-text-faint)]" />}
                        </div>
                        <div className="text-xs text-[var(--color-text-faint)] mt-1 line-clamp-2">{res.description}</div>
                        <div className="flex gap-1 mt-2 flex-wrap">
                          <Chip>{res.type}</Chip>
                          <Chip>{res.difficulty}</Chip>
                          <Chip tone="warn">{res.cost}</Chip>
                        </div>
                      </a>
                    ))}
                  </div>
                </Section>
              )}

              {s.projects?.length > 0 && (
                <Section title="Projects">
                  <div className="space-y-3">
                    {s.projects.map((p, j) => (
                      <div key={j} className="border border-[var(--color-line)] rounded-lg p-4">
                        <div className="flex items-center gap-2">
                          <div className="font-semibold">{p.name}</div>
                          <Chip>{p.difficulty}</Chip>
                          <Chip>{p.estimated_time}</Chip>
                        </div>
                        <div className="text-sm text-[var(--color-text-faint)] mt-1">{p.description}</div>
                        {p.features?.length > 0 && (
                          <ul className="list-disc pl-5 mt-2 text-xs text-[var(--color-text-dim)]">
                            {p.features.slice(0, 5).map((f, k) => <li key={k}>{f}</li>)}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </Section>
              )}

              {s.best_practices?.length > 0 && (
                <Section title="Best practices">
                  <ul className="list-disc pl-5 space-y-1 text-sm text-[var(--color-text-dim)]">
                    {s.best_practices.map((bp, j) => (
                      <li key={j}><strong>{bp.title}:</strong> {bp.description}</li>
                    ))}
                  </ul>
                </Section>
              )}

              {s.common_pitfalls?.length > 0 && (
                <Section title="Common pitfalls">
                  <ul className="space-y-2 text-sm">
                    {s.common_pitfalls.map((pf, j) => (
                      <li key={j} className="border-l-2 border-[#ff8a7a]/40 pl-3">
                        <div className="text-[#ff8a7a]">{pf.issue}</div>
                        <div className="text-[var(--color-text-dim)] text-xs">→ {pf.solution}</div>
                      </li>
                    ))}
                  </ul>
                </Section>
              )}
            </Card>
          ))}
        </div>
      )}

      {tab === "tools" && (
        <div className="grid sm:grid-cols-2 gap-4">
          {r.tools.map((t, i) => (
            <Card key={i}>
              <div className="mono text-xs text-[var(--color-neon)] uppercase">{t.category}</div>
              <h3 className="display text-xl mt-1">{t.name}</h3>
              <p className="text-sm text-[var(--color-text-dim)] mt-1">{t.description}</p>
              {t.url && <a href={t.url} target="_blank" rel="noopener noreferrer" className="text-xs text-[var(--color-neon)] underline mt-2 inline-block">visit →</a>}
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <div className="mono text-[var(--color-text-faint)] mb-1">pros</div>
                  <ul className="list-disc pl-4 space-y-0.5">{t.pros?.slice(0, 3).map((p, j) => <li key={j}>{p}</li>)}</ul>
                </div>
                <div>
                  <div className="mono text-[var(--color-text-faint)] mb-1">cons</div>
                  <ul className="list-disc pl-4 space-y-0.5">{t.cons?.slice(0, 3).map((p, j) => <li key={j}>{p}</li>)}</ul>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {tab === "certifications" && (
        <div className="grid sm:grid-cols-2 gap-4">
          {r.certifications.map((c, i) => (
            <Card key={i}>
              <div className="mono text-xs text-[var(--color-neon)]">{c.provider} · {c.level}</div>
              <h3 className="display text-xl mt-1">{c.name}</h3>
              <p className="text-sm text-[var(--color-text-dim)] mt-1">{c.description}</p>
              <div className="text-xs text-[var(--color-text-faint)] mt-2 mono">{c.cost} · valid {c.validity}</div>
              {c.url && <a href={c.url} target="_blank" rel="noopener noreferrer" className="text-xs text-[var(--color-neon)] underline mt-2 inline-block">visit →</a>}
            </Card>
          ))}
        </div>
      )}

      {tab === "career" && (
        <Card>
          <div className="mb-4">
            <div className="mono text-xs text-[var(--color-neon)] uppercase tracking-widest">salary band</div>
            <div className="display text-3xl">{r.career_path.salary_range}</div>
          </div>
          <Section title="Roles">
            <div className="flex flex-wrap gap-2">
              {r.career_path.roles.map((x, i) => <Chip key={i} tone="neon">{x}</Chip>)}
            </div>
          </Section>
          <Section title="Skills required">
            <ul className="list-disc pl-5 text-sm text-[var(--color-text-dim)] space-y-1">
              {r.career_path.skills_required.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </Section>
          <Section title="Progression">
            <ol className="list-decimal pl-5 text-sm text-[var(--color-text-dim)] space-y-1">
              {r.career_path.progression.map((s, i) => <li key={i}>{s}</li>)}
            </ol>
          </Section>
        </Card>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-5">
      <div className="mono text-xs uppercase tracking-widest text-[var(--color-text-faint)] mb-2">{title}</div>
      {children}
    </div>
  );
}
