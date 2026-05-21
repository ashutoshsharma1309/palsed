import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorageState, LS_KEYS } from "../hooks/useLocalStorageState";
import { Background } from "../components/layout/Background";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";

export interface Profile {
  displayName: string;
  avatarSeed: string;
  joinedAt: string;
  learningGoal: string;
  preferredStyle: "visual" | "code_first" | "analogy" | "step_by_step";
  dailyMinutes: number;
}

const DEFAULT_PROFILE: Profile = {
  displayName: "Learner",
  avatarSeed: Math.random().toString(36).slice(2, 8),
  joinedAt: new Date().toISOString(),
  learningGoal: "Master DSA",
  preferredStyle: "step_by_step",
  dailyMinutes: 30,
};

const GOALS = [
  "Crack MAANG SDE",
  "Get my first dev job",
  "Master DSA",
  "System design depth",
  "Custom...",
];

const STYLES = [
  { id: "visual", label: "Visual", desc: "Diagrams, spatial layouts, mental models." },
  { id: "code_first", label: "Code-first", desc: "Show me runnable code, then explain." },
  { id: "analogy", label: "Analogy", desc: "Relate it to something I already know." },
  { id: "step_by_step", label: "Step-by-step", desc: "Walk me through one piece at a time." },
] as const;

export default function Onboarding() {
  const [, setProfile] = useLocalStorageState<Profile>(LS_KEYS.profile, DEFAULT_PROFILE);
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<Profile>(DEFAULT_PROFILE);
  const [customGoal, setCustomGoal] = useState("");
  const navigate = useNavigate();

  const finish = () => {
    const goal = draft.learningGoal === "Custom..." ? customGoal.trim() || "Master something new" : draft.learningGoal;
    setProfile({ ...draft, learningGoal: goal, joinedAt: new Date().toISOString() });
    navigate("/dashboard");
  };

  return (
    <>
      <Background />
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl">
          <div className="mono text-xs text-[var(--color-neon)] uppercase tracking-[0.3em] mb-3">
            // onboarding · step {step + 1} / 4
          </div>
          <h1 className="display text-5xl sm:text-6xl mb-8">SET UP PALSED.</h1>

          <Card className="space-y-6">
            {step === 0 && (
              <div>
                <label className="text-xs uppercase tracking-widest text-white/50 mono">
                  What should we call you?
                </label>
                <input
                  className="w-full mt-2 bg-transparent border-b-2 border-white/20 focus:border-[var(--color-neon)] outline-none text-2xl py-2 display"
                  value={draft.displayName}
                  onChange={(e) => setDraft({ ...draft, displayName: e.target.value })}
                  placeholder="Your name"
                />
              </div>
            )}
            {step === 1 && (
              <div>
                <label className="text-xs uppercase tracking-widest text-white/50 mono">
                  What's your goal?
                </label>
                <select
                  className="w-full mt-2 bg-[#1a1a1a] border border-white/20 rounded-lg p-3 text-white"
                  value={draft.learningGoal}
                  onChange={(e) => setDraft({ ...draft, learningGoal: e.target.value })}
                >
                  {GOALS.map((g) => (
                    <option key={g}>{g}</option>
                  ))}
                </select>
                {draft.learningGoal === "Custom..." && (
                  <input
                    className="w-full mt-3 bg-transparent border-b-2 border-white/20 focus:border-[var(--color-neon)] outline-none text-lg py-2"
                    placeholder="Describe your goal"
                    value={customGoal}
                    onChange={(e) => setCustomGoal(e.target.value)}
                  />
                )}
              </div>
            )}
            {step === 2 && (
              <div>
                <label className="text-xs uppercase tracking-widest text-white/50 mono">
                  How do you learn best?
                </label>
                <div className="grid sm:grid-cols-2 gap-3 mt-3">
                  {STYLES.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setDraft({ ...draft, preferredStyle: s.id })}
                      className={`text-left p-4 rounded-xl border transition-all ${
                        draft.preferredStyle === s.id
                          ? "border-[var(--color-neon)] bg-[var(--color-neon)]/10"
                          : "border-white/10 hover:border-white/30"
                      }`}
                    >
                      <div className="font-semibold mb-1">{s.label}</div>
                      <div className="text-xs text-white/60">{s.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
            {step === 3 && (
              <div>
                <label className="text-xs uppercase tracking-widest text-white/50 mono">
                  Daily focus minutes
                </label>
                <div className="flex gap-3 mt-3">
                  {[15, 30, 60].map((m) => (
                    <button
                      key={m}
                      onClick={() => setDraft({ ...draft, dailyMinutes: m })}
                      className={`flex-1 p-4 rounded-xl border transition-all ${
                        draft.dailyMinutes === m
                          ? "border-[var(--color-neon)] bg-[var(--color-neon)]/10"
                          : "border-white/10"
                      }`}
                    >
                      <div className="display text-3xl">{m}</div>
                      <div className="text-xs text-white/60 mt-1">min / day</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </Card>

          <div className="flex items-center justify-between mt-8">
            <Button variant="ghost" onClick={() => navigate("/dashboard")}>
              Skip
            </Button>
            <div className="flex gap-3">
              {step > 0 && (
                <Button variant="outline" onClick={() => setStep((s) => s - 1)}>
                  Back
                </Button>
              )}
              {step < 3 ? (
                <Button onClick={() => setStep((s) => s + 1)}>Continue</Button>
              ) : (
                <Button onClick={finish}>Enter PalsEd →</Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
