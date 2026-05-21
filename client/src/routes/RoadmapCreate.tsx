import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Loader } from "../components/ui/Loader";
import { apiPost } from "../lib/api";
import { useLocalStorageState, LS_KEYS } from "../hooks/useLocalStorageState";
import type { AIRoadmap } from "../types/roadmap";

export default function RoadmapCreate() {
  const navigate = useNavigate();
  const [roadmaps, setRoadmaps] = useLocalStorageState<AIRoadmap[]>(LS_KEYS.roadmaps, []);
  const [topic, setTopic] = useState("");
  const [level, setLevel] = useState("Beginner");
  const [loading, setLoading] = useState(false);

  const go = async () => {
    if (!topic.trim()) return toast.error("Pick a topic");
    setLoading(true);
    try {
      const res = await apiPost<Omit<AIRoadmap, "id" | "createdAt">>("/api/roadmaps/generate", {
        topic: topic.trim(),
        level,
      });
      const r: AIRoadmap = {
        ...res,
        id: `r_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
        createdAt: new Date().toISOString(),
      };
      setRoadmaps([r, ...roadmaps].slice(0, 20));
      toast.success("Roadmap generated");
      navigate(`/roadmaps/${r.id}`);
    } catch (e: any) {
      toast.error(e.message || "Generation failed");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20">
        <Card><Loader label="Crafting roadmap" /></Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-12">
      <div className="mono text-xs uppercase tracking-[0.3em] text-[var(--color-neon)] mb-2">// generate a roadmap</div>
      <h1 className="display text-5xl sm:text-6xl mb-8">NEW ROADMAP.</h1>

      <Card className="space-y-6">
        <div>
          <label className="text-xs uppercase tracking-widest text-white/50 mono">Topic</label>
          <input
            className="w-full mt-2 bg-transparent border-b-2 border-white/20 focus:border-[var(--color-neon)] outline-none text-2xl py-2 display"
            placeholder="e.g. Rust for backend engineers"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-3 gap-3">
          {["Beginner", "Intermediate", "Advanced"].map((l) => (
            <button
              key={l}
              onClick={() => setLevel(l)}
              className={`p-3 rounded-xl border ${level === l ? "border-[var(--color-neon)] bg-[var(--color-neon)]/10" : "border-white/10"}`}
            >
              {l}
            </button>
          ))}
        </div>
        <Button fullWidth onClick={go}>Generate</Button>
      </Card>
    </div>
  );
}
