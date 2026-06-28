// Pro upsell — shown in the sidebar to free users. Drives the subscription
// funnel without gating core learning content (beginners stay free). For Pro
// users it shows a subtle badge instead.
import { Link } from "react-router-dom";
import { Sparkles, Check } from "lucide-react";
import { Card } from "../ui/Card";
import { usePlan } from "../../hooks/usePlan";

export function ProUpsell() {
  const { isPro } = usePlan();

  if (isPro) {
    return (
      <Card className="bg-[var(--color-neon)]/10 border-[var(--color-neon)]/40">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[var(--color-neon)]" />
          <span className="font-semibold text-sm">PrepPlace Pro</span>
          <span className="ml-auto mono text-[10px] uppercase tracking-widest text-[var(--color-neon)]">active</span>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="w-4 h-4 text-[var(--color-neon)]" />
        <span className="font-semibold">Go Pro</span>
      </div>
      <ul className="space-y-1.5 mb-4">
        {["Advanced topics & contest prep", "AI mock interviews (soon)", "Detailed progress analytics"].map((f) => (
          <li key={f} className="text-[13px] text-[var(--color-text-dim)] flex items-center gap-2">
            <Check className="w-3.5 h-3.5 text-[var(--color-neon)] shrink-0" /> {f}
          </li>
        ))}
      </ul>
      <Link
        to="/pricing"
        className="block text-center text-sm font-semibold rounded-full px-4 py-2 bg-[var(--color-neon)] text-black hover:opacity-90"
      >
        Upgrade to Pro
      </Link>
    </Card>
  );
}
