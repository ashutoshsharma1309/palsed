import { Check, Sparkles, Crown, Building2 } from "lucide-react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { usePageMeta } from "../hooks/usePageMeta";
import { useState } from "react";

interface Tier {
  name: string;
  price: string;
  yearlyHint?: string;
  blurb: string;
  cta: string;
  highlight?: boolean;
  Icon: typeof Sparkles;
  features: { included: boolean; text: string; pro?: boolean }[];
}

const TIERS: Tier[] = [
  {
    name: "Free",
    price: "₹0",
    blurb: "Everything you need to get started. No card, no time limit.",
    cta: "Start free",
    Icon: Sparkles,
    features: [
      { included: true, text: "75 recruiters with eligibility + rounds" },
      { included: true, text: "PYQ vault (read + vote)" },
      { included: true, text: "Applications kanban (3 active)" },
      { included: true, text: "DSA tracker (450+ problems)" },
      { included: true, text: "Resume Roast (3 scores / month)" },
      { included: true, text: "Salary calculator" },
      { included: true, text: "Compare up to 3 companies" },
      { included: false, text: "Unlimited Resume Roasts", pro: true },
      { included: false, text: "PYQ contribute + leaderboard", pro: true },
      { included: false, text: "Per-company AI prep plans", pro: true },
    ],
  },
  {
    name: "Pro",
    price: "₹99",
    yearlyHint: "₹999/yr · save 16%",
    blurb: "For students serious about a top offer this season.",
    cta: "Go Pro",
    highlight: true,
    Icon: Crown,
    features: [
      { included: true, text: "Everything in Free, plus:" },
      { included: true, text: "Unlimited Resume Roasts" },
      { included: true, text: "Unlimited applications" },
      { included: true, text: "Compare 6 companies side-by-side" },
      { included: true, text: "5-year takehome projections + RSU" },
      { included: true, text: "Offer-letter clause analyzer" },
      { included: true, text: "Priority PYQ submission queue" },
      { included: true, text: "Contributor leaderboard + badges" },
      { included: true, text: "Telegram bot notifications" },
      { included: true, text: "Daily prep digest email" },
      { included: true, text: "Custom OA practice tests" },
    ],
  },
  {
    name: "Team",
    price: "₹499",
    yearlyHint: "per 5 students / month",
    blurb: "For college placement cells + campus ambassadors.",
    cta: "Talk to us",
    Icon: Building2,
    features: [
      { included: true, text: "Everything in Pro for each member" },
      { included: true, text: "Shared application kanban" },
      { included: true, text: "Group OA challenges (PVP mode)" },
      { included: true, text: "Campus leaderboard" },
      { included: true, text: "Cohort prep analytics" },
      { included: true, text: "Branded space (your college's name)" },
      { included: true, text: "Coordinator dashboard" },
      { included: true, text: "Priority support" },
    ],
  },
];

export default function Pricing() {
  usePageMeta({
    title: "Pricing — Free, Pro, Team for campus placement prep",
    description: "PrepNext is free forever. Pro at ₹99/mo unlocks unlimited features. Team for placement cells.",
    canonical: "/pricing",
  });

  const [annual, setAnnual] = useState(false);

  const handleCta = (t: Tier) => {
    if (t.name === "Free") {
      toast.success("You're already on the Free tier!");
      return;
    }
    toast(
      `${t.name} launches Aug 2026. Subscribe to early-bird wait-list?`,
      { icon: "🚀", duration: 4000 }
    );
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
      <header className="text-center mb-10">
        <div className="mono text-xs uppercase tracking-[0.3em] text-[var(--color-neon)] mb-2">// pricing</div>
        <h1 className="display text-5xl sm:text-7xl">SIMPLE PRICING.</h1>
        <p className="text-white/60 mt-3 max-w-xl mx-auto">
          Free forever for the basics. Pro for students who want every edge this placement season.
          No hidden charges, no trial-to-card surprises.
        </p>

        {/* Billing toggle */}
        <div className="inline-flex items-center bg-white/[0.04] border border-white/15 rounded-full p-1 mt-6 mono text-[11px] uppercase tracking-widest">
          <button
            onClick={() => setAnnual(false)}
            className={`px-4 py-1.5 rounded-full transition-colors ${!annual ? "bg-[var(--color-neon)] text-black" : "text-white/60 hover:text-white"}`}
          >
            Monthly
          </button>
          <button
            onClick={() => setAnnual(true)}
            className={`px-4 py-1.5 rounded-full transition-colors ${annual ? "bg-[var(--color-neon)] text-black" : "text-white/60 hover:text-white"}`}
          >
            Annual <span className="ml-1 opacity-70">· save 16%</span>
          </button>
        </div>
      </header>

      <div className="grid md:grid-cols-3 gap-5">
        {TIERS.map((t) => {
          const Icon = t.Icon;
          return (
            <Card
              key={t.name}
              className={
                t.highlight
                  ? "border-[var(--color-neon)] !bg-[var(--color-neon)]/[0.04] ring-1 ring-[var(--color-neon)]/30 relative overflow-hidden"
                  : ""
              }
            >
              {t.highlight && (
                <div className="absolute top-0 right-4 bg-[var(--color-neon)] text-black text-[10px] mono uppercase tracking-widest font-bold px-2.5 py-0.5 rounded-b">
                  Most popular
                </div>
              )}

              <div className="flex items-center gap-2 mb-2">
                <Icon className={`w-4 h-4 ${t.highlight ? "text-[var(--color-neon)]" : "text-white/60"}`} />
                <div className="display text-2xl">{t.name}</div>
              </div>

              <div className="flex items-baseline gap-1 mb-1">
                <span className="display text-5xl neon-text">
                  {t.name === "Pro" && annual ? "₹83" : t.price}
                </span>
                {t.name !== "Free" && (
                  <span className="text-sm text-white/50">
                    /{t.name === "Team" ? "month" : "month"}
                  </span>
                )}
              </div>
              {t.yearlyHint && (
                <div className="text-[11px] text-white/50 mono mb-3">
                  {t.name === "Pro" && annual ? "billed ₹999/yr" : t.yearlyHint}
                </div>
              )}

              <p className="text-sm text-white/65 mb-5">{t.blurb}</p>

              <Button onClick={() => handleCta(t)} fullWidth variant={t.highlight ? undefined : "ghost"}>
                {t.cta}
              </Button>

              <ul className="space-y-2 mt-5 pt-5 border-t border-white/10">
                {t.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <Check
                      className={`w-4 h-4 mt-0.5 shrink-0 ${
                        f.included ? "text-[var(--color-neon)]" : "text-white/20"
                      }`}
                    />
                    <span className={f.included ? "text-white/90" : "text-white/35 line-through"}>
                      {f.text}
                    </span>
                    {f.pro && !f.included && (
                      <span className="text-[9px] mono uppercase tracking-widest text-[var(--color-neon)]/80 self-center">
                        Pro
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </Card>
          );
        })}
      </div>

      {/* TRUST SECTION */}
      <div className="mt-12 grid md:grid-cols-3 gap-5">
        <Card>
          <div className="display text-xl mb-2">Money-back guarantee.</div>
          <p className="text-sm text-white/60">
            7-day no-questions-asked refund. We only want you on Pro if it's saving you time.
          </p>
        </Card>
        <Card>
          <div className="display text-xl mb-2">Built by students, for students.</div>
          <p className="text-sm text-white/60">
            Made by people who interviewed at FAANG + Indian unicorns last placement season.
          </p>
        </Card>
        <Card>
          <div className="display text-xl mb-2">No card up front.</div>
          <p className="text-sm text-white/60">
            Cancel anytime in Settings. We won't auto-charge or hide a cancel flow.
          </p>
        </Card>
      </div>

      <div className="text-center mt-10 text-sm text-white/50">
        Have a coupon code or college tie-up?{" "}
        <Link to="/settings" className="text-[var(--color-neon)] underline">
          Apply in Settings →
        </Link>
      </div>
    </div>
  );
}
