// Deterministic rule-based resume scorer. NO API. NO billing risk.
//
// Inspired by real ATS heuristics + what FAANG recruiters complain about most
// in Indian campus resumes. Generates an 0-100 score, issue list with severity,
// before/after bullet rewrites (template-based), strengths, and ATS keywords.
//
// Runs entirely in the browser. Same shape as the old Groq response so the UI
// doesn't change.

export type Severity = "blocker" | "major" | "minor";

export interface ScoredIssue {
  severity: Severity;
  title: string;
  detail: string;
  fix: string;
}

export interface BulletRewrite {
  before: string;
  after: string;
}

export interface ResumeScore {
  overallScore: number;
  headline: string;
  strengths: string[];
  issues: ScoredIssue[];
  rewrites: BulletRewrite[];
  skillsToHighlight: string[];
  atsKeywords: string[];
}

// ─── ATS keyword library, by target company name ──────────────────────────
// Conservative; expand over time. Fallback "Generic" is used when targetCompany
// isn't in the map.
const ATS_KEYWORDS: Record<string, string[]> = {
  Google: ["Distributed Systems", "Bigtable", "Protocol Buffers", "Spanner", "TypeScript", "Go", "MapReduce", "Borg", "OOP", "DSA"],
  Microsoft: ["C#", "Azure", ".NET", "TypeScript", "Distributed Systems", "OOP", "SQL Server", "Power BI", "REST APIs", "Agile"],
  Amazon: ["AWS", "DynamoDB", "S3", "Lambda", "Distributed Systems", "Leadership Principles", "OOP", "Java", "TypeScript", "REST"],
  Razorpay: ["Node.js", "TypeScript", "Postgres", "Redis", "Payments", "PCI", "REST APIs", "Microservices", "AWS", "Kubernetes"],
  Stripe: ["Ruby", "Go", "Distributed Systems", "Postgres", "API Design", "Payments", "TypeScript", "Kafka", "Latency", "Idempotency"],
  Atlassian: ["Java", "Spring", "REST APIs", "Postgres", "Distributed Systems", "Agile", "Kubernetes", "TypeScript", "React", "Confluence"],
  Adobe: ["C++", "Java", "JavaScript", "Photoshop SDK", "Cloud", "REST APIs", "Distributed Systems", "Computer Graphics", "OOP", "Agile"],
  Flipkart: ["Java", "Spring", "Postgres", "Kafka", "Microservices", "AWS", "DSA", "Distributed Systems", "REST APIs", "Scaling"],
  Swiggy: ["Java", "Go", "Kafka", "Postgres", "Microservices", "AWS", "Distributed Systems", "REST APIs", "ML", "Logistics"],
  Zomato: ["Node.js", "TypeScript", "Postgres", "Kafka", "Microservices", "AWS", "REST APIs", "Distributed Systems", "ML", "React Native"],
  TCS: ["Java", "Spring", "SQL", "REST APIs", "Agile", "OOP", "DSA", "Cloud", "DevOps", "Networking"],
  Infosys: ["Java", "Spring", "SQL", "REST APIs", "Agile", "OOP", "DSA", "Cloud", "Banking Domain", "Microservices"],
  Wipro: ["Java", "Spring", "SQL", "REST APIs", "Agile", "OOP", "DSA", "Cloud", "DevOps", "Banking Domain"],
  Goldman: ["Java", "Python", "Distributed Systems", "Low Latency", "SQL", "Risk", "Algorithms", "FIX Protocol", "Concurrency", "Quant"],
  Generic: ["DSA", "OOP", "REST APIs", "Distributed Systems", "Git", "CI/CD", "Docker", "Postgres", "TypeScript", "AWS"],
};

// Strong action verbs that signal impact. Used as "what's working" detection.
const STRONG_VERBS = [
  "built", "shipped", "designed", "led", "owned", "architected", "implemented",
  "optimized", "reduced", "improved", "scaled", "deployed", "launched", "engineered",
  "developed", "authored", "automated", "increased", "decreased", "migrated", "refactored"
];

// Weak phrases that recruiters flag — vague, no impact, no scope.
const WEAK_PATTERNS = [
  /\bworked on\b/i,
  /\bresponsible for\b/i,
  /\bhelped (?:to |with )?\b/i,
  /\bassisted (?:to |with )?\b/i,
  /\bparticipated in\b/i,
  /\binvolved in\b/i,
  /\b(?:used|using) (?:html|css|java|python|javascript)\b/i,
];

// Common "buzzword stack list" — present but flagged if NO metrics nearby.
const TECH_TOKENS = [
  "react", "node", "next", "typescript", "javascript", "python", "java", "c\\+\\+",
  "django", "flask", "spring", "express", "postgres", "mysql", "mongodb", "redis",
  "aws", "gcp", "azure", "docker", "kubernetes", "git", "rest", "graphql"
];

// ─── helpers ──────────────────────────────────────────────────────────────
const has = (re: RegExp, text: string) => re.test(text);
const lc = (s: string) => s.toLowerCase();
const lines = (s: string) => s.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
const wordCount = (s: string) => (s.match(/\S+/g) || []).length;

function getMetrics(text: string): { count: number; matched: string[] } {
  const matched = text.match(/\b\d+(?:[.,]\d+)?\s*(?:%|x|×|k\b|m\b|users?|ms\b|s\b|hrs?\b|days?\b|qps\b|rps\b|tps\b|requests?\/(?:s|min|day)|crore|lakh)/gi) || [];
  return { count: matched.length, matched: matched.slice(0, 8) };
}

function getStrongVerbCount(text: string): { count: number; matched: string[] } {
  const re = new RegExp(`\\b(${STRONG_VERBS.join("|")})\\b`, "gi");
  const matched = text.match(re) || [];
  return { count: matched.length, matched: matched.slice(0, 6) };
}

function findWeakBullets(text: string): string[] {
  const ls = lines(text);
  return ls.filter((l) => l.length > 25 && WEAK_PATTERNS.some((re) => re.test(l))).slice(0, 5);
}

function findShortBullets(text: string): string[] {
  // Bullets that look like a project mention but have < 8 words → likely "just a list of names"
  const ls = lines(text);
  return ls
    .filter((l) => /^[•\-*●▪▫]/.test(l))
    .filter((l) => wordCount(l) < 8)
    .slice(0, 5);
}

function rewriteWeakBullet(orig: string): string {
  // Template-based rewrite using STAR-ish format with placeholders.
  // We strip the leading bullet marker and lift the rest.
  const stripped = orig.replace(/^[•\-*●▪▫]\s*/, "").trim();
  const cleaned = stripped.replace(WEAK_PATTERNS[0], "Built").replace(WEAK_PATTERNS[1], "Owned");
  // Bolt on a metric + outcome scaffold
  return `${cleaned} — handling [X] users/day with p99 < [Y]ms; reduced [metric] by [Z]%.`;
}

// ─── the scorer ───────────────────────────────────────────────────────────
export function scoreResume(rawResume: string, targetCompany?: string): ResumeScore {
  const resume = rawResume.trim();
  const lower = lc(resume);
  const wc = wordCount(resume);
  const metrics = getMetrics(resume);
  const strongVerbs = getStrongVerbCount(resume);
  const weakBullets = findWeakBullets(resume);
  const shortBullets = findShortBullets(resume);

  const issues: ScoredIssue[] = [];
  const strengths: string[] = [];
  const rewrites: BulletRewrite[] = [];

  // ─── HARD MISSING ITEMS ─────────────────────────────────────────────────
  if (wc < 150) {
    issues.push({
      severity: "blocker",
      title: "Resume is too thin",
      detail: `Only ${wc} words. A campus-placement resume should be 350-650 words across projects, internships, skills, education.`,
      fix: "Add 2-3 substantial project bullets with metrics + tech stack.",
    });
  } else if (wc > 1000) {
    issues.push({
      severity: "minor",
      title: "Resume is over-stuffed",
      detail: `${wc} words. Recruiters scan for 6 seconds — they won't read paragraph 4.`,
      fix: "Cut to 1 page. Drop courses, generic 'familiar with' bullets, and >5-year-old projects.",
    });
  } else {
    strengths.push(`Word count (${wc}) is in the right range for a 1-page campus resume.`);
  }

  // CGPA mention
  if (!/(cgpa|gpa|sgpa)\s*[:\-=]?\s*\d/i.test(resume)) {
    issues.push({
      severity: "major",
      title: "No CGPA visible",
      detail: "Indian campus recruiters expect to see CGPA in the Education section. Missing it raises a yellow flag — looks like you're hiding a low score.",
      fix: "Add 'CGPA: X.YY / 10.0' on your education line. If it's truly bad, add a positive 'major GPA: X.YY' instead.",
    });
  } else {
    strengths.push("CGPA is explicitly stated — recruiters can pre-filter you fast.");
  }

  // GitHub link
  if (!/(github\.com|gitlab\.com|bitbucket)/i.test(resume)) {
    issues.push({
      severity: "major",
      title: "No GitHub link",
      detail: "For an SDE role, no GitHub link is a credibility hit. Recruiters assume you have nothing to show.",
      fix: "Add 'github.com/yourhandle' under your name. Pin 3 projects with proper READMEs.",
    });
  } else {
    strengths.push("GitHub link is present — instant credibility boost.");
  }

  // LinkedIn link
  if (!/linkedin\.com/i.test(resume)) {
    issues.push({
      severity: "minor",
      title: "No LinkedIn link",
      detail: "LinkedIn is the first thing a recruiter clicks. Missing it hurts inbound interest.",
      fix: "Add 'linkedin.com/in/yourhandle' next to your email.",
    });
  }

  // Email
  if (!/[\w.+-]+@[\w-]+\.\w+/.test(resume)) {
    issues.push({
      severity: "blocker",
      title: "No email visible",
      detail: "No email = can't get callbacks.",
      fix: "Add a clear @ email at the top of the header.",
    });
  }

  // Phone
  if (!/(\+91|91)?[\s-]?\d{10}/.test(resume) && !/\(\d{3}\)\s*\d{3}-\d{4}/.test(resume)) {
    issues.push({
      severity: "minor",
      title: "No phone number visible",
      detail: "Some recruiters still cold-call. Missing it loses 10% of callbacks.",
      fix: "Add '+91-XXXXXXXXXX' next to your email.",
    });
  }

  // ─── BULLET QUALITY ─────────────────────────────────────────────────────
  if (metrics.count >= 4) {
    strengths.push(`${metrics.count} quantified outcomes detected (${metrics.matched.slice(0, 3).join(", ")}…). Recruiters love this.`);
  } else if (metrics.count >= 1) {
    issues.push({
      severity: "major",
      title: "Only " + metrics.count + " metric(s) on the whole resume",
      detail: "Without numbers, every bullet reads the same. Recruiters can't distinguish you from 200 other CSE candidates.",
      fix: "Every project bullet should have at least one number — users, latency, % improvement, request volume, dollar value.",
    });
  } else {
    issues.push({
      severity: "blocker",
      title: "Zero quantified outcomes",
      detail: "Not a single number. Every bullet is invisible to a recruiter scanning for impact.",
      fix: "Add at least 5 metrics across your bullets — even estimates like '~500 daily users' or '40% faster' work.",
    });
  }

  if (strongVerbs.count >= 5) {
    strengths.push(`Strong action verbs throughout (${strongVerbs.matched.slice(0, 3).join(", ")}…).`);
  } else if (strongVerbs.count >= 2) {
    issues.push({
      severity: "minor",
      title: "Weak verb mix",
      detail: `Only ${strongVerbs.count} strong action verbs found (built/shipped/led/optimized/etc.)`,
      fix: "Replace 'worked on', 'helped with', 'participated' with built / shipped / led / owned / designed.",
    });
  } else {
    issues.push({
      severity: "major",
      title: "Passive language throughout",
      detail: "Almost no action verbs detected. The resume reads like a job description, not a track record.",
      fix: "Rewrite every bullet with a strong opening verb (built / shipped / designed / optimized / led).",
    });
  }

  if (weakBullets.length > 0) {
    issues.push({
      severity: "major",
      title: `${weakBullets.length} vague bullets ("worked on", "responsible for")`,
      detail: "These phrases signal you didn't actually own the outcome. Recruiters skip past them.",
      fix: "Rewrite each as a STAR statement — situation, task, action, RESULT (quantified).",
    });
    weakBullets.slice(0, 3).forEach((b) => {
      rewrites.push({ before: b, after: rewriteWeakBullet(b) });
    });
  }

  if (shortBullets.length >= 3) {
    issues.push({
      severity: "minor",
      title: `${shortBullets.length} stub bullets (< 8 words each)`,
      detail: "Bullets like 'Stack overflow contributor.' or 'Used React.' add no signal.",
      fix: "Expand or remove. Every bullet needs context + outcome.",
    });
  }

  // Tech buzzwords without context check
  const tokenHits = TECH_TOKENS.filter((t) => new RegExp(`\\b${t}\\b`, "i").test(lower));
  if (tokenHits.length < 4) {
    issues.push({
      severity: "minor",
      title: "Thin tech vocabulary",
      detail: `Only ${tokenHits.length} mainstream tech tokens detected. ATS keyword density is low.`,
      fix: "Name your stack explicitly — React, Node, Postgres, AWS, Docker etc. ATS scans for these.",
    });
  }

  // Project section detection
  if (!/\bprojects?\b/i.test(resume)) {
    issues.push({
      severity: "major",
      title: "No clear 'Projects' section",
      detail: "Recruiters scan for the Projects heading. Without it they assume you've shipped nothing.",
      fix: "Add an explicit 'Projects' or 'Personal Projects' section header.",
    });
  }

  // Skills section
  if (!/(skills|technologies|tech stack)/i.test(resume)) {
    issues.push({
      severity: "minor",
      title: "No 'Skills' section",
      detail: "Recruiters and ATS both expect a dedicated Skills list. Without it, keyword search misses you.",
      fix: "Add a 'Skills' section with Languages, Frameworks, Tools, Databases lines.",
    });
  }

  // Target-company specific
  if (targetCompany && ATS_KEYWORDS[targetCompany]) {
    const missing = ATS_KEYWORDS[targetCompany].filter(
      (k) => !new RegExp(`\\b${k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i").test(resume)
    );
    if (missing.length >= ATS_KEYWORDS[targetCompany].length / 2) {
      issues.push({
        severity: "major",
        title: `Missing ${missing.length} ${targetCompany}-specific keywords`,
        detail: `Including: ${missing.slice(0, 5).join(", ")}. Their ATS likely filters on these.`,
        fix: `Add a 'Targeting ${targetCompany}' tailored skills line or work them into project bullets.`,
      });
    }
  }

  // ─── SCORE COMPUTATION ──────────────────────────────────────────────────
  // Base score 80, deduct for issues
  let score = 80;
  const deductionsBySeverity: Record<Severity, number> = { blocker: 15, major: 7, minor: 2 };
  issues.forEach((i) => (score -= deductionsBySeverity[i.severity]));
  // Reward metrics + strong verbs
  score += Math.min(metrics.count, 8) * 1.5;
  score += Math.min(strongVerbs.count, 8) * 0.8;
  // Reward optimal length
  if (wc >= 300 && wc <= 700) score += 4;
  // Clamp
  score = Math.round(Math.max(0, Math.min(98, score)));

  const headline = generateHeadline(score, issues, targetCompany);
  const atsKeywords = (targetCompany && ATS_KEYWORDS[targetCompany]) || ATS_KEYWORDS.Generic;

  // Top skills to highlight — suggest ones not currently in the resume but
  // expected for SDE roles.
  const skillsToHighlight = ["DSA + Time Complexity", "System Design Basics", "REST API Design", "Postgres / SQL fundamentals", "Git workflow"]
    .filter((s) => !lower.includes(s.toLowerCase().split(" ")[0]))
    .slice(0, 5);

  // Default strengths fallback
  if (strengths.length === 0) {
    strengths.push("Resume parsed cleanly — formatting is recoverable.");
  }

  // Default rewrites fallback — invent some plausible ones from the resume
  if (rewrites.length === 0) {
    rewrites.push({
      before: "Built a web app using React and Node.js",
      after: "Built a React + Node.js platform serving [X] users/day; cut page load from [Y]ms to [Z]ms via code-splitting + edge caching.",
    });
  }

  // Sort issues by severity (blockers first)
  const order: Record<Severity, number> = { blocker: 0, major: 1, minor: 2 };
  issues.sort((a, b) => order[a.severity] - order[b.severity]);

  return {
    overallScore: score,
    headline,
    strengths: strengths.slice(0, 6),
    issues: issues.slice(0, 10),
    rewrites: rewrites.slice(0, 5),
    skillsToHighlight,
    atsKeywords,
  };
}

function generateHeadline(score: number, issues: ScoredIssue[], company?: string): string {
  const blockers = issues.filter((i) => i.severity === "blocker").length;
  const majors = issues.filter((i) => i.severity === "major").length;
  const target = company ? ` for ${company}` : "";
  if (blockers >= 2) return `Has blockers that'll get you auto-rejected${target}. Fix those first.`;
  if (score >= 90) return `Already strong${target} — polish the bullet language.`;
  if (score >= 75) return `Solid foundation${target}, but ${majors} major issues are bleeding callbacks.`;
  if (score >= 60) return `Has potential${target} but reads more like a job description than a track record.`;
  if (score >= 40) return `Lots to fix${target} — start with metrics + action verbs.`;
  return `Major rewrite needed${target}. The current resume won't pass screening.`;
}
