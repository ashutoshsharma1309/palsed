import { useMemo } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, BookOpen, Code2, Network, Brain, MessageSquare, Calendar } from "lucide-react";
import { Card } from "./ui/Card";
import { Chip } from "./ui/Chip";
import { PROBLEMS } from "../data/dsa-problems";
import type { Company } from "../data/companies";
import type { PYQ } from "../data/pyqs-seed";

// Per-Company Prep Kit — composes the existing DSA / PYQ / topic data into a
// company-specific 30-day plan. No competitor does this: GFG has topics, LeetCode
// has problems, but nobody bundles them into "Here's exactly what to do in the
// 30 days before Razorpay onsite."
//
// Strategy:
//   • Filter PROBLEMS by company NAME (DSA data uses display names, not slugs).
//   • Group recommended DSA by topic, weighted by problem.frequency.
//   • Surface top 5 PYQs by upvotes for quick wins.
//   • Build a 4-week plan: Week 1 (DSA fundamentals), Week 2 (DSA advanced + Core CS),
//     Week 3 (System design + PYQs), Week 4 (Mock + HR/behavioral).

interface PrepKitProps {
  company: Company;
  pyqs: PYQ[];
}

export function PrepKit({ company: c, pyqs }: PrepKitProps) {
  // 1) Find DSA problems explicitly tagged with this company's name.
  const tagged = useMemo(
    () => PROBLEMS.filter((p) => p.companies.includes(c.name)),
    [c.name]
  );

  // 2) Distribute across difficulty + topics covered by the company.
  const easy = tagged.filter((p) => p.difficulty === "Easy");
  const med = tagged.filter((p) => p.difficulty === "Medium");
  const hard = tagged.filter((p) => p.difficulty === "Hard");

  // 3) Pick the top PYQs (already vote-sorted by usePYQs hook upstream usually,
  // but be defensive — sort by upvotes here).
  const topPYQs = useMemo(
    () => [...pyqs].sort((a, b) => b.upvotes - a.upvotes).slice(0, 5),
    [pyqs]
  );

  // 4) Stats for the header card
  const totalProblems = tagged.length;
  const totalPYQs = pyqs.length;
  const hasSystemDesign = (c.topicsAsked.systemDesign || []).length > 0;
  const hasCoreCs = (c.topicsAsked.coreCs || []).length > 0;
  const hasBehavioral = (c.topicsAsked.behavioral || []).length > 0;

  // No tagged problems and no PYQs → don't render an empty kit
  if (totalProblems === 0 && totalPYQs === 0) return null;

  return (
    <Card className="mb-6 border-[var(--color-neon)]/30">
      <div className="flex items-start justify-between gap-3 flex-wrap mb-4">
        <div>
          <div className="mono text-[10px] uppercase tracking-widest text-[var(--color-neon)] mb-1">
            · 30-day prep plan ·
          </div>
          <h2 className="display text-2xl">YOUR {c.name.toUpperCase()} KIT.</h2>
          <p className="text-[var(--color-text-dim)] text-sm mt-1">
            Auto-generated from {totalProblems} tagged DSA problems and {totalPYQs} verified PYQs.
            Follow the 4-week structure or skim sections below.
          </p>
        </div>
        <div className="flex flex-col items-end gap-1 mono text-[10px] uppercase tracking-widest text-[var(--color-text-faint)]">
          <span>· targeting</span>
          <span className="text-[var(--color-text)]">{c.rounds.length} rounds</span>
          <span>~ {c.rounds.length * 7}d prep</span>
        </div>
      </div>

      {/* 4-WEEK PLAN */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <PlanWeek
          week={1}
          title="DSA Foundations"
          Icon={Code2}
          items={[
            `Solve ${Math.min(easy.length, 6) || 6} Easy problems`,
            ...c.topicsAsked.dsa.slice(0, 3).map((t) => `Revise ${t}`),
          ]}
        />
        <PlanWeek
          week={2}
          title="DSA + Core CS"
          Icon={Brain}
          items={[
            `${Math.min(med.length, 8) || 8} Mediums on company-tagged topics`,
            hasCoreCs ? `Core CS: ${(c.topicsAsked.coreCs || [])[0] || "OS/DBMS/CN"}` : "OS · DBMS · Networks",
            `1 mock OA on ${c.oaTools[0] || "HackerRank"}`,
          ]}
        />
        <PlanWeek
          week={3}
          title={hasSystemDesign ? "System Design + PYQs" : "Hard DSA + PYQs"}
          Icon={Network}
          items={[
            hasSystemDesign
              ? `System design: ${(c.topicsAsked.systemDesign || [])[0] || "URL shortener"}`
              : `${Math.min(hard.length, 4) || 4} Hard problems`,
            `Review top ${Math.min(totalPYQs, 5)} PYQs below`,
            "Whiteboard 2 problems out loud",
          ]}
        />
        <PlanWeek
          week={4}
          title="Mock + HR"
          Icon={MessageSquare}
          items={[
            hasBehavioral
              ? `Behavioral: ${(c.topicsAsked.behavioral || [])[0] || "Leadership"}`
              : "STAR-format stories ×3",
            "1 peer mock interview",
            "Resume polish + LinkedIn",
          ]}
        />
      </div>

      {/* DSA — top problems for this company */}
      {tagged.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-sm flex items-center gap-2">
              <Code2 className="w-4 h-4 text-[var(--color-neon)]" />
              DSA recommended for {c.name}
            </h3>
            <Link to={`/dsa`} className="text-[10px] text-[var(--color-neon)] underline">
              See all in /dsa →
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 gap-2">
            {tagged
              .sort((a, b) => b.frequency - a.frequency)
              .slice(0, 8)
              .map((p) => (
                <Link
                  key={p.id}
                  to={`/dsa/${p.slug}`}
                  className="border border-[var(--color-line)] rounded-lg px-3 py-2 hover:border-[var(--color-neon)]/40 transition-colors text-sm flex items-center justify-between gap-2"
                >
                  <span className="truncate">
                    <span className="text-[var(--color-text-faint)] mono text-[10px] mr-2">#{p.leetcodeNumber}</span>
                    {p.title}
                  </span>
                  <span
                    className="text-[10px] mono px-1.5 py-0.5 rounded shrink-0"
                    style={{
                      background:
                        p.difficulty === "Easy"
                          ? "#b9f5c822"
                          : p.difficulty === "Medium"
                          ? "#ffe87a22"
                          : "#ff8a7a22",
                      color:
                        p.difficulty === "Easy"
                          ? "#b9f5c8"
                          : p.difficulty === "Medium"
                          ? "#ffe87a"
                          : "#ff8a7a",
                    }}
                  >
                    {p.difficulty}
                  </span>
                </Link>
              ))}
          </div>
        </div>
      )}

      {/* PYQ quick-look */}
      {topPYQs.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-sm flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[var(--color-neon)]" />
              Top PYQs for {c.name}
            </h3>
            <span className="text-[10px] text-[var(--color-text-faint)] mono">sorted by votes</span>
          </div>
          <ol className="space-y-1.5">
            {topPYQs.map((p, i) => (
              <li key={p.id} className="flex items-start gap-3 text-sm border-l-2 border-[var(--color-neon)]/30 pl-3">
                <span className="display text-xs text-[var(--color-neon)] mt-0.5">{i + 1}.</span>
                <div className="flex-1 min-w-0">
                  <div className="text-[var(--color-text-dim)] truncate">{p.question}</div>
                  <div className="flex items-center gap-2 mt-0.5 text-[10px] mono text-[var(--color-text-faint)]">
                    <span>{p.round}</span>
                    <span>·</span>
                    <span>{p.year}</span>
                    <span>·</span>
                    <span>{p.topic}</span>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Topics covered checklist */}
      <div className="grid sm:grid-cols-2 gap-3 mb-4">
        <div>
          <div className="mono text-[10px] uppercase tracking-widest text-[var(--color-text-faint)] mb-1">DSA topics in scope</div>
          <div className="flex flex-wrap gap-1">
            {c.topicsAsked.dsa.map((t) => (
              <Chip tone="neon" key={t}>
                {t}
              </Chip>
            ))}
          </div>
        </div>
        {hasSystemDesign && (
          <div>
            <div className="mono text-[10px] uppercase tracking-widest text-[var(--color-text-faint)] mb-1">System design</div>
            <div className="flex flex-wrap gap-1">
              {(c.topicsAsked.systemDesign || []).map((t) => (
                <Chip key={t}>{t}</Chip>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 text-[11px] text-[var(--color-text-faint)] border-t border-[var(--color-line)] pt-3">
        <Calendar className="w-3 h-3 text-[var(--color-neon)]" />
        <span>
          Hiring window: <span className="text-[var(--color-text)]">{c.hiringWindow}</span> · adjust the plan to your OA date.
        </span>
      </div>
    </Card>
  );
}

function PlanWeek({
  week,
  title,
  items,
  Icon,
}: {
  week: number;
  title: string;
  items: string[];
  Icon: typeof Code2;
}) {
  return (
    <div className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-card-soft)] p-3">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-3.5 h-3.5 text-[var(--color-neon)]" />
        <div className="mono text-[10px] uppercase tracking-widest text-[var(--color-text-faint)]">Week {week}</div>
      </div>
      <div className="font-bold text-sm">{title}</div>
      <ul className="mt-2 space-y-1">
        {items.map((it, i) => (
          <li key={i} className="text-xs text-[var(--color-text-dim)] flex items-start gap-1.5">
            <CheckCircle2 className="w-3 h-3 mt-0.5 text-[var(--color-text-faint)] shrink-0" />
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
