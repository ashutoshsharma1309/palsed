import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ChevronLeft, FileText, Building2, StickyNote, Code2, Gauge,
  Flag, CheckCircle2, CircleDot, Circle, Sparkles,
} from "lucide-react";
import { PROBLEMS } from "../data/dsa-problems";
import { getSolution } from "../data/dsa-solutions";
import { useLocalStorageState, LS_KEYS } from "../hooks/useLocalStorageState";
import { useMastery } from "../hooks/useMastery";
import { useSRS } from "../hooks/useSRS";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Chip } from "../components/ui/Chip";
import { AccordionItem } from "../components/dsa/Accordion";
import { LeetCodeLogo } from "../components/dsa/LeetCodeLogo";
import { MarkdownView } from "../components/lesson/MarkdownView";
import { apiPost } from "../lib/api";
import toast from "react-hot-toast";

type Status = "not_started" | "attempted" | "solved";
const REVISION_KEY = "prepnext.dsa.revision.v1";

const FREQUENCY_LABEL: Record<number, string> = {
  5: "Very High", 4: "High", 3: "Medium", 2: "Low", 1: "Rare",
};
const DIFF_COLOR: Record<string, string> = {
  Easy: "text-[var(--color-mint)]",
  Medium: "text-[var(--color-yellow)]",
  Hard: "text-[var(--color-peach)]",
};

function leetcodeUrl(slug: string) {
  return `https://leetcode.com/problems/${slug}/`;
}

export default function DsaProblem() {
  const { slug } = useParams();
  const problem = useMemo(() => PROBLEMS.find((p) => p.slug === slug), [slug]);

  const [statuses, setStatuses] = useLocalStorageState<Record<number, Status>>(LS_KEYS.dsaStatuses, {});
  const [revision, setRevision] = useLocalStorageState<number[]>(REVISION_KEY, []);
  const { record } = useMastery();
  const { add: addSRS } = useSRS();

  // Solution panel state
  const [solutionShown, setSolutionShown] = useState(false);
  const [remoteCode, setRemoteCode] = useState<string | null>(null);
  const [remoteLoading, setRemoteLoading] = useState(false);

  // AI tutor (kept — guides without spoiling)
  const [tutor, setTutor] = useState<string | null>(null);
  const [tutorLoading, setTutorLoading] = useState(false);
  const [followups, setFollowups] = useState<string[]>([]);

  if (!problem) {
    return (
      <div className="mx-auto max-w-3xl py-32 text-center">
        <h1 className="display text-4xl mb-3">Problem not found.</h1>
        <Link to="/dsa" className="text-[var(--color-neon)] underline">Back to DSA Hub</Link>
      </div>
    );
  }

  const status: Status = statuses[problem.id] ?? "not_started";
  const inRevision = revision.includes(problem.id);
  const sol = getSolution(problem.slug);

  const setStatus = (next: Status) => {
    setStatuses((prev) => ({ ...prev, [problem.id]: next }));
    if (next === "solved") {
      record(problem.topic, { correct: true, hintsUsed: 0 });
      toast.success("Marked solved — mastery updated");
    } else if (next === "attempted") {
      addSRS({ itemId: `dsa-${problem.id}`, kind: "dsa", payload: { slug: problem.slug, title: problem.title } });
    }
  };

  const toggleRevision = () => {
    setRevision((prev) => (prev.includes(problem.id) ? prev.filter((x) => x !== problem.id) : [...prev, problem.id]));
  };

  const viewSolution = async () => {
    setSolutionShown(true);
    if (sol && !sol.code && sol.githubRaw && remoteCode === null) {
      setRemoteLoading(true);
      try {
        const r = await fetch(sol.githubRaw);
        setRemoteCode(r.ok ? await r.text() : null);
      } catch {
        setRemoteCode(null);
      } finally {
        setRemoteLoading(false);
      }
    }
  };

  const askTutor = async (question?: string) => {
    setTutorLoading(true);
    try {
      const res = await apiPost<{ reply: string; suggestedFollowups: string[] }>("/api/tutor/explain", {
        context: {
          problem: problem.title,
          topic: problem.topic,
          difficulty: problem.difficulty,
          question: question ?? "Walk me through this problem without giving the answer.",
        },
        style: "step_by_step",
        transcript: [],
      });
      setTutor(res.reply);
      setFollowups(res.suggestedFollowups ?? []);
    } catch (e: any) {
      toast.error("Tutor unavailable: " + e.message);
    } finally {
      setTutorLoading(false);
    }
  };

  const codeBlock = sol?.code
    ? `\`\`\`${sol.language ?? "python"}\n${sol.code}\n\`\`\``
    : remoteCode
    ? `\`\`\`${sol?.language ?? "text"}\n${remoteCode}\n\`\`\``
    : null;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
      <Link to="/dsa" className="text-xs text-[var(--color-text-faint)] hover:text-[var(--color-text)] inline-flex items-center gap-1 mb-4">
        <ChevronLeft className="w-3 h-3" /> Back to DSA Hub
      </Link>

      {/* Header: title + LeetCode logo */}
      <header className="mb-6">
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="display text-4xl sm:text-5xl">{problem.title}</h1>
          <a
            href={leetcodeUrl(problem.slug)}
            target="_blank"
            rel="noopener noreferrer"
            title="Solve on LeetCode"
            aria-label="Solve on LeetCode (opens in a new tab)"
            className="group relative inline-flex items-center justify-center w-10 h-10 rounded-xl border border-[var(--color-line)] text-[#ffa116] hover:border-[#ffa116] hover:bg-[#ffa116]/10 transition-colors"
          >
            <LeetCodeLogo className="w-5 h-5" />
            <span className="pointer-events-none absolute -bottom-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-[var(--color-text)] px-2 py-1 text-[11px] text-[var(--color-bg)] opacity-0 group-hover:opacity-100 transition-opacity z-10">
              Solve on LeetCode
            </span>
          </a>
        </div>
        <div className="mono text-xs text-[var(--color-text-faint)] mt-2">LeetCode #{problem.leetcodeNumber}</div>
      </header>

      {/* Question Information — modern cards + badges */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <InfoCard label="Topic" value={problem.topic} />
        <InfoCard label="Difficulty" value={problem.difficulty} valueClass={DIFF_COLOR[problem.difficulty]} />
        <InfoCard label="Frequency" value={FREQUENCY_LABEL[problem.frequency]} valueClass="text-[var(--color-neon)]" />
        <InfoCard label="Sources" value={`${problem.sources.length} sheet${problem.sources.length === 1 ? "" : "s"}`} />
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Main column — accordions */}
        <div className="lg:col-span-2 space-y-3">
          <AccordionItem title="Problem Overview" icon={<FileText className="w-4 h-4" />} defaultOpen>
            <div className="text-sm text-[var(--color-text-faint)] space-y-3">
              <p>
                <span className="text-[var(--color-text-faint)]">{problem.title}</span> is a{" "}
                <span className={DIFF_COLOR[problem.difficulty]}>{problem.difficulty}</span> problem in the{" "}
                <span className="text-[var(--color-text)]">{problem.topic}</span> pattern, asked with{" "}
                <span className="text-[var(--color-neon)]">{FREQUENCY_LABEL[problem.frequency].toLowerCase()}</span>{" "}
                frequency in interviews.
              </p>
              <div className="flex flex-wrap gap-1.5">
                {problem.sources.map((s) => (
                  <Chip key={s} tone="neon">{s}</Chip>
                ))}
              </div>
              <a
                href={leetcodeUrl(problem.slug)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-[#ffa116] hover:underline"
              >
                <LeetCodeLogo className="w-4 h-4" /> Read the full problem statement on LeetCode
              </a>
            </div>
          </AccordionItem>

          <AccordionItem title="Companies Asked" icon={<Building2 className="w-4 h-4" />} hint={`${problem.companies.length} companies`}>
            <div className="flex flex-wrap gap-2">
              {problem.companies.map((c) => (
                <span
                  key={c}
                  className="px-3 py-1.5 rounded-lg border border-[var(--color-line)] bg-[var(--color-card-soft)] text-sm text-[var(--color-text-dim)]"
                >
                  {c}
                </span>
              ))}
            </div>
          </AccordionItem>

          <AccordionItem title="Important Notes" icon={<StickyNote className="w-4 h-4" />}>
            {sol?.notes ? (
              <div className="text-sm text-[var(--color-text-dim)]"><MarkdownView>{sol.notes}</MarkdownView></div>
            ) : (
              <p className="text-sm text-[var(--color-text-faint)]">
                Focus on the <span className="text-[var(--color-text)]">{problem.topic}</span> pattern. Identify the
                brute-force approach first, then look for the data structure or two-pointer/window trick
                that removes redundant work.
              </p>
            )}
          </AccordionItem>

          <AccordionItem title="Solution" icon={<Code2 className="w-4 h-4" />}>
            {!sol ? (
              <p className="text-sm text-[var(--color-text-faint)]">
                An in-platform solution for this problem is coming soon. Try it yourself, or ask the AI
                tutor for a guided walkthrough.
              </p>
            ) : !solutionShown ? (
              <div className="text-sm text-[var(--color-text-faint)]">
                <p className="mb-4">Give it a genuine attempt first — then reveal the full approach and code below.</p>
                <Button onClick={viewSolution}>View Solution</Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <div className="mono text-[11px] uppercase tracking-widest text-[var(--color-text-faint)] mb-2">Approach</div>
                  <div className="text-sm text-[var(--color-text-faint)]"><MarkdownView>{sol.approach}</MarkdownView></div>
                </div>
                {remoteLoading ? (
                  <div className="text-sm text-[var(--color-text-faint)]">Loading solution source…</div>
                ) : codeBlock ? (
                  <div>
                    <div className="mono text-[11px] uppercase tracking-widest text-[var(--color-text-faint)] mb-2">Sample Code</div>
                    <MarkdownView>{codeBlock}</MarkdownView>
                  </div>
                ) : null}
              </div>
            )}
          </AccordionItem>

          <AccordionItem title="Complexity Analysis" icon={<Gauge className="w-4 h-4" />}>
            {sol ? (
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-[var(--color-line)] bg-[var(--color-card-soft)] p-4">
                  <div className="mono text-[11px] uppercase tracking-widest text-[var(--color-text-faint)] mb-1">Time</div>
                  <div className="display text-2xl text-[var(--color-neon)]">{sol.time}</div>
                </div>
                <div className="rounded-xl border border-[var(--color-line)] bg-[var(--color-card-soft)] p-4">
                  <div className="mono text-[11px] uppercase tracking-widest text-[var(--color-text-faint)] mb-1">Space</div>
                  <div className="display text-2xl text-[var(--color-mint)]">{sol.space}</div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-[var(--color-text-faint)]">Complexity analysis will appear with the solution.</p>
            )}
          </AccordionItem>
        </div>

        {/* Sidebar — progress + AI tutor */}
        <div className="space-y-5">
          <Card>
            <div className="mono text-xs uppercase tracking-widest text-[var(--color-text-faint)] mb-3">Your progress</div>
            <div className="space-y-2">
              <ProgressOption active={status === "not_started"} onClick={() => setStatus("not_started")}
                icon={<Circle className="w-4 h-4" />} label="Not Started" />
              <ProgressOption active={status === "attempted"} onClick={() => setStatus("attempted")}
                icon={<CircleDot className="w-4 h-4" />} label="In Progress" />
              <ProgressOption active={status === "solved"} onClick={() => setStatus("solved")}
                icon={<CheckCircle2 className="w-4 h-4" />} label="Solved" />
            </div>
            <button
              type="button"
              onClick={toggleRevision}
              aria-pressed={inRevision}
              className={`mt-3 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors ${
                inRevision
                  ? "border-[var(--color-yellow)] bg-[var(--color-yellow)]/10 text-[var(--color-yellow)]"
                  : "border-[var(--color-line)] text-[var(--color-text-dim)] hover:border-[var(--color-line)]"
              }`}
            >
              <Flag className="w-4 h-4" /> {inRevision ? "Marked for Revision" : "Mark for Revision"}
            </button>
          </Card>

          <Card>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-[var(--color-neon)]" />
              <div className="mono text-xs uppercase tracking-widest text-[var(--color-text-faint)]">Ask the tutor</div>
            </div>
            {tutor ? (
              <div className="text-sm text-[var(--color-text-dim)]"><MarkdownView>{tutor}</MarkdownView></div>
            ) : (
              <div className="text-sm text-[var(--color-text-faint)] italic">
                Stuck? The AI tutor guides you Socratically — without spoiling the answer.
              </div>
            )}
            {followups.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {followups.map((q, i) => (
                  <Chip key={i} tone="neon" onClick={() => askTutor(q)}>{q}</Chip>
                ))}
              </div>
            )}
            <Button size="sm" fullWidth className="mt-4" onClick={() => askTutor()} disabled={tutorLoading}>
              {tutorLoading ? "Thinking…" : "Ask tutor"}
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ label, value, valueClass = "text-[var(--color-text)]" }: { label: string; value: string; valueClass?: string }) {
  return (
    <div className="rounded-xl border border-[var(--color-line)] bg-[var(--color-card-soft)] p-4">
      <div className="mono text-[10px] uppercase tracking-widest text-[var(--color-text-faint)] mb-1">{label}</div>
      <div className={`font-semibold ${valueClass}`}>{value}</div>
    </div>
  );
}

function ProgressOption({
  active, onClick, icon, label,
}: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors ${
        active
          ? "border-[var(--color-neon)] bg-[var(--color-neon)]/10 text-[var(--color-neon)]"
          : "border-[var(--color-line)] text-[var(--color-text-dim)] hover:border-[var(--color-line)]"
      }`}
    >
      {icon} {label}
    </button>
  );
}
