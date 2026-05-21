export interface ResourceLink {
  title: string;
  url: string;
  category: string;
  type: ResourceType;
  difficulty: ResourceDifficulty;
}

export type ResourceType = "Questions" | "Tutorial" | "Practice" | "Guide" | "Collection" | "Book" | "Course" | "Tool";
export type ResourceDifficulty = "Beginner" | "Intermediate" | "Advanced" | "All Levels";

const TYPE_RULES: Array<[RegExp, ResourceType]> = [
  [/interview|questions|q&a|q-and-a/i, "Questions"],
  [/practice|labs|exercises|problems|leetcode|hackerrank|pramp/i, "Practice"],
  [/awesome|primer|catalog|encyclopedia|collection|repos?|cheat/i, "Collection"],
  [/book|chapter/i, "Book"],
  [/course|mooc|nptel|cs\d{3}|6\.s\d{3}|15-\d{3}/i, "Course"],
  [/excalidraw|drawio|draw\.io|mermaid|tldraw|eraser|tool/i, "Tool"],
  [/tutorial|guide|primer|how to|walk-through|notes/i, "Tutorial"],
];

const DIFFICULTY_RULES: Array<[RegExp, ResourceDifficulty]> = [
  [/advanced|deep|expert|hard|low\s?level\s?design|distributed/i, "Advanced"],
  [/intermediate|grokking|patterns|design/i, "Intermediate"],
  [/beginner|intro|primer|basics|bootcamp|getting\s?started/i, "Beginner"],
];

function tagType(title: string, category: string): ResourceType {
  const t = `${title} ${category}`.toLowerCase();
  for (const [re, type] of TYPE_RULES) if (re.test(t)) return type;
  return "Guide";
}
function tagDifficulty(title: string, category: string): ResourceDifficulty {
  const t = `${title} ${category}`.toLowerCase();
  for (const [re, d] of DIFFICULTY_RULES) if (re.test(t)) return d;
  return "All Levels";
}

export function parseResourceMarkdown(md: string): { categories: string[]; links: ResourceLink[] } {
  const lines = md.split(/\r?\n/);
  let category = "General";
  const links: ResourceLink[] = [];
  const cats = new Set<string>();
  const linkRe = /^[\-\*]\s*\[([^\]]+)\]\(([^)]+)\)/;
  for (const raw of lines) {
    const line = raw.trim();
    if (line.startsWith("### ")) {
      category = line.replace(/^###\s+/, "").trim();
      cats.add(category);
      continue;
    }
    if (line.startsWith("## ")) {
      category = line.replace(/^##\s+/, "").trim();
      cats.add(category);
      continue;
    }
    const m = line.match(linkRe);
    if (m) {
      const title = m[1].trim();
      const url = m[2].trim();
      links.push({
        title,
        url,
        category,
        type: tagType(title, category),
        difficulty: tagDifficulty(title, category),
      });
    }
  }
  return { categories: Array.from(cats), links };
}
