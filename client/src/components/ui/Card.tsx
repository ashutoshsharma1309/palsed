import React from "react";

export function Card({
  className = "",
  children,
  tint,
  ...rest
}: React.HTMLAttributes<HTMLDivElement> & {
  tint?: "mint" | "peach" | "yellow" | "blue" | "purple" | "neon";
}) {
  const tintMap: Record<string, string> = {
    mint: "bg-[var(--color-mint)] text-black",
    peach: "bg-[var(--color-peach)] text-black",
    yellow: "bg-[var(--color-yellow)] text-black",
    blue: "bg-[var(--color-blue)] text-black",
    purple: "bg-[var(--color-purple)] text-black",
    neon: "bg-[var(--color-neon)] text-black",
  };
  const cls = tint
    ? `${tintMap[tint]} rounded-3xl p-6 border border-black/10`
    : `card-base p-6`;
  return (
    <div className={`${cls} ${className}`} {...rest}>
      {children}
    </div>
  );
}
