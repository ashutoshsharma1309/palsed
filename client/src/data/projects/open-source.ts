import type { ProjectDomain } from "./types";

export const openSource: ProjectDomain = {
  id: "open-source",
  title: "Open Source",
  icon: "GitFork",
  accent: "peach",
  blurb: "Contribute to real codebases, build in public, and let merged PRs speak louder than any side project.",
  overview:
    "Open-source contributions are one of the most credible signals you can put in front of an Indian placement recruiter or a FAANG hiring manager. A merged PR to a well-known repository proves you can read unfamiliar code, communicate asynchronously with senior engineers, write production-quality commits, and navigate a real review cycle — none of which a solo side project demonstrates. Programs like Google Summer of Code (GSoC) and Outreachy are explicitly tracked by top Indian product companies and carry outsized weight on a resume.\n\nThe path is more approachable than it looks. You start with documentation typos and good-first-issues to learn the workflow (fork → branch → commit → PR → respond to review), then move to bug fixes and feature additions in codebases you already use, and finally graduate to maintaining your own library — complete with README, license, CI, semantic versioning, and real users. Every step is a compounding portfolio asset: your GitHub contribution graph fills up, your reviewer network grows, and each merged PR is a permanent, publicly verifiable achievement that no interviewer can dispute.",
  skillsRequired: [
    "Git fundamentals: clone, branch, commit, merge, rebase, stash",
    "GitHub workflow: fork, pull request, code review, issue tracker",
    "Reading and navigating an unfamiliar codebase",
    "Clear written English for PR descriptions and issue comments",
    "Basic command line and package manager usage (npm / pip / cargo / go mod)",
    "Understanding of at least one programming language well enough to write tests",
  ],
  learningOrder: [
    "Master Git internals: branching model, rebasing vs merging, cherry-pick, bisect, reflog",
    "Learn the GitHub collaboration model: forks, upstream remotes, squash vs merge, protected branches",
    "Find your first repository using curated lists (awesome-for-beginners, good-first-issue.com)",
    "Make your first 3–5 documentation or typo contributions following the full fork→branch→PR cycle",
    "Graduate to bug-fix good-first-issues: reproduce the bug, write a failing test, fix it, update docs",
    "Make a meaningful feature contribution to a mid-size project: read the CONTRIBUTING guide, discuss in an issue before coding, write tests, keep the PR focused",
    "Build and publish your own open-source library or CLI tool: add a LICENSE, CONTRIBUTING.md, GitHub Actions CI, semantic versioning, and a clear README with usage examples",
    "Grow your project: triage issues, review others’ PRs, publish to npm/PyPI, write a blog post, and optionally apply to GSoC or Outreachy",
  ],
  difficulty: "Beginner-friendly → Advanced",
  techStack: [
    "Git",
    "GitHub (Actions, Issues, Projects, Discussions)",
    "Language of choice (JavaScript / TypeScript, Python, Go, Rust, Java)",
    "CI/CD (GitHub Actions)",
    "Package registries (npm, PyPI, crates.io)",
    "Markdown + MkDocs / Docusaurus (project documentation)",
    "Semantic Release / Changesets (versioning)",
  ],
  githubResources: [
    {
      label: "first-contributions — practice the fork→PR flow safely",
      url: "https://github.com/firstcontributions/first-contributions",
      kind: "repo",
    },
    {
      label: "MunGell/awesome-for-beginners — curated beginner-friendly repos",
      url: "https://github.com/MunGell/awesome-for-beginners",
      kind: "repo",
    },
    {
      label: "EddieHubCommunity/good-first-issue-finder",
      url: "https://github.com/EddieHubCommunity/good-first-issue-finder",
      kind: "repo",
    },
    {
      label: "nicedoc.io — beautiful README generator",
      url: "https://github.com/nicedoc/nicedoc.io",
      kind: "tool",
    },
    {
      label: "semantic-release — automated versioning and changelog",
      url: "https://github.com/semantic-release/semantic-release",
      kind: "tool",
    },
  ],
  learningResources: [
    {
      label: "opensource.guide — the canonical guide to contributing and maintaining",
      url: "https://opensource.guide/",
      kind: "article",
    },
    {
      label: "GitHub Skills — hands-on interactive Git and GitHub courses",
      url: "https://skills.github.com/",
      kind: "course",
    },
    {
      label: "roadmap.sh — Git & GitHub guide with visual roadmap",
      url: "https://roadmap.sh/git-github",
      kind: "roadmap",
    },
    {
      label: "How to Contribute to Open Source (freeCodeCamp)",
      url: "https://github.com/freeCodeCamp/how-to-contribute-to-open-source",
      kind: "article",
    },
    {
      label: "Pro Git Book — free, comprehensive, covers internals",
      url: "https://git-scm.com/book/en/v2",
      kind: "docs",
    },
  ],
  portfolioTips: [
    "Pin your top merged PR and your own maintained repository on your GitHub profile — these are the first things a recruiter clicks.",
    "Keep a ‘Contributions’ section in your portfolio site listing the project name, what you fixed/added, and a link to the merged PR.",
    "A green contribution graph matters: consistent daily activity signals sustained interest, not just burst effort before placement season.",
    "For your own OSS project, add a badge row (build status, npm version, license, downloads) to the README — it signals professionalism immediately.",
    "Write a short blog post or LinkedIn post about a non-trivial contribution — it shows communication skills and often drives stars to your repo.",
  ],
  resumeTips: [
    "Quantify every line: ‘Merged 7 PRs to freeCodeCamp (120k+ stars) fixing TypeScript type errors across 12 files’ beats ‘contributed to open source’.",
    "For your own library: lead with adoption — ‘Published npm package with 800+ weekly downloads and 140 GitHub stars’.",
    "Call out review quality: ‘Passed code review with senior maintainer in 2 rounds, zero blocking comments on merge’.",
    "GSoC or Outreachy: list it the same way as an internship — org name, project title, dates, and the impact of what you shipped.",
    "Name the stack of the project you contributed to, not just ‘Git’ — e.g., ‘contributed to Vite (TypeScript, Rollup)’ tells more.",
  ],
  interviewRelevance:
    "Open-source experience pays dividends across every interview round. In **HR/culture rounds**, it demonstrates initiative, self-direction, and the ability to work with a global distributed team — qualities Indian product companies (Atlassian, Razorpay, Zepto, Swiggy) explicitly look for. In **technical rounds**, having reviewed a real codebase gives you concrete answers to ‘How do you approach an unfamiliar codebase?’ and ‘Describe a time you collaborated on a technical decision.’\n\n**GSoC** is a particularly strong signal in the Indian placement market: IIT/NIT placement coordinators often shortlist GSoC alumni for the first interview round at product companies. Even a selected-but-not-completed proposal is worth mentioning.\n\nFor **system design**, maintaining your own library forces you to think about API design, backward compatibility, semantic versioning, and CI — all direct interview topics. Expect questions like ‘How would you handle a breaking change in a public API?’ or ‘How did you test this?’ — your OSS repo gives you a real, verifiable answer.",
  projects: [
    {
      id: "first-merged-prs",
      name: "First 3–5 Merged Pull Requests",
      level: "Beginner",
      blurb: "Learn the fork→branch→PR loop by fixing docs, typos, and good-first-issues in real repos.",
      estimatedTime: "1–2 weekends",
      objective:
        "Execute the complete open-source contribution workflow end-to-end — fork a repository, create a feature branch, make a focused change, write a clear PR description, respond to reviewer feedback, and get the PR merged — at least 3 times across different repositories. This milestone is about mastering the process, not the complexity of the change. Even a one-line doc fix demonstrates Git hygiene, reading comprehension, and asynchronous collaboration to a recruiter.",
      features: [
        "Fork at least 2 different repositories and keep them in sync with upstream using git fetch + rebase",
        "Fix at least one documentation error (typo, broken link, outdated example) with a clear commit message",
        "Resolve at least one labeled good-first-issue that involves a code change (even a small one)",
        "Write a PR description that includes: what changed, why, how to test, and references the issue",
        "Respond constructively to at least one round of reviewer feedback and push an updated commit",
        "Ensure all 3–5 PRs are fully merged (not just opened) before calling this milestone complete",
      ],
      folderStructure: `# No app folder to ship — the ‘structure’ here is your Git workflow.
# After your PRs are merged, keep a log like this in a personal notes repo:

contributions/
├── README.md                  # table of PRs: repo, issue, PR link, status
├── pr-01-freeCodeCamp/
│   ├── notes.md               # what you changed and what reviewer said
│   └── diff.patch             # optional: saved with git diff
├── pr-02-awesome-python/
│   └── notes.md
└── pr-03-good-first-issue/
    └── notes.md`,
      technologies: [
        "Git (fork, branch, rebase, cherry-pick)",
        "GitHub (Issues, Pull Requests, Reviews)",
        "Markdown",
        "Language of the target repo (JavaScript, Python, etc.)",
      ],
      skills: [
        "Fork-and-sync workflow (git remote add upstream, git fetch, git rebase)",
        "Writing atomic, well-scoped commits with conventional commit messages",
        "Reading and following CONTRIBUTING.md and code style guides",
        "Writing a clear PR description (what / why / how-to-test)",
        "Responding to code review professionally and iterating quickly",
      ],
      stretchGoals: [
        "Get a PR merged into a repository with 5,000+ GitHub stars",
        "Contribute to a repository where you are a user of the actual product (dog-fooding)",
        "Add yourself to the Contributors section of first-contributions to practice the exact workflow",
      ],
      futureImprovements: [
        "Set up a GitHub profile README that lists your merged PRs with badges",
        "Subscribe to the repositories you contributed to and triage a new incoming issue",
        "Write a short LinkedIn post sharing what you learned from the code review process",
      ],
    },
    {
      id: "meaningful-feature-contribution",
      name: "Meaningful Feature or Bug-Fix Contribution",
      level: "Intermediate",
      blurb: "Ship a real, tested, well-reviewed feature or non-trivial bug fix to an active mid-size project.",
      estimatedTime: "2–3 weeks",
      objective:
        "Go beyond documentation and make a substantive code contribution to a real open-source project — a bug fix with a regression test or a small but complete feature addition. The goal is to navigate a realistic review cycle: discuss the approach in the issue before writing code, follow the project’s testing conventions, keep the PR focused and rebased cleanly on main, and survive 2–3 rounds of review from a maintainer you have never met. This is the contribution worth highlighting in interviews because it shows you can work in someone else’s codebase under real constraints.",
      features: [
        "Identify a bug or feature request via the issue tracker and comment to claim it before starting",
        "Read the project’s CONTRIBUTING.md, set up the local dev environment from scratch, and run the existing test suite",
        "Reproduce the bug with a failing test (or write a test for the new feature’s expected behavior) before touching production code",
        "Implement the fix/feature with minimal diff — no unrelated refactors in the same PR",
        "Update or add documentation (docstring, README section, or changelog entry) as part of the same PR",
        "Keep the branch rebased on main throughout the review cycle; resolve all merge conflicts without breaking tests",
      ],
      folderStructure: `# The repo you contribute to will have its own structure.
# Below is a reference for what a healthy mid-size OSS project looks like
# so you know what to expect when you clone it:

target-project/
├── .github/
│   ├── ISSUE_TEMPLATE/
│   ├── PULL_REQUEST_TEMPLATE.md
│   └── workflows/
│       ├── ci.yml             # lint + test on every PR
│       └── release.yml
├── src/
│   ├── core/
│   └── utils/
├── tests/
│   ├── unit/
│   └── integration/
├── docs/
├── CHANGELOG.md
├── CONTRIBUTING.md
├── LICENSE
└── README.md`,
      technologies: [
        "Git (rebase, interactive rebase, squash, fixup commits)",
        "GitHub Actions (reading CI output, understanding why a check fails)",
        "Testing framework of the project (Jest, pytest, Go test, RSpec, etc.)",
        "Language of the target repository",
        "Linters and formatters used by the project (ESLint, Prettier, Black, rustfmt)",
      ],
      skills: [
        "Reading and understanding an unfamiliar production codebase",
        "Test-driven debugging: write the failing test first",
        "Clean, focused PR hygiene — one concern per PR, no scope creep",
        "Navigating a multi-round code review and incorporating feedback gracefully",
        "Rebasing on a fast-moving main branch without introducing regressions",
      ],
      stretchGoals: [
        "Get your contribution featured in the project’s release notes or CHANGELOG",
        "Follow up the merged PR by helping a newer contributor solve the same environment setup issues you faced",
        "Write a blog post or gist explaining the bug, your investigation process, and the fix — link it in the issue thread",
      ],
      futureImprovements: [
        "Become a regular contributor (3+ merged PRs) to the same project and ask about joining the maintainer team",
        "Add the contribution to your resume with a link and quantify the impact (e.g., ‘fixed crash affecting 12% of users on Node 20’)",
        "Use the experience to prepare a concrete answer to ‘Tell me about a time you worked in an existing codebase’ for behavioral interviews",
      ],
    },
    {
      id: "own-oss-library",
      name: "Build, Document, and Maintain Your Own OSS Library",
      level: "Advanced",
      blurb: "Ship a real, installable library or CLI tool with CI, tests, docs, and a growing user base.",
      estimatedTime: "4–6 weeks to v1.0, then ongoing",
      objective:
        "Design, build, publish, and actively maintain an open-source library or CLI tool that solves a real problem you or your peers have. This is the highest-signal OSS achievement for Indian placements: it proves product thinking (you identified a gap), engineering depth (you built something others can depend on), and sustained ownership (you didn’t abandon it after shipping). A library with 100+ GitHub stars, published on npm or PyPI, with green CI and a changelog, is a tier-1 resume item. Optionally, scope the project to align with a GSoC organization’s wishlist and use this as your proposal prototype.",
      features: [
        "Identify a narrow, well-scoped problem (a utility, a CLI tool, a React hook library, a Python helper) — solve one thing excellently",
        "Structure the repo from day one with: README (with usage examples), LICENSE (MIT or Apache-2.0), CONTRIBUTING.md, and a CODE_OF_CONDUCT.md",
        "Write a comprehensive test suite (unit + at least one integration test) targeting 80%+ coverage",
        "Set up GitHub Actions CI that runs lint and tests on every push and PR from external contributors",
        "Publish to the appropriate registry (npm, PyPI, crates.io, pkg.go.dev) with a proper package.json / pyproject.toml / Cargo.toml",
        "Set up semantic versioning with Changesets or semantic-release so every release produces a changelog entry automatically",
        "Actively triage issues, respond to PRs within 48 hours, and tag releases with clear release notes",
      ],
      folderStructure: `my-oss-library/
├── .github/
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.yml
│   │   └── feature_request.yml
│   ├── PULL_REQUEST_TEMPLATE.md
│   └── workflows/
│       ├── ci.yml             # lint + test on push/PR
│       └── release.yml        # publish to registry on tag
├── src/
│   ├── index.ts           # public API surface
│   ├── core/
│   └── utils/
├── tests/
│   ├── unit/
│   └── integration/
├── docs/                  # MkDocs or Docusaurus site (optional)
│   └── getting-started.md
├── examples/              # runnable usage examples
├── CHANGELOG.md           # auto-generated by semantic-release
├── CONTRIBUTING.md
├── CODE_OF_CONDUCT.md
├── LICENSE
├── README.md              # badges, install, usage, API, contributing
└── package.json           # (or pyproject.toml / Cargo.toml)`,
      technologies: [
        "Git (tags, signed commits, release branches)",
        "GitHub Actions (CI pipeline, automated npm/PyPI publish on tag)",
        "Language of choice at production quality (TypeScript with strict mode, Python with type hints)",
        "Testing framework (Vitest / pytest / cargo test)",
        "Semantic Release or Changesets for automated versioning",
        "npm / PyPI / crates.io (registry publishing)",
        "Docusaurus or MkDocs (optional documentation site)",
      ],
      skills: [
        "API design for a public, versioned, dependency-safe library",
        "Semantic versioning and backward-compatibility discipline",
        "Writing documentation that lets a stranger use your library in under 5 minutes",
        "CI/CD for automated testing and registry publishing",
        "Issue triage, contributor onboarding, and community management",
        "Thinking about security, trust, and supply-chain risks in a published package",
      ],
      stretchGoals: [
        "Reach 100+ GitHub stars and 500+ weekly downloads, then add the metrics to your resume",
        "Apply to Google Summer of Code with this project as proof of your ability to scope and execute OSS work",
        "Get your library listed in an awesome-* list relevant to your domain (e.g., awesome-python, awesome-react)",
      ],
      futureImprovements: [
        "Add a documentation website (Docusaurus) with versioned docs so contributors can understand API changes across releases",
        "Implement a plugin system so the community can extend functionality without forking",
        "Write a detailed post-mortem or architecture blog post explaining key design decisions — this becomes a portfolio artifact and demonstrates engineering maturity",
      ],
    },
  ],
};
