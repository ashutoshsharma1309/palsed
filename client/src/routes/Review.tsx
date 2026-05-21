import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { useSRS } from "../hooks/useSRS";
import type { SRSRating } from "../lib/srs";

export default function Review() {
  const { due, review } = useSRS();
  const [idx, setIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);

  if (due.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-32 text-center">
        <h1 className="display text-5xl mb-3">NOTHING DUE.</h1>
        <p className="text-white/60 mb-6">Come back tomorrow — your spaced-repetition queue ages over time.</p>
        <Link to="/dashboard"><Button>Back to dashboard</Button></Link>
      </div>
    );
  }

  if (idx >= due.length) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-32 text-center">
        <h1 className="display text-5xl mb-3">SESSION DONE.</h1>
        <p className="text-white/60 mb-6">You reviewed {due.length} cards. Good work.</p>
        <Link to="/dashboard"><Button>Back to dashboard</Button></Link>
      </div>
    );
  }

  const card = due[idx];
  const p: any = card.payload || {};

  const rate = (r: SRSRating) => {
    review(card.itemId, card.kind, r);
    toast.success(`Rated ${r}`);
    setIdx((i) => i + 1);
    setRevealed(false);
  };

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-12">
      <div className="mono text-xs uppercase tracking-[0.3em] text-[var(--color-neon)] mb-2">// review · {idx + 1}/{due.length}</div>
      <h1 className="display text-4xl mb-6">SPACED REPETITION.</h1>

      <Card>
        <div className="mono text-[10px] uppercase tracking-widest text-white/40 mb-3">
          {card.kind} · ease {card.easeFactor.toFixed(2)} · interval {card.interval}d · reps {card.reps}
        </div>
        <div className="text-lg font-semibold mb-4">
          {p.question || p.title || card.itemId}
        </div>
        {!revealed ? (
          <Button fullWidth onClick={() => setRevealed(true)}>Show answer</Button>
        ) : (
          <>
            {p.correct && (
              <div className="p-4 rounded-lg bg-[var(--color-neon)]/10 border border-[var(--color-neon)]/40 mb-4">
                <div className="mono text-[10px] uppercase tracking-widest text-[var(--color-neon)] mb-1">correct answer</div>
                <div>{p.correct}</div>
              </div>
            )}
            {p.slug && (
              <Link to={`/dsa/${p.slug}`} className="block text-xs text-[var(--color-neon)] underline mb-4">
                Open problem →
              </Link>
            )}
            <div className="grid grid-cols-4 gap-2 mt-4">
              <Button size="sm" variant="danger" onClick={() => rate("again")}>Again</Button>
              <Button size="sm" variant="outline" onClick={() => rate("hard")}>Hard</Button>
              <Button size="sm" onClick={() => rate("good")}>Good</Button>
              <Button size="sm" variant="ghost" className="!bg-[var(--color-mint)] !text-black" onClick={() => rate("easy")}>Easy</Button>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
