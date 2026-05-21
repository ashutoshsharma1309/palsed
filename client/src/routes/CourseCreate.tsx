import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Loader } from "../components/ui/Loader";
import { apiPost } from "../lib/api";
import { useLocalStorageState, LS_KEYS } from "../hooks/useLocalStorageState";
import { useMastery } from "../hooks/useMastery";
import type { AICourse } from "../types/course";
import type { Profile } from "./Onboarding";

const DEFAULT_PROFILE: Profile = {
  displayName: "Learner",
  avatarSeed: "x",
  joinedAt: new Date().toISOString(),
  learningGoal: "Master DSA",
  preferredStyle: "step_by_step",
  dailyMinutes: 30,
};

export default function CourseCreate() {
  const navigate = useNavigate();
  const [profile] = useLocalStorageState<Profile>(LS_KEYS.profile, DEFAULT_PROFILE);
  const [courses, setCourses] = useLocalStorageState<AICourse[]>(LS_KEYS.courses, []);
  const { top } = useMastery();

  const [topic, setTopic] = useState("");
  const [level, setLevel] = useState<"Beginner" | "Intermediate" | "Advanced">("Beginner");
  const [minutes, setMinutes] = useState<15 | 30 | 60>(30);
  const [style, setStyle] = useState(profile.preferredStyle);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"idle" | "calling" | "validating" | "saving">("idle");

  const generate = async () => {
    if (!topic.trim()) return toast.error("Pick a topic");
    setLoading(true);
    setStep("calling");
    try {
      const { weak, strong } = top(3);
      const res = await apiPost<Omit<AICourse, "id" | "createdAt">>("/api/courses/generate", {
        topic: topic.trim(),
        level,
        sessionMinutes: minutes,
        style,
        weakTopics: weak,
        strongTopics: strong,
      });
      setStep("saving");
      const course: AICourse = {
        ...res,
        id: `c_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
        createdAt: new Date().toISOString(),
      };
      // LRU cap at 20
      setCourses([course, ...courses].slice(0, 20));
      toast.success("Course generated");
      navigate(`/courses/${course.id}`);
    } catch (e: any) {
      toast.error(e.message || "Generation failed");
    } finally {
      setLoading(false);
      setStep("idle");
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20">
        <Card>
          <Loader label={step === "calling" ? "Asking Groq" : step === "validating" ? "Validating" : "Saving"} />
          <div className="mt-6 space-y-2 mono text-xs text-white/40">
            <div>· assembling multi-style explanations</div>
            <div>· tuning difficulty curve for your level</div>
            <div>· seeding adaptive quiz topics</div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-12">
      <div className="mono text-xs uppercase tracking-[0.3em] text-[var(--color-neon)] mb-2">// generate a course</div>
      <h1 className="display text-5xl sm:text-6xl mb-8">NEW COURSE.</h1>

      <Card className="space-y-6">
        <div>
          <label className="text-xs uppercase tracking-widest text-white/50 mono">Topic</label>
          <input
            className="w-full mt-2 bg-transparent border-b-2 border-white/20 focus:border-[var(--color-neon)] outline-none text-2xl py-2 display"
            placeholder="e.g. Binary Search Mastery"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-3 gap-3">
          {(["Beginner", "Intermediate", "Advanced"] as const).map((l) => (
            <button
              key={l}
              onClick={() => setLevel(l)}
              className={`p-3 rounded-xl border ${level === l ? "border-[var(--color-neon)] bg-[var(--color-neon)]/10" : "border-white/10"}`}
            >
              {l}
            </button>
          ))}
        </div>
        <div>
          <div className="text-xs uppercase tracking-widest text-white/50 mono mb-2">Session length</div>
          <div className="grid grid-cols-3 gap-3">
            {([15, 30, 60] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMinutes(m)}
                className={`p-3 rounded-xl border ${minutes === m ? "border-[var(--color-neon)] bg-[var(--color-neon)]/10" : "border-white/10"}`}
              >
                <div className="display text-2xl">{m}</div>
                <div className="text-[10px] text-white/50">min / day</div>
              </button>
            ))}
          </div>
        </div>
        <div>
          <div className="text-xs uppercase tracking-widest text-white/50 mono mb-2">Preferred style</div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(["visual", "code_first", "analogy", "step_by_step"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStyle(s)}
                className={`p-2.5 rounded-xl border text-xs capitalize ${style === s ? "border-[var(--color-neon)] bg-[var(--color-neon)]/10" : "border-white/10"}`}
              >
                {s.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>
        <Button fullWidth onClick={generate}>Generate course</Button>
      </Card>
    </div>
  );
}
