import { useMemo, useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ExternalLink, Lightbulb, ChevronLeft } from "lucide-react";
import Editor from "@monaco-editor/react";
import { PROBLEMS } from "../data/dsa-problems";
import { useLocalStorageState, LS_KEYS } from "../hooks/useLocalStorageState";
import { useMastery } from "../hooks/useMastery";
import { useSRS } from "../hooks/useSRS";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Chip } from "../components/ui/Chip";
import { apiPost } from "../lib/api";
import toast from "react-hot-toast";

type Status = "not_started" | "attempted" | "solved";
interface Attempt { count: number; lastAt: string; msSpent?: number; hintsUsed?: number }

const HINTS = [
  { label: "Vague nudge", body: "Think about the data structure that gives O(1) lookups. Which one helps you avoid a double loop?" },
  { label: "Specific direction", body: "Walk through the array once. Store something while you go. Use that storage to skip work later." },
  { label: "Near-spoiler", body: "Use a hash map of value → index. For each element x at index i, check if (target − x) is in the map." },
];

export default function DsaProblem() {
  const { slug } = useParams();
  const problem = useMemo(() => PROBLEMS.find((p) => p.slug === slug), [slug]);

  const [statuses, setStatuses] = useLocalStorageState<Record<number, Status>>(LS_KEYS.dsaStatuses, {});
  const [attempts, setAttempts] = useLocalStorageState<Record<number, Attempt>>(LS_KEYS.dsaAttempts, {});
  const [code, setCode] = useState<string>("// write your solution here\n");
  const [hintLevel, setHintLevel] = useState(0);
  const [tutor, setTutor] = useState<string | null>(null);
  const [tutorLoading, setTutorLoading] = useState(false);
  const [followups, setFollowups] = useState<string[]>([]);
  const [startedAt] = useState(Date.now());
  const { record } = useMastery();
  const { add: addSRS } = useSRS();

  useEffect(() => {
    if (!problem) return;
    setAttempts((prev) => ({
      ...prev,
      [problem.id]: {
        count: (prev[problem.id]?.count ?? 0) + 1,
        lastAt: new Date().toISOString(),
        msSpent: prev[problem.id]?.msSpent ?? 0,
        hintsUsed: prev[problem.id]?.hintsUsed ?? 0,
      },
    }));
  }, [problem?.id]);

  if (!problem) {
    return (
      <div className="mx-auto max-w-3xl py-32 text-center">
        <h1 className="display text-4xl mb-3">Problem not found.</h1>
        <Link to="/dsa" className="text-[var(--color-neon)] underline">Back to DSA Hub</Link>
      </div>
    );
  }

  const cycleStatus = () => {
    setStatuses((prev) => {
      const cur = prev[problem.id] ?? "not_started";
      const next: Status = cur === "not_started" ? "attempted" : cur === "attempted" ? "solved" : "not_started";
      if (next === "solved") {
        record(problem.topic, { correct: true, hintsUsed: hintLevel });
        toast.success("Marked solved + mastery updated");
      } else if (next === "attempted") {
        addSRS({ itemId: `dsa-${problem.id}`, kind: "dsa", payload: { slug: problem.slug, title: problem.title } });
      }
      return { ...prev, [problem.id]: next };
    });
    setAttempts((prev) => ({
      ...prev,
      [problem.id]: {
        ...prev[problem.id]!,
        msSpent: (prev[problem.id]?.msSpent ?? 0) + (Date.now() - startedAt),
      },
    }));
  };

  const revealHint = () => {
    if (hintLevel >= HINTS.length) return;
    setHintLevel((l) => l + 1);
    setAttempts((prev) => ({
      ...prev,
      [problem.id]: {
        ...prev[problem.id]!,
        hintsUsed: (prev[problem.id]?.hintsUsed ?? 0) + 1,
      },
    }));
  };

  const askTutor = async (question?: string) => {
    setTutorLoading(true);
    try {
      const res = await apiPost<{ reply: string; suggestedFollowups: string[] }>("/api/tutor/explain", {
        context: {
          problem: problem.title,
          topic: problem.topic,
          difficulty: problem.difficulty,
          codeSnippet: code.slice(0, 1000),
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

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
      <Link to="/dsa" className="text-xs text-white/40 hover:text-white inline-flex items-center gap-1 mb-3">
        <ChevronLeft className="w-3 h-3" /> Back to DSA Hub
      </Link>

      <header className="mb-6 flex items-start justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 mono text-xs text-white/40 mb-2">
            LC #{problem.leetcodeNumber} · <Chip tone="neon" active>{problem.difficulty}</Chip> · {problem.topic}
          </div>
          <h1 className="display text-4xl sm:text-5xl">{problem.title}</h1>
          <div className="flex flex-wrap gap-1.5 mt-3">
            {problem.companies.map((c) => (
              <Chip key={c}>{c}</Chip>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <a
            href={`https://leetcode.com/problems/${problem.slug}/`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 text-sm hover:border-[var(--color-neon)]"
          >
            Open on LeetCode <ExternalLink className="w-3 h-3" />
          </a>
          <Button onClick={cycleStatus}>
            {statuses[problem.id] === "solved" ? "✓ Solved" : statuses[problem.id] === "attempted" ? "◐ Attempted" : "Mark progress"}
          </Button>
        </div>
      </header>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <Card>
            <div className="mono text-xs uppercase tracking-widest text-white/40 mb-3">Editor</div>
            <div className="rounded-xl overflow-hidden border border-white/10">
              <Editor
                height="400px"
                defaultLanguage="javascript"
                value={code}
                onChange={(v) => setCode(v ?? "")}
                theme="vs-dark"
                options={{ fontSize: 13, minimap: { enabled: false }, fontFamily: "Share Tech Mono, monospace" }}
              />
            </div>
            <div className="text-xs text-white/40 mono mt-2">
              Code is local to this page — paste your solution into LeetCode to run it.
            </div>
          </Card>
        </div>

        <div className="space-y-5">
          <Card>
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-4 h-4 text-[var(--color-neon)]" />
              <div className="mono text-xs uppercase tracking-widest text-white/50">Hint ladder</div>
            </div>
            <div className="space-y-3">
              {HINTS.map((h, i) => (
                <div key={i} className={`text-sm transition-all ${i < hintLevel ? "opacity-100" : "opacity-30"}`}>
                  <div className="mono text-[10px] uppercase tracking-widest text-[var(--color-neon)] mb-1">
                    {h.label}
                  </div>
                  {i < hintLevel ? (
                    <div className="text-white/80">{h.body}</div>
                  ) : (
                    <div className="text-white/30 italic">— hidden —</div>
                  )}
                </div>
              ))}
            </div>
            {hintLevel < HINTS.length && (
              <Button size="sm" variant="outline" className="mt-4" fullWidth onClick={revealHint}>
                Reveal next hint
              </Button>
            )}
          </Card>

          <Card>
            <div className="mono text-xs uppercase tracking-widest text-white/50 mb-3">Ask the tutor</div>
            {tutor ? (
              <div className="text-sm text-white/80 whitespace-pre-wrap markdown-body">{tutor}</div>
            ) : (
              <div className="text-sm text-white/40 italic">
                Stuck? Ask the AI tutor — it'll guide you Socratically without spoiling the answer.
              </div>
            )}
            {followups.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {followups.map((q, i) => (
                  <Chip key={i} tone="neon" onClick={() => askTutor(q)}>
                    {q}
                  </Chip>
                ))}
              </div>
            )}
            <Button
              size="sm"
              fullWidth
              className="mt-4"
              onClick={() => askTutor()}
              disabled={tutorLoading}
            >
              {tutorLoading ? "Thinking…" : "Ask tutor"}
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
