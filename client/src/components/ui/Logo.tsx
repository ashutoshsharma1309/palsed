// PrepNext brand mark. Inline SVG (not <img src=>) so it picks up currentColor —
// the parent's text color drives the stroke. Lets us use the same mark in
// neon, black, white, or invert-on-hover without shipping multiple SVG files.
//
// Composition: a code-bracket `[` enclosing a forward chevron `>`. Reads as
// "[›" — engineering syntax + forward motion. See DESIGN.md for the rationale.

interface LogoMarkProps {
  className?: string;
  size?: number;
  title?: string;
}

export function LogoMark({ className, size = 24, title = "PrepNext" }: LogoMarkProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={className}
      fill="none"
      role="img"
      aria-label={title}
    >
      <path d="M11 12 H24 M11 12 V52 M11 52 H24" stroke="currentColor" strokeWidth="6" strokeLinecap="square" />
      <path d="M31 20 L47 32 L31 44" stroke="currentColor" strokeWidth="6" strokeLinecap="square" strokeLinejoin="miter" strokeMiterlimit={4} />
    </svg>
  );
}

interface LogoLockupProps {
  className?: string;
  /** "horizontal" places mark left of wordmark; "stacked" puts wordmark below. */
  variant?: "horizontal" | "stacked";
  /** Wordmark size class — controls font-size of "PREPNEXT". */
  wordmarkClass?: string;
  /** Mark pixel size. */
  markSize?: number;
}

export function LogoLockup({
  className = "",
  variant = "horizontal",
  wordmarkClass = "display text-2xl tracking-tight",
  markSize = 26,
}: LogoLockupProps) {
  if (variant === "stacked") {
    return (
      <span className={`inline-flex flex-col items-center gap-2 ${className}`}>
        <LogoMark size={markSize} className="text-[var(--color-neon)]" />
        <span className={wordmarkClass}>PREPNEXT</span>
      </span>
    );
  }
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark size={markSize} className="text-[var(--color-neon)]" />
      <span className={wordmarkClass}>PREPNEXT</span>
    </span>
  );
}
