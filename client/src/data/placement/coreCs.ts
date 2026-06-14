import type { HubSection } from "./types";

// Section 9 — Core Computer Science
export const coreCs: HubSection = {
  id: "core-cs",
  title: "Core Computer Science",
  blurb: "DBMS, OS, Networks, OOP, and System Design — notes, revision, and interview Qs.",
  icon: "Cpu",
  accent: "#b9f5c8",
  topics: [
    {
      id: "cs-dbms",
      title: "DBMS",
      difficulty: "Intermediate",
      resources: [
        { title: "DBMS — GeeksforGeeks", type: "notes", url: "https://www.geeksforgeeks.org/dbms/" },
        { title: "DBMS Revision Notes (GitHub)", type: "repo", url: "https://github.com/Devinterview-io/dbms-interview-questions" },
        { title: "SQL Practice — LeetCode", type: "practice", url: "https://leetcode.com/studyplan/top-sql-50/", difficulty: "Medium" },
      ],
    },
    {
      id: "cs-os",
      title: "Operating Systems",
      difficulty: "Intermediate",
      resources: [
        { title: "OS — GeeksforGeeks", type: "notes", url: "https://www.geeksforgeeks.org/operating-systems/" },
        { title: "OSTEP (Free Book)", type: "notes", url: "https://pages.cs.wisc.edu/~remzi/OSTEP/" },
        { title: "OS Interview Questions", type: "practice", url: "https://www.interviewbit.com/operating-system-interview-questions/" },
      ],
    },
    {
      id: "cs-cn",
      title: "Computer Networks",
      difficulty: "Intermediate",
      resources: [
        { title: "Computer Networks — GfG", type: "notes", url: "https://www.geeksforgeeks.org/computer-network-tutorials/" },
        { title: "CN Interview Questions", type: "practice", url: "https://www.interviewbit.com/computer-network-interview-questions/" },
      ],
    },
    {
      id: "cs-oop",
      title: "OOP",
      difficulty: "Beginner",
      resources: [
        { title: "OOP Concepts — GfG", type: "notes", url: "https://www.geeksforgeeks.org/object-oriented-programming-oops-concept-in-java/" },
        { title: "OOP Interview Questions", type: "practice", url: "https://www.interviewbit.com/oops-interview-questions/" },
      ],
    },
    {
      id: "cs-system-design",
      title: "System Design",
      difficulty: "Advanced",
      resources: [
        { title: "System Design Primer (GitHub)", type: "repo", url: "https://github.com/donnemartin/system-design-primer" },
        { title: "System Design Roadmap (roadmap.sh)", type: "roadmap", url: "https://roadmap.sh/system-design" },
        { title: "Grokking System Design", type: "notes", url: "https://www.educative.io/courses/grokking-the-system-design-interview" },
      ],
    },
  ],
};
