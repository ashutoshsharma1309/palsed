export function Footer() {
  return (
    <footer className="border-t border-white/10 py-10 mt-20 relative z-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="display text-2xl neon-text">PREPNXT</div>
          <div className="text-xs text-white/40 mt-1 mono">
            adaptive · ai-driven · cloud-synced
          </div>
        </div>
        <div className="text-xs text-white/40 mono md:text-right">
          <div>© {new Date().getFullYear()} PrepNxt. All rights reserved.</div>
          <div className="mt-2 text-white/60">
            Made by Ashutosh Sharma ·{" "}
            <a
              href="https://www.linkedin.com/in/ashutoshsharma1309"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-neon)] hover:underline"
            >
              linkedin.com/in/ashutoshsharma1309
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
