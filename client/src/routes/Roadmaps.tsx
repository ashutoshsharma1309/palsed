import { Link } from "react-router-dom";
import { Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { useLocalStorageState, LS_KEYS } from "../hooks/useLocalStorageState";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import type { AIRoadmap } from "../types/roadmap";

export default function Roadmaps() {
  const [roadmaps, setRoadmaps] = useLocalStorageState<AIRoadmap[]>(LS_KEYS.roadmaps, []);

  const remove = (id: string) => {
    if (!confirm("Delete this roadmap?")) return;
    setRoadmaps((prev) => prev.filter((r) => r.id !== id));
    toast.success("Deleted");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
        <div>
          <div className="mono text-xs uppercase tracking-[0.3em] text-[var(--color-neon)] mb-2">// roadmaps</div>
          <h1 className="display text-5xl sm:text-7xl">ROADMAPS.</h1>
          <p className="text-white/60 mt-2">Multi-stage career roadmaps for any topic, generated on demand.</p>
        </div>
        <Link to="/roadmaps/create"><Button size="lg"><Plus className="w-4 h-4" /> New roadmap</Button></Link>
      </div>

      {roadmaps.length === 0 ? (
        <Card className="text-center py-20">
          <div className="display text-4xl mb-3">NO ROADMAPS YET.</div>
          <p className="text-white/60 mb-5">Generate one for any topic — Rust, Kubernetes, ML, whatever.</p>
          <Link to="/roadmaps/create"><Button>Generate first roadmap</Button></Link>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {roadmaps.map((r) => (
            <Card key={r.id} className="relative group">
              <button
                className="absolute top-4 right-4 text-white/30 hover:text-red-400 opacity-0 group-hover:opacity-100"
                onClick={() => remove(r.id)}
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <div className="mono text-xs text-[var(--color-neon)] uppercase tracking-widest mb-2">
                {r.stages.length} stages
              </div>
              <h3 className="display text-2xl mb-2 leading-tight">{r.title}</h3>
              <p className="text-sm text-white/60 mb-4 line-clamp-3">{r.description}</p>
              <Link to={`/roadmaps/${r.id}`} className="block">
                <Button fullWidth size="sm">Open</Button>
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
