import { useMemo, useState } from "react";
import { IndianRupee, Calculator, Building2, Plus, Lock, ChevronRight } from "lucide-react";
import { Card } from "../components/ui/Card";
import { Chip } from "../components/ui/Chip";
import { Button } from "../components/ui/Button";
import { breakdownCtc, takehome, CITY_HRA, formatINR } from "../lib/salaryMath";
import { COMPANIES } from "../data/companies";
import { usePageMeta } from "../hooks/usePageMeta";
import { Link } from "react-router-dom";

// Salary Calculator + Takehome Estimator.
// Pure math: New Tax Regime FY 2025-26 + Indian PF/gratuity rules.
// Free for one calc/session; Pro gating wraps the offer comparison feature.

export default function Salary() {
  usePageMeta({
    title: "Salary Calculator — what's your real takehome on a ₹X LPA offer?",
    description: "Calculate in-hand monthly salary for any campus placement offer. Tax breakdown, HRA, PF, gratuity — for every Indian city. Free.",
    canonical: "/salary",
  });

  const [ctc, setCtc] = useState<number>(15);
  const [city, setCity] = useState<string>("Bengaluru");
  const [hasJoinBonus, setHasJoinBonus] = useState(false);
  const [joinBonus, setJoinBonus] = useState<number>(2);

  const b = useMemo(() => breakdownCtc(ctc, city, hasJoinBonus, joinBonus), [ctc, city, hasJoinBonus, joinBonus]);
  const t = useMemo(() => takehome(b), [b]);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
      <header className="mb-8">
        <div className="mono text-xs uppercase tracking-[0.3em] text-[var(--color-neon)] mb-2">// salary lab</div>
        <h1 className="display text-5xl sm:text-6xl">YOUR REAL TAKEHOME.</h1>
        <p className="text-[var(--color-text-dim)] mt-2 max-w-2xl">
          Indian recruiters quote CTC. You care about monthly in-hand. Set your offer below and see
          the real numbers — basic, HRA, PF, bonus, tax — broken down honestly.
        </p>
      </header>

      <div className="grid lg:grid-cols-[1fr_1.4fr] gap-6 mb-8">
        {/* INPUT PANEL */}
        <Card>
          <h2 className="display text-xl mb-4">YOUR OFFER.</h2>

          <div className="space-y-4">
            <div>
              <label className="mono text-[10px] uppercase tracking-widest text-[var(--color-text-faint)]">
                CTC (LPA) <span className="text-[var(--color-text)]">· ₹{ctc} LPA</span>
              </label>
              <input
                type="range"
                min={3}
                max={150}
                step={0.5}
                value={ctc}
                onChange={(e) => setCtc(Number(e.target.value))}
                className="w-full mt-2 accent-[var(--color-neon)]"
              />
              <input
                type="number"
                value={ctc}
                onChange={(e) => setCtc(Math.max(0, Number(e.target.value) || 0))}
                step={0.5}
                min={0}
                className="w-full mt-2 bg-[var(--color-card-soft)] border border-[var(--color-line)] rounded-lg px-3 py-2 text-sm outline-none focus:border-[var(--color-neon)]"
              />
            </div>

            <div>
              <label className="mono text-[10px] uppercase tracking-widest text-[var(--color-text-faint)]">City</label>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {CITY_HRA.map((c) => (
                  <Chip key={c.city} active={city === c.city} onClick={() => setCity(c.city)}>
                    {c.city}
                  </Chip>
                ))}
              </div>
            </div>

            <label className="inline-flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={hasJoinBonus}
                onChange={(e) => setHasJoinBonus(e.target.checked)}
                className="accent-[var(--color-neon)]"
              />
              <span>Joining bonus / Year-1 RSU vest</span>
            </label>

            {hasJoinBonus && (
              <div>
                <label className="mono text-[10px] uppercase tracking-widest text-[var(--color-text-faint)]">
                  Joining bonus (LPA) · ₹{joinBonus} LPA
                </label>
                <input
                  type="range"
                  min={0}
                  max={20}
                  step={0.5}
                  value={joinBonus}
                  onChange={(e) => setJoinBonus(Number(e.target.value))}
                  className="w-full mt-2 accent-[var(--color-neon)]"
                />
              </div>
            )}
          </div>
        </Card>

        {/* RESULTS PANEL */}
        <Card className="border-[var(--color-neon)]/30">
          <div className="mono text-[10px] uppercase tracking-widest text-[var(--color-neon)] mb-1">· in-hand ·</div>
          <div className="flex items-baseline gap-2 mb-1">
            <div className="display text-6xl neon-text">
              ₹{formatINR(t.monthlyInhandRupees)}
            </div>
            <span className="text-sm text-[var(--color-text-faint)]">/ month</span>
          </div>
          <div className="text-sm text-[var(--color-text-dim)] mb-5">
            ≈ ₹{t.netInhandAnnualLpa.toFixed(2)} LPA net · after tax
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
            <Stat label="Basic" value={`₹${b.basicLpa.toFixed(2)} L`} />
            <Stat label="HRA" value={`₹${b.hraLpa.toFixed(2)} L`} hint={`${(CITY_HRA.find((c) => c.city === city) || CITY_HRA[CITY_HRA.length - 1]).hraPct}% of basic`} />
            <Stat label="Other allow." value={`₹${b.otherAllowanceLpa.toFixed(2)} L`} />
            <Stat label="Annual bonus" value={`₹${b.bonusLpa.toFixed(2)} L`} />
          </div>

          <div className="text-[10px] mono uppercase tracking-widest text-[var(--color-text-faint)] mb-2">Employer adds on top (not in your hand)</div>
          <div className="grid grid-cols-3 gap-3 mb-5">
            <Stat label="PF (employer)" value={`₹${b.pfEmployerLpa.toFixed(2)} L`} hint="12% of basic" />
            <Stat label="Gratuity" value={`₹${b.gratuityLpa.toFixed(2)} L`} hint="4.81% of basic" />
            <Stat label="Insurance" value={`₹${b.insuranceLpa.toFixed(2)} L`} />
          </div>

          {b.oneTimeLpa > 0 && (
            <div className="mb-5 rounded-xl bg-[var(--color-neon)]/[0.08] border border-[var(--color-neon)]/30 p-3">
              <div className="mono text-[10px] uppercase tracking-widest text-[var(--color-neon)] mb-1">Year 1 only</div>
              <div className="text-sm">
                Joining bonus of <strong>₹{b.oneTimeLpa.toFixed(2)} L</strong> adds to year-1 takehome.
                Often clawed back if you leave within 12-24 months — read the contract carefully.
              </div>
            </div>
          )}

          <div className="border-t border-[var(--color-line)] pt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[var(--color-text-dim)]">Gross taxable</span>
              <span>₹{t.grossInhandAnnualLpa.toFixed(2)} L</span>
            </div>
            <div className="flex items-center justify-between text-sm mt-1">
              <span className="text-[var(--color-text-dim)]">Income tax (New Regime)</span>
              <span className="text-[var(--severity-crit-text)]">- ₹{t.taxAnnualLpa.toFixed(2)} L</span>
            </div>
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-[var(--color-line)]">
              <span className="font-bold">Net annual</span>
              <span className="display text-xl text-[var(--color-neon)]">₹{t.netInhandAnnualLpa.toFixed(2)} L</span>
            </div>
          </div>
        </Card>
      </div>

      {/* COMPARE — Pro-gated upsell */}
      <Card className="mb-6 border-[var(--color-neon)]/30 relative overflow-hidden">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex-1 min-w-[280px]">
            <div className="flex items-center gap-2 mb-1">
              <Lock className="w-3.5 h-3.5 text-[var(--color-neon)]" />
              <span className="mono text-[10px] uppercase tracking-widest text-[var(--color-neon)]">PrepNext Pro</span>
            </div>
            <div className="display text-2xl">Compare multiple offers side-by-side.</div>
            <p className="text-sm text-[var(--color-text-dim)] mt-1">
              Got offers from 2-3 companies? Compare in-hand, RSU vest schedules, 5-year takehome
              projections, and city cost-of-living adjustments.
            </p>
          </div>
          <Link to="/compare">
            <Button>
              Compare offers <ChevronRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </Card>

      {/* Reference: companies near your CTC */}
      <Card>
        <div className="flex items-center gap-2 mb-3">
          <Building2 className="w-4 h-4 text-[var(--color-neon)]" />
          <h3 className="font-bold">Companies offering near ₹{ctc} LPA</h3>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {COMPANIES
            .filter((c) => c.verified && Math.abs(c.ctcBand.typical - ctc) <= Math.max(3, ctc * 0.2))
            .slice(0, 8)
            .map((c) => (
              <Link
                key={c.id}
                to={`/companies/${c.slug}`}
                className="border border-[var(--color-line)] rounded-lg px-3 py-2 hover:border-[var(--color-neon)]/40 transition-colors flex items-center justify-between text-sm"
              >
                <span>{c.name}</span>
                <span className="text-[var(--color-neon)] mono text-[11px]">₹{c.ctcBand.typical} L</span>
              </Link>
            ))}
        </div>
      </Card>

      <div className="mt-6 text-[11px] text-[var(--color-text-faint)] max-w-2xl">
        <strong className="text-[var(--color-text-dim)]">Disclaimer:</strong> illustrative numbers using New Tax Regime
        FY 2025-26 with ₹75k standard deduction. Actual CTC composition varies (RSU vest schedules,
        retirals %, perks). Verify your payslip with a CA before financial decisions.
      </div>
    </div>
  );
}

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div>
      <div className="mono text-[10px] uppercase tracking-widest text-[var(--color-text-faint)]">{label}</div>
      <div className="font-bold mt-0.5">{value}</div>
      {hint && <div className="text-[10px] text-[var(--color-text-faint)] mt-0.5">{hint}</div>}
    </div>
  );
}
