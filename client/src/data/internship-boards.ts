// Curated index of where to find internships + jobs (esp. for Indian students).
// No AI. Pure data. Migrates cleanly into SQL when we move it.

export type BoardCategory =
  | "India · General"
  | "India · Tech"
  | "Global · General"
  | "Global · Startups & YC"
  | "Big-Tech Programs"
  | "Research & Academic"
  | "Remote-first"
  | "Newsletters & Communities"
  | "Hackathons → Hiring"
  | "Salary & Levels"
  | "AI Lab Programs";

export type BoardTier = "free" | "freemium" | "paid";

export interface InternshipBoard {
  name: string;
  url: string;
  category: BoardCategory;
  tier: BoardTier;
  focus: string[];                    // tags: "intern", "off-campus", "remote", "ml", "h1b-friendly"
  region: ("India" | "Global" | "US" | "Europe" | "APAC" | "Remote-OK")[];
  description: string;
  tip?: string;                       // one-liner pro tip
}

const B = (b: InternshipBoard): InternshipBoard => b;

export const INTERNSHIP_BOARDS: InternshipBoard[] = [
  // ───── India · General ─────
  B({ name: "Internshala", url: "https://internshala.com", category: "India · General", tier: "free",
      focus: ["intern", "fresher", "stipend"], region: ["India"],
      description: "India's biggest internship aggregator. Daily new listings across every role and city.",
      tip: "Filter by 'Work from home' + 'Stipend ≥ ₹10k'. Apply within 24h — older listings ghost." }),
  B({ name: "Unstop (formerly D2C)", url: "https://unstop.com", category: "India · General", tier: "free",
      focus: ["intern", "ppo", "competition", "hackathon"], region: ["India"],
      description: "Hackathons + case comps + company challenges that double as PPO funnels (TCS, Flipkart, etc.).",
      tip: "Top finishers in flagship comps (Flipkart Wired, TCS CodeVita) get fast-tracked interviews." }),
  B({ name: "Naukri Campus", url: "https://campus.naukri.com", category: "India · General", tier: "free",
      focus: ["fresher", "intern"], region: ["India"],
      description: "Naukri's college-focused arm. Bulk recruiters list here." }),
  B({ name: "Foundit Campus (formerly Monster)", url: "https://www.foundit.in/campus", category: "India · General", tier: "free",
      focus: ["fresher", "intern"], region: ["India"],
      description: "Mid-volume India job board." }),
  B({ name: "Apna", url: "https://apna.co", category: "India · General", tier: "free",
      focus: ["fresher", "tier-2-3"], region: ["India"],
      description: "Hyper-local jobs and internships. Strong in Tier 2/3 cities." }),
  B({ name: "Hirect", url: "https://hirect.in", category: "India · General", tier: "free",
      focus: ["fresher", "startup"], region: ["India"],
      description: "Chat-first job app. Direct messaging with founders/recruiters." }),

  // ───── India · Tech ─────
  B({ name: "Cuvette", url: "https://cuvette.tech", category: "India · Tech", tier: "free",
      focus: ["intern", "fresher", "startup", "tech"], region: ["India", "Remote-OK"],
      description: "Tech-only internships + jobs at Indian startups. Take their assessments to get fast-tracked.",
      tip: "Their leaderboard ranks get visibility from hiring managers — actually worth the effort." }),
  B({ name: "Outscal", url: "https://outscal.com", category: "India · Tech", tier: "freemium",
      focus: ["fresher", "fullstack", "game-dev"], region: ["India", "Remote-OK"],
      description: "Tech-focused upskilling + placement. Strong for full-stack and game dev." }),
  B({ name: "Coding Ninjas Jobs", url: "https://codingninjas.com/career-camp", category: "India · Tech", tier: "freemium",
      focus: ["fresher", "intern"], region: ["India"],
      description: "Placement portal tied to their cohort programs." }),
  B({ name: "Refer Me", url: "https://refer.me", category: "India · Tech", tier: "freemium",
      focus: ["referral", "tech"], region: ["India", "Global"],
      description: "Get referrals at FAANG and Indian unicorns." }),

  // ───── Global · General ─────
  B({ name: "LinkedIn Jobs", url: "https://linkedin.com/jobs", category: "Global · General", tier: "free",
      focus: ["intern", "fresher", "experienced"], region: ["Global"],
      description: "The default global job board. Filter 'Internship' + 'Past 24h' + your country.",
      tip: "Set up 5 saved searches with email alerts. Apply within 1h of posting — recruiters review in FIFO." }),
  B({ name: "Indeed", url: "https://indeed.com", category: "Global · General", tier: "free",
      focus: ["intern", "fresher"], region: ["Global"],
      description: "Largest cross-region aggregator." }),
  B({ name: "Glassdoor Jobs", url: "https://glassdoor.com/Job", category: "Global · General", tier: "free",
      focus: ["intern", "fresher"], region: ["Global"],
      description: "Jobs + salary insights + interview reviews per company." }),

  // ───── Global · Startups & YC ─────
  B({ name: "Y Combinator — Work at a Startup", url: "https://workatastartup.com", category: "Global · Startups & YC", tier: "free",
      focus: ["intern", "fresher", "startup", "ssr", "tech"], region: ["US", "Remote-OK"],
      description: "Apply once → matched with every hiring YC company. Best single source for YC startups.",
      tip: "Write your profile like a YC application. Tag remote + visa needs honestly — they filter on it." }),
  B({ name: "Wellfound (formerly AngelList Talent)", url: "https://wellfound.com", category: "Global · Startups & YC", tier: "free",
      focus: ["intern", "fresher", "startup"], region: ["Global"],
      description: "Startup-focused job board. Direct chat with founders/hiring managers." }),
  B({ name: "Hacker News — Who's Hiring?", url: "https://news.ycombinator.com/submitted?id=whoishiring", category: "Global · Startups & YC", tier: "free",
      focus: ["intern", "fresher", "remote", "tech"], region: ["Global"],
      description: "Monthly thread of every YC-adjacent and indie tech company hiring. Search by Ctrl-F.",
      tip: "Search for 'INTERN' + 'REMOTE' + your stack. Email the contacts directly — usually founders/CTOs." }),
  B({ name: "Otta", url: "https://otta.com", category: "Global · Startups & YC", tier: "freemium",
      focus: ["fresher", "tech", "startup"], region: ["Europe", "US", "Remote-OK"],
      description: "Curated tech jobs at high-quality startups. Heavy UK + US slant." }),
  B({ name: "Built In", url: "https://builtin.com", category: "Global · Startups & YC", tier: "free",
      focus: ["fresher", "startup", "tech"], region: ["US"],
      description: "US startup hubs (NYC, SF, Austin) job boards." }),

  // ───── Big-Tech Programs ─────
  B({ name: "Google STEP (Student Training in Engineering Program)", url: "https://buildyourfuture.withgoogle.com/programs/step", category: "Big-Tech Programs", tier: "free",
      focus: ["intern", "1st-2nd-year", "tech"], region: ["Global", "India"],
      description: "Google internship for 1st/2nd year undergrads. Tier-1 talent funnel.",
      tip: "Apply in Sep-Nov for the next summer. CV signal is academics + early projects." }),
  B({ name: "Meta University Recruiting", url: "https://metacareers.com/students", category: "Big-Tech Programs", tier: "free",
      focus: ["intern", "fresher", "tech"], region: ["Global", "India"],
      description: "Meta's structured intern pipeline (E3 SWE intern, Production Engineer Intern)." }),
  B({ name: "Microsoft Engage", url: "https://microsoft.com/en-in/campus/engage", category: "Big-Tech Programs", tier: "free",
      focus: ["intern", "2nd-3rd-year", "india"], region: ["India"],
      description: "Microsoft India's mentorship + summer internship program for women + allies.",
      tip: "Engage often converts to PPOs. Strong India funnel." }),
  B({ name: "Amazon ML Summer School", url: "https://amazon.jobs/en/landing_pages/mlsummerschool-india", category: "Big-Tech Programs", tier: "free",
      focus: ["ml", "intern", "india"], region: ["India"],
      description: "Free 1-week intensive ML program. Top performers get full Amazon SDE/ML internship offers." }),
  B({ name: "Amazon FTE/Intern Hiring (Off-campus)", url: "https://amazon.jobs/en/teams/internships-for-students", category: "Big-Tech Programs", tier: "free",
      focus: ["intern", "fresher", "tech"], region: ["Global", "India"],
      description: "Off-campus SDE intern + FTE applications." }),
  B({ name: "Adobe Women in Technology Scholarship", url: "https://research.adobe.com/scholarship/", category: "Big-Tech Programs", tier: "free",
      focus: ["intern", "women", "tech"], region: ["Global", "India"],
      description: "Scholarship + Adobe internship for women in undergrad CS." }),

  // ───── Research & Academic ─────
  B({ name: "MITACS Globalink", url: "https://mitacs.ca/our-programs/globalink-research-internship/", category: "Research & Academic", tier: "free",
      focus: ["research", "summer", "canada"], region: ["Global"],
      description: "Paid 12-week research internship in Canada for undergrads.",
      tip: "Apply Aug-Sep for next summer. Indian eligibility: 3rd/4th year." }),
  B({ name: "DAAD WISE", url: "https://www.daad.de/en/study-and-research-in-germany/scholarships/", category: "Research & Academic", tier: "free",
      focus: ["research", "summer", "germany"], region: ["Global"],
      description: "Paid summer research at German universities. Open to Indian undergrads." }),
  B({ name: "S.N. Bose Scholars Program", url: "https://www.iusstf.org/program/sn-bose-scholars-student-exchange-program", category: "Research & Academic", tier: "free",
      focus: ["research", "us", "summer"], region: ["India"],
      description: "Indian undergrads → US universities for summer research. Highly selective." }),
  B({ name: "Khorana Scholars Program", url: "https://www.iusstf.org/program/khorana-program-for-scholars", category: "Research & Academic", tier: "free",
      focus: ["research", "us", "biology", "stem"], region: ["India"],
      description: "Indo-US summer research exchange for STEM undergrads." }),
  B({ name: "CERN Summer Student Programme", url: "https://careers.cern/summer", category: "Research & Academic", tier: "free",
      focus: ["research", "physics", "europe"], region: ["Global"],
      description: "Summer research at CERN (Geneva). Limited to certain eligible countries — check yearly." }),
  B({ name: "Indian Academy of Sciences Summer Fellowship", url: "https://web-japps.ias.ac.in/SRFP/", category: "Research & Academic", tier: "free",
      focus: ["research", "india", "summer"], region: ["India"],
      description: "Work in a top Indian research lab for 8 weeks. ₹6k/month stipend.",
      tip: "Apply Nov-Dec for next summer. Pick a host with mentorship reputation, not just brand name." }),
  B({ name: "IIT Summer Internships (e.g. IITB Mitacs, IITGN SURE)", url: "https://www.iitb.ac.in/en/admissions/student-exchange", category: "Research & Academic", tier: "free",
      focus: ["research", "india", "summer"], region: ["India"],
      description: "Most IITs run summer internship programs. Apply via the IIT's CSE/dean-of-students page." }),
  B({ name: "IISc Summer Research Fellowship", url: "https://www.iisc.ac.in/admissions/short-term-courses-fellowships/", category: "Research & Academic", tier: "free",
      focus: ["research", "india", "summer"], region: ["India"],
      description: "IISc Bangalore SRFP. 2-month research stints with faculty." }),

  // ───── Remote-first ─────
  B({ name: "Remote OK", url: "https://remoteok.com", category: "Remote-first", tier: "free",
      focus: ["remote", "tech", "fresher-friendly"], region: ["Remote-OK"],
      description: "Remote tech jobs aggregator. Filter 'No location restriction'." }),
  B({ name: "We Work Remotely", url: "https://weworkremotely.com", category: "Remote-first", tier: "free",
      focus: ["remote", "tech"], region: ["Remote-OK"],
      description: "Long-running remote job board. Mostly US-EU companies." }),
  B({ name: "Working Nomads", url: "https://workingnomads.com", category: "Remote-first", tier: "free",
      focus: ["remote", "tech"], region: ["Remote-OK"],
      description: "Curated remote jobs newsletter." }),
  B({ name: "Remotive", url: "https://remotive.com", category: "Remote-first", tier: "free",
      focus: ["remote", "tech", "support"], region: ["Remote-OK"],
      description: "Remote tech jobs + community." }),
  B({ name: "Arc", url: "https://arc.dev", category: "Remote-first", tier: "freemium",
      focus: ["remote", "experienced", "fresher"], region: ["Remote-OK"],
      description: "Remote-only marketplace. Vetted, but harder for total freshers." }),

  // ───── Newsletters & Communities ─────
  B({ name: "TLDR Jobs", url: "https://tldr.tech/jobs", category: "Newsletters & Communities", tier: "free",
      focus: ["remote", "tech"], region: ["Global"],
      description: "Daily curated tech jobs from the TLDR newsletter." }),
  B({ name: "Levels.fyi Jobs", url: "https://levels.fyi/jobs", category: "Newsletters & Communities", tier: "free",
      focus: ["tech", "salary-transparent"], region: ["Global"],
      description: "Jobs listed with verified comp band." }),
  B({ name: "r/cscareerquestions India", url: "https://reddit.com/r/developersIndia", category: "Newsletters & Communities", tier: "free",
      focus: ["community", "india", "advice"], region: ["India"],
      description: "Subreddit for Indian devs. Weekly hiring threads + AMAs.",
      tip: "Old reddit search > new reddit search. Look for 'Hiring Thread' as keyword." }),
  B({ name: "r/cscareerquestions (US)", url: "https://reddit.com/r/cscareerquestions", category: "Newsletters & Communities", tier: "free",
      focus: ["community", "global", "advice"], region: ["Global"],
      description: "Largest dev career subreddit. Read the wiki before posting." }),
  B({ name: "TechFlow on LinkedIn (Indian Hiring Newsletters)", url: "https://linkedin.com", category: "Newsletters & Communities", tier: "free",
      focus: ["india", "community"], region: ["India"],
      description: "Follow 'Hiring' tag + creators like Anshul Roy (Notion + DSA threads), Anish Patel." }),

  // ───── Hackathons → Hiring ─────
  B({ name: "Devfolio", url: "https://devfolio.co", category: "Hackathons → Hiring", tier: "free",
      focus: ["hackathon", "india", "ppo"], region: ["India", "Global"],
      description: "India's biggest hackathon platform. Winners get sponsor company interviews." }),
  B({ name: "Devpost", url: "https://devpost.com", category: "Hackathons → Hiring", tier: "free",
      focus: ["hackathon", "global"], region: ["Global"],
      description: "Global hackathons. Many sponsor-hosted ones convert to job interviews." }),
  B({ name: "MLH (Major League Hacking)", url: "https://mlh.io", category: "Hackathons → Hiring", tier: "free",
      focus: ["hackathon", "intern", "fellowship"], region: ["Global"],
      description: "Student hackathon league + MLH Fellowship (paid open-source internship)." }),
  B({ name: "Hack Club", url: "https://hackclub.com", category: "Hackathons → Hiring", tier: "free",
      focus: ["community", "students", "hackathon"], region: ["Global"],
      description: "Global student hacker community. Runs Outernet, AMAs with founders." }),

  // ───── Salary & Levels ─────
  B({ name: "Levels.fyi", url: "https://levels.fyi", category: "Salary & Levels", tier: "free",
      focus: ["salary", "verified"], region: ["Global", "India"],
      description: "Verified comp by company, level, location. India tab is mature now.",
      tip: "Filter to your YOE + city. Look at the offers within last 6 months — older ones are stale." }),
  B({ name: "Glassdoor Salaries", url: "https://glassdoor.com/Salaries", category: "Salary & Levels", tier: "free",
      focus: ["salary", "reviews"], region: ["Global"],
      description: "Self-reported salaries + interview experiences." }),
  B({ name: "AmbitionBox", url: "https://ambitionbox.com", category: "Salary & Levels", tier: "free",
      focus: ["salary", "reviews", "india"], region: ["India"],
      description: "India-specific Glassdoor. Salaries, interview rounds, company reviews." }),
  B({ name: "Comparably", url: "https://comparably.com", category: "Salary & Levels", tier: "free",
      focus: ["salary", "culture"], region: ["Global"],
      description: "Salary + culture data, US-leaning." }),

  // ───── AI Lab Programs ─────
  B({ name: "Anthropic Residency", url: "https://anthropic.com/careers", category: "AI Lab Programs", tier: "free",
      focus: ["ml", "research", "ai-safety"], region: ["Global", "Remote-OK"],
      description: "6-month research residency. Open to people transitioning into AI safety research." }),
  B({ name: "OpenAI Residency", url: "https://openai.com/careers", category: "AI Lab Programs", tier: "free",
      focus: ["ml", "research"], region: ["Global"],
      description: "6-month residency to convert into a full research/engineering role." }),
  B({ name: "Google DeepMind Internships", url: "https://deepmind.google/about/internships", category: "AI Lab Programs", tier: "free",
      focus: ["ml", "research"], region: ["Global"],
      description: "Research + engineering internships at DeepMind." }),
  B({ name: "Hugging Face Open-Source Bounties", url: "https://huggingface.co/jobs", category: "AI Lab Programs", tier: "free",
      focus: ["ml", "open-source"], region: ["Remote-OK"],
      description: "Contribute to transformers/diffusers — strong OSS = direct hiring channel." }),
  B({ name: "Cohere For AI", url: "https://cohere.com/research/cohere-for-ai", category: "AI Lab Programs", tier: "free",
      focus: ["ml", "research"], region: ["Global", "Remote-OK"],
      description: "Open research community + scholar programs for ML/NLP researchers." }),
];

export const BOARD_CATEGORIES: BoardCategory[] = [
  "India · General",
  "India · Tech",
  "Global · General",
  "Global · Startups & YC",
  "Big-Tech Programs",
  "Research & Academic",
  "Remote-first",
  "AI Lab Programs",
  "Hackathons → Hiring",
  "Newsletters & Communities",
  "Salary & Levels",
];
