import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Chip } from "../components/ui/Chip";
import { COMPANIES } from "../data/companies";
import { PYQRound } from "../data/pyqs-seed";
import { usePYQs } from "../hooks/usePYQs";

const ROUNDS: PYQRound[] = ["OA","Tech","HR","Managerial","Group Discussion","Case","Bar Raiser"];
const DIFFS = ["Easy", "Medium", "Hard"] as const;

export default function PyqSubmit() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { submit } = usePYQs();

  const [companySlug, setCompanySlug] = useState(params.get("company") || "");
  const [round, setRound] = useState<PYQRound>("OA");
  const [year, setYear] = useState(new Date().getFullYear());
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState<(typeof DIFFS)[number]>("Medium");
  const [question, setQuestion] = useState("");
  const [expectedApproach, setExpectedApproach] = useState("");

  const company = COMPANIES.find((c) => c.slug === companySlug);

  const onSubmit = () => {
    if (!companySlug) return toast.error("Pick a company");
    if (!topic.trim()) return toast.error("Add a topic");
    if (question.trim().length < 20) return toast.error("Question is too short");
    if (year < 2015 || year > new Date().getFullYear() + 1) return toast.error("Year out of range");

    const created = submit({
      companySlug,
      round,
      year,
      topic: topic.trim(),
      difficulty,
      question: question.trim(),
      expectedApproach: expectedApproach.trim() || undefined,
    });
    toast.success("Submitted! Pending verification.");
    navigate(`/companies/${companySlug}#pyq-${created.id}`);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
      <Link to="/pyq" className="text-xs text-white/40 hover:text-white inline-flex items-center gap-1 mb-3">
        <ArrowLeft className="w-3 h-3" /> PYQ vault
      </Link>
      <div className="mono text-xs uppercase tracking-[0.3em] text-[var(--color-neon)] mb-2">// submit a PYQ</div>
      <h1 className="display text-5xl mb-2">CONTRIBUTE.</h1>
      <p className="text-white/60 mb-8">
        Help other students prep. Your submission goes into a verification queue — once 3 people
        confirm, it gets a ✓ verified badge.
      </p>

      <Card className="space-y-6">
        <Field label="Company">
          <select
            className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg p-3"
            value={companySlug}
            onChange={(e) => setCompanySlug(e.target.value)}
          >
            <option value="">— pick —</option>
            {COMPANIES.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
          </select>
          {company && <div className="text-xs text-white/40 mt-1 mono">{company.sector} · {company.tier}</div>}
        </Field>

        <Field label="Round">
          <div className="flex flex-wrap gap-1.5">
            {ROUNDS.map((r) => (
              <Chip tone="neon" key={r} active={round === r} onClick={() => setRound(r)}>{r}</Chip>
            ))}
          </div>
        </Field>

        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Year">
            <input
              type="number"
              min="2015"
              max={new Date().getFullYear() + 1}
              className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg p-3"
              value={year}
              onChange={(e) => setYear(+e.target.value)}
            />
          </Field>
          <Field label="Difficulty">
            <div className="flex gap-1.5">
              {DIFFS.map((d) => (
                <Chip key={d} active={difficulty === d} onClick={() => setDifficulty(d)}>{d}</Chip>
              ))}
            </div>
          </Field>
        </div>

        <Field label="Topic" hint="e.g. Arrays & Hashing, OS, DBMS, OOPs, System Design, HR">
          <input
            className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg p-3"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
        </Field>

        <Field label="Question" hint="The exact phrasing you remember (or paraphrase). Be precise about constraints.">
          <textarea
            rows={5}
            className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg p-3 resize-y"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="e.g. Given an array of N integers, find the longest subarray with sum divisible by K."
          />
        </Field>

        <Field label="Expected approach" hint="(optional) A 1-2 line hint at the intended solution. Don't post the full code.">
          <textarea
            rows={3}
            className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg p-3 resize-y"
            value={expectedApproach}
            onChange={(e) => setExpectedApproach(e.target.value)}
            placeholder="e.g. Prefix sum mod K + hashmap of first-seen index."
          />
        </Field>

        <Button fullWidth onClick={onSubmit}>Submit for verification</Button>
        <div className="text-[10px] text-white/40 mono uppercase tracking-widest text-center">
          By submitting, you confirm this question is not under NDA and is being asked publicly.
        </div>
      </Card>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="text-[10px] uppercase tracking-widest text-white/50 mono mb-1">{label}</div>
      {children}
      {hint && <div className="text-xs text-white/40 mt-1">{hint}</div>}
    </label>
  );
}
