import type { HubSection } from "./types";

// Section 1 — Programming Languages
export const languages: HubSection = {
  id: "languages",
  title: "Programming Languages",
  blurb: "Master a language end-to-end: roadmap, notes, cheat sheets, and interview prep.",
  icon: "Code2",
  accent: "#c8ff3d",
  topics: [
    {
      id: "lang-c",
      title: "C",
      difficulty: "Beginner",
      resources: [
        { title: "C Roadmap (GeeksforGeeks)", type: "roadmap", url: "https://www.geeksforgeeks.org/c-programming-language/" },
        { title: "C Notes — Programiz", type: "notes", url: "https://www.programiz.com/c-programming" },
        { title: "C Cheat Sheet", type: "notes", url: "https://quickref.me/c.html", tags: ["cheatsheet"] },
        { title: "Awesome C (GitHub)", type: "repo", url: "https://github.com/oz123/awesome-c" },
        { title: "C Coding Questions", type: "practice", url: "https://www.hackerrank.com/domains/c", difficulty: "Easy" },
        { title: "C Interview Questions", type: "practice", url: "https://www.interviewbit.com/c-interview-questions/" },
      ],
    },
    {
      id: "lang-cpp",
      title: "C++",
      difficulty: "Intermediate",
      resources: [
        { title: "C++ Roadmap (roadmap.sh)", type: "roadmap", url: "https://roadmap.sh/cpp" },
        { title: "LearnCpp.com Notes", type: "notes", url: "https://www.learncpp.com/" },
        { title: "C++ Cheat Sheet", type: "notes", url: "https://hackingcpp.com/cpp/cheat_sheets.html", tags: ["cheatsheet"] },
        { title: "Awesome C++ (GitHub)", type: "repo", url: "https://github.com/fffaraz/awesome-cpp" },
        { title: "C++ STL for CP", type: "video", url: "https://www.youtube.com/watch?v=zBhVZzi5RdU" },
        { title: "C++ Interview Questions", type: "practice", url: "https://www.interviewbit.com/cpp-interview-questions/" },
      ],
    },
    {
      id: "lang-python",
      title: "Python",
      difficulty: "Beginner",
      resources: [
        { title: "Python Roadmap (roadmap.sh)", type: "roadmap", url: "https://roadmap.sh/python" },
        { title: "Official Python Docs", type: "notes", url: "https://docs.python.org/3/tutorial/" },
        { title: "Python Cheat Sheet", type: "notes", url: "https://www.pythoncheatsheet.org/", tags: ["cheatsheet"] },
        { title: "Awesome Python (GitHub)", type: "repo", url: "https://github.com/vinta/awesome-python" },
        { title: "Python Practice — HackerRank", type: "practice", url: "https://www.hackerrank.com/domains/python", difficulty: "Easy" },
        { title: "Python Interview Questions", type: "practice", url: "https://www.interviewbit.com/python-interview-questions/" },
      ],
    },
    {
      id: "lang-java",
      title: "Java",
      difficulty: "Intermediate",
      resources: [
        { title: "Java Roadmap (roadmap.sh)", type: "roadmap", url: "https://roadmap.sh/java" },
        { title: "Java Notes — Jenkov", type: "notes", url: "https://jenkov.com/tutorials/java/index.html" },
        { title: "Java Cheat Sheet", type: "notes", url: "https://quickref.me/java.html", tags: ["cheatsheet"] },
        { title: "Awesome Java (GitHub)", type: "repo", url: "https://github.com/akullpp/awesome-java" },
        { title: "Java Coding Questions", type: "practice", url: "https://www.hackerrank.com/domains/java", difficulty: "Easy" },
        { title: "Java Interview Questions", type: "practice", url: "https://www.interviewbit.com/java-interview-questions/" },
      ],
    },
    {
      id: "lang-javascript",
      title: "JavaScript",
      difficulty: "Beginner",
      resources: [
        { title: "JavaScript Roadmap (roadmap.sh)", type: "roadmap", url: "https://roadmap.sh/javascript" },
        { title: "javascript.info", type: "notes", url: "https://javascript.info/" },
        { title: "JS Cheat Sheet", type: "notes", url: "https://quickref.me/javascript.html", tags: ["cheatsheet"] },
        { title: "30 Seconds of Code (GitHub)", type: "repo", url: "https://github.com/Chalarangelo/30-seconds-of-code" },
        { title: "JS Coding Questions (GitHub)", type: "repo", url: "https://github.com/lydiahallie/javascript-questions" },
        { title: "JS Interview Questions", type: "practice", url: "https://www.interviewbit.com/javascript-interview-questions/" },
      ],
    },
  ],
};
