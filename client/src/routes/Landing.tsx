import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Brain, Cpu, GitBranch, Layers, Sparkles, Zap } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Background } from "../components/layout/Background";
import { Footer } from "../components/layout/Footer";
import { AuthPanel } from "../components/auth/AuthPanel";
import { useAuth } from "../hooks/useAuth";

const FEATURES = [
  {
    tint: "neon" as const,
    icon: <Brain className="w-7 h-7" />,
    title: "Adaptive AI Tutor",
    desc: "Re-explains in your preferred style. If you stall, it pivots to a different angle automatically.",
  },
  {
    tint: "mint" as const,
    icon: <Layers className="w-7 h-7" />,
    title: "Multi-Style Lessons",
    desc: "Every lesson has Visual / Code-first / Analogy / Step-by-step variants. Switch with one click.",
  },
  {
    tint: "peach" as const,
    icon: <Cpu className="w-7 h-7" />,
    title: "Adaptive Difficulty",
    desc: "Quiz questions target ~70% expected success — the desirable-difficulty sweet spot.",
  },
  {
    tint: "yellow" as const,
    icon: <Zap className="w-7 h-7" />,
    title: "Engagement Watchdog",
    desc: "We watch focus, scroll, tab-switches. When you're stuck, we step in — gently.",
  },
  {
    tint: "blue" as const,
    icon: <GitBranch className="w-7 h-7" />,
    title: "Mastery Knowledge Graph",
    desc: "Per-topic EWMA scores feed a live radar chart. See your weak spots in one glance.",
  },
  {
    tint: "purple" as const,
    icon: <Sparkles className="w-7 h-7" />,
    title: "Spaced Repetition",
    desc: "SM-2 lite reviews wrong quiz answers and unsolved DSA problems on the right day.",
  },
];

const HOW_IT_ADAPTS = [
  { n: "01", t: "Profile you", d: "Pick a goal + a preferred teaching style at onboarding. Your browser is your identity." },
  { n: "02", t: "Watch you learn", d: "Every interaction feeds per-topic EWMA mastery scores stored in localStorage." },
  { n: "03", t: "Tune difficulty", d: "Next question / next problem aims at your ~70% success band. Easy when you struggle, hard when you fly." },
  { n: "04", t: "Pivot the explanation", d: "Stuck? PrepNext offers a re-explanation in a different style or shortens the lesson." },
];

const STATS = [
  { v: "150+", l: "Curated DSA problems" },
  { v: "400+", l: "Curated resource links" },
  { v: "4", l: "Teaching styles per lesson" },
  { v: "0", l: "Servers needed to run you" },
];

export default function Landing() {
  const { isAuthenticated, user, logout } = useAuth();
  return (
    <>
      <Background />
      <div className="relative z-10">
        <header className="mx-auto max-w-7xl px-4 sm:px-6 flex items-center justify-between h-16">
          <div className="display text-2xl neon-text">PREPNEXT</div>
          <nav className="flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <span className="text-xs text-white/40 px-2 hidden sm:inline">
                  {user?.displayName}
                </span>
                <Link to="/dashboard" className="text-xs text-white/60 hover:text-white px-3 py-2">
                  Dashboard
                </Link>
                <Button size="sm" variant="ghost" onClick={logout}>
                  Log out
                </Button>
              </>
            ) : (
              <>
                <a href="#signin" className="text-xs text-white/60 hover:text-white px-3 py-2">
                  Sign in
                </a>
                <Link to="/onboarding">
                  <Button size="sm">Get started</Button>
                </Link>
              </>
            )}
          </nav>
        </header>

        <section className="mx-auto max-w-7xl px-4 sm:px-6 pt-12 pb-20">
          <div className="grid lg:grid-cols-[1.35fr_minmax(340px,420px)] gap-10 lg:gap-12 items-center">
            {/* LEFT — hero content (unchanged copy) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="mono text-xs uppercase tracking-[0.3em] text-[var(--color-neon)] mb-4">
                · adaptive ai learning universe ·
              </div>
              <h1 className="display text-[13vw] sm:text-[90px] lg:text-[112px] leading-[0.85]">
                YOUR
                <br />
                ADAPTIVE
                <br />
                <span className="neon-text">LEARNING</span>
                <br />
                UNIVERSE.
              </h1>
              <div className="flex flex-wrap gap-3 mt-10">
                <Link to="/onboarding">
                  <Button size="lg">
                    Start learning <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link to="/dsa">
                  <Button size="lg" variant="outline">
                    Browse DSA Hub
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* RIGHT — authentication card */}
            <motion.div
              id="signin"
              className="scroll-mt-24 flex justify-center lg:justify-end"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              <AuthPanel />
            </motion.div>
          </div>
        </section>

        {/* PLACEMENT TRAINING HUB — prominent promo */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 pb-20">
          <Link to="/placement-hub" className="block group" aria-label="Explore the Placement Training Hub">
            <div className="relative overflow-hidden rounded-3xl border border-[var(--color-neon)]/30 bg-white/[0.04] backdrop-blur-2xl p-8 sm:p-12 transition-all duration-300 group-hover:border-[var(--color-neon)] group-hover:shadow-[0_10px_60px_rgba(200,255,61,0.18)]">
              <div className="absolute -right-16 -top-16 w-72 h-72 rounded-full bg-[var(--color-neon)]/10 blur-3xl pointer-events-none" />
              <div className="relative flex flex-col lg:flex-row lg:items-center gap-8 justify-between">
                <div className="max-w-2xl">
                  <div className="mono text-xs uppercase tracking-[0.3em] text-[var(--color-neon)] mb-3">
                    · new · one-stop placement prep ·
                  </div>
                  <h2 className="display text-4xl sm:text-6xl">
                    PLACEMENT TRAINING <span className="neon-text">HUB.</span>
                  </h2>
                  <p className="text-white/65 mt-4 text-lg">
                    Languages, DSA, LeetCode, Web, ML, AI, App Dev, Aptitude, Core CS, and Interviews —
                    curated roadmaps and resources with progress tracking, all in one place.
                  </p>
                  <div className="flex flex-wrap gap-2 mt-5">
                    {["DSA", "LeetCode", "Web Dev", "ML / AI", "Core CS", "Interviews"].map((t) => (
                      <span key={t} className="text-xs px-3 py-1 rounded-full border border-white/15 text-white/70">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="shrink-0">
                  <Button size="lg">
                    Explore Placement Hub <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>
              </div>
            </div>
          </Link>
        </section>

        <section className="border-y border-white/10 bg-black/40 backdrop-blur-sm">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              "Adaptive",
              "AI-Driven",
              "localStorage-only",
              "Free Forever",
            ].map((s, i) => (
              <div key={i} className="flex flex-col">
                <div className="mono text-xs uppercase tracking-widest text-white/40">// pillar {i + 1}</div>
                <div className="display text-3xl sm:text-4xl mt-2 neon-text">{s}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 sm:px-6 py-24">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
            <h2 className="display text-5xl sm:text-7xl">FEATURES.</h2>
            <p className="text-white/60 max-w-md">
              Six pieces that together make PrepNext actually adapt to you — not just slap "AI" on a CMS.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <Card tint={f.tint} className="h-full">
                  <div className="mb-4">{f.icon}</div>
                  <div className="font-extrabold text-xl mb-2">{f.title}</div>
                  <div className="text-sm opacity-80">{f.desc}</div>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 sm:px-6 py-24">
          <div className="mb-12">
            <div className="mono text-xs uppercase tracking-[0.3em] text-[var(--color-neon)] mb-3">
              · how prepnext adapts ·
            </div>
            <h2 className="display text-5xl sm:text-7xl">FOUR STEPS, ON LOOP.</h2>
          </div>
          <div className="grid lg:grid-cols-4 gap-5">
            {HOW_IT_ADAPTS.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="card-base p-6 relative overflow-hidden"
              >
                <div className="mono text-7xl text-[var(--color-neon)]/15 absolute -top-4 -right-2 select-none">
                  {step.n}
                </div>
                <div className="relative">
                  <div className="mono text-xs text-[var(--color-neon)] mb-3">{step.n}</div>
                  <div className="display text-2xl mb-2">{step.t}</div>
                  <div className="text-sm text-white/60">{step.d}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 sm:px-6 py-24 border-y border-white/10">
          <h2 className="display text-5xl sm:text-7xl mb-10">PREPNEXT IN NUMBERS.</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {STATS.map((s, i) => (
              <div key={i} className="card-base p-8 text-center">
                <div className="display text-6xl neon-text">{s.v}</div>
                <div className="text-xs text-white/60 mt-2 uppercase tracking-widest mono">{s.l}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-4 sm:px-6 py-24">
          <h2 className="display text-5xl sm:text-7xl mb-10">FAQ.</h2>
          <div className="space-y-2">
            {[
              {
                q: "Do I need an account?",
                a: "No. Your browser is your identity. Everything lives in localStorage. Wipe it from /settings whenever you want.",
              },
              {
                q: "How does the AI know me?",
                a: "Every interaction (lesson, quiz, DSA solve) feeds per-topic mastery scores. Those scores get bundled into every AI request so the model adapts.",
              },
              {
                q: "What model is this?",
                a: "openai/gpt-oss-120b through Groq. Strict JSON mode, validated server-side.",
              },
              {
                q: "Can I export my progress?",
                a: "Yes. /settings → Export → download a JSON blob. Import it on another machine and you're back where you left off.",
              },
              {
                q: "Is the resource content yours?",
                a: "No. PrepNext links out to canonical sources (donnemartin/system-design-primer, OSTEP, CMU 15-445, IndiaBix, etc.). We don't host or republish anything.",
              },
            ].map((f, i) => (
              <details key={i} className="card-base p-5 group">
                <summary className="cursor-pointer font-semibold text-lg list-none flex items-center justify-between">
                  {f.q}
                  <span className="text-[var(--color-neon)] group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="text-white/70 mt-3">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

      </div>
      <Footer />
    </>
  );
}
