import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../hooks/useTheme";

interface Props {
  className?: string;
  label?: boolean;
}

export function ThemeToggle({ className = "", label = false }: Props) {
  const { theme, toggle } = useTheme();
  const isLight = theme === "light";
  return (
    <button
      onClick={toggle}
      className={`theme-toggle ${className}`}
      aria-label={isLight ? "Switch to dark mode" : "Switch to light mode"}
      title={isLight ? "Switch to dark mode" : "Switch to light mode"}
    >
      {isLight ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
      {label && <span className="ml-2 text-xs mono uppercase tracking-widest">{isLight ? "dark" : "light"}</span>}
    </button>
  );
}
