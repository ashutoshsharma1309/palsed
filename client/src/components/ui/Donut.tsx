interface Segment {
  label: string;
  value: number;
  color: string;
}

interface Props {
  segments: Segment[];
  centerLabel?: string;
  centerValue?: string | number;
  size?: number;
  thickness?: number;
  showLegend?: boolean;
}

export function Donut({
  segments,
  centerLabel,
  centerValue,
  size = 180,
  thickness = 22,
  showLegend = true,
}: Props) {
  const total = segments.reduce((a, s) => a + s.value, 0) || 1;
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;

  let offset = 0;
  const arcs = segments.map((s) => {
    const len = (s.value / total) * circumference;
    const dasharray = `${len} ${circumference - len}`;
    const dashoffset = -offset;
    offset += len;
    return { ...s, dasharray, dashoffset };
  });

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#222"
            strokeWidth={thickness}
          />
          {arcs.map((a, i) => (
            <circle
              key={i}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={a.color}
              strokeWidth={thickness}
              strokeDasharray={a.dasharray}
              strokeDashoffset={a.dashoffset}
              strokeLinecap="butt"
            />
          ))}
        </svg>
        {(centerValue || centerLabel) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            {centerValue !== undefined && (
              <div className="text-3xl font-extrabold neon-text mono">{centerValue}</div>
            )}
            {centerLabel && (
              <div className="text-[10px] uppercase tracking-widest text-[var(--color-text-faint)] mt-1">
                {centerLabel}
              </div>
            )}
          </div>
        )}
      </div>
      {showLegend && (
        <ul className="flex flex-wrap gap-x-4 gap-y-1 justify-center text-xs">
          {segments.map((s, i) => (
            <li key={i} className="flex items-center gap-2 text-[var(--color-text-dim)]">
              <span
                className="inline-block w-3 h-3 rounded-sm"
                style={{ background: s.color }}
              />
              <span>{s.label}</span>
              <span className="text-[var(--color-text-faint)] mono">{s.value}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
