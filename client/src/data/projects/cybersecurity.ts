import type { ProjectDomain } from "./types";

export const cybersecurity: ProjectDomain = {
  id: "cybersecurity",
  title: "Cybersecurity",
  icon: "ShieldCheck",
  accent: "peach",
  blurb: "Build defensive security tools — protect systems, understand attacks, and land blue-team roles.",
  overview:
    "Cybersecurity is one of the fastest-growing career tracks in Indian tech: every bank, fintech, product company, and government organisation is hiring for application security, cloud security, and SOC roles. Unlike many domains, security rewards curiosity and systematic thinking — skills you already build solving DSA problems — and a strong portfolio of *defensive* tools and CTF writeups is a genuine differentiator at campus placements.\n\nThis path is intentionally defensive and educational. You will learn how attackers think so you can build better defences: hashing and salting passwords correctly, validating and sanitising every input, scanning your own applications for OWASP Top 10 vulnerabilities, and analysing logs to detect intrusions before they escalate. The three projects below form a ladder — from understanding the basics of credential safety all the way to building a mini SIEM dashboard that mirrors what security engineers use on the job.",
  skillsRequired: [
    "Python basics (functions, file I/O, standard library, pip)",
    "Comfort with the Linux command line (bash, curl, netcat)",
    "Basic networking concepts (IP, TCP/UDP, HTTP/HTTPS)",
    "Git & GitHub for version control",
    "Basic web development knowledge (HTTP requests, cookies, headers)",
  ],
  learningOrder: [
    "Networking fundamentals: TCP/IP model, DNS, HTTP(S), TLS, common ports",
    "Linux security essentials: file permissions, processes, users, ssh, firewall (ufw/iptables basics)",
    "Web security basics: OWASP Top 10, HTTP headers, cookies, sessions, CORS",
    "Secure coding: input validation, parameterised queries, bcrypt hashing, environment variables",
    "Recon and vulnerability assessment: Nmap, Nikto, Burp Suite (community) on intentionally vulnerable apps",
    "CTF fundamentals: PortSwigger Web Security Academy labs (free), TryHackMe beginner rooms",
    "Log analysis and SIEM concepts: parsing syslog/access logs, pattern detection, alerting thresholds",
    "Responsible disclosure and ethics: CVE lifecycle, bug bounty etiquette, legal boundaries of security testing",
  ],
  difficulty: "Beginner-friendly → Advanced",
  techStack: [
    "Python 3 (socket, requests, hashlib, bcrypt, re, pandas)",
    "Flask / FastAPI (for secure backend projects)",
    "SQLite / PostgreSQL",
    "Docker (isolated lab environments)",
    "Nmap / Nikto / Burp Suite Community",
    "OWASP Juice Shop / DVWA (intentionally vulnerable targets)",
    "Elasticsearch / Kibana or Grafana (SIEM dashboard)",
  ],
  githubResources: [
    {
      label: "OWASP WebGoat (vulnerable-by-design learning app)",
      url: "https://github.com/WebGoat/WebGoat",
      kind: "repo",
    },
    {
      label: "PayloadsAllTheThings (defensive reference for attack patterns)",
      url: "https://github.com/swisskyrepo/PayloadsAllTheThings",
      kind: "repo",
    },
    {
      label: "Awesome Security (curated security tools & resources)",
      url: "https://github.com/sbilly/awesome-security",
      kind: "repo",
    },
    {
      label: "OWASP Juice Shop (modern vulnerable web app for practice)",
      url: "https://github.com/juice-shop/juice-shop",
      kind: "repo",
    },
    {
      label: "Awesome CTF (tools and write-ups for Capture The Flag)",
      url: "https://github.com/apsdehal/awesome-ctf",
      kind: "repo",
    },
  ],
  learningResources: [
    {
      label: "OWASP Top 10 — official vulnerability reference",
      url: "https://owasp.org/www-project-top-ten/",
      kind: "docs",
    },
    {
      label: "PortSwigger Web Security Academy (free, hands-on labs)",
      url: "https://portswigger.net/web-security",
      kind: "course",
    },
    {
      label: "TryHackMe — guided beginner to intermediate rooms",
      url: "https://tryhackme.com/",
      kind: "course",
    },
    {
      label: "roadmap.sh — Cyber Security roadmap",
      url: "https://roadmap.sh/cyber-security",
      kind: "roadmap",
    },
    {
      label: "NIST Cybersecurity Framework — industry-standard defensive reference",
      url: "https://www.nist.gov/cyberframework",
      kind: "docs",
    },
  ],
  portfolioTips: [
    "Host every project on GitHub with a detailed README that explains the *defensive* purpose and the threat model it addresses.",
    "Record a short demo video (Loom / OBS) showing the tool in action against a local intentionally-vulnerable target — never a live production site.",
    "Include a SECURITY.md or dedicated section in the README explaining responsible use, legal boundaries, and how you kept testing ethical.",
    "Link TryHackMe profile badges or PortSwigger Web Security Academy certificates to evidence your hands-on learning.",
    "Document your CTF writeups in a public GitHub repo — even one well-written writeup signals problem-solving depth to hiring managers.",
  ],
  resumeTips: [
    "Frame skills defensively: 'Identified and mitigated OWASP Top 10 vulnerabilities in a self-hosted test environment' rather than 'hacked X'.",
    "Quantify findings: 'Automated detection of 6 vulnerability classes across 40+ endpoints using Python scanner'.",
    "Name specific standards and tools: OWASP, bcrypt, HMAC, TLS 1.3, Nmap, Burp Suite — recruiters and ATS systems keyword-match these.",
    "Certifications matter early-career: even free badges (TryHackMe Jr Penetration Tester, PortSwigger) differentiate you from peers with no security exposure.",
  ],
  interviewRelevance:
    "Security questions appear even in **general SDE interviews** at product companies: 'How do you store passwords?', 'What is SQL injection and how do you prevent it?', 'Explain CORS', 'How does HTTPS work?'. Having built projects in this space means you can answer from first principles rather than rote recall.\n\nFor **dedicated security roles** (AppSec, security engineer, SOC analyst) at Flipkart, Razorpay, PhonePe, Zerodha, and large IT services firms, these projects directly mirror on-the-job work. Expect questions on: OWASP Top 10 mitigations, the difference between authentication and authorisation, symmetric vs asymmetric encryption, how you would review a pull request for security issues, and how you would triage a suspicious log spike. A SIEM dashboard project in particular signals SOC analyst readiness — one of the highest-demand entry-level roles in India right now.",
  projects: [
    {
      id: "password-security-auditor",
      name: "Password Security Auditor",
      level: "Beginner",
      blurb: "Analyse password strength and check credentials against breach databases — without storing anything.",
      estimatedTime: "1–2 weekends",
      objective:
        "Build a privacy-respecting CLI + web tool that evaluates password strength using entropy calculations and checks whether a password has appeared in known data breaches using the HaveIBeenPwned k-anonymity API (only a 5-character hash prefix is ever sent — the plaintext never leaves the machine). This project teaches hashing, API design, input validation, and responsible data handling — all core to secure software engineering.",
      features: [
        "Entropy-based strength scorer (length, character-set diversity, common-password list check)",
        "Breach check via HaveIBeenPwned Pwned Passwords API using k-anonymity (SHA-1 prefix only)",
        "Suggestions for strengthening weak passwords (without generating or storing them)",
        "CLI interface (argparse) and a minimal Flask web UI",
        "Rate limiting on the web endpoint to prevent abuse",
        "No passwords ever logged to disk or sent in plaintext",
      ],
      folderStructure: `password-auditor/
├── auditor/
│   ├── __init__.py
│   ├── entropy.py          # strength scoring, entropy calc
│   ├── hibp.py             # k-anonymity breach check
│   └── wordlists/
│       └── common-10k.txt  # top 10k common passwords
├── web/
│   ├── app.py              # Flask app with rate limiting
│   ├── templates/
│   │   └── index.html
│   └── static/
│       └── style.css
├── cli.py                  # argparse entry point
├── tests/
│   ├── test_entropy.py
│   └── test_hibp.py
├── requirements.txt
└── README.md`,
      technologies: ["Python 3", "Flask", "hashlib", "requests", "Flask-Limiter", "pytest"],
      skills: [
        "SHA-1 hashing and k-anonymity privacy patterns",
        "REST API consumption with security constraints",
        "Input validation and defensive coding",
        "Rate limiting to prevent abuse",
        "Writing unit tests for security-critical logic",
      ],
      stretchGoals: [
        "Add a passphrase generator using the EFF wordlist (diceware) and score the generated phrases",
        "Build a bulk CSV auditor for IT admins to check a list of hashed credentials against breach data",
        "Deploy the web UI to Render with HTTPS enforced and add a Content-Security-Policy header",
      ],
      futureImprovements: [
        "Integrate zxcvbn (Dropbox's password strength estimator) for more nuanced scoring",
        "Add support for checking email addresses against HaveIBeenPwned account breaches",
        "Create a browser extension that audits passwords inline as users type (entirely client-side, no network calls for plaintext)",
      ],
    },
    {
      id: "web-vulnerability-scanner",
      name: "Web Vulnerability Scanner",
      level: "Intermediate",
      blurb: "Automate OWASP Top 10 checks against a local intentionally-vulnerable app and generate a findings report.",
      estimatedTime: "2–3 weeks",
      objective:
        "Build a Python-based vulnerability scanner that discovers and reports common web security issues — reflected XSS, SQL injection indicators, missing security headers, open redirects, and directory listing — against a self-hosted intentionally vulnerable application such as OWASP Juice Shop (run via Docker). You will learn how each vulnerability class works, how to detect it programmatically, and — most importantly — how to fix it. The output is a structured HTML/JSON report similar to what professional tools like Nikto produce.",
      features: [
        "Crawler that discovers internal links and forms on the target application",
        "Reflected XSS probe: inject benign canary strings into URL params and form fields; detect echo in response",
        "SQL injection indicator check: inject common error-triggering payloads; detect DB error strings in response",
        "Security headers audit: check for Content-Security-Policy, X-Frame-Options, HSTS, X-Content-Type-Options",
        "Open redirect detector: test redirect parameters with an external URL canary",
        "Structured JSON + rendered HTML report with severity ratings and remediation guidance",
        "Hard-coded scope enforcement: scanner refuses to run against anything outside localhost / 127.0.0.1",
      ],
      folderStructure: `vuln-scanner/
├── scanner/
│   ├── __init__.py
│   ├── crawler.py          # link + form discovery
│   ├── checks/
│   │   ├── __init__.py
│   │   ├── xss.py
│   │   ├── sqli.py
│   │   ├── headers.py
│   │   └── redirects.py
│   ├── reporter.py         # JSON + HTML report generation
│   └── scope.py            # strict scope enforcement
├── targets/
│   └── docker-compose.yml  # spins up OWASP Juice Shop locally
├── reports/                # generated output (gitignored)
├── tests/
│   ├── test_crawler.py
│   ├── test_xss.py
│   └── test_headers.py
├── cli.py
├── requirements.txt
└── README.md`,
      technologies: [
        "Python 3",
        "requests / httpx",
        "BeautifulSoup4",
        "Jinja2 (report templates)",
        "Docker (Juice Shop target)",
        "pytest",
      ],
      skills: [
        "OWASP Top 10 vulnerability mechanics and detection",
        "HTTP request/response analysis",
        "Responsible scoping — preventing accidental scanning of live sites",
        "Automated report generation with severity ratings",
        "Defensive thinking: understanding attacks to implement fixes",
      ],
      stretchGoals: [
        "Add a cookie / session security checker (HttpOnly, Secure, SameSite flags)",
        "Implement a basic spider that follows pagination and authenticated pages using session cookies",
        "Integrate with GitHub Actions so the scanner runs automatically on every PR in a CI pipeline against a local Juice Shop",
      ],
      futureImprovements: [
        "Add a remediation code-snippet library that shows developers the correct fix for each finding in Python, Node.js, and Java",
        "Support authenticated scanning by replaying a recorded login flow (Playwright recording export)",
        "Publish findings to a lightweight SQLite database for trend analysis across multiple scan runs",
      ],
    },
    {
      id: "siem-lite-dashboard",
      name: "SIEM-Lite Intrusion Detection Dashboard",
      level: "Advanced",
      blurb: "Parse real server logs, detect anomalies and attack signatures, and visualise alerts on a live dashboard.",
      estimatedTime: "3–4 weeks",
      objective:
        "Build a lightweight Security Information and Event Management (SIEM) system that ingests Nginx/Apache access logs and Linux auth logs, applies rule-based and statistical anomaly detection (brute-force login attempts, port scan signatures, SQL injection patterns in access logs, unusual traffic spikes), and surfaces alerts on a real-time Grafana or custom React dashboard. This project mirrors the daily work of a SOC analyst and is one of the strongest advanced security portfolio pieces for Indian placement — especially for roles at IT services firms, fintech companies, and government cyber units.",
      features: [
        "Log ingestion pipeline: tail and parse Nginx access logs + Linux /var/log/auth.log in real time",
        "Rule engine: detect brute-force (N failed logins / minute from same IP), SQLi patterns in request URLs, directory traversal attempts",
        "Statistical anomaly detection: Z-score or rolling-average spike detection for request-rate anomalies",
        "IP reputation lookup: check source IPs against AbuseIPDB free API",
        "Alert store: write structured alerts (timestamp, severity, type, source IP, evidence) to SQLite",
        "Dashboard: Flask + Chart.js (or Grafana with a SQLite/Prometheus data source) showing live alert feed, top offending IPs, and request heatmap",
        "Dockerised deployment with a sample log generator to demo the system without a real server",
      ],
      folderStructure: `siem-lite/
├── ingestion/
│   ├── __init__.py
│   ├── tailer.py           # real-time log tail (watchdog)
│   ├── parsers/
│   │   ├── nginx.py        # nginx combined log format parser
│   │   └── auth.py         # sshd / PAM auth log parser
│   └── pipeline.py         # ingestion orchestrator
├── detection/
│   ├── __init__.py
│   ├── rules/
│   │   ├── brute_force.py
│   │   ├── sqli_pattern.py
│   │   └── traversal.py
│   ├── anomaly.py          # rolling-window z-score detector
│   └── reputation.py       # AbuseIPDB API client
├── store/
│   ├── db.py               # SQLite schema + alert writes
│   └── migrations/
│       └── 001_init.sql
├── dashboard/
│   ├── app.py              # Flask API + SSE for live feed
│   ├── templates/
│   │   └── index.html
│   └── static/
│       ├── app.js          # Chart.js dashboard
│       └── style.css
├── generator/
│   └── log_gen.py          # synthetic log generator for demo
├── docker-compose.yml
├── tests/
│   ├── test_parsers.py
│   ├── test_rules.py
│   └── test_anomaly.py
├── requirements.txt
└── README.md`,
      technologies: [
        "Python 3 (watchdog, re, statistics, sqlite3)",
        "Flask + Server-Sent Events (live alert feed)",
        "Chart.js (dashboard visualisation)",
        "SQLite",
        "Docker + Docker Compose",
        "AbuseIPDB API (free tier)",
      ],
      skills: [
        "Log parsing and real-time stream processing",
        "Rule-based and statistical anomaly detection",
        "Alert triage and severity classification",
        "SOC analyst workflow understanding",
        "Full-stack: backend pipeline + live frontend dashboard",
        "IP reputation and threat intelligence integration",
      ],
      stretchGoals: [
        "Replace SQLite with Elasticsearch and Kibana for a production-grade ELK-style stack (run locally via Docker Compose)",
        "Add email / Slack webhook notifications when a high-severity alert fires",
        "Write a post-incident report template generator that summarises an attack timeline from the alert store",
      ],
      futureImprovements: [
        "Train a simple ML classifier (scikit-learn) on labelled log lines to reduce false positives in anomaly detection",
        "Add support for Windows Event Log ingestion (EVTX parsing) to cover Windows-based infrastructure",
        "Implement a MITRE ATT&CK technique tagger that maps detected patterns to the ATT&CK framework IDs",
      ],
    },
  ],
};
