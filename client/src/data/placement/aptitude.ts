import type { HubSection } from "./types";

// Section 8 — Aptitude Preparation
export const aptitude: HubSection = {
  id: "aptitude",
  title: "Aptitude Preparation",
  blurb: "Quant, logical reasoning, and verbal — with practice sets and PYQs.",
  icon: "Calculator",
  accent: "#ffe87a",
  topics: [
    {
      id: "apt-quant",
      title: "Quantitative Aptitude",
      difficulty: "Beginner",
      resources: [
        { title: "Quant Topics (IndiaBix)", type: "notes", url: "https://www.indiabix.com/aptitude/questions-and-answers/" },
        { title: "Quant Practice Sets", type: "practice", url: "https://www.geeksforgeeks.org/quantitative-aptitude/", difficulty: "Beginner" },
        { title: "PYQs — PrepInsta", type: "practice", url: "https://prepinsta.com/quantitative-aptitude/", difficulty: "Intermediate" },
      ],
    },
    {
      id: "apt-logical",
      title: "Logical Reasoning",
      difficulty: "Beginner",
      resources: [
        { title: "Logical Reasoning (IndiaBix)", type: "notes", url: "https://www.indiabix.com/logical-reasoning/questions-and-answers/" },
        { title: "Reasoning Practice (GfG)", type: "practice", url: "https://www.geeksforgeeks.org/logical-reasoning/", difficulty: "Beginner" },
      ],
    },
    {
      id: "apt-verbal",
      title: "Verbal Ability",
      difficulty: "Beginner",
      resources: [
        { title: "Verbal Ability (IndiaBix)", type: "notes", url: "https://www.indiabix.com/verbal-ability/questions-and-answers/" },
        { title: "Verbal Practice (PrepInsta)", type: "practice", url: "https://prepinsta.com/verbal-ability/", difficulty: "Beginner" },
      ],
    },
  ],
};
