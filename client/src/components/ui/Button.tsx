import React from "react";

type Variant = "primary" | "ghost" | "outline" | "danger";
type Size = "sm" | "md" | "lg";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
}

export function Button({
  variant = "primary",
  size = "md",
  fullWidth,
  className = "",
  children,
  ...rest
}: Props) {
  const base =
    "inline-flex items-center justify-center gap-2 font-semibold rounded-full transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed select-none";
  const variants: Record<Variant, string> = {
    primary:
      "bg-[var(--color-neon)] text-black hover:translate-y-[-1px] hover:shadow-[0_0_28px_rgba(200,255,61,0.55)]",
    ghost:
      "bg-transparent text-white hover:bg-white/5 border border-transparent",
    outline:
      "bg-transparent text-[var(--color-neon)] border border-[var(--color-neon)]/60 hover:bg-[var(--color-neon)]/10",
    danger:
      "bg-[#ff5247] text-white hover:bg-[#ff3a2d]",
  };
  const sizes: Record<Size, string> = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-7 py-3.5 text-base",
  };
  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${fullWidth ? "w-full" : ""} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
