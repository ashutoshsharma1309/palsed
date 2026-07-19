// PrepNext brand mark — "Hard P" (Option D). Inline SVG (not <img src=>) so
// it picks up currentColor — the parent's text color drives the fill. Lets us
// use the same mark in neon, black, white, or invert-on-hover without shipping
// multiple SVG files.
//
// Composition: a geometric capital P with 45° chamfered corners on the bowl.
// Reads instantly as the letter P (the brand starts with P) with a subtle
// "engineered/machined" angular character that distinguishes it from a generic
// P logo. See DESIGN.md for the rationale.

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
      role="img"
      aria-label={title}
    >
      {/* "Hard P" — chamfered geometric capital P (Option D). Single path with
          evenodd fill rule so the bowl reads as cleanly cut negative space. */}
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M16 12 L40 12 L48 20 L48 28 L40 36 L26 36 L26 52 L16 52 Z M26 20 L26 28 L36 28 L40 24 L36 20 Z"
      />
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

/**
 * The mark rendered as a filled neon "chip" with a dark P — the same treatment
 * used in the PrepNext social/brand assets. Unlike a bare neon-colored glyph
 * (which becomes a pale, low-contrast lime in light mode), this stays clearly
 * visible in BOTH themes: the neon fill reads on dark and light page
 * backgrounds, and the near-black P always has strong contrast against the neon.
 * A hairline ring + soft shadow give it definition on light surfaces.
 */
function LogoBadge({ size }: { size: number }) {
  const pad = Math.round(size * 0.3);
  const box = size + pad * 2;
  return (
    <span
      className="inline-grid place-items-center rounded-[26%] bg-[var(--color-neon)] shadow-sm ring-1 ring-black/15"
      style={{ width: box, height: box }}
      aria-hidden="true"
    >
      {/* Fixed near-black P — the neon chip is bright in both themes, so a dark
          glyph keeps maximum contrast regardless of the active theme. */}
      <LogoMark size={size} className="text-[#0a0a0a]" />
    </span>
  );
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
        <LogoBadge size={markSize} />
        <span className={wordmarkClass}>PREPNEXT</span>
      </span>
    );
  }
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoBadge size={markSize} />
      <span className={wordmarkClass}>PREPNEXT</span>
    </span>
  );
}
