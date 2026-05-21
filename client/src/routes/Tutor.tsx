import { useState } from "react";
import { Send } from "lucide-react";
import toast from "react-hot-toast";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Chip } from "../components/ui/Chip";
import { MarkdownView } from "../components/lesson/MarkdownView";
import { useLocalStorageState, LS_KEYS } from "../hooks/useLocalStorageState";
import { useMastery } from "../hooks/useMastery";
import { apiPost } from "../lib/api";
import type { Profile } from "./Onboarding";

const DEFAULT_PROFILE: Profile = {
  displayName: "Learner", avatarSeed: "x", joinedAt: new Date().toISOString(),
  learningGoal: "Master DSA", preferredStyle: "step_by_step", dailyMinutes: 30,
};

interface Msg { role: "user" | "assistant"; content: string }

interface Thread { id: string; title: string; messages: Msg[]; updatedAt: string }

export default function Tutor() {
  const [profile] = useLocalStorageState<Profile>(LS_KEYS.profile, DEFAULT_PROFILE);
  const [threads, setThreads] = useLocalStorageState<Thread[]>(LS_KEYS.tutorThreads, []);
  const { top } = useMastery();

  const [activeId, setActiveId] = useState<string | null>(threads[0]?.id ?? null);
  const active = threads.find((t) => t.id === activeId);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);
  const [followups, setFollowups] = useState<string[]>([]);

  const newThread = () => {
    const t: Thread = {
      id: `th_${Date.now().toString(36)}`,
      title: "New thread",
      messages: [],
      updatedAt: new Date().toISOString(),
    };
    setThreads([t, ...threads].slice(0, 20));
    setActiveId(t.id);
  };

  const send = async (content: string) => {
    if (!content.trim()) return;
    let cur = active;
    if (!cur) {
      const t: Thread = { id: `th_${Date.now().toString(36)}`, title: content.slice(0, 40), messages: [], updatedAt: new Date().toISOString() };
      setThreads((prev) => [t, ...prev].slice(0, 20));
      setActiveId(t.id);
      cur = t;
    }
    const userMsg: Msg = { role: "user", content };
    const updated: Thread = {
      ...cur,
      title: cur.messages.length === 0 ? content.slice(0, 40) : cur.title,
      messages: [...cur.messages, userMsg],
      updatedAt: new Date().toISOString(),
    };
    setThreads((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    setDraft("");
    setLoading(true);
    try {
      const { weak } = top(3);
      const res = await apiPost<{ reply: string; suggestedFollowups: string[] }>("/api/tutor/explain", {
        context: { goal: profile.learningGoal, weakTopics: weak },
        style: profile.preferredStyle,
        transcript: updated.messages.slice(-10),
      });
      const aMsg: Msg = { role: "assistant", content: res.reply };
      setThreads((prev) => prev.map((t) => t.id === updated.id ? { ...t, messages: [...t.messages, aMsg] } : t));
      setFollowups(res.suggestedFollowups ?? []);
    } catch (e: any) {
      toast.error("Tutor failed: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
      <div className="mono text-xs uppercase tracking-[0.3em] text-[var(--color-neon)] mb-2">// ai tutor</div>
      <h1 className="display text-5xl sm:text-7xl mb-6">TUTOR.</h1>

      <div className="grid lg:grid-cols-[280px_1fr] gap-5">
        <Card className="!p-3 h-fit">
          <Button fullWidth size="sm" onClick={newThread}>+ New thread</Button>
          <div className="mt-3 space-y-1">
            {threads.length === 0 && <div className="text-xs text-white/40 p-3">No threads yet.</div>}
            {threads.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveId(t.id)}
                className={`block w-full text-left p-2 rounded-lg text-xs ${
                  activeId === t.id ? "bg-[var(--color-neon)]/10 text-[var(--color-neon)]" : "text-white/70 hover:bg-white/5"
                }`}
              >
                <div className="font-semibold truncate">{t.title}</div>
                <div className="mono text-[10px] text-white/40">{new Date(t.updatedAt).toLocaleString()}</div>
              </button>
            ))}
          </div>
        </Card>

        <Card className="flex flex-col min-h-[500px]">
          <div className="flex-1 overflow-y-auto space-y-4 mb-4 max-h-[600px]">
            {!active || active.messages.length === 0 ? (
              <div className="text-white/40 text-center py-20">
                Ask anything. The tutor uses your weak topics ({top(3).weak.join(", ") || "—"}) for context.
              </div>
            ) : (
              active.messages.map((m, i) => (
                <div
                  key={i}
                  className={`rounded-xl p-4 ${m.role === "user" ? "bg-[var(--color-neon)]/10 ml-12" : "bg-white/5 mr-12"}`}
                >
                  <div className="mono text-[10px] uppercase tracking-widest mb-1 opacity-50">
                    {m.role === "user" ? "you" : "tutor"}
                  </div>
                  <MarkdownView>{m.content}</MarkdownView>
                </div>
              ))
            )}
            {loading && <div className="text-xs text-white/40 mono">tutor is thinking…</div>}
          </div>

          {followups.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {followups.map((f, i) => (
                <Chip key={i} tone="neon" onClick={() => send(f)}>{f}</Chip>
              ))}
            </div>
          )}

          <div className="flex gap-2">
            <input
              className="flex-1 bg-[#1a1a1a] border border-white/10 rounded-full px-4 py-2.5 outline-none focus:border-[var(--color-neon)]"
              placeholder="Ask the tutor…"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send(draft)}
            />
            <Button onClick={() => send(draft)} disabled={loading}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
