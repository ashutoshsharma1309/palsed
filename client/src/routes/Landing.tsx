import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { ArrowRight, Building2, Calendar, Database, Layers, Search, FolderGit2, Timer, Puzzle } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { ThemeToggle } from "../components/ui/ThemeToggle";
import { AuthPanel } from "../components/auth/AuthPanel";
import { Background } from "../components/layout/Background";
import { Footer } from "../components/layout/Footer";
import { usePageMeta } from "../hooks/usePageMeta";
import { LogoLockup } from "../components/ui/Logo";
// Landing is first-paint critical. We used to import COMPANIES (96KB) +
// PYQ_SEED (19KB) just to render two `.length` stats — 115KB of JS shipped to
// print two numbers. Hardcoded here; bump when seed data grows past the next
// round number. Source files: client/src/data/{companies,pyqs-seed}.ts.
const COMPANY_COUNT = 85;
const PYQ_COUNT = 82;

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
    icon: <FolderGit2 className="w-7 h-7" />,
    title: "Project Tracks",
    desc: "Build resume-worthy projects with structured paths across 10 domains — objective, features, folder structure, tech stack, stretch goals.",
  },
  {
    tint: "yellow" as const,
    icon: <Layers className="w-7 h-7" />,
    title: "Per-Company Prep Kits",
    desc: "DSA topics + system design + behavioral + PYQs, bundled per company. Open one. Start studying.",
  },
  {
    tint: "blue" as const,
    icon: <Timer className="w-7 h-7" />,
    title: "Mock OA Practice",
    desc: "Real PYQs, timed test mode, self-graded with rubric. Simulate the platform pressure before it counts.",
  },
  {
    tint: "purple" as const,
    icon: <Puzzle className="w-7 h-7" />,
    title: "Coding Patterns",
    desc: "The 20+ recurring patterns behind DSA — recognition cues, when to use, worked examples, and grouped practice.",
  },
];

const HOW_IT_WORKS = [
  { n: "01", t: "Sign up", d: "Email + password. 30 seconds. No analysis." },
  { n: "02", t: "Learn the fundamentals", d: "DSA roadmap, coding patterns, aptitude, and core CS — structured, step by step." },
  { n: "03", t: "Practice & build", d: "Solve company-tagged PYQs, run timed mock OAs, and ship resume-worthy projects." },
  { n: "04", t: "Interview & place", d: "Per-company prep kits, interview resources, and hackathon guidance — through to the offer." },
];

const STATS = [
  { v: COMPANY_COUNT.toString(), l: "Curated recruiters" },
  { v: PYQ_COUNT.toString() + "+", l: "PYQs (and growing)" },
  { v: "150", l: "DSA problems" },
  { v: "0", l: "AI calls · zero ops cost" },
];

const FAQ_SCHEMA_ITEMS = [
  {
    q: "What is PrepNext?",
    a: "PrepNext is an all-in-one placement preparation platform for Indian college students — learn DSA and core CS, master coding patterns and aptitude, build resume-worthy projects, practice mock OAs and PYQs, and prep for interviews, all in one workspace.",
  },
  {
    q: "Is PrepNext free?",
    a: "Yes — the core features are free forever. Pro features unlock unlimited PYQ access, advanced analytics, and mock interview AI.",
  },
  {
    q: "Which companies does PrepNext cover?",
    a: "100+ top recruiters including Google, Microsoft, Amazon, Goldman Sachs, plus YC startups hiring interns.",
  },
  {
    q: "Does PrepNext help with DSA practice?",
    a: "Yes — a curated DSA tracker with 450+ problems, company-tagged, with spaced repetition for retention.",
  },
  {
    q: "Does PrepNext help me build projects for my resume?",
    a: "Yes — the Projects module gives structured learning paths across 10 domains (Web, Backend, AI/ML, Cybersecurity, Cloud, DevOps, Mobile, Blockchain, Data Science, Open Source), each with beginner→advanced projects detailing objective, features, folder structure, tech stack, and stretch goals.",
  },
  {
    q: "Is PrepNext only for engineering students?",
    a: "PrepNext is optimized for engineering campus placements but works for any college student preparing for tech, finance, or consulting recruiting.",
  },
];

export default function Landing() {
  const location = useLocation();
  const navigate = useNavigate();

  usePageMeta({
    title: "Placement Season OS for Indian campus students",
    description:
      "Learn DSA + Core CS, master coding patterns and aptitude, build resume-worthy projects, practice mock OAs and PYQs, and prep for interviews — all in one workspace. Free for students.",
    canonical: "/",
  });

  // Inject FAQPage JSON-LD into <head> for rich Google snippets.
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: FAQ_SCHEMA_ITEMS.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.a,
        },
      })),
    });
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, []);

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
          <LogoLockup wordmarkClass="display text-2xl neon-text" markSize={26} />
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
              <p className="text-base sm:text-lg text-[var(--color-text-dim)] max-w-xl mt-7">
                Every recruiter visiting your campus. Every previous-year question. Every application
                you've submitted. One platform. No more scattered WhatsApp groups or rotting Google Docs.
              </p>
              <div className="flex flex-wrap gap-3 mt-8 lg:hidden">
                <a href="#auth">
                  <Button size="lg">
                    Start tracking <ArrowRight className="w-4 h-4" />
                  </Button>
                </a>
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
                <AuthPanel />
              </div>
            </motion.div>
          </div>
        </section>

        <section className="border-y border-[var(--color-line)] bg-black/40 backdrop-blur-sm">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((s, i) => (
              <div key={i} className="flex flex-col">
                <div className="mono text-xs uppercase tracking-widest text-[var(--color-text-faint)]">// pillar {i + 1}</div>
                <div className="display text-3xl sm:text-4xl mt-2 neon-text">{s.v}</div>
                <div className="text-xs text-[var(--color-text-faint)] mt-1">{s.l}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 sm:px-6 py-24">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
            <h2 className="display text-5xl sm:text-7xl">WHAT YOU GET.</h2>
            <p className="text-[var(--color-text-faint)] max-w-md">
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
                  <div className="text-sm text-[var(--color-text-faint)]">{step.d}</div>
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
                a: "It's free. Learn DSA step by step, practice problems, and track your streak at no cost.",
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
                <p className="text-[var(--color-text-dim)] mt-3">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
