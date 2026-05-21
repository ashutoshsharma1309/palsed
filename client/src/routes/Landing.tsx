import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Brain, Cpu, GitBranch, Layers, Sparkles, Zap } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Background } from "../components/layout/Background";
import { Footer } from "../components/layout/Footer";

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
  { n: "04", t: "Pivot the explanation", d: "Stuck? PalsEd offers a re-explanation in a different style or shortens the lesson." },
];

const STATS = [
  { v: "150+", l: "Curated DSA problems" },
  { v: "400+", l: "Curated resource links" },
  { v: "4", l: "Teaching styles per lesson" },
  { v: "0", l: "Servers needed to run you" },
];

export default function Landing() {
  return (
    <>
      <Background />
      <div className="relative z-10">
        <header className="mx-auto max-w-7xl px-4 sm:px-6 flex items-center justify-between h-16">
          <div className="display text-2xl neon-text">PALSED</div>
          <nav className="flex items-center gap-2">
            <Link to="/dashboard" className="text-xs text-white/60 hover:text-white px-3 py-2">
              Dashboard
            </Link>
            <Link to="/onboarding">
              <Button size="sm">Get started</Button>
            </Link>
          </nav>
        </header>

        <section className="mx-auto max-w-7xl px-4 sm:px-6 pt-12 pb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-5xl"
          >
            <div className="mono text-xs uppercase tracking-[0.3em] text-[var(--color-neon)] mb-4">
              · adaptive ai learning universe ·
            </div>
            <h1 className="display text-[14vw] sm:text-[110px] lg:text-[150px] leading-[0.85]">
              YOUR
              <br />
              ADAPTIVE
              <br />
              <span className="neon-text">LEARNING</span>
              <br />
              UNIVERSE.
            </h1>
            <p className="text-lg sm:text-xl text-white/70 max-w-2xl mt-8">
              PalsEd watches how you learn — your pace, your engagement, your gaps — and reshapes
              every lesson, hint, and quiz to fit you. Pure browser, zero backend storage,
              ridiculously powerful AI.
            </p>
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
              Six pieces that together make PalsEd actually adapt to you — not just slap "AI" on a CMS.
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
              · how palsed adapts ·
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

        <section className="mx-auto max-w-7xl px-4 sm:px-6 py-24">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
            <h2 className="display text-5xl sm:text-7xl">YOUR JOURNEY.</h2>
          </div>
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="relative h-[400px]">
              {[0, 1, 2, 3].map((i) => {
                const size = 360 - i * 70;
                const rot = i * 22;
                return (
                  <div
                    key={i}
                    className="absolute top-1/2 left-1/2 border-2 border-[var(--color-neon)]/30"
                    style={{
                      width: size,
                      height: size,
                      marginLeft: -size / 2,
                      marginTop: -size / 2,
                      transform: `rotate(${rot}deg)`,
                      borderRadius: i === 3 ? "20%" : "0",
                      animation: "blob-float 20s ease-in-out infinite",
                      animationDelay: `${i * 0.5}s`,
                    }}
                  />
                );
              })}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="display text-5xl neon-text">YOU</div>
                  <div className="mono text-xs text-white/40 mt-2">at the center</div>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              {[
                { t: "Day 1", d: "Onboard, set a goal, take a baseline." },
                { t: "Day 3", d: "First adaptive course generated for your weak topics." },
                { t: "Day 10", d: "Spaced-repetition queue is humming, mastery radar fills in." },
                { t: "Day 30", d: "You can defend the topics you used to dodge in interviews." },
              ].map((j, i) => (
                <div key={i} className="card-base p-5 flex items-center gap-4">
                  <div className="display text-3xl neon-text w-24 shrink-0">{j.t}</div>
                  <div className="text-white/70">{j.d}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 sm:px-6 py-24 border-y border-white/10">
          <h2 className="display text-5xl sm:text-7xl mb-10">PALSED IN NUMBERS.</h2>
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
                a: "No. PalsEd links out to canonical sources (donnemartin/system-design-primer, OSTEP, CMU 15-445, IndiaBix, etc.). We don't host or republish anything.",
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

        <section className="mx-auto max-w-7xl px-4 sm:px-6 py-24">
          <Card className="bg-[var(--color-neon)] text-black flex flex-col lg:flex-row items-center justify-between gap-6 border-0">
            <div>
              <div className="display text-4xl sm:text-6xl">READY TO ADAPT?</div>
              <div className="text-sm mt-2 opacity-80">
                Onboarding takes 30 seconds. Browser stores it all. No emails.
              </div>
            </div>
            <Link to="/onboarding">
              <Button size="lg" variant="outline" className="!bg-black !text-[var(--color-neon)] !border-black">
                Start now <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </Card>
        </section>
      </div>
      <Footer />
    </>
  );
}
