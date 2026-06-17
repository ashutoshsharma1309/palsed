import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { ArrowRight, Building2, Calendar, Database, Layers, Search, Target } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { ThemeToggle } from "../components/ui/ThemeToggle";
import { AuthPanel } from "../components/auth/AuthPanel";
import { Background } from "../components/layout/Background";
import { Footer } from "../components/layout/Footer";
import { COMPANIES } from "../data/companies";
import { PYQ_SEED } from "../data/pyqs-seed";

const FEATURES = [
  {
    tint: "neon" as const,
    icon: <Building2 className="w-7 h-7" />,
    title: "Recruiter Map",
    desc: "50 top companies — eligibility, packages, rounds, OA platforms, topics asked, tips from past offer holders.",
  },
  {
    tint: "mint" as const,
    icon: <Database className="w-7 h-7" />,
    title: "PYQ Vault",
    desc: "Previous-year questions by company × round × year. Crowd-sourced, verified, voted.",
  },
  {
    tint: "peach" as const,
    icon: <Target className="w-7 h-7" />,
    title: "Application Tracker",
    desc: "Kanban for your placement season. Wishlist → OA → Tech → HR → Offer. Deadlines, notes, conversion rate.",
  },
  {
    tint: "yellow" as const,
    icon: <Layers className="w-7 h-7" />,
    title: "Per-Company Prep Kits",
    desc: "DSA topics + system design + behavioral + PYQs, bundled per company. Open one. Start studying.",
  },
  {
    tint: "blue" as const,
    icon: <Calendar className="w-7 h-7" />,
    title: "Placement Calendar",
    desc: "Every upcoming round date with company logo, role, and prep status. iCal export soon.",
  },
  {
    tint: "purple" as const,
    icon: <Search className="w-7 h-7" />,
    title: "Spaced-repetition + Mastery",
    desc: "Missed questions resurface on the right day. Per-topic mastery radar. Cmd+K to jump anywhere.",
  },
];

const HOW_IT_WORKS = [
  { n: "01", t: "Sign up", d: "Email + password. 30 seconds. No analysis." },
  { n: "02", t: "Pick your targets", d: "Browse 50 recruiter pages. Bookmark the ones visiting your campus." },
  { n: "03", t: "Track every round", d: "Add each application to the kanban. Move it as you progress." },
  { n: "04", t: "Prep with PYQs", d: "Open any company → past questions, topics, tips. Quiz yourself daily." },
];

const STATS = [
  { v: COMPANIES.length.toString(), l: "Curated recruiters" },
  { v: PYQ_SEED.length.toString() + "+", l: "PYQs (and growing)" },
  { v: "150", l: "DSA problems" },
  { v: "0", l: "AI calls · zero ops cost" },
];

export default function Landing() {
  const location = useLocation();
  const navigate = useNavigate();

  // If the user landed here via RequireAuth redirect, notify them and
  // bring the AuthPanel into view.
  useEffect(() => {
    const state = location.state as { requiresAuth?: boolean; from?: string } | null;
    if (!state?.requiresAuth) return;
    toast.error("Please log in to access that feature.", { id: "auth-required", duration: 4500 });
    // give the page a tick to mount before scrolling
    const t = setTimeout(() => {
      document.getElementById("auth")?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 80);
    // Strip the state so a refresh doesn't keep firing the toast.
    navigate(location.pathname + location.search, { replace: true, state: { from: state.from } });
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Background />
      <div className="relative z-10">
        <header className="mx-auto max-w-7xl px-4 sm:px-6 flex items-center justify-between h-16">
          <div className="display text-2xl neon-text">PREPNEXT</div>
          <nav className="flex items-center gap-2">
            <ThemeToggle />
            <a href="#auth">
              <Button size="sm">Sign in</Button>
            </a>
          </nav>
        </header>

        {/* HERO — two-column on lg: headline + AuthPanel side-by-side.
            On smaller screens it stacks vertically (headline first, AuthPanel below). */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 pt-10 lg:pt-16 pb-24">
          <div className="grid lg:grid-cols-[1.5fr_minmax(380px,1fr)] gap-10 lg:gap-14 items-center">
            {/* LEFT — headline + copy + secondary CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
            >
              <div className="mono text-xs uppercase tracking-[0.3em] text-[var(--color-neon)] mb-4">
                · placement season · operating system ·
              </div>
              <h1 className="display text-[13vw] sm:text-[88px] lg:text-[104px] xl:text-[124px] leading-[0.86]">
                YOUR
                <br />
                PLACEMENT
                <br />
                <span className="neon-text">SEASON,</span>
                <br />
                ORGANIZED.
              </h1>
              <p className="text-base sm:text-lg text-white/70 max-w-xl mt-7">
                Every recruiter visiting your campus. Every previous-year question. Every application
                you've submitted. One platform. No more scattered WhatsApp groups or rotting Google Docs.
              </p>
              <div className="flex flex-wrap gap-3 mt-8">
                <a href="#auth" className="lg:hidden">
                  <Button size="lg">
                    Start tracking <ArrowRight className="w-4 h-4" />
                  </Button>
                </a>
                <Link to="/companies">
                  <Button size="lg" variant="outline">
                    Browse 50 recruiters
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* RIGHT — AuthPanel always visible alongside the headline on lg+,
                stacks below on smaller screens. Anchor target for #auth scrolls. */}
            <motion.div
              id="auth"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex justify-center lg:justify-end scroll-mt-24"
            >
              <div className="w-full max-w-md lg:max-w-sm xl:max-w-md">
                <div className="mono text-[10px] uppercase tracking-[0.32em] text-[var(--color-neon)] text-center lg:text-left mb-3">
                  · 30-second signup · no questionnaires ·
                </div>
                <AuthPanel defaultTab="signup" />
              </div>
            </motion.div>
          </div>
        </section>

        <section className="border-y border-white/10 bg-black/40 backdrop-blur-sm">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((s, i) => (
              <div key={i} className="flex flex-col">
                <div className="mono text-xs uppercase tracking-widest text-white/40">// pillar {i + 1}</div>
                <div className="display text-3xl sm:text-4xl mt-2 neon-text">{s.v}</div>
                <div className="text-xs text-white/50 mt-1">{s.l}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 sm:px-6 py-24">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
            <h2 className="display text-5xl sm:text-7xl">WHAT YOU GET.</h2>
            <p className="text-white/60 max-w-md">
              Six features that turn your placement season from a panic into a workflow.
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
              · how it works ·
            </div>
            <h2 className="display text-5xl sm:text-7xl">FOUR STEPS. NO BS.</h2>
          </div>
          <div className="grid lg:grid-cols-4 gap-5">
            {HOW_IT_WORKS.map((step, i) => (
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

        <section className="mx-auto max-w-4xl px-4 sm:px-6 py-24">
          <h2 className="display text-5xl sm:text-7xl mb-10">FAQ.</h2>
          <div className="space-y-2">
            {[
              {
                q: "Is this another AI-powered edtech?",
                a: "No. PrepNext does zero AI calls at runtime. We don't analyze you, predict you, or grade you. The platform is pure workflow — recruiter data + your data + tracking. Faster, cheaper, more trustworthy.",
              },
              {
                q: "Where do the questions come from?",
                a: "Seeded by us, then crowd-contributed. Every submission goes into a verification queue. Once 3 students confirm accuracy, it gets a ✓ badge.",
              },
              {
                q: "Is my data private?",
                a: "Your application tracker, notes, mastery — only you see them. Public profiles are opt-in.",
              },
              {
                q: "What does it cost?",
                a: "Free during beta. Premium tier later: priority verification, deeper salary data, recruiter visibility.",
              },
              {
                q: "What if my college isn't listed?",
                a: "Doesn't matter — companies are companies. The platform works regardless of college. We'll add per-college visit schedules in v2.",
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
