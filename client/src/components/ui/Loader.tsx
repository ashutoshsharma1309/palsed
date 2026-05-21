export function Loader({ label = "Thinking" }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-10">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-2 border-[var(--color-neon)]/30 animate-ping" />
        <div className="absolute inset-2 rounded-full border-2 border-[var(--color-neon)] animate-pulse" />
        <div className="absolute inset-5 rounded-full bg-[var(--color-neon)]/30" />
      </div>
      <div className="mono text-xs uppercase tracking-widest text-white/50">{label}…</div>
    </div>
  );
}
