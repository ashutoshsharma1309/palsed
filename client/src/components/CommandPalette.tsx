import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Award,
  BookOpen,
  BrainCircuit,
  Code2,
  Compass,
  FolderGit2,
  GraduationCap,
  Layers,
  LayoutDashboard,
  Rocket,
  Route as RouteIcon,
  RotateCw,
  Search,
  Settings as SettingsIcon,
  Sparkles,
  Target,
} from "lucide-react";

interface Cmd {
  label: string;
  hint: string;
  icon: React.ReactNode;
  run: () => void;
  keywords?: string;
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [focusedIdx, setFocusedIdx] = useState(0);

  const commands: Cmd[] = useMemo(
    () => [
      { label: "Go to Dashboard", hint: "/dashboard", icon: <LayoutDashboard className="w-4 h-4" />, run: () => navigate("/dashboard") },
      { label: "Recruiter map · 85 companies", hint: "/companies", icon: <Compass className="w-4 h-4" />, run: () => navigate("/companies"), keywords: "company recruiter map list" },
      { label: "PYQ Vault — browse questions", hint: "/pyq", icon: <BookOpen className="w-4 h-4" />, run: () => navigate("/pyq"), keywords: "previous year questions pyq" },
      { label: "Contribute a PYQ", hint: "/pyq/submit", icon: <Sparkles className="w-4 h-4" />, run: () => navigate("/pyq/submit"), keywords: "submit add question crowd" },
      { label: "Internship Boards · 50+ platforms", hint: "/internships", icon: <Compass className="w-4 h-4" />, run: () => navigate("/internships"), keywords: "internship intern jobs find apply board linkedin internshala yc" },
      { label: "DSA Practice Hub", hint: "/dsa", icon: <Code2 className="w-4 h-4" />, run: () => navigate("/dsa") },
      { label: "Coding Patterns", hint: "/patterns", icon: <Layers className="w-4 h-4" />, run: () => navigate("/patterns"), keywords: "patterns sliding window two pointer recursion" },
      { label: "Projects — build resume-worthy apps", hint: "/projects", icon: <FolderGit2 className="w-4 h-4" />, run: () => navigate("/projects"), keywords: "projects portfolio build web ai ml devops cloud blockchain mobile data science open source" },
      { label: "Mock OA — timed assessments", hint: "/oa", icon: <Target className="w-4 h-4" />, run: () => navigate("/oa"), keywords: "online assessment test timed oa coding" },
      { label: "Placement Hub (10 sections)", hint: "/placement-hub", icon: <GraduationCap className="w-4 h-4" />, run: () => navigate("/placement-hub") },
      { label: "Career Roadmaps (14 roles)", hint: "/roadmap", icon: <RouteIcon className="w-4 h-4" />, run: () => navigate("/roadmap"), keywords: "roadmap career path role frontend backend devops ml" },
      { label: "Hackathon Guide", hint: "/hackathon", icon: <Rocket className="w-4 h-4" />, run: () => navigate("/hackathon"), keywords: "hackathon devfolio devpost mlh hack win team demo" },
      { label: "Spaced repetition review", hint: "/review", icon: <RotateCw className="w-4 h-4" />, run: () => navigate("/review"), keywords: "srs flashcards due" },
      { label: "Mastery radar", hint: "/mastery", icon: <BrainCircuit className="w-4 h-4" />, run: () => navigate("/mastery") },
      { label: "Engagement dashboard", hint: "/engagement", icon: <Target className="w-4 h-4" />, run: () => navigate("/engagement") },
      { label: "System Design library", hint: "/system-design", icon: <BookOpen className="w-4 h-4" />, run: () => navigate("/system-design") },
      { label: "Core CS library", hint: "/core-cs", icon: <BookOpen className="w-4 h-4" />, run: () => navigate("/core-cs") },
      { label: "Aptitude library", hint: "/aptitude", icon: <BookOpen className="w-4 h-4" />, run: () => navigate("/aptitude") },
      { label: "Interview resources", hint: "/interview-resources", icon: <BookOpen className="w-4 h-4" />, run: () => navigate("/interview-resources") },
      { label: "Certificates", hint: "/certificates", icon: <Award className="w-4 h-4" />, run: () => navigate("/certificates") },
      { label: "Settings", hint: "/settings", icon: <SettingsIcon className="w-4 h-4" />, run: () => navigate("/settings") },
    ],
    [navigate]
  );

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    if (!qq) return commands;
    return commands.filter((c) => `${c.label} ${c.hint} ${c.keywords || ""}`.toLowerCase().includes(qq));
  }, [q, commands]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) {
      setQ("");
      setFocusedIdx(0);
      setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [open]);

  const onInputKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocusedIdx((i) => Math.min(filtered.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusedIdx((i) => Math.max(0, i - 1));
    } else if (e.key === "Enter") {
      filtered[focusedIdx]?.run();
      setOpen(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm flex items-start justify-center pt-[12vh] px-4" onClick={() => setOpen(false)}>
      <div className="card-base !p-0 max-w-xl w-full overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 p-4 border-b border-[var(--color-line)]">
          <Search className="w-4 h-4 text-[var(--color-text-faint)]" />
          <input
            ref={inputRef}
            className="flex-1 bg-transparent outline-none text-base placeholder:text-[var(--color-text-faint)]"
            placeholder="Jump to anywhere…"
            value={q}
            onChange={(e) => { setQ(e.target.value); setFocusedIdx(0); }}
            onKeyDown={onInputKey}
          />
          <kbd className="mono text-[10px] px-2 py-0.5 rounded border border-[var(--color-line)] text-[var(--color-text-faint)]">ESC</kbd>
        </div>
        <div className="max-h-[55vh] overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="text-[var(--color-text-faint)] text-sm text-center py-8">No matches.</div>
          ) : (
            filtered.map((c, i) => (
              <button
                key={c.label}
                onClick={() => { c.run(); setOpen(false); }}
                onMouseEnter={() => setFocusedIdx(i)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left ${
                  i === focusedIdx ? "bg-[var(--color-neon)]/10" : "hover:bg-[var(--color-text)]/5"
                }`}
              >
                <div className={i === focusedIdx ? "text-[var(--color-neon)]" : "text-[var(--color-text-faint)]"}>{c.icon}</div>
                <div className="flex-1">
                  <div className={`text-sm ${i === focusedIdx ? "text-[var(--color-text)]" : "text-[var(--color-text-dim)]"}`}>{c.label}</div>
                  <div className="mono text-[10px] text-[var(--color-text-faint)]">{c.hint}</div>
                </div>
                {i === focusedIdx && <ArrowRight className="w-3 h-3 text-[var(--color-neon)]" />}
              </button>
            ))
          )}
        </div>
        <div className="px-4 py-2 border-t border-[var(--color-line)] mono text-[10px] text-[var(--color-text-faint)] flex justify-between">
          <span>↑↓ navigate · ↵ select</span>
          <span>⌘K toggle</span>
        </div>
      </div>
    </div>
  );
}
