import type { ProjectDomain } from "./types";

export const webDevelopment: ProjectDomain = {
  id: "web-development",
  title: "Web Development",
  icon: "Globe",
  accent: "blue",
  blurb: "Ship full-stack web apps — the most hireable, most visible portfolio.",
  overview:
    "Web development is the highest-leverage domain for a placement portfolio: recruiters can *open your project in a browser* and judge it in 30 seconds, and almost every product company hires web engineers. You'll move from static, well-built UIs to dynamic, data-backed apps with auth, databases, and deployment.\n\nThe goal isn't to learn every framework — it's to ship 2–3 polished, deployed apps that prove you can take a feature from idea to production. One excellent deployed app beats ten half-finished tutorials.",
  skillsRequired: [
    "HTML & CSS fundamentals (box model, flexbox, grid)",
    "JavaScript basics (functions, arrays, objects, async/await, fetch)",
    "Comfort with Git & GitHub",
    "Basic command line usage",
  ],
  learningOrder: [
    "HTML + semantic markup, then CSS layout (flexbox & grid) and responsive design",
    "Modern JavaScript (ES6+): array methods, promises, async/await, modules, DOM",
    "A component framework — React (most in-demand) — props, state, hooks, lists",
    "Client-side routing + calling REST APIs with fetch; loading/error states",
    "A backend: Node.js + Express, REST API design, validation, middleware",
    "A database: start with PostgreSQL (SQL) or MongoDB; CRUD + relations",
    "Authentication & sessions/JWT, environment variables, security basics",
    "Deployment (Vercel/Netlify for frontend, Render/Railway for backend) + CI",
  ],
  difficulty: "Beginner-friendly → Advanced",
  techStack: [
    "HTML5 / CSS3 / Tailwind CSS",
    "JavaScript / TypeScript",
    "React (+ Vite)",
    "Node.js / Express",
    "PostgreSQL / MongoDB / Prisma",
    "REST / WebSockets",
    "Vercel / Render / Docker",
  ],
  githubResources: [
    { label: "freeCodeCamp", url: "https://github.com/freeCodeCamp/freeCodeCamp", kind: "repo" },
    { label: "Awesome React", url: "https://github.com/enaqx/awesome-react", kind: "repo" },
    { label: "build-your-own-x (web projects)", url: "https://github.com/codecrafters-io/build-your-own-x", kind: "repo" },
    { label: "RealWorld example apps", url: "https://github.com/gothinkster/realworld", kind: "repo" },
    { label: "Public APIs (project ideas)", url: "https://github.com/public-apis/public-apis", kind: "repo" },
  ],
  learningResources: [
    { label: "MDN Web Docs", url: "https://developer.mozilla.org/", kind: "docs" },
    { label: "react.dev — official React docs", url: "https://react.dev/learn", kind: "docs" },
    { label: "The Odin Project (full-stack path)", url: "https://www.theodinproject.com/", kind: "course" },
    { label: "JavaScript.info", url: "https://javascript.info/", kind: "article" },
    { label: "roadmap.sh — Frontend & Backend", url: "https://roadmap.sh/frontend", kind: "roadmap" },
  ],
  portfolioTips: [
    "Deploy every project with a live URL — an unreachable repo barely counts.",
    "Add a clean README: screenshot/GIF at top, live link, tech stack, run steps, and the problem it solves.",
    "Use a real domain or a clean *.vercel.app name; remove default boilerplate and 'Lorem ipsum'.",
    "Seed the app with realistic demo data so reviewers see it working without signing up.",
    "Make it responsive — reviewers often open it on a phone.",
  ],
  resumeTips: [
    "Lead with impact and scale: 'Built and deployed a full-stack X serving N features / handling Y'.",
    "Name the stack explicitly (React, Node, PostgreSQL) — recruiters keyword-match.",
    "Quantify: Lighthouse score, load time, number of users/records, test coverage.",
    "Link the live demo + repo directly in the bullet; don't make them search.",
  ],
  interviewRelevance:
    "Web projects are interview gold: they let you discuss **REST API design, state management, authentication, database schema, and rendering/performance trade-offs** with something you actually built. Expect questions on how you structured components, handled async errors, secured endpoints, and what you'd change to scale. Deployed projects also naturally lead into **system design** discussions (caching, CDNs, DB indexing).",
  projects: [
    {
      id: "responsive-portfolio",
      name: "Responsive Personal Portfolio",
      level: "Beginner",
      blurb: "A fast, accessible personal site — your home base on the internet.",
      estimatedTime: "1 weekend",
      objective:
        "Build a polished, fully responsive personal portfolio that showcases your projects, skills, and contact info. This is the project every recruiter sees first, so it must be fast, accessible, and bug-free. It proves you can write clean semantic HTML/CSS and care about UX detail.",
      features: [
        "Hero section with a clear one-line value proposition",
        "Projects grid with screenshots, tech tags, and live/repo links",
        "About + skills section",
        "Contact form (using a service like Formspree) or mailto",
        "Dark/light mode toggle",
        "Fully responsive (mobile, tablet, desktop) and keyboard-accessible",
      ],
      folderStructure: `portfolio/
├── index.html
├── styles/
│   ├── main.css
│   └── variables.css
├── scripts/
│   └── main.js          # theme toggle, mobile nav
├── assets/
│   ├── images/
│   └── resume.pdf
└── README.md`,
      technologies: ["HTML5", "CSS3 (or Tailwind)", "Vanilla JS", "Vercel/Netlify"],
      skills: ["Semantic HTML", "Responsive CSS (flexbox/grid)", "Accessibility basics", "Deployment"],
      stretchGoals: [
        "Add subtle scroll animations (Intersection Observer or Framer Motion)",
        "Pull project cards dynamically from the GitHub API",
        "Achieve a 95+ Lighthouse score across all categories",
      ],
      futureImprovements: [
        "Add a blog section powered by Markdown",
        "Internationalize (i18n) for multiple languages",
        "Add analytics to see which projects get clicks",
      ],
    },
    {
      id: "fullstack-task-manager",
      name: "Full-Stack Task Manager",
      level: "Intermediate",
      blurb: "A CRUD app with auth, a database, and a deployed API — the canonical full-stack proof.",
      estimatedTime: "1–2 weeks",
      objective:
        "Build a multi-user task manager (think a mini Trello/Todoist) with user accounts, a REST API, and a real database. This is the single best 'I can do full-stack' project: it covers auth, CRUD, relational data, protected routes, and deployment of both a frontend and a backend.",
      features: [
        "Email/password signup & login with hashed passwords + JWT sessions",
        "Create, read, update, delete tasks scoped to the logged-in user",
        "Task lists/boards, due dates, priority, and completed state",
        "Filtering & search; optimistic UI updates",
        "Protected API routes (a user can only see their own data)",
        "Frontend deployed (Vercel) + backend & DB deployed (Render/Railway)",
      ],
      folderStructure: `task-manager/
├── client/                 # React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── lib/api.ts       # fetch wrapper w/ auth header
│   │   └── App.tsx
│   └── package.json
├── server/                 # Express backend
│   ├── src/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── middleware/auth.ts
│   │   ├── models/         # Prisma schema / queries
│   │   └── index.ts
│   ├── prisma/schema.prisma
│   └── package.json
└── README.md`,
      technologies: ["React", "TypeScript", "Express", "PostgreSQL + Prisma", "JWT", "Zod (validation)"],
      skills: ["REST API design", "Authentication & authorization", "Relational data modeling", "Protected routes", "Full deployment"],
      stretchGoals: [
        "Add drag-and-drop reordering (dnd-kit)",
        "Real-time sync across tabs/devices with WebSockets",
        "Role-based shared boards (invite collaborators)",
      ],
      futureImprovements: [
        "Add rate limiting and refresh-token rotation",
        "Write integration tests for the API (Vitest/Supertest)",
        "Add a CI pipeline that runs tests on every PR",
      ],
    },
    {
      id: "realtime-collab-app",
      name: "Real-Time Collaborative App",
      level: "Advanced",
      blurb: "A live multiplayer editor/whiteboard with WebSockets and conflict handling.",
      estimatedTime: "3–4 weeks",
      objective:
        "Build a real-time collaborative tool — a shared whiteboard, code editor, or document — where multiple users see each other's changes instantly. This demonstrates advanced skills recruiters love: WebSocket architecture, state synchronization, presence, and conflict resolution. It's a strong system-design talking point.",
      features: [
        "Rooms users can join via a shareable link",
        "Live cursors / presence (see who else is online)",
        "Instant sync of edits across all connected clients via WebSockets",
        "Conflict handling (last-write-wins or CRDT-based merge)",
        "Persistence so a room's state survives reconnects",
        "Auth + per-room access control",
      ],
      folderStructure: `collab-app/
├── client/
│   ├── src/
│   │   ├── canvas/          # rendering layer
│   │   ├── realtime/        # socket client, presence
│   │   ├── state/           # shared doc state (e.g. Yjs)
│   │   └── App.tsx
├── server/
│   ├── src/
│   │   ├── ws/              # socket.io / ws handlers
│   │   ├── rooms/           # room lifecycle + persistence
│   │   ├── redis/           # pub/sub for horizontal scaling
│   │   └── index.ts
└── README.md`,
      technologies: ["React", "Socket.IO / ws", "Yjs (CRDT)", "Redis (pub/sub)", "Node.js", "PostgreSQL"],
      skills: ["WebSocket architecture", "State synchronization & CRDTs", "Presence systems", "Horizontal scaling with pub/sub", "Performance under concurrency"],
      stretchGoals: [
        "Scale to multiple server instances using Redis pub/sub",
        "Add offline support with local-first sync on reconnect",
        "Record and replay a session's edit history",
      ],
      futureImprovements: [
        "Add end-to-end encryption for room contents",
        "Load-test with k6 and document the concurrency ceiling",
        "Add observability (latency metrics, dropped-message tracking)",
      ],
    },
  ],
};
