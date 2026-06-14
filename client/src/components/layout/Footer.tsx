export function Footer() {
  return (
    <footer className="border-t border-white/10 py-10 mt-20 relative z-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="display text-2xl neon-text">PREPNEXT</div>
          <div className="text-xs text-white/40 mt-1 mono">
            adaptive · ai-driven · localstorage-only · free forever
          </div>
        </div>
        <div className="text-xs text-white/40 mono">
          built for the pals hackathon — challenge 3 / education · ai
        </div>
      </div>
    </footer>
  );
}
