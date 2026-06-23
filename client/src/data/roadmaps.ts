// ────────────────────────────────────────────────────────────────────────────
//  Career Roadmap data layer
//
//  Pure, typed, data-driven definitions for role-based learning roadmaps. The UI
//  (routes/Roadmap.tsx) renders entirely from this file, so adding a new role is
//  just appending to `ROLES` — no UI changes required.
//
//  Shared modules (DSA_CATEGORIES, CS_AREAS) are defined once and referenced by
//  roles via `requiresDSA` / `requiresCS`, so progress on a shared item (e.g.
//  "Two Sum") is tracked globally by its stable content id and counts across
//  every roadmap that includes it.
//
//  Future-proofing: the schema intentionally separates content (here) from
//  progress (useRoadmapProgress) and presentation (Roadmap.tsx). AI-generated
//  roadmaps can later produce the same `Role` shape and slot in unchanged.
// ────────────────────────────────────────────────────────────────────────────
import type { LucideIcon } from "lucide-react";
import {
  Layout, Server, Layers, Cloud, Shield, Database, Brain, Cpu,
  Smartphone, Code2, Boxes, Activity, Gamepad2, Bot,
} from "lucide-react";

// ── Shared enums ────────────────────────────────────────────────────────────
export type Difficulty = "Beginner" | "Intermediate" | "Advanced";
export type Importance = "Critical" | "High" | "Medium";
export type SkillLevel = "must" | "good" | "optional";
export type ProjectLevel = "Beginner" | "Intermediate" | "Advanced";

// 3-state progress, persisted by useRoadmapProgress.
export type ItemStatus = "not_started" | "in_progress" | "completed";

// ── Content types ───────────────────────────────────────────────────────────
export interface StageTopic {
  id: string; // stable global content id (shared topics count across roles)
  name: string;
}
export interface Stage {
  id: string;
  name: string;
  summary: string;
  topics: StageTopic[];
}
export interface Skill {
  id: string;
  name: string;
  level: SkillLevel;
  description: string;
  why: string;
  difficulty: Difficulty;
  estTime: string; // human-readable, e.g. "1–2 weeks"
}
export interface Course {
  title: string;
  provider: string;
  type: "Free" | "YouTube" | "Docs" | "Course" | "Open-source";
  duration: string;
  difficulty: Difficulty;
  why: string;
  url?: string;
}
export interface Project {
  id: string;
  title: string;
  level: ProjectLevel;
  description: string;
  skills: string[];
  tech: string[];
  duration: string;
  portfolioValue: "High" | "Medium";
}
export interface Role {
  id: string;
  title: string;
  short: string;
  icon: LucideIcon;
  blurb: string;
  requiresDSA: boolean;
  requiresCS: boolean;
  stages: Stage[];
  skills: Skill[];
  courses: Course[];
  projects: Project[];
}

// ── DSA module (shared, interview-focused — no competitive-programming) ───────
export interface DsaQuestion {
  id: string;
  title: string;
  difficulty: "Easy" | "Easy-Medium" | "Medium";
  importance: Importance;
}
export interface DsaCategory {
  id: string;
  name: string;
  concepts: string[];
  estMinutes: number; // rough completion estimate for the curated set
  questions: DsaQuestion[];
}

const q = (id: string, title: string, difficulty: DsaQuestion["difficulty"], importance: Importance): DsaQuestion =>
  ({ id, title, difficulty, importance });

export const DSA_CATEGORIES: DsaCategory[] = [
  {
    id: "arrays", name: "Arrays", estMinutes: 360,
    concepts: ["Two pointers", "Prefix sums", "Sliding window", "Kadane's algorithm"],
    questions: [
      q("arr-1", "Two Sum", "Easy", "Critical"),
      q("arr-2", "Best Time to Buy and Sell Stock", "Easy", "Critical"),
      q("arr-3", "Maximum Subarray (Kadane's)", "Easy-Medium", "Critical"),
      q("arr-4", "Move Zeroes", "Easy", "High"),
      q("arr-5", "Product of Array Except Self", "Medium", "High"),
      q("arr-6", "Merge Intervals", "Medium", "High"),
    ],
  },
  {
    id: "strings", name: "Strings", estMinutes: 300,
    concepts: ["Frequency maps", "Two pointers", "Sliding window", "Palindromes"],
    questions: [
      q("str-1", "Valid Anagram", "Easy", "Critical"),
      q("str-2", "Valid Palindrome", "Easy", "High"),
      q("str-3", "Longest Substring Without Repeating Characters", "Medium", "Critical"),
      q("str-4", "Group Anagrams", "Medium", "High"),
      q("str-5", "Longest Common Prefix", "Easy", "Medium"),
    ],
  },
  {
    id: "hashing", name: "Hashing", estMinutes: 240,
    concepts: ["Hash maps", "Hash sets", "Frequency counting", "Two-sum pattern"],
    questions: [
      q("hash-1", "Contains Duplicate", "Easy", "Critical"),
      q("hash-2", "Top K Frequent Elements", "Medium", "High"),
      q("hash-3", "Longest Consecutive Sequence", "Medium", "High"),
      q("hash-4", "Subarray Sum Equals K", "Medium", "High"),
      q("hash-5", "First Unique Character in a String", "Easy", "Medium"),
    ],
  },
  {
    id: "linked-list", name: "Linked List", estMinutes: 300,
    concepts: ["Fast & slow pointers", "Reversal", "Dummy nodes", "Cycle detection"],
    questions: [
      q("ll-1", "Reverse Linked List", "Easy", "Critical"),
      q("ll-2", "Merge Two Sorted Lists", "Easy", "Critical"),
      q("ll-3", "Linked List Cycle", "Easy", "High"),
      q("ll-4", "Remove Nth Node From End", "Medium", "High"),
      q("ll-5", "Middle of the Linked List", "Easy", "Medium"),
    ],
  },
  {
    id: "stack", name: "Stack", estMinutes: 240,
    concepts: ["LIFO", "Monotonic stack", "Expression parsing", "Bracket matching"],
    questions: [
      q("stk-1", "Valid Parentheses", "Easy", "Critical"),
      q("stk-2", "Min Stack", "Medium", "High"),
      q("stk-3", "Daily Temperatures", "Medium", "High"),
      q("stk-4", "Evaluate Reverse Polish Notation", "Medium", "Medium"),
    ],
  },
  {
    id: "queue", name: "Queue", estMinutes: 180,
    concepts: ["FIFO", "Deque", "Queue via stacks", "Sliding window maximum"],
    questions: [
      q("que-1", "Implement Queue using Stacks", "Easy", "High"),
      q("que-2", "Number of Recent Calls", "Easy", "Medium"),
      q("que-3", "Sliding Window Maximum", "Medium", "Medium"),
    ],
  },
  {
    id: "binary-search", name: "Binary Search", estMinutes: 240,
    concepts: ["Search space", "Lower/upper bound", "Search on answer", "Rotated arrays"],
    questions: [
      q("bs-1", "Binary Search", "Easy", "Critical"),
      q("bs-2", "Search in Rotated Sorted Array", "Medium", "Critical"),
      q("bs-3", "Find First and Last Position", "Medium", "High"),
      q("bs-4", "Koko Eating Bananas", "Medium", "Medium"),
    ],
  },
  {
    id: "trees", name: "Trees", estMinutes: 360,
    concepts: ["DFS / BFS", "Recursion", "Level order", "Height & depth"],
    questions: [
      q("tree-1", "Maximum Depth of Binary Tree", "Easy", "Critical"),
      q("tree-2", "Invert Binary Tree", "Easy", "High"),
      q("tree-3", "Binary Tree Level Order Traversal", "Medium", "Critical"),
      q("tree-4", "Diameter of Binary Tree", "Easy-Medium", "High"),
      q("tree-5", "Lowest Common Ancestor", "Medium", "High"),
    ],
  },
  {
    id: "bst", name: "Binary Search Tree", estMinutes: 240,
    concepts: ["BST property", "In-order traversal", "Validation", "Insert/search"],
    questions: [
      q("bst-1", "Validate Binary Search Tree", "Medium", "Critical"),
      q("bst-2", "Kth Smallest Element in a BST", "Medium", "High"),
      q("bst-3", "Convert Sorted Array to BST", "Easy", "Medium"),
      q("bst-4", "Lowest Common Ancestor of a BST", "Easy-Medium", "High"),
    ],
  },
  {
    id: "heap", name: "Heap / Priority Queue", estMinutes: 240,
    concepts: ["Min/max heap", "Top-K pattern", "Heapify", "k-way merge"],
    questions: [
      q("heap-1", "Kth Largest Element in an Array", "Medium", "Critical"),
      q("heap-2", "K Closest Points to Origin", "Medium", "High"),
      q("heap-3", "Last Stone Weight", "Easy", "Medium"),
      q("heap-4", "Merge K Sorted Lists", "Medium", "High"),
    ],
  },
  {
    id: "graph-basics", name: "Graph Basics", estMinutes: 360,
    concepts: ["Adjacency list", "BFS / DFS", "Connected components", "Topological sort"],
    questions: [
      q("graph-1", "Number of Islands", "Medium", "Critical"),
      q("graph-2", "Clone Graph", "Medium", "High"),
      q("graph-3", "Course Schedule (topo sort)", "Medium", "High"),
      q("graph-4", "Flood Fill", "Easy", "Medium"),
      q("graph-5", "Rotting Oranges", "Medium", "High"),
    ],
  },
  {
    id: "dp-basics", name: "Dynamic Programming Basics", estMinutes: 360,
    concepts: ["Memoization", "Tabulation", "1-D DP", "Subsequence patterns"],
    questions: [
      q("dp-1", "Climbing Stairs", "Easy", "Critical"),
      q("dp-2", "House Robber", "Medium", "Critical"),
      q("dp-3", "Coin Change", "Medium", "High"),
      q("dp-4", "Longest Increasing Subsequence", "Medium", "High"),
      q("dp-5", "Maximum Product Subarray", "Medium", "Medium"),
    ],
  },
];

export const TOTAL_DSA_QUESTIONS = DSA_CATEGORIES.reduce((n, c) => n + c.questions.length, 0);

// ── CS Fundamentals module (shared) ───────────────────────────────────────────
export interface CsTopic {
  id: string;
  name: string;
  importance: Importance;
  interviewRelevance: "Very High" | "High" | "Medium";
  resources: string[];
}
export interface CsArea {
  id: string;
  name: string;
  topics: CsTopic[];
}

const ct = (id: string, name: string, importance: Importance, rel: CsTopic["interviewRelevance"], resources: string[]): CsTopic =>
  ({ id, name, importance, interviewRelevance: rel, resources });

export const CS_AREAS: CsArea[] = [
  {
    id: "os", name: "Operating Systems",
    topics: [
      ct("os-proc", "Processes", "Critical", "Very High", ["OSTEP (free book)", "Gate Smashers — OS"]),
      ct("os-thread", "Threads & Concurrency", "Critical", "Very High", ["OSTEP — Concurrency"]),
      ct("os-sched", "CPU Scheduling", "High", "High", ["Gate Smashers — Scheduling"]),
      ct("os-mem", "Memory Management & Paging", "High", "High", ["OSTEP — Virtualization"]),
      ct("os-deadlock", "Deadlocks", "High", "High", ["Gate Smashers — Deadlocks"]),
    ],
  },
  {
    id: "dbms", name: "DBMS",
    topics: [
      ct("db-norm", "Normalization (1NF–BCNF)", "Critical", "Very High", ["Gate Smashers — DBMS"]),
      ct("db-index", "Indexing (B-Tree, Hash)", "High", "High", ["Use The Index, Luke"]),
      ct("db-txn", "Transactions", "Critical", "Very High", ["DBMS — Concurrency Control"]),
      ct("db-acid", "ACID Properties", "Critical", "Very High", ["Any standard DBMS text"]),
      ct("db-joins", "Joins & Query Basics", "High", "High", ["SQLBolt (free, interactive)"]),
    ],
  },
  {
    id: "cn", name: "Computer Networks",
    topics: [
      ct("cn-tcpip", "TCP/IP Model", "Critical", "Very High", ["Computer Networking: A Top-Down Approach"]),
      ct("cn-http", "HTTP", "Critical", "Very High", ["MDN — HTTP"]),
      ct("cn-https", "HTTPS & TLS", "High", "High", ["Cloudflare Learning — TLS"]),
      ct("cn-dns", "DNS", "High", "High", ["MDN — DNS"]),
      ct("cn-lb", "Load Balancing", "Medium", "Medium", ["System Design Primer"]),
    ],
  },
  {
    id: "oop", name: "OOP",
    topics: [
      ct("oop-enc", "Encapsulation", "High", "High", ["Refactoring Guru — OOP"]),
      ct("oop-inh", "Inheritance", "High", "High", ["Refactoring Guru — OOP"]),
      ct("oop-poly", "Polymorphism", "Critical", "Very High", ["Refactoring Guru — OOP"]),
      ct("oop-abs", "Abstraction", "High", "High", ["Refactoring Guru — OOP"]),
      ct("oop-solid", "SOLID Principles", "Critical", "Very High", ["Refactoring Guru — SOLID"]),
    ],
  },
];

// ── Reusable building blocks ─────────────────────────────────────────────────
const FOUNDATIONS: Stage = {
  id: "foundations",
  name: "Stage 1 · Foundations",
  summary: "The universal base every software role shares.",
  topics: [
    { id: "f-prog", name: "Programming Basics (a language well)" },
    { id: "f-ps", name: "Problem Solving" },
    { id: "f-git", name: "Git & GitHub" },
    { id: "f-linux", name: "Linux & Command Line Basics" },
  ],
};

// ── Roles ─────────────────────────────────────────────────────────────────────
// NOTE: roles below are fully fleshed for the most common paths; every listed
// role has valid, renderable data and shares the DSA + CS modules. Add more by
// appending a `Role` object — no UI change required.
export const ROLES: Role[] = [
  // ─── Backend Developer ───
  {
    id: "backend", title: "Backend Developer", short: "Backend", icon: Server,
    blurb: "Build the servers, APIs, and data layers that power applications.",
    requiresDSA: true, requiresCS: true,
    stages: [
      FOUNDATIONS,
      {
        id: "be-core", name: "Stage 2 · Core Skills",
        summary: "The day-to-day backend toolkit.",
        topics: [
          { id: "be-http", name: "HTTP & REST APIs" },
          { id: "be-db", name: "Databases & SQL" },
          { id: "be-authz", name: "Authentication & Authorization" },
          { id: "be-lang", name: "A backend runtime (Node.js / Java / Python)" },
          { id: "be-cache", name: "Caching" },
          { id: "be-apidesign", name: "API Design" },
        ],
      },
      {
        id: "be-inter", name: "Stage 3 · Intermediate",
        summary: "Ship reliable, deployable services.",
        topics: [
          { id: "be-sysd", name: "System Design Basics" },
          { id: "be-scale", name: "Scalability Concepts" },
          { id: "be-docker", name: "Docker" },
          { id: "be-cicd", name: "CI/CD" },
          { id: "be-cloud", name: "Cloud Fundamentals" },
        ],
      },
      {
        id: "be-adv", name: "Stage 4 · Advanced",
        summary: "Operate systems at scale in production.",
        topics: [
          { id: "be-dist", name: "Distributed Systems" },
          { id: "be-micro", name: "Microservices" },
          { id: "be-mq", name: "Message Queues" },
          { id: "be-perf", name: "Performance Optimization" },
          { id: "be-monitor", name: "Monitoring & Observability" },
          { id: "be-prod", name: "Production Deployments" },
        ],
      },
    ],
    skills: [
      { id: "sk-be-api", name: "REST API design", level: "must", description: "Design clean, versioned, resource-oriented APIs.", why: "Every backend role centers on it.", difficulty: "Beginner", estTime: "1–2 weeks" },
      { id: "sk-be-sql", name: "SQL & relational modeling", level: "must", description: "Schema design, joins, indexes, transactions.", why: "Data correctness and performance depend on it.", difficulty: "Intermediate", estTime: "2–3 weeks" },
      { id: "sk-be-auth", name: "Auth (sessions, JWT, OAuth)", level: "must", description: "Secure login, tokens, and access control.", why: "A non-negotiable, heavily-interviewed topic.", difficulty: "Intermediate", estTime: "1–2 weeks" },
      { id: "sk-be-docker", name: "Docker", level: "must", description: "Containerize and run services reproducibly.", why: "Standard for local dev and deployment.", difficulty: "Intermediate", estTime: "1 week" },
      { id: "sk-be-cache", name: "Caching (Redis)", level: "good", description: "Cache hot data and reduce DB load.", why: "Key scalability lever.", difficulty: "Intermediate", estTime: "1 week" },
      { id: "sk-be-mq", name: "Message queues (Kafka/RabbitMQ)", level: "good", description: "Async, decoupled processing.", why: "Common in scaled systems.", difficulty: "Advanced", estTime: "2 weeks" },
      { id: "sk-be-graphql", name: "GraphQL", level: "optional", description: "Flexible client-driven queries.", why: "Nice-to-have alternative to REST.", difficulty: "Intermediate", estTime: "1 week" },
    ],
    courses: [
      { title: "The Odin Project — Node.js", provider: "The Odin Project", type: "Free", duration: "40+ hrs", difficulty: "Beginner", why: "Free, project-based backend path." },
      { title: "MDN — HTTP", provider: "Mozilla", type: "Docs", duration: "Reference", difficulty: "Beginner", why: "Authoritative HTTP reference." },
      { title: "System Design Primer", provider: "donnemartin (GitHub)", type: "Open-source", duration: "Self-paced", difficulty: "Intermediate", why: "The standard free system-design resource." },
      { title: "SQLBolt", provider: "SQLBolt", type: "Free", duration: "3–4 hrs", difficulty: "Beginner", why: "Interactive SQL from scratch." },
    ],
    projects: [
      { id: "p-be-1", title: "URL Shortener API", level: "Beginner", description: "REST API that shortens and redirects URLs with click counts.", skills: ["REST", "DB", "Caching"], tech: ["Node.js", "Express", "PostgreSQL"], duration: "1 week", portfolioValue: "Medium" },
      { id: "p-be-2", title: "Auth + Notes service", level: "Beginner", description: "JWT auth with per-user CRUD notes.", skills: ["Auth", "REST", "SQL"], tech: ["Express", "JWT", "Prisma"], duration: "1 week", portfolioValue: "Medium" },
      { id: "p-be-3", title: "Rate-limited public API", level: "Intermediate", description: "API gateway with Redis rate limiting and API keys.", skills: ["Caching", "API Design"], tech: ["Node.js", "Redis"], duration: "1–2 weeks", portfolioValue: "High" },
      { id: "p-be-4", title: "Job queue worker", level: "Intermediate", description: "Background jobs (emails/thumbnails) via a queue.", skills: ["Message Queues"], tech: ["BullMQ", "Redis"], duration: "1–2 weeks", portfolioValue: "High" },
      { id: "p-be-5", title: "Mini e-commerce backend", level: "Advanced", description: "Catalog, cart, orders, payments, idempotency.", skills: ["System Design", "SQL", "Auth"], tech: ["Node.js", "PostgreSQL", "Stripe"], duration: "3–4 weeks", portfolioValue: "High" },
      { id: "p-be-6", title: "Microservices + message bus", level: "Advanced", description: "Split a monolith into services communicating over a broker.", skills: ["Microservices", "Message Queues"], tech: ["Docker", "Kafka"], duration: "4 weeks", portfolioValue: "High" },
    ],
  },

  // ─── Frontend Developer ───
  {
    id: "frontend", title: "Frontend Developer", short: "Frontend", icon: Layout,
    blurb: "Build fast, accessible, beautiful user interfaces.",
    requiresDSA: true, requiresCS: true,
    stages: [
      FOUNDATIONS,
      {
        id: "fe-core", name: "Stage 2 · Core Skills", summary: "The web platform + a framework.",
        topics: [
          { id: "fe-html", name: "HTML & Semantics" },
          { id: "fe-css", name: "CSS & Responsive Layout" },
          { id: "fe-js", name: "Modern JavaScript (ES6+)" },
          { id: "fe-react", name: "A framework (React)" },
          { id: "fe-state", name: "State Management" },
          { id: "fe-fetch", name: "Working with APIs (fetch, REST)" },
        ],
      },
      {
        id: "fe-inter", name: "Stage 3 · Intermediate", summary: "Quality, tooling, and TypeScript.",
        topics: [
          { id: "fe-ts", name: "TypeScript" },
          { id: "fe-build", name: "Build tools (Vite)" },
          { id: "fe-a11y", name: "Accessibility (a11y)" },
          { id: "fe-test", name: "Testing (Vitest / RTL)" },
          { id: "fe-perf-basics", name: "Web Performance Basics" },
        ],
      },
      {
        id: "fe-adv", name: "Stage 4 · Advanced", summary: "Scale and ship production frontends.",
        topics: [
          { id: "fe-ssr", name: "SSR / SSG (Next.js)" },
          { id: "fe-perf", name: "Performance Optimization (Core Web Vitals)" },
          { id: "fe-arch", name: "Component Architecture & Design Systems" },
          { id: "fe-pwa", name: "PWAs & Offline" },
          { id: "fe-deploy", name: "Production Deployments (CI/CD)" },
        ],
      },
    ],
    skills: [
      { id: "sk-fe-js", name: "JavaScript (deep)", level: "must", description: "Closures, async, the event loop, DOM.", why: "The foundation of all frontend work.", difficulty: "Intermediate", estTime: "3–4 weeks" },
      { id: "sk-fe-react", name: "React", level: "must", description: "Components, hooks, state, effects.", why: "The most in-demand UI framework.", difficulty: "Intermediate", estTime: "3–4 weeks" },
      { id: "sk-fe-css", name: "CSS & responsive design", level: "must", description: "Flexbox, grid, mobile-first layouts.", why: "UIs must work on every screen.", difficulty: "Beginner", estTime: "2 weeks" },
      { id: "sk-fe-ts", name: "TypeScript", level: "must", description: "Static types for safer UIs.", why: "Now the industry default.", difficulty: "Intermediate", estTime: "2 weeks" },
      { id: "sk-fe-a11y", name: "Accessibility", level: "good", description: "ARIA, keyboard nav, contrast.", why: "Increasingly required and tested.", difficulty: "Intermediate", estTime: "1 week" },
      { id: "sk-fe-next", name: "Next.js", level: "good", description: "SSR/SSG, routing, data fetching.", why: "Dominant React meta-framework.", difficulty: "Intermediate", estTime: "2 weeks" },
      { id: "sk-fe-anim", name: "Animation (Framer Motion)", level: "optional", description: "Polished motion and transitions.", why: "Differentiator for product roles.", difficulty: "Intermediate", estTime: "1 week" },
    ],
    courses: [
      { title: "The Odin Project — JavaScript", provider: "The Odin Project", type: "Free", duration: "50+ hrs", difficulty: "Beginner", why: "Best free, project-driven JS path." },
      { title: "react.dev (Learn)", provider: "React", type: "Docs", duration: "Self-paced", difficulty: "Beginner", why: "Official, modern React tutorial." },
      { title: "javascript.info", provider: "javascript.info", type: "Free", duration: "Reference", difficulty: "Intermediate", why: "Deep, free JS reference." },
      { title: "web.dev — Learn", provider: "Google", type: "Free", duration: "Self-paced", difficulty: "Intermediate", why: "Performance + a11y from the source." },
    ],
    projects: [
      { id: "p-fe-1", title: "Responsive landing page", level: "Beginner", description: "Pixel-accurate, mobile-first marketing page.", skills: ["CSS", "HTML"], tech: ["HTML", "CSS"], duration: "3–5 days", portfolioValue: "Medium" },
      { id: "p-fe-2", title: "Weather app (API)", level: "Beginner", description: "Search a city, fetch + render weather.", skills: ["JS", "APIs"], tech: ["React", "fetch"], duration: "1 week", portfolioValue: "Medium" },
      { id: "p-fe-3", title: "Kanban board", level: "Intermediate", description: "Drag-drop board with persistence.", skills: ["State", "TypeScript"], tech: ["React", "TS"], duration: "1–2 weeks", portfolioValue: "High" },
      { id: "p-fe-4", title: "Accessible component library", level: "Intermediate", description: "Reusable, keyboard-accessible components + docs.", skills: ["Accessibility", "Design Systems"], tech: ["React", "TS"], duration: "2 weeks", portfolioValue: "High" },
      { id: "p-fe-5", title: "Full SSR dashboard", level: "Advanced", description: "Auth'd analytics dashboard with charts and SSR.", skills: ["Next.js", "Performance"], tech: ["Next.js", "TS"], duration: "3–4 weeks", portfolioValue: "High" },
    ],
  },

  // ─── Full Stack Developer ───
  {
    id: "fullstack", title: "Full Stack Developer", short: "Full Stack", icon: Layers,
    blurb: "Own features end-to-end, from UI to database.",
    requiresDSA: true, requiresCS: true,
    stages: [
      FOUNDATIONS,
      {
        id: "fs-core", name: "Stage 2 · Core Skills", summary: "Both ends of the stack.",
        topics: [
          { id: "fs-fe", name: "Frontend (HTML/CSS/JS/React)" },
          { id: "fs-be", name: "Backend (REST APIs, a runtime)" },
          { id: "fs-db", name: "Databases & SQL" },
          { id: "fs-auth", name: "Authentication & Authorization" },
          { id: "fs-ts", name: "TypeScript across the stack" },
        ],
      },
      {
        id: "fs-inter", name: "Stage 3 · Intermediate", summary: "Glue it together and deploy.",
        topics: [
          { id: "fs-fullframe", name: "A full-stack framework (Next.js)" },
          { id: "fs-orm", name: "ORMs (Prisma)" },
          { id: "fs-docker", name: "Docker" },
          { id: "fs-cicd", name: "CI/CD" },
          { id: "fs-cloud", name: "Cloud Fundamentals" },
        ],
      },
      {
        id: "fs-adv", name: "Stage 4 · Advanced", summary: "Production-grade products.",
        topics: [
          { id: "fs-sysd", name: "System Design Basics" },
          { id: "fs-scale", name: "Scalability & Caching" },
          { id: "fs-monitor", name: "Monitoring" },
          { id: "fs-prod", name: "Production Deployments" },
          { id: "fs-testing", name: "End-to-end Testing" },
        ],
      },
    ],
    skills: [
      { id: "sk-fs-js", name: "JavaScript + TypeScript", level: "must", description: "One language across the whole stack.", why: "Maximizes productivity and shared code.", difficulty: "Intermediate", estTime: "3–4 weeks" },
      { id: "sk-fs-react", name: "React", level: "must", description: "Build the UI layer.", why: "Most-used frontend framework.", difficulty: "Intermediate", estTime: "3 weeks" },
      { id: "sk-fs-node", name: "Node.js + Express", level: "must", description: "Build the API layer.", why: "Pairs naturally with a JS frontend.", difficulty: "Intermediate", estTime: "3 weeks" },
      { id: "sk-fs-db", name: "Databases (SQL + ORM)", level: "must", description: "Model and query data.", why: "Every product needs persistence.", difficulty: "Intermediate", estTime: "2–3 weeks" },
      { id: "sk-fs-next", name: "Next.js", level: "good", description: "Unified full-stack framework.", why: "Industry-standard for shipping fast.", difficulty: "Intermediate", estTime: "2 weeks" },
      { id: "sk-fs-deploy", name: "Deployment (Vercel/Docker)", level: "good", description: "Ship and operate apps.", why: "A feature isn't done until it's live.", difficulty: "Intermediate", estTime: "1 week" },
    ],
    courses: [
      { title: "The Odin Project (Full Stack JS)", provider: "The Odin Project", type: "Free", duration: "100+ hrs", difficulty: "Beginner", why: "Complete free full-stack curriculum." },
      { title: "Full Stack Open", provider: "University of Helsinki", type: "Free", duration: "100+ hrs", difficulty: "Intermediate", why: "Rigorous, modern, free MOOC." },
      { title: "Next.js Learn", provider: "Vercel", type: "Docs", duration: "Self-paced", difficulty: "Intermediate", why: "Official full-stack Next.js course." },
    ],
    projects: [
      { id: "p-fs-1", title: "Personal blog (CRUD)", level: "Beginner", description: "Auth'd blog with posts and comments.", skills: ["React", "REST", "DB"], tech: ["Next.js", "Prisma"], duration: "1 week", portfolioValue: "Medium" },
      { id: "p-fs-2", title: "Expense tracker", level: "Beginner", description: "Track income/expenses with charts.", skills: ["State", "SQL"], tech: ["React", "Express"], duration: "1–2 weeks", portfolioValue: "Medium" },
      { id: "p-fs-3", title: "Real-time chat", level: "Intermediate", description: "Rooms, presence, and live messages.", skills: ["WebSockets", "Auth"], tech: ["Socket.io", "Node"], duration: "2 weeks", portfolioValue: "High" },
      { id: "p-fs-4", title: "SaaS starter (billing)", level: "Advanced", description: "Auth, teams, subscriptions, dashboard.", skills: ["System Design", "Payments"], tech: ["Next.js", "Stripe", "Prisma"], duration: "4 weeks", portfolioValue: "High" },
    ],
  },

  // ─── SDE (generalist) ───
  {
    id: "sde", title: "Software Development Engineer (SDE)", short: "SDE", icon: Code2,
    blurb: "The generalist product-engineering track most campus roles hire for.",
    requiresDSA: true, requiresCS: true,
    stages: [
      FOUNDATIONS,
      {
        id: "sde-core", name: "Stage 2 · Core Skills", summary: "Strong fundamentals + one stack.",
        topics: [
          { id: "sde-lang", name: "One language deeply (Java/C++/Python)" },
          { id: "sde-dsa", name: "Data Structures & Algorithms" },
          { id: "sde-web", name: "Build something end-to-end (web/app)" },
          { id: "sde-db", name: "Databases & SQL" },
          { id: "sde-git", name: "Collaborative Git workflows" },
        ],
      },
      {
        id: "sde-inter", name: "Stage 3 · Intermediate", summary: "Think in systems.",
        topics: [
          { id: "sde-sysd", name: "System Design Basics" },
          { id: "sde-oop", name: "OOP & Design Patterns" },
          { id: "sde-test", name: "Testing & Debugging" },
          { id: "sde-docker", name: "Docker & CI/CD" },
        ],
      },
      {
        id: "sde-adv", name: "Stage 4 · Advanced", summary: "Interview + on-the-job depth.",
        topics: [
          { id: "sde-lld", name: "Low-Level Design (LLD)" },
          { id: "sde-hld", name: "High-Level Design (HLD)" },
          { id: "sde-scale", name: "Scalability & Caching" },
          { id: "sde-behave", name: "Behavioral / HR prep" },
        ],
      },
    ],
    skills: [
      { id: "sk-sde-dsa", name: "DSA", level: "must", description: "Patterns over memorization.", why: "The core of every SDE interview.", difficulty: "Intermediate", estTime: "8–12 weeks" },
      { id: "sk-sde-lang", name: "One language, deeply", level: "must", description: "Idioms, std library, memory model.", why: "Interviewers probe depth, not breadth.", difficulty: "Intermediate", estTime: "ongoing" },
      { id: "sk-sde-cs", name: "CS fundamentals (OS/DBMS/CN/OOP)", level: "must", description: "Theory that shows up in rounds.", why: "Heavily asked in Indian campus drives.", difficulty: "Intermediate", estTime: "4–6 weeks" },
      { id: "sk-sde-sysd", name: "System design basics", level: "must", description: "Design scalable systems at a high level.", why: "Now common even for fresher SDE-1.", difficulty: "Advanced", estTime: "3–4 weeks" },
      { id: "sk-sde-project", name: "One strong end-to-end project", level: "good", description: "A real, deployed app you can defend.", why: "Differentiates you in HR/tech rounds.", difficulty: "Intermediate", estTime: "3–4 weeks" },
      { id: "sk-sde-behave", name: "Behavioral storytelling (STAR)", level: "good", description: "Structured answers to HR questions.", why: "Decides many final-round outcomes.", difficulty: "Beginner", estTime: "1 week" },
    ],
    courses: [
      { title: "NeetCode 150", provider: "NeetCode", type: "YouTube", duration: "Self-paced", difficulty: "Intermediate", why: "Curated, pattern-based DSA explanations." },
      { title: "Striver's A2Z DSA Sheet", provider: "takeUforward", type: "Free", duration: "Self-paced", difficulty: "Intermediate", why: "Comprehensive India-focused DSA path." },
      { title: "System Design Primer", provider: "GitHub", type: "Open-source", duration: "Self-paced", difficulty: "Intermediate", why: "Free, complete system-design intro." },
    ],
    projects: [
      { id: "p-sde-1", title: "CLI tool", level: "Beginner", description: "A useful command-line utility with tests.", skills: ["Language", "Testing"], tech: ["Any language"], duration: "1 week", portfolioValue: "Medium" },
      { id: "p-sde-2", title: "Full-stack CRUD app", level: "Intermediate", description: "Deployed app with auth + DB you can demo.", skills: ["Web", "DB", "Auth"], tech: ["React", "Node", "SQL"], duration: "2–3 weeks", portfolioValue: "High" },
      { id: "p-sde-3", title: "Design + build a scalable service", level: "Advanced", description: "Document HLD/LLD, then implement the core.", skills: ["System Design", "DSA"], tech: ["Your stack"], duration: "4 weeks", portfolioValue: "High" },
    ],
  },

  // ─── DevOps Engineer ───
  {
    id: "devops", title: "DevOps Engineer", short: "DevOps", icon: Boxes,
    blurb: "Automate build, deploy, and operations for fast, reliable delivery.",
    requiresDSA: false, requiresCS: true,
    stages: [
      FOUNDATIONS,
      {
        id: "do-core", name: "Stage 2 · Core Skills", summary: "Containers, pipelines, and the cloud.",
        topics: [
          { id: "do-linux", name: "Linux administration" },
          { id: "do-script", name: "Scripting (Bash, Python)" },
          { id: "do-docker", name: "Docker" },
          { id: "do-cicd", name: "CI/CD pipelines" },
          { id: "do-cloud", name: "A cloud provider (AWS/GCP/Azure)" },
        ],
      },
      {
        id: "do-inter", name: "Stage 3 · Intermediate", summary: "Orchestrate and codify infra.",
        topics: [
          { id: "do-k8s", name: "Kubernetes" },
          { id: "do-iac", name: "Infrastructure as Code (Terraform)" },
          { id: "do-config", name: "Config management (Ansible)" },
          { id: "do-net", name: "Networking & DNS" },
        ],
      },
      {
        id: "do-adv", name: "Stage 4 · Advanced", summary: "Operate reliably at scale.",
        topics: [
          { id: "do-obs", name: "Monitoring & Observability (Prometheus/Grafana)" },
          { id: "do-sec", name: "Security & Secrets Management" },
          { id: "do-gitops", name: "GitOps" },
          { id: "do-cost", name: "Cost & Performance Optimization" },
        ],
      },
    ],
    skills: [
      { id: "sk-do-linux", name: "Linux", level: "must", description: "Comfortable in the shell and with services.", why: "Everything runs on it.", difficulty: "Intermediate", estTime: "3 weeks" },
      { id: "sk-do-docker", name: "Docker", level: "must", description: "Build and run containers.", why: "The unit of modern deployment.", difficulty: "Intermediate", estTime: "1–2 weeks" },
      { id: "sk-do-cicd", name: "CI/CD", level: "must", description: "Automate test + deploy pipelines.", why: "The core of the role.", difficulty: "Intermediate", estTime: "2 weeks" },
      { id: "sk-do-cloud", name: "A cloud provider", level: "must", description: "Provision and operate cloud resources.", why: "Where infra lives.", difficulty: "Intermediate", estTime: "4 weeks" },
      { id: "sk-do-k8s", name: "Kubernetes", level: "good", description: "Container orchestration.", why: "Standard at scale.", difficulty: "Advanced", estTime: "4 weeks" },
      { id: "sk-do-tf", name: "Terraform", level: "good", description: "Declarative infrastructure.", why: "IaC is expected.", difficulty: "Intermediate", estTime: "2 weeks" },
    ],
    courses: [
      { title: "roadmap.sh — DevOps", provider: "roadmap.sh", type: "Open-source", duration: "Self-paced", difficulty: "Intermediate", why: "The canonical DevOps roadmap." },
      { title: "KodeKloud free labs", provider: "KodeKloud", type: "Free", duration: "Self-paced", difficulty: "Beginner", why: "Hands-on Docker/K8s labs." },
      { title: "AWS Skill Builder", provider: "AWS", type: "Free", duration: "Self-paced", difficulty: "Beginner", why: "Official free cloud foundations." },
    ],
    projects: [
      { id: "p-do-1", title: "Dockerize an app + compose", level: "Beginner", description: "Containerize a multi-service app locally.", skills: ["Docker"], tech: ["Docker", "Compose"], duration: "3–5 days", portfolioValue: "Medium" },
      { id: "p-do-2", title: "CI/CD pipeline", level: "Intermediate", description: "Auto test + build + deploy on push.", skills: ["CI/CD"], tech: ["GitHub Actions"], duration: "1 week", portfolioValue: "High" },
      { id: "p-do-3", title: "K8s + Terraform cluster", level: "Advanced", description: "Provision a cluster via IaC with monitoring.", skills: ["Kubernetes", "Terraform"], tech: ["K8s", "Terraform", "Prometheus"], duration: "3–4 weeks", portfolioValue: "High" },
    ],
  },

  // ─── Cloud Engineer ───
  {
    id: "cloud", title: "Cloud Engineer", short: "Cloud", icon: Cloud,
    blurb: "Design, deploy, and operate scalable cloud infrastructure.",
    requiresDSA: false, requiresCS: true,
    stages: [
      FOUNDATIONS,
      { id: "cl-core", name: "Stage 2 · Core Skills", summary: "Cloud building blocks.", topics: [
        { id: "cl-prov", name: "A cloud provider (AWS first)" },
        { id: "cl-compute", name: "Compute (VMs, containers, serverless)" },
        { id: "cl-storage", name: "Storage & Databases" },
        { id: "cl-net", name: "Networking (VPC, DNS, LB)" },
        { id: "cl-iam", name: "Identity & Access (IAM)" },
      ]},
      { id: "cl-inter", name: "Stage 3 · Intermediate", summary: "Automate and orchestrate.", topics: [
        { id: "cl-iac", name: "Infrastructure as Code (Terraform)" },
        { id: "cl-containers", name: "Containers & Kubernetes" },
        { id: "cl-cicd", name: "CI/CD" },
        { id: "cl-cost", name: "Cost Management" },
      ]},
      { id: "cl-adv", name: "Stage 4 · Advanced", summary: "Architect for scale.", topics: [
        { id: "cl-arch", name: "Well-Architected design" },
        { id: "cl-ha", name: "High Availability & DR" },
        { id: "cl-sec", name: "Cloud Security" },
        { id: "cl-obs", name: "Observability" },
      ]},
    ],
    skills: [
      { id: "sk-cl-aws", name: "AWS core services", level: "must", description: "EC2, S3, RDS, Lambda, VPC, IAM.", why: "Most common cloud in hiring.", difficulty: "Intermediate", estTime: "4–6 weeks" },
      { id: "sk-cl-net", name: "Cloud networking", level: "must", description: "VPCs, subnets, DNS, load balancers.", why: "Underpins every architecture.", difficulty: "Intermediate", estTime: "2 weeks" },
      { id: "sk-cl-iac", name: "Terraform", level: "must", description: "Codify infrastructure.", why: "IaC is the standard.", difficulty: "Intermediate", estTime: "2 weeks" },
      { id: "sk-cl-k8s", name: "Kubernetes", level: "good", description: "Container orchestration.", why: "Expected at scale.", difficulty: "Advanced", estTime: "4 weeks" },
      { id: "sk-cl-cert", name: "Cloud certification", level: "optional", description: "AWS Cloud Practitioner / Associate.", why: "Signals credibility to recruiters.", difficulty: "Intermediate", estTime: "3–4 weeks" },
    ],
    courses: [
      { title: "roadmap.sh — AWS", provider: "roadmap.sh", type: "Open-source", duration: "Self-paced", difficulty: "Intermediate", why: "Structured cloud roadmap." },
      { title: "AWS Cloud Practitioner Essentials", provider: "AWS", type: "Free", duration: "~6 hrs", difficulty: "Beginner", why: "Official free intro." },
      { title: "freeCodeCamp — AWS", provider: "freeCodeCamp", type: "YouTube", duration: "Varies", difficulty: "Beginner", why: "Long-form hands-on walkthroughs." },
    ],
    projects: [
      { id: "p-cl-1", title: "Static site on S3 + CDN", level: "Beginner", description: "Host and globally serve a static site.", skills: ["Storage", "Networking"], tech: ["S3", "CloudFront"], duration: "2–3 days", portfolioValue: "Medium" },
      { id: "p-cl-2", title: "Serverless API", level: "Intermediate", description: "Lambda + API Gateway + DynamoDB.", skills: ["Compute", "Databases"], tech: ["Lambda", "DynamoDB"], duration: "1–2 weeks", portfolioValue: "High" },
      { id: "p-cl-3", title: "Multi-AZ app via Terraform", level: "Advanced", description: "HA architecture provisioned as code.", skills: ["IaC", "HA"], tech: ["Terraform", "AWS"], duration: "3 weeks", portfolioValue: "High" },
    ],
  },

  // ─── Cybersecurity Engineer ───
  {
    id: "security", title: "Cybersecurity Engineer", short: "Security", icon: Shield,
    blurb: "Defend systems, find vulnerabilities, and secure software.",
    requiresDSA: false, requiresCS: true,
    stages: [
      FOUNDATIONS,
      { id: "se-core", name: "Stage 2 · Core Skills", summary: "Security fundamentals.", topics: [
        { id: "se-net", name: "Networking & TCP/IP" },
        { id: "se-os", name: "OS internals & Linux hardening" },
        { id: "se-crypto", name: "Cryptography Basics" },
        { id: "se-web", name: "Web Security (OWASP Top 10)" },
        { id: "se-tools", name: "Security tooling (Wireshark, Burp, nmap)" },
      ]},
      { id: "se-inter", name: "Stage 3 · Intermediate", summary: "Offensive + defensive practice.", topics: [
        { id: "se-pentest", name: "Penetration Testing Basics" },
        { id: "se-appsec", name: "Application Security" },
        { id: "se-iam", name: "Identity & Access Management" },
        { id: "se-cloudsec", name: "Cloud Security" },
      ]},
      { id: "se-adv", name: "Stage 4 · Advanced", summary: "Operate a security program.", topics: [
        { id: "se-ir", name: "Incident Response" },
        { id: "se-threat", name: "Threat Modeling" },
        { id: "se-soc", name: "SIEM / SOC operations" },
        { id: "se-devsecops", name: "DevSecOps" },
      ]},
    ],
    skills: [
      { id: "sk-se-net", name: "Networking", level: "must", description: "Packets, protocols, and ports.", why: "You can't secure what you don't understand.", difficulty: "Intermediate", estTime: "3 weeks" },
      { id: "sk-se-owasp", name: "OWASP Top 10", level: "must", description: "The most common web vulnerabilities.", why: "Bread and butter of appsec.", difficulty: "Intermediate", estTime: "2 weeks" },
      { id: "sk-se-linux", name: "Linux", level: "must", description: "Hardening and forensics.", why: "Most servers and tools are Linux.", difficulty: "Intermediate", estTime: "3 weeks" },
      { id: "sk-se-tools", name: "Burp / nmap / Wireshark", level: "good", description: "Core offensive/analysis tools.", why: "Hands-on testing requires them.", difficulty: "Intermediate", estTime: "2 weeks" },
      { id: "sk-se-cert", name: "Security+ / eJPT", level: "optional", description: "Entry-level certifications.", why: "Strong resume signal in security.", difficulty: "Intermediate", estTime: "4–6 weeks" },
    ],
    courses: [
      { title: "TryHackMe — Pre-Security", provider: "TryHackMe", type: "Free", duration: "Self-paced", difficulty: "Beginner", why: "Gamified hands-on intro." },
      { title: "PortSwigger Web Security Academy", provider: "PortSwigger", type: "Free", duration: "Self-paced", difficulty: "Intermediate", why: "Best free web-security labs." },
      { title: "OWASP Top 10", provider: "OWASP", type: "Docs", duration: "Reference", difficulty: "Intermediate", why: "Authoritative vulnerability reference." },
    ],
    projects: [
      { id: "p-se-1", title: "Harden a Linux box", level: "Beginner", description: "Apply CIS hardening + document it.", skills: ["Linux"], tech: ["Linux"], duration: "3–5 days", portfolioValue: "Medium" },
      { id: "p-se-2", title: "Vulnerability write-ups", level: "Intermediate", description: "Solve + document 10 web-security labs.", skills: ["OWASP", "Tools"], tech: ["Burp"], duration: "2 weeks", portfolioValue: "High" },
      { id: "p-se-3", title: "Build a CI/CD security scanner", level: "Advanced", description: "Pipeline that fails builds on findings.", skills: ["DevSecOps"], tech: ["GitHub Actions", "Semgrep"], duration: "3 weeks", portfolioValue: "High" },
    ],
  },

  // ─── Data Engineer ───
  {
    id: "data-engineer", title: "Data Engineer", short: "Data Eng", icon: Database,
    blurb: "Build pipelines and platforms that move and shape data at scale.",
    requiresDSA: true, requiresCS: true,
    stages: [
      FOUNDATIONS,
      { id: "de-core", name: "Stage 2 · Core Skills", summary: "Data + SQL + Python.", topics: [
        { id: "de-sql", name: "Advanced SQL" },
        { id: "de-py", name: "Python for data" },
        { id: "de-model", name: "Data Modeling & Warehousing" },
        { id: "de-etl", name: "ETL / ELT" },
        { id: "de-batch", name: "Batch processing" },
      ]},
      { id: "de-inter", name: "Stage 3 · Intermediate", summary: "Pipelines and big data.", topics: [
        { id: "de-spark", name: "Apache Spark" },
        { id: "de-orch", name: "Orchestration (Airflow)" },
        { id: "de-stream", name: "Streaming (Kafka)" },
        { id: "de-cloud", name: "Cloud data services" },
      ]},
      { id: "de-adv", name: "Stage 4 · Advanced", summary: "Reliable data platforms.", topics: [
        { id: "de-lake", name: "Data Lakes / Lakehouse" },
        { id: "de-quality", name: "Data Quality & Governance" },
        { id: "de-perf", name: "Pipeline Performance" },
        { id: "de-obs", name: "Observability" },
      ]},
    ],
    skills: [
      { id: "sk-de-sql", name: "Advanced SQL", level: "must", description: "Window functions, CTEs, optimization.", why: "The core data-engineering language.", difficulty: "Intermediate", estTime: "3 weeks" },
      { id: "sk-de-py", name: "Python", level: "must", description: "Scripting, pandas, pipeline code.", why: "Glue of the data stack.", difficulty: "Intermediate", estTime: "3 weeks" },
      { id: "sk-de-warehouse", name: "Data warehousing", level: "must", description: "Dimensional modeling, star schemas.", why: "Underpins analytics.", difficulty: "Intermediate", estTime: "2 weeks" },
      { id: "sk-de-spark", name: "Apache Spark", level: "good", description: "Distributed data processing.", why: "Standard for big data.", difficulty: "Advanced", estTime: "3–4 weeks" },
      { id: "sk-de-airflow", name: "Airflow", level: "good", description: "Schedule and orchestrate pipelines.", why: "Common orchestration tool.", difficulty: "Intermediate", estTime: "2 weeks" },
    ],
    courses: [
      { title: "Data Engineering Zoomcamp", provider: "DataTalks.Club", type: "Free", duration: "9 weeks", difficulty: "Intermediate", why: "Free, hands-on, end-to-end." },
      { title: "Mode SQL Tutorial", provider: "Mode", type: "Free", duration: "Self-paced", difficulty: "Beginner", why: "Practical analytical SQL." },
      { title: "Spark — official docs", provider: "Apache", type: "Docs", duration: "Reference", difficulty: "Advanced", why: "Authoritative Spark reference." },
    ],
    projects: [
      { id: "p-de-1", title: "CSV → warehouse ETL", level: "Beginner", description: "Ingest, clean, and load data with Python.", skills: ["Python", "SQL"], tech: ["Python", "PostgreSQL"], duration: "1 week", portfolioValue: "Medium" },
      { id: "p-de-2", title: "Airflow pipeline", level: "Intermediate", description: "Scheduled DAG pulling + transforming an API.", skills: ["Orchestration"], tech: ["Airflow"], duration: "2 weeks", portfolioValue: "High" },
      { id: "p-de-3", title: "Streaming analytics", level: "Advanced", description: "Real-time pipeline with Kafka + Spark.", skills: ["Streaming", "Spark"], tech: ["Kafka", "Spark"], duration: "3–4 weeks", portfolioValue: "High" },
    ],
  },

  // ─── Machine Learning Engineer ───
  {
    id: "ml-engineer", title: "Machine Learning Engineer", short: "ML Eng", icon: Brain,
    blurb: "Build, train, and ship ML models into production.",
    requiresDSA: true, requiresCS: true,
    stages: [
      FOUNDATIONS,
      { id: "ml-core", name: "Stage 2 · Core Skills", summary: "Math + Python + classic ML.", topics: [
        { id: "ml-math", name: "Linear Algebra, Probability, Statistics" },
        { id: "ml-py", name: "Python + NumPy + pandas" },
        { id: "ml-classic", name: "Classical ML (sklearn)" },
        { id: "ml-eval", name: "Model Evaluation & Metrics" },
        { id: "ml-fe", name: "Feature Engineering" },
      ]},
      { id: "ml-inter", name: "Stage 3 · Intermediate", summary: "Deep learning.", topics: [
        { id: "ml-dl", name: "Neural Networks (PyTorch/TensorFlow)" },
        { id: "ml-cv", name: "Computer Vision basics" },
        { id: "ml-nlp", name: "NLP basics" },
        { id: "ml-data", name: "Data pipelines for ML" },
      ]},
      { id: "ml-adv", name: "Stage 4 · Advanced", summary: "MLOps + production.", topics: [
        { id: "ml-mlops", name: "MLOps (tracking, serving)" },
        { id: "ml-deploy", name: "Model Deployment" },
        { id: "ml-monitor", name: "Monitoring & Drift" },
        { id: "ml-scale", name: "Scaling Training" },
      ]},
    ],
    skills: [
      { id: "sk-ml-py", name: "Python (NumPy/pandas)", level: "must", description: "The ML lingua franca.", why: "Every ML workflow uses it.", difficulty: "Intermediate", estTime: "3 weeks" },
      { id: "sk-ml-math", name: "ML math", level: "must", description: "Linear algebra, probability, stats.", why: "Needed to reason about models.", difficulty: "Intermediate", estTime: "4 weeks" },
      { id: "sk-ml-sklearn", name: "Classical ML", level: "must", description: "Regression, trees, clustering.", why: "Foundation before deep learning.", difficulty: "Intermediate", estTime: "3 weeks" },
      { id: "sk-ml-dl", name: "Deep learning (PyTorch)", level: "good", description: "Neural nets and training loops.", why: "Powers modern ML.", difficulty: "Advanced", estTime: "5–6 weeks" },
      { id: "sk-ml-mlops", name: "MLOps", level: "good", description: "Track, serve, and monitor models.", why: "Turns models into products.", difficulty: "Advanced", estTime: "3 weeks" },
    ],
    courses: [
      { title: "Andrew Ng — Machine Learning Specialization", provider: "DeepLearning.AI / Coursera", type: "Course", duration: "~3 months", difficulty: "Beginner", why: "The classic ML starting point (audit free)." },
      { title: "fast.ai", provider: "fast.ai", type: "Free", duration: "Self-paced", difficulty: "Intermediate", why: "Top-down practical deep learning." },
      { title: "Kaggle Learn", provider: "Kaggle", type: "Free", duration: "Self-paced", difficulty: "Beginner", why: "Hands-on micro-courses + datasets." },
    ],
    projects: [
      { id: "p-ml-1", title: "Tabular prediction (Kaggle)", level: "Beginner", description: "EDA + model on a classic dataset.", skills: ["Classical ML"], tech: ["sklearn"], duration: "1 week", portfolioValue: "Medium" },
      { id: "p-ml-2", title: "Image classifier", level: "Intermediate", description: "CNN trained + evaluated on real images.", skills: ["Deep Learning", "CV"], tech: ["PyTorch"], duration: "2 weeks", portfolioValue: "High" },
      { id: "p-ml-3", title: "Deployed ML API", level: "Advanced", description: "Serve a model behind a REST API with monitoring.", skills: ["MLOps", "Deployment"], tech: ["FastAPI", "Docker"], duration: "3 weeks", portfolioValue: "High" },
    ],
  },

  // ─── AI Engineer ───
  {
    id: "ai-engineer", title: "AI Engineer", short: "AI Eng", icon: Bot,
    blurb: "Build applications on top of LLMs and generative AI.",
    requiresDSA: true, requiresCS: true,
    stages: [
      FOUNDATIONS,
      { id: "ai-core", name: "Stage 2 · Core Skills", summary: "Working with LLMs.", topics: [
        { id: "ai-py", name: "Python + APIs" },
        { id: "ai-llm", name: "LLM fundamentals & prompting" },
        { id: "ai-embed", name: "Embeddings & Vector DBs" },
        { id: "ai-rag", name: "Retrieval-Augmented Generation (RAG)" },
        { id: "ai-eval", name: "Evaluation of AI outputs" },
      ]},
      { id: "ai-inter", name: "Stage 3 · Intermediate", summary: "Build agentic apps.", topics: [
        { id: "ai-tools", name: "Tool / function calling" },
        { id: "ai-agents", name: "Agents & orchestration" },
        { id: "ai-frame", name: "Frameworks (LangChain/LlamaIndex)" },
        { id: "ai-guard", name: "Guardrails & safety" },
      ]},
      { id: "ai-adv", name: "Stage 4 · Advanced", summary: "Production AI systems.", topics: [
        { id: "ai-ft", name: "Fine-tuning & adapters" },
        { id: "ai-cost", name: "Cost & latency optimization" },
        { id: "ai-obs", name: "Observability & tracing" },
        { id: "ai-deploy", name: "Deployment & scaling" },
      ]},
    ],
    skills: [
      { id: "sk-ai-py", name: "Python", level: "must", description: "Primary language for AI apps.", why: "Best ecosystem support.", difficulty: "Intermediate", estTime: "2–3 weeks" },
      { id: "sk-ai-prompt", name: "Prompt engineering", level: "must", description: "Reliable structured outputs from LLMs.", why: "Core skill for AI apps.", difficulty: "Beginner", estTime: "1–2 weeks" },
      { id: "sk-ai-rag", name: "RAG + vector search", level: "must", description: "Ground LLMs in your own data.", why: "Most real AI products use it.", difficulty: "Intermediate", estTime: "2 weeks" },
      { id: "sk-ai-agents", name: "Agents & tool use", level: "good", description: "LLMs that call tools and act.", why: "The frontier of AI apps.", difficulty: "Advanced", estTime: "2–3 weeks" },
      { id: "sk-ai-eval", name: "Evaluation", level: "good", description: "Measure quality and prevent regressions.", why: "Separates demos from products.", difficulty: "Intermediate", estTime: "1 week" },
    ],
    courses: [
      { title: "Prompt Engineering for Developers", provider: "DeepLearning.AI", type: "Free", duration: "~2 hrs", difficulty: "Beginner", why: "Short, official, practical." },
      { title: "Anthropic / OpenAI docs", provider: "Vendors", type: "Docs", duration: "Reference", difficulty: "Intermediate", why: "Authoritative API + tool-use guides." },
      { title: "LangChain docs", provider: "LangChain", type: "Docs", duration: "Reference", difficulty: "Intermediate", why: "Building blocks for AI apps." },
    ],
    projects: [
      { id: "p-ai-1", title: "Chatbot with memory", level: "Beginner", description: "Conversational app over an LLM API.", skills: ["Prompting"], tech: ["Python", "LLM API"], duration: "3–5 days", portfolioValue: "Medium" },
      { id: "p-ai-2", title: "RAG over your docs", level: "Intermediate", description: "Q&A grounded in a document set.", skills: ["RAG", "Embeddings"], tech: ["Vector DB", "LLM"], duration: "2 weeks", portfolioValue: "High" },
      { id: "p-ai-3", title: "Multi-tool agent", level: "Advanced", description: "Agent that uses tools to complete tasks.", skills: ["Agents", "Tools"], tech: ["LangChain"], duration: "3 weeks", portfolioValue: "High" },
    ],
  },

  // ─── Mobile App Developer ───
  {
    id: "mobile", title: "Mobile App Developer", short: "Mobile", icon: Smartphone,
    blurb: "Build native or cross-platform apps for iOS and Android.",
    requiresDSA: true, requiresCS: true,
    stages: [
      FOUNDATIONS,
      { id: "mo-core", name: "Stage 2 · Core Skills", summary: "A platform + UI + data.", topics: [
        { id: "mo-lang", name: "A platform (React Native / Flutter / Kotlin / Swift)" },
        { id: "mo-ui", name: "Mobile UI & navigation" },
        { id: "mo-state", name: "State management" },
        { id: "mo-api", name: "Networking & APIs" },
        { id: "mo-store", name: "Local storage" },
      ]},
      { id: "mo-inter", name: "Stage 3 · Intermediate", summary: "Device features + quality.", topics: [
        { id: "mo-native", name: "Device APIs (camera, location, push)" },
        { id: "mo-test", name: "Testing" },
        { id: "mo-perf", name: "Performance & memory" },
        { id: "mo-ci", name: "CI/CD for mobile" },
      ]},
      { id: "mo-adv", name: "Stage 4 · Advanced", summary: "Ship to the stores.", topics: [
        { id: "mo-publish", name: "App Store / Play Store publishing" },
        { id: "mo-offline", name: "Offline-first & sync" },
        { id: "mo-analytics", name: "Analytics & crash reporting" },
        { id: "mo-scale", name: "Scaling & modularization" },
      ]},
    ],
    skills: [
      { id: "sk-mo-platform", name: "One platform deeply", level: "must", description: "RN/Flutter or native Kotlin/Swift.", why: "Depth beats breadth for hiring.", difficulty: "Intermediate", estTime: "4–6 weeks" },
      { id: "sk-mo-ui", name: "Mobile UI/UX", level: "must", description: "Navigation, gestures, responsiveness.", why: "Mobile UX expectations are high.", difficulty: "Intermediate", estTime: "2 weeks" },
      { id: "sk-mo-api", name: "API integration", level: "must", description: "Fetch, cache, and sync data.", why: "Apps live on remote data.", difficulty: "Intermediate", estTime: "2 weeks" },
      { id: "sk-mo-native", name: "Device APIs", level: "good", description: "Camera, push, location, sensors.", why: "Differentiates real apps.", difficulty: "Intermediate", estTime: "2 weeks" },
      { id: "sk-mo-publish", name: "Store publishing", level: "good", description: "Build, sign, and release apps.", why: "Shipping is part of the job.", difficulty: "Intermediate", estTime: "1 week" },
    ],
    courses: [
      { title: "React Native docs", provider: "Meta", type: "Docs", duration: "Reference", difficulty: "Intermediate", why: "Official cross-platform path." },
      { title: "Flutter — official codelabs", provider: "Google", type: "Free", duration: "Self-paced", difficulty: "Beginner", why: "Hands-on guided builds." },
      { title: "Hacking with Swift", provider: "Paul Hudson", type: "Free", duration: "Self-paced", difficulty: "Beginner", why: "Best free native iOS resource." },
    ],
    projects: [
      { id: "p-mo-1", title: "To-do app", level: "Beginner", description: "CRUD app with local storage.", skills: ["UI", "Storage"], tech: ["React Native"], duration: "3–5 days", portfolioValue: "Medium" },
      { id: "p-mo-2", title: "Weather/news app", level: "Intermediate", description: "API-driven app with navigation + caching.", skills: ["API", "State"], tech: ["Flutter"], duration: "1–2 weeks", portfolioValue: "High" },
      { id: "p-mo-3", title: "Published app", level: "Advanced", description: "Real app with push + analytics on a store.", skills: ["Device APIs", "Publishing"], tech: ["RN/Flutter"], duration: "4 weeks", portfolioValue: "High" },
    ],
  },

  // ─── Blockchain Developer ───
  {
    id: "blockchain", title: "Blockchain Developer", short: "Blockchain", icon: Boxes,
    blurb: "Build smart contracts and decentralized applications.",
    requiresDSA: true, requiresCS: true,
    stages: [
      FOUNDATIONS,
      { id: "bc-core", name: "Stage 2 · Core Skills", summary: "Web3 + smart contracts.", topics: [
        { id: "bc-basics", name: "Blockchain fundamentals" },
        { id: "bc-sol", name: "Solidity" },
        { id: "bc-evm", name: "EVM & gas" },
        { id: "bc-tools", name: "Tooling (Hardhat/Foundry)" },
        { id: "bc-web3", name: "Web3 frontend (ethers/wagmi)" },
      ]},
      { id: "bc-inter", name: "Stage 3 · Intermediate", summary: "Real dApps.", topics: [
        { id: "bc-standards", name: "Token standards (ERC-20/721)" },
        { id: "bc-test", name: "Contract testing" },
        { id: "bc-security", name: "Smart-contract security" },
        { id: "bc-oracle", name: "Oracles" },
      ]},
      { id: "bc-adv", name: "Stage 4 · Advanced", summary: "Protocols + scale.", topics: [
        { id: "bc-defi", name: "DeFi primitives" },
        { id: "bc-l2", name: "Layer-2 & scaling" },
        { id: "bc-audit", name: "Auditing & gas optimization" },
        { id: "bc-deploy", name: "Mainnet deployment" },
      ]},
    ],
    skills: [
      { id: "sk-bc-sol", name: "Solidity", level: "must", description: "The primary smart-contract language.", why: "Core of EVM development.", difficulty: "Intermediate", estTime: "4 weeks" },
      { id: "sk-bc-evm", name: "EVM mental model", level: "must", description: "Gas, storage, transactions.", why: "Required to write safe contracts.", difficulty: "Advanced", estTime: "2 weeks" },
      { id: "sk-bc-tools", name: "Hardhat / Foundry", level: "must", description: "Build, test, deploy contracts.", why: "Standard dev tooling.", difficulty: "Intermediate", estTime: "2 weeks" },
      { id: "sk-bc-sec", name: "Contract security", level: "good", description: "Reentrancy, overflow, access control.", why: "Bugs cost real money.", difficulty: "Advanced", estTime: "3 weeks" },
    ],
    courses: [
      { title: "CryptoZombies", provider: "CryptoZombies", type: "Free", duration: "Self-paced", difficulty: "Beginner", why: "Gamified Solidity intro." },
      { title: "Cyfrin Updraft", provider: "Cyfrin", type: "Free", duration: "Self-paced", difficulty: "Intermediate", why: "Modern, free, hands-on web3." },
      { title: "Solidity docs", provider: "Solidity", type: "Docs", duration: "Reference", difficulty: "Intermediate", why: "Authoritative language reference." },
    ],
    projects: [
      { id: "p-bc-1", title: "ERC-20 token", level: "Beginner", description: "Write, test, and deploy a token to a testnet.", skills: ["Solidity"], tech: ["Hardhat"], duration: "1 week", portfolioValue: "Medium" },
      { id: "p-bc-2", title: "NFT minting dApp", level: "Intermediate", description: "ERC-721 contract + web3 frontend.", skills: ["Standards", "Web3"], tech: ["Solidity", "wagmi"], duration: "2 weeks", portfolioValue: "High" },
      { id: "p-bc-3", title: "Mini DeFi protocol", level: "Advanced", description: "Staking/lending with thorough tests.", skills: ["DeFi", "Security"], tech: ["Foundry"], duration: "4 weeks", portfolioValue: "High" },
    ],
  },

  // ─── Site Reliability Engineer ───
  {
    id: "sre", title: "Site Reliability Engineer", short: "SRE", icon: Activity,
    blurb: "Keep large-scale systems reliable, observable, and fast.",
    requiresDSA: true, requiresCS: true,
    stages: [
      FOUNDATIONS,
      { id: "sre-core", name: "Stage 2 · Core Skills", summary: "Systems + automation.", topics: [
        { id: "sre-linux", name: "Linux & systems internals" },
        { id: "sre-script", name: "Scripting (Python/Go)" },
        { id: "sre-net", name: "Networking" },
        { id: "sre-cloud", name: "Cloud & containers" },
        { id: "sre-cicd", name: "CI/CD" },
      ]},
      { id: "sre-inter", name: "Stage 3 · Intermediate", summary: "Observe and orchestrate.", topics: [
        { id: "sre-obs", name: "Monitoring, logging, tracing" },
        { id: "sre-k8s", name: "Kubernetes" },
        { id: "sre-slo", name: "SLI / SLO / error budgets" },
        { id: "sre-iac", name: "Infrastructure as Code" },
      ]},
      { id: "sre-adv", name: "Stage 4 · Advanced", summary: "Reliability at scale.", topics: [
        { id: "sre-incident", name: "Incident response & on-call" },
        { id: "sre-chaos", name: "Chaos engineering" },
        { id: "sre-capacity", name: "Capacity planning" },
        { id: "sre-dist", name: "Distributed systems reliability" },
      ]},
    ],
    skills: [
      { id: "sk-sre-linux", name: "Linux & systems", level: "must", description: "Deep OS and process knowledge.", why: "You debug at this level.", difficulty: "Advanced", estTime: "4 weeks" },
      { id: "sk-sre-obs", name: "Observability", level: "must", description: "Metrics, logs, traces, dashboards.", why: "Can't fix what you can't see.", difficulty: "Intermediate", estTime: "2 weeks" },
      { id: "sk-sre-k8s", name: "Kubernetes", level: "must", description: "Operate containerized workloads.", why: "Where modern services run.", difficulty: "Advanced", estTime: "4 weeks" },
      { id: "sk-sre-code", name: "Coding (Python/Go)", level: "good", description: "Automate ops and build tooling.", why: "SRE is engineering, not clicking.", difficulty: "Intermediate", estTime: "3 weeks" },
    ],
    courses: [
      { title: "Google SRE Book", provider: "Google", type: "Free", duration: "Self-paced", difficulty: "Intermediate", why: "The foundational free SRE text." },
      { title: "roadmap.sh — DevOps", provider: "roadmap.sh", type: "Open-source", duration: "Self-paced", difficulty: "Intermediate", why: "Overlapping skill roadmap." },
      { title: "Prometheus docs", provider: "Prometheus", type: "Docs", duration: "Reference", difficulty: "Intermediate", why: "Standard metrics tooling." },
    ],
    projects: [
      { id: "p-sre-1", title: "Monitor a service", level: "Beginner", description: "Add metrics + a Grafana dashboard.", skills: ["Observability"], tech: ["Prometheus", "Grafana"], duration: "1 week", portfolioValue: "Medium" },
      { id: "p-sre-2", title: "Self-healing deployment", level: "Intermediate", description: "Health checks + auto-restart on K8s.", skills: ["Kubernetes"], tech: ["K8s"], duration: "2 weeks", portfolioValue: "High" },
      { id: "p-sre-3", title: "Chaos + SLO dashboard", level: "Advanced", description: "Inject failures, track error budgets.", skills: ["Chaos", "SLO"], tech: ["K8s", "Grafana"], duration: "3 weeks", portfolioValue: "High" },
    ],
  },

  // ─── Game Developer ───
  {
    id: "game-dev", title: "Game Developer", short: "Game Dev", icon: Gamepad2,
    blurb: "Build interactive games and real-time graphics.",
    requiresDSA: true, requiresCS: false,
    stages: [
      FOUNDATIONS,
      { id: "gd-core", name: "Stage 2 · Core Skills", summary: "An engine + game math.", topics: [
        { id: "gd-engine", name: "A game engine (Unity / Unreal / Godot)" },
        { id: "gd-lang", name: "C# or C++" },
        { id: "gd-math", name: "Game math (vectors, transforms)" },
        { id: "gd-loop", name: "Game loop & physics" },
        { id: "gd-input", name: "Input & controls" },
      ]},
      { id: "gd-inter", name: "Stage 3 · Intermediate", summary: "Make it feel good.", topics: [
        { id: "gd-anim", name: "Animation & state machines" },
        { id: "gd-ai", name: "Game AI (pathfinding, FSMs)" },
        { id: "gd-audio", name: "Audio & juice" },
        { id: "gd-ui", name: "Game UI/UX" },
      ]},
      { id: "gd-adv", name: "Stage 4 · Advanced", summary: "Polish and ship.", topics: [
        { id: "gd-perf", name: "Performance & profiling" },
        { id: "gd-multi", name: "Multiplayer basics" },
        { id: "gd-build", name: "Builds & platforms" },
        { id: "gd-ship", name: "Publishing (itch.io / Steam)" },
      ]},
    ],
    skills: [
      { id: "sk-gd-engine", name: "A game engine", level: "must", description: "Unity (C#) is the common starting point.", why: "Where games are actually built.", difficulty: "Intermediate", estTime: "5–6 weeks" },
      { id: "sk-gd-lang", name: "C# or C++", level: "must", description: "Engine scripting language.", why: "Required to implement gameplay.", difficulty: "Intermediate", estTime: "4 weeks" },
      { id: "sk-gd-math", name: "Game math", level: "must", description: "Vectors, matrices, transforms.", why: "Movement and physics depend on it.", difficulty: "Intermediate", estTime: "2 weeks" },
      { id: "sk-gd-ai", name: "Game AI", level: "good", description: "Pathfinding and behavior.", why: "Brings worlds to life.", difficulty: "Intermediate", estTime: "2 weeks" },
    ],
    courses: [
      { title: "Unity Learn", provider: "Unity", type: "Free", duration: "Self-paced", difficulty: "Beginner", why: "Official guided projects." },
      { title: "GDQuest (Godot)", provider: "GDQuest", type: "YouTube", duration: "Self-paced", difficulty: "Beginner", why: "Great free open-source-engine path." },
      { title: "Catlike Coding (Unity)", provider: "Catlike Coding", type: "Free", duration: "Self-paced", difficulty: "Intermediate", why: "Deep Unity tutorials." },
    ],
    projects: [
      { id: "p-gd-1", title: "2D platformer", level: "Beginner", description: "Movement, jumping, collectibles.", skills: ["Engine", "Game loop"], tech: ["Unity / Godot"], duration: "1–2 weeks", portfolioValue: "Medium" },
      { id: "p-gd-2", title: "Top-down shooter", level: "Intermediate", description: "Enemies, AI, score, juice.", skills: ["Game AI", "Animation"], tech: ["Unity"], duration: "2–3 weeks", portfolioValue: "High" },
      { id: "p-gd-3", title: "Polished, published game", level: "Advanced", description: "A small complete game shipped to itch.io.", skills: ["Performance", "Publishing"], tech: ["Unity / Unreal"], duration: "4–6 weeks", portfolioValue: "High" },
    ],
  },
];

// ── Lookups ────────────────────────────────────────────────────────────────
export const getRole = (id: string): Role | undefined => ROLES.find((r) => r.id === id);

// All trackable content ids for a role (used to compute overall progress).
export function roleContentIds(role: Role): string[] {
  const ids: string[] = [];
  for (const s of role.stages) for (const t of s.topics) ids.push(`topic:${t.id}`);
  for (const sk of role.skills) ids.push(`skill:${sk.id}`);
  for (const p of role.projects) ids.push(`project:${p.id}`);
  if (role.requiresDSA) for (const c of DSA_CATEGORIES) for (const q of c.questions) ids.push(`dsa:${q.id}`);
  if (role.requiresCS) for (const a of CS_AREAS) for (const t of a.topics) ids.push(`cs:${t.id}`);
  return ids;
}
