import { Link } from "react-router-dom";
import { Company } from "../data/companies";

const DIFF_COLORS = ["#777", "#b9f5c8", "#c8ff3d", "#ffe87a", "#ffd4b0", "#ff8a7a"];

export function CompanyTile({ c }: { c: Company }) {
  return (
    <Link
      to={`/companies/${c.slug}`}
      className="card-base p-5 hover:border-[var(--color-neon)] transition-all flex flex-col gap-3 group relative overflow-hidden"
    >
      <div className="flex items-start gap-4">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 display text-3xl"
          style={{ background: c.brandColor || "#1a1a1a", color: c.brandColor ? "#fff" : "#c8ff3d" }}
        >
          {c.logoLetter}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-bold text-base group-hover:text-[var(--color-neon)] truncate">{c.name}</div>
          <div className="text-xs text-white/50 mono truncate">{c.sector}</div>
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5 text-[10px] mono uppercase tracking-wider">
        <span className="px-2 py-0.5 rounded bg-white/5 text-white/70">{c.tier}</span>
        <span className="px-2 py-0.5 rounded bg-[var(--color-neon)]/15 text-[var(--color-neon)]">
          ₹{c.ctcBand.typical} LPA
        </span>
        <span className="px-2 py-0.5 rounded" style={{ background: `${DIFF_COLORS[c.difficulty]}22`, color: DIFF_COLORS[c.difficulty] }}>
          {"★".repeat(c.difficulty)}
        </span>
      </div>
      <div className="text-xs text-white/40">
        {c.indianOffices.slice(0, 3).join(" · ")}
      </div>
    </Link>
  );
}
