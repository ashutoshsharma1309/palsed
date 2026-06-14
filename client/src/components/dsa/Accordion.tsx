import { useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface Props {
  title: string;
  icon?: ReactNode;
  /** Open on first render. Per spec, default closed. */
  defaultOpen?: boolean;
  /** Small text shown on the right of the header (e.g. a count). */
  hint?: string;
  children: ReactNode;
}

export function AccordionItem({ title, icon, defaultOpen = false, hint, children }: Props) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-white/[0.03] transition-colors"
      >
        {icon && <span className="text-[var(--color-neon)] shrink-0">{icon}</span>}
        <span className="font-semibold text-white flex-1">{title}</span>
        {hint && <span className="mono text-[11px] text-white/40">{hint}</span>}
        <ChevronDown
          className={`w-4 h-4 text-white/50 shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            <div className="px-5 pb-5 pt-1">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
