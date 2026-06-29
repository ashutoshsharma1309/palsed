import {
  Globe,
  Server,
  BrainCircuit,
  ShieldCheck,
  Cloud,
  Infinity as InfinityIcon,
  Smartphone,
  Boxes,
  BarChart3,
  GitFork,
  FolderGit2,
  type LucideIcon,
} from "lucide-react";

// Maps the `icon` string stored on each ProjectDomain to a lucide component.
// Keeping it explicit (vs. dynamic import) keeps the bundle tree-shakeable.
const ICONS: Record<string, LucideIcon> = {
  Globe,
  Server,
  BrainCircuit,
  ShieldCheck,
  Cloud,
  Infinity: InfinityIcon,
  Smartphone,
  Boxes,
  BarChart3,
  GitFork,
};

export function DomainIcon({ name, className }: { name: string; className?: string }) {
  const Icon = ICONS[name] ?? FolderGit2;
  return <Icon className={className} />;
}
