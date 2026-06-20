import React from "react";

interface Props extends React.HTMLAttributes<HTMLSpanElement> {
  active?: boolean;
  tone?: "default" | "neon" | "warn" | "success";
}

export function Chip({ active, tone = "default", className = "", children, ...rest }: Props) {
  // Theme-aware tones using CSS vars.
  // - active "default" → uses the inverted text/bg pair: looks like the brand
  //   text color filled with the brand bg color. In dark mode = white pill,
  //   black ink. In light mode = black pill, white ink.
  // - inactive → semi-bordered with dim text, hover crisps the border.
  const tones: Record<string, string> = {
    default: active
      ? "bg-[var(--color-text)] text-[var(--color-bg)] border-[var(--color-text)]"
      : "bg-transparent text-[var(--color-text-dim)] border-[var(--color-line)] hover:border-[var(--color-text-faint)] hover:text-[var(--color-text)]",
    neon: active
      ? "bg-[var(--color-neon)] text-black border-[var(--color-neon)]"
      : "bg-transparent text-[var(--color-neon)] border-[var(--color-neon)]/40 hover:border-[var(--color-neon)]",
    warn:
      "border-transparent " +
      "bg-[var(--severity-warn-bg)] text-[var(--severity-warn-text)] border-[var(--severity-warn-border)]",
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
