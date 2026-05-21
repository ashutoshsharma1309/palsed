interface Props {
  value: number; // 0..1
  height?: number;
  color?: string;
  label?: string;
}

export function ProgressBar({ value, height = 8, color = "#c8ff3d", label }: Props) {
  const pct = Math.max(0, Math.min(1, value));
  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between text-[11px] uppercase tracking-wider text-white/50 mb-1">
          <span>{label}</span>
          <span className="mono">{Math.round(pct * 100)}%</span>
        </div>
      )}
      <div
        className="relative w-full rounded-full overflow-hidden bg-[#1a1a1a]"
        style={{ height }}
      >
        <div
          className="h-full transition-all duration-500"
          style={{ width: `${pct * 100}%`, background: color, boxShadow: `0 0 12px ${color}` }}
        />
      </div>
    </div>
  );
}
