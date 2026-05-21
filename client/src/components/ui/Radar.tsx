interface Point {
  label: string;
  value: number; // 0..1
}

interface Props {
  points: Point[];
  size?: number;
  color?: string;
}

export function Radar({ points, size = 360, color = "#c8ff3d" }: Props) {
  const n = points.length;
  if (n < 3) return <div className="text-white/40 text-sm">Need at least 3 topics for a radar.</div>;
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 40;

  const angle = (i: number) => (-Math.PI / 2) + (i * 2 * Math.PI) / n;
  const point = (i: number, v: number) => {
    const a = angle(i);
    return [cx + r * v * Math.cos(a), cy + r * v * Math.sin(a)] as const;
  };

  const rings = [0.25, 0.5, 0.75, 1];
  const polygon = points
    .map((p, i) => {
      const [x, y] = point(i, Math.max(0.03, Math.min(1, p.value)));
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg width={size} height={size} className="block max-w-full">
      {rings.map((rv, idx) => (
        <polygon
          key={idx}
          points={points
            .map((_, i) => {
              const [x, y] = point(i, rv);
              return `${x},${y}`;
            })
            .join(" ")}
          fill="none"
          stroke="#222"
          strokeWidth={1}
        />
      ))}
      {points.map((_, i) => {
        const [x, y] = point(i, 1);
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="#222" strokeWidth={1} />;
      })}
      <polygon points={polygon} fill={color} fillOpacity={0.15} stroke={color} strokeWidth={2} />
      {points.map((p, i) => {
        const [x, y] = point(i, 1.12);
        return (
          <text
            key={i}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={10}
            fill="#a0a0a0"
            fontFamily="Share Tech Mono, monospace"
          >
            {p.label}
          </text>
        );
      })}
    </svg>
  );
}
