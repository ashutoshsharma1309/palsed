import type { HubSection } from "./types";

// Section 10 — Interview Preparation
export const interview: HubSection = {
  id: "interview",
  title: "Interview Preparation",
  blurb: "HR, technical, behavioral, and mock interviews — question banks and strategies.",
  icon: "MessagesSquare",
  accent: "#d6c1ff",
  topics: [
    {
      id: "int-hr",
      title: "HR Interview",
      difficulty: "Beginner",
      resources: [
        { title: "HR Interview Questions (IndiaBix)", type: "notes", url: "https://www.indiabix.com/hr-interview/questions-and-answers/" },
        { title: "Top HR Questions (GfG)", type: "notes", url: "https://www.geeksforgeeks.org/hr-interview-questions/" },
      ],
    },
    {
      id: "int-technical",
      title: "Technical Interview",
      difficulty: "Intermediate",
      resources: [
        { title: "Tech Interview Handbook", type: "roadmap", url: "https://www.techinterviewhandbook.org/" },
        { title: "Coding Interview University (GitHub)", type: "repo", url: "https://github.com/jwasham/coding-interview-university" },
        { title: "InterviewBit", type: "practice", url: "https://www.interviewbit.com/", difficulty: "Intermediate" },
      ],
    },
    {
      id: "int-behavioral",
      title: "Behavioral Questions",
      difficulty: "Beginner",
      resources: [
        { title: "Behavioral Guide (Tech Interview Handbook)", type: "notes", url: "https://www.techinterviewhandbook.org/behavioral-interview/" },
        { title: "STAR Method", type: "notes", url: "https://www.themuse.com/advice/star-interview-method" },
      ],
    },
    {
      id: "int-mock",
      title: "Mock Interviews",
      difficulty: "Intermediate",
      resources: [
        { title: "Pramp (Free Mock Interviews)", type: "practice", url: "https://www.pramp.com/", difficulty: "Intermediate" },
        { title: "interviewing.io", type: "practice", url: "https://interviewing.io/", difficulty: "Advanced" },
      ],
    },
  ],
};
