import type { HubSection } from "./types";

// Section 4 — Web Development (Frontend / Backend / Full Stack)
export const webdev: HubSection = {
  id: "webdev",
  title: "Web Development",
  blurb: "Visual roadmaps for Frontend, Backend, and Full Stack — with the core stack covered.",
  icon: "Globe",
  accent: "#b9f5c8",
  topics: [
    {
      id: "web-frontend-roadmap",
      title: "Frontend Roadmap",
      difficulty: "Beginner",
      blurb: "HTML → CSS → JavaScript → TypeScript → React → Next.js",
      resources: [
        { title: "Frontend Roadmap (roadmap.sh)", type: "roadmap", url: "https://roadmap.sh/frontend" },
        { title: "Full Stack Open", type: "notes", url: "https://fullstackopen.com/en/" },
        { title: "Frontend Practice Projects", type: "practice", url: "https://www.frontendmentor.io/", difficulty: "Beginner" },
      ],
    },
    {
      id: "web-backend-roadmap",
      title: "Backend Roadmap",
      difficulty: "Intermediate",
      blurb: "Node.js → Express → REST APIs → Authentication → Databases",
      resources: [
        { title: "Backend Roadmap (roadmap.sh)", type: "roadmap", url: "https://roadmap.sh/backend" },
        { title: "Node.js Best Practices (GitHub)", type: "repo", url: "https://github.com/goldbergyoni/nodebestpractices" },
        { title: "REST API Tutorial", type: "notes", url: "https://restfulapi.net/" },
      ],
    },
    {
      id: "web-fullstack-roadmap",
      title: "Full Stack Roadmap",
      difficulty: "Advanced",
      blurb: "Combine frontend + backend into shippable products.",
      resources: [
        { title: "Full Stack Roadmap (roadmap.sh)", type: "roadmap", url: "https://roadmap.sh/full-stack" },
        { title: "The Odin Project", type: "notes", url: "https://www.theodinproject.com/" },
        { title: "App Ideas Collection (GitHub)", type: "repo", url: "https://github.com/florinpop17/app-ideas" },
      ],
    },
    {
      id: "web-react",
      title: "React",
      difficulty: "Intermediate",
      resources: [
        { title: "React Roadmap (roadmap.sh)", type: "roadmap", url: "https://roadmap.sh/react" },
        { title: "React Official Docs", type: "notes", url: "https://react.dev/learn" },
        { title: "React Interview Questions (GitHub)", type: "repo", url: "https://github.com/sudheerj/reactjs-interview-questions" },
      ],
    },
    {
      id: "web-nextjs",
      title: "Next.js",
      difficulty: "Advanced",
      resources: [
        { title: "Next.js Learn", type: "notes", url: "https://nextjs.org/learn" },
        { title: "Next.js Docs", type: "notes", url: "https://nextjs.org/docs" },
      ],
    },
    {
      id: "web-node-express",
      title: "Node.js & Express",
      difficulty: "Intermediate",
      resources: [
        { title: "Node.js Roadmap (roadmap.sh)", type: "roadmap", url: "https://roadmap.sh/nodejs" },
        { title: "Express Docs", type: "notes", url: "https://expressjs.com/" },
        { title: "Node Interview Questions (GitHub)", type: "repo", url: "https://github.com/learning-zone/nodejs-interview-questions" },
      ],
    },
    {
      id: "web-typescript",
      title: "TypeScript",
      difficulty: "Intermediate",
      resources: [
        { title: "TypeScript Roadmap (roadmap.sh)", type: "roadmap", url: "https://roadmap.sh/typescript" },
        { title: "TypeScript Handbook", type: "notes", url: "https://www.typescriptlang.org/docs/handbook/intro.html" },
      ],
    },
  ],
};
