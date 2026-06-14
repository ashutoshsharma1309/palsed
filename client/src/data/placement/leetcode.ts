import type { HubSection } from "./types";

// Section 3 — LeetCode Preparation (categorized tracks)
export const leetcode: HubSection = {
  id: "leetcode",
  title: "LeetCode Preparation",
  blurb: "Categorized roadmaps with recommended problem counts and completion tracking.",
  icon: "ListChecks",
  accent: "#ffe87a",
  topics: [
    {
      id: "lc-beginner",
      title: "Beginner Track",
      difficulty: "Easy",
      recommended: 75,
      blurb: "Foundational patterns. Aim for Blind 75 / Grind 75 fundamentals.",
      resources: [
        { title: "Grind 75", type: "roadmap", url: "https://www.techinterviewhandbook.org/grind75" },
        { title: "Blind 75 (NeetCode)", type: "practice", url: "https://neetcode.io/practice", difficulty: "Easy" },
        { title: "LeetCode Top Interview 150", type: "practice", url: "https://leetcode.com/studyplan/top-interview-150/", difficulty: "Easy" },
      ],
    },
    {
      id: "lc-intermediate",
      title: "Intermediate Track",
      difficulty: "Medium",
      recommended: 150,
      blurb: "Pattern mastery across all core categories.",
      resources: [
        { title: "NeetCode 150", type: "roadmap", url: "https://neetcode.io/practice" },
        { title: "LeetCode Patterns", type: "notes", url: "https://seanprashad.com/leetcode-patterns/" },
        { title: "Striver SDE Sheet", type: "practice", url: "https://takeuforward.org/interviews/strivers-sde-sheet-top-coding-interview-problems/", difficulty: "Medium" },
      ],
    },
    {
      id: "lc-advanced",
      title: "Advanced Track",
      difficulty: "Hard",
      recommended: 250,
      blurb: "Hard problems, advanced graphs, DP-on-trees, and contest prep.",
      resources: [
        { title: "NeetCode 250", type: "roadmap", url: "https://neetcode.io/practice" },
        { title: "LeetCode Hard Collection", type: "practice", url: "https://leetcode.com/problem-list/hard/", difficulty: "Hard" },
        { title: "Codeforces (Contests)", type: "practice", url: "https://codeforces.com/", difficulty: "Hard" },
      ],
    },
  ],
};
