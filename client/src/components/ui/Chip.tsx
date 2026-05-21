import React from "react";

interface Props extends React.HTMLAttributes<HTMLSpanElement> {
  active?: boolean;
  tone?: "default" | "neon" | "warn" | "success";
}

export function Chip({ active, tone = "default", className = "", children, ...rest }: Props) {
  const tones: Record<string, string> = {
    default: active
      ? "bg-white text-black border-white"
      : "bg-transparent text-white/80 border-white/15 hover:border-white/40",
    neon: active
      ? "bg-[var(--color-neon)] text-black border-[var(--color-neon)]"
      : "bg-transparent text-[var(--color-neon)] border-[var(--color-neon)]/40 hover:border-[var(--color-neon)]",
    warn: "bg-[#ffe87a] text-black border-[#ffe87a]",
    success: "bg-[var(--color-mint)] text-black border-[var(--color-mint)]",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full border cursor-pointer transition-all ${tones[tone]} ${className}`}
      {...rest}
    >
      {children}
    </span>
  );
}
