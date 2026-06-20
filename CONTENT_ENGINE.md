# CONTENT REPORT

## 1. Executive Summary

- **PrepNext is invisible to Google.** SPA-only Vite build with zero SSR/prerender means crawlers see an empty `<div id="root">` for every route except `/`. The `<head>` in `index.html` still pitches "Adaptive AI Learning Universe" while the Landing copy markets "zero AI calls placement-OS" — search engines, when they eventually index, will rank for the wrong intent. Fix the head + add a prerender layer (vite-plugin-prerender or migrate to Next.js) before any content investment.
- **The codebase already contains the highest-value SEO assets in the country — and is wasting them.** 50 company prep pages (`/companies/:slug`), ~150 DSA problems (`/dsa/:slug`), a crowd-sourced PYQ vault, and a public certificate verifier are all programmatic-SEO goldmines that currently render no metadata, no JSON-LD, and no static HTML. Indian placement queries like "TCS NQT previous year questions", "Infosys SP eligibility 2026", "Goldman Sachs OA pattern" have 1k-40k MSV each and weak SERP incumbents (PrepInsta, IndiaBix) running 2015-era UX.
- **Content moat is "PYQ Vault + Companies Vault + Application Tracker" — not blog posts.** PrepInsta and GFG already own generic "how to crack TCS" listicles. PrepNext wins by publishing structured, dated, verified data (this year's OA pattern, this week's drive dates, this batch's eligibility) — programmatic pages that update from the DB, not 1500-word evergreen articles. Blog is supporting cast, not the lead.
- **A 100-title editorial calendar is included below**, segmented into 4 topic clusters: (a) Company-specific drive intel (40), (b) DSA + System Design + Core CS tactical (30), (c) Off-campus + internship strategy (15), (d) Resume / HR / aptitude (15). Mix is intentionally 70% bottom-funnel BOFU (transactional placement-season queries) and 30% top-funnel TOFU brand building.
- **30-day target: ship prerendering + 50 programmatic company pages + 10 PYQ cluster pages + correct OG/title.** This is achievable inside the existing Vite+Express+Prisma stack without a Next.js rewrite — and should produce the first 500 organic sessions/month inside 60 days given the low difficulty of Indian placement long-tails.

## 2. Current State

Brutal version: **PrepNext currently has zero content engine.** There is no `/blog` route in `App.tsx`, no MDX pipeline, no CMS, no `sitemap.xml`, no `robots.txt`, no canonical tags, no per-route `<title>` updates (no `react-helmet-async` in the dependency tree based on the stack recon), and no structured data anywhere despite shipping a real FAQ on the Landing page. The static `index.html` head is the *only* metadata Google ever sees, and that head describes a different product than what Landing actually sells.

Worse, the head describes the product that *used to exist* — the legacy Tutor/Courses/Roadmaps stack that `App.tsx` now redirects via `<Navigate>` while the Prisma schema still carries `Course`, `Chapter`, `Lesson`, `Roadmap`, `TutorThread`, `TutorMessage` models. Anyone landing from search expects an "AI tutor" and finds a placement-prep kanban. Bounce city.

The traffic situation: vercel.app subdomain (which Google deprioritizes vs. a custom apex), 18 signups, no backlinks, no domain authority, no GSC property because there's no verified domain. The `og-image.svg` is an SVG — most social platforms (Slack, WhatsApp, LinkedIn) won't unfurl SVGs reliably. Every share is a dead share.

The good news buried under all this: **the product itself is a content engine in disguise.** The `PYQVault`, crowd-sourced via `/pyq/submit`, with `verified` + voting (per the recon) is structurally identical to how Stack Overflow built its SEO empire. The 50-company recruiter map (`Companies`, `/companies/:slug`) is structurally identical to how Levels.fyi prints money. The DSA tracker with ~150 problems and per-problem `/dsa/:slug` pages is structurally identical to how NeetCode and InterviewBit rank. **None of these database tables are being projected to indexable HTML.** That is the entire problem and the entire opportunity.

Competitor reality check:
- **PrepInsta** ranks #1-3 for almost every "{company} previous year questions" query. Domain is 10 years old, UX is hostile, content is unverified. Beatable on structured data + freshness signals.
- **GeeksforGeeks** dominates "{topic} interview questions" generic queries. Unbeatable on TOFU listicles; ignore that lane.
- **InterviewBit** owns "{company} interview experience". They publish dated experiences. PrepNext's PYQ vault is the same shape, more granular.
- **LeetCode** owns DSA. Don't fight there. Use DSA as utility, not as SEO target.
- **Unstop** owns "campus hiring events" and runs the actual drives. Partner-or-perish; not a content competitor.
- **Naukri Campus** is invisible in organic. Ignore.
- **AlmaBetter / Scaler / Coding Ninjas** are paid-bootcamp SEO; they bid on commercial terms, weak on informational. Steal their long-tail.

The competitive whitespace is unambiguous: **dated, structured, verified, India-specific placement intel** — and PrepNext already has the DB schema to publish it.

## 3. Critical Issues

| # | Issue | Impact | Effort | Priority |
|---|-------|--------|--------|----------|
| 1 | SPA renders empty shell to crawlers; no per-route `<title>`/meta — every URL beyond `/` is functionally unindexed | Catastrophic | High | P0 |
| 2 | `index.html` head messaging contradicts Landing — "Adaptive AI Learning Universe" vs "zero AI calls placement-OS" | High | Trivial | P0 |
| 3 | No `sitemap.xml`, no `robots.txt`, no canonical tags, no JSON-LD (Organization, WebSite, FAQPage, BreadcrumbList) | High | Low | P0 |
| 4 | `/companies/:slug` (50 pages) has no programmatic SEO layer despite being the highest-intent surface (`TCS NQT eligibility`, `Goldman Sachs OA`) | Catastrophic | Medium | P0 |
| 5 | `/pyq` vault has no public listing pages by company × year × role — losing 100% of `"{company} previous year questions"` search demand | Catastrophic | Medium | P0 |
| 6 | No blog route exists in `App.tsx`; no MDX/content pipeline; no editorial workflow | High | Medium | P1 |
| 7 | `og-image.svg` is SVG — fails to unfurl on WhatsApp/LinkedIn/Slack, killing every share | Medium | Low | P0 |
| 8 | Running on `vercel.app` subdomain — Google deprioritizes; no GSC verification possible at apex | High | Low | P0 |
| 9 | `/dsa/:slug` (~150 problem pages) renders no problem statement to crawlers; loses `"{problem name} solution india"` long-tail | Medium | Medium | P1 |
| 10 | Legacy Course/Roadmap/Tutor routes redirected but Prisma models still present — schema drift signals confused positioning | Low | Medium | P2 |
| 11 | No `lastmod` / `datePublished` / `dateModified` on any content — losing Google's freshness ranking signal that beats PrepInsta | High | Low | P1 |
| 12 | No internal linking strategy between Companies ↔ PYQ ↔ DSA ↔ Application Tracker — orphan pages, no topic-cluster hub | Medium | Low | P1 |
| 13 | `/verify-certificate` is public and shareable but has no OG card per cert — losing viral loop on student LinkedIn shares | Medium | Low | P1 |
| 14 | No author bylines / E-E-A-T signals on PYQs despite crowd-source model — Google's Helpful Content Update penalizes unattributed content | Medium | Medium | P2 |

## 4. Recommendations

### 4.1 Fix the head before anything else (this week)

Open `client/index.html`. Replace the title and all meta descriptions to match Landing's actual pitch. The current copy ("Adaptive AI Learning Universe") is from the deprecated Tutor product. Suggested:

```html
<title>PrepNext — Placement Season OS for Indian Engineering Students</title>
<meta name="description" content="Track campus placements, previous-year questions for TCS, Infosys, Goldman Sachs and 47 more, DSA practice, and applications — built for 2nd/3rd/4th-year engineering students in India." />
<meta name="keywords" content="campus placement, TCS NQT, Infosys SP, previous year questions, off-campus drives, internship 2026, DSA practice India" />
```

Add `<link rel="canonical" href="https://prepnext.vercel.app/" />` (and dynamically per route once prerender is in place). Re-export `og-image.svg` as a 1200x630 PNG/JPG at `/og-image.png` and update both `og:image` and `twitter:image`. SVG OG cards are silently dropped by WhatsApp and unreliable on LinkedIn — this is killing every student share.

### 4.2 Add prerendering — do NOT rewrite to Next.js yet

The stack is Vite + Express + Prisma on Vercel. A full Next.js migration is a 2-3 week project and you have 18 signups. Wrong altitude. Instead:

- Install `vite-plugin-ssr` (now Vike) or `react-snap` and prerender the static surface: `/`, `/companies`, all 50 `/companies/:slug` (Prisma query at build time), `/dsa`, `/pyq`, `/internships`, `/interview-resources`, `/onboarding`, `/verify-certificate`.
- For dynamic routes (PYQ detail, DSA problem detail), add an Express middleware that serves a rendered HTML shell with correct `<title>`, `<meta>`, JSON-LD for crawlers (UA-sniff `Googlebot`, `bingbot`, `Slackbot`, `WhatsApp`, `LinkedInBot`, `Twitterbot`) while serving the SPA to humans. This is a 200-line file.
- Add `react-helmet-async` to the dependency tree and wire `<Helmet>` into every route component so client-side navigation updates the head correctly for SPA-mode crawlers (Google does run JS now, but the static fallback is still the ranking signal).

### 4.3 Ship programmatic SEO for the three goldmine surfaces

**Companies (50 pages).** Each `/companies/:slug` should render server-side with:
- `<title>{Company} Placement 2026 — Eligibility, Package, OA Pattern, PYQs | PrepNext</title>`
- `<meta description>` interpolated from the `Companies` row.
- JSON-LD: `Organization` for the company, `FAQPage` for the rounds Q&A, `BreadcrumbList`.
- Internal links to the company's PYQs, DSA problems tagged with that company, and the Application Tracker CTA.
- An H1 that includes "{Company} Campus Placement Process 2026" — this is the exact long-tail Indian students type.

**PYQs.** Create three new listing surfaces:
- `/pyq/company/:slug` — all PYQs for one company, sorted by year desc.
- `/pyq/company/:slug/:year` — one company × one year (highest-intent cluster).
- `/pyq/topic/:topic` — aptitude, DSA, HR by topic.

Each PYQ detail page should render the question text in the SSR HTML (not lazy-loaded), include `datePublished`, `author` (the submitter's `displayName` if `verified`), and `upvoteCount`. This is the Stack Overflow playbook applied to placement prep.

**DSA Problems (~150).** Each `/dsa/:slug` should render the problem statement, examples, and constraints in SSR HTML. Add JSON-LD `TechArticle` type. Don't render the solution — keep that gated to logged-in users (this preserves the Monaco editor + attempts moat without hurting SEO; Google ranks the problem statement).

### 4.4 Build the blog as a thin MDX layer, not a CMS

Add `/blog` and `/blog/:slug` routes. Use `@mdx-js/rollup` + `gray-matter` to read `content/blog/*.mdx` at build time. No CMS, no admin UI. Editorial team commits markdown via PR. This is what Vercel, Linear, and Resend do. Total infra cost: zero. Total maintenance: ~30 lines in `vite.config.ts`.

The 100-title calendar below feeds this directly. Aim for **2 posts/week for the first 12 weeks** (24 posts), then evaluate. Quality threshold: every post must include a screenshot of the actual PrepNext feature it's promoting + an internal link to the relevant `/companies/:slug` or `/pyq/...` page. No generic listicles.

### 4.5 Domain and GSC — do this Monday

Buy `prepnext.in` or `prepnext.app` ($12). Point Vercel apex. Verify in Google Search Console + Bing Webmaster Tools + Naver (yes, Naver — Indian students from Korean partnerships are a thing). Submit `sitemap.xml`. Without a custom domain, none of the above content work compounds — Google explicitly deprioritizes `vercel.app` subdomains.

### 4.6 Topic Cluster Architecture

Build three hubs that pillar-link the cluster:

- **Hub: `/companies` (existing)** → spokes: 50 company detail pages → spokes: per-company PYQs, DSA, blog posts.
- **New hub: `/placement-guide`** → spokes: TCS NQT guide, Infosys SP guide, Wipro Elite guide, Accenture, Capgemini, Cognizant — the 6 mass-recruiter pillars that drive 70% of Tier 2/3 college placement search.
- **New hub: `/off-campus`** → spokes: Goldman Sachs, JPMorgan, D.E. Shaw, Microsoft, Google, Amazon, Atlassian, Stripe — the dream-company set.

Each hub gets H2-per-spoke with descriptive anchor text. This is Topic Cluster SEO 101 (HubSpot model) and works particularly well for low-DA sites because internal PageRank routing matters more than backlinks early on.

### 4.7 The 100-Article Editorial Calendar

Format: `Title | Target Keyword | Est. MSV (India) | KD (0-100)`

MSV estimates are rough — Indian placement queries spike Aug-Feb and crash Mar-Jul. Numbers below reflect peak-season Ahrefs/Semrush bands for in-IN search.

**Cluster A: Company-Specific Drive Intel (40 articles, BOFU)**

1. TCS NQT 2026 Previous Year Questions with Answers | tcs nqt previous year questions | 18,000 | 22
2. Infosys SP Eligibility Criteria 2026 Complete Guide | infosys sp eligibility 2026 | 9,500 | 18
3. Wipro Elite NTH 2026 Syllabus and Pattern | wipro elite nth syllabus | 7,200 | 20
4. Accenture Off Campus Drive 2026 Registration | accenture off campus drive 2026 | 22,000 | 28
5. Cognizant GenC Eligibility and Selection Process | cognizant genc eligibility | 6,800 | 19
6. Capgemini Exceller Pseudo Code Questions 2026 | capgemini pseudo code questions | 14,000 | 24
7. HCL TechBee Interview Experience CSE 2026 | hcl techbee interview | 4,500 | 16
8. Tech Mahindra OA Coding Questions with Solutions | tech mahindra coding questions | 3,800 | 17
9. LTIMindtree Selection Process 2026 | ltimindtree selection process | 5,200 | 20
10. Mphasis Coding Round Questions and Pattern | mphasis coding questions | 2,400 | 15
11. Goldman Sachs Engineering Campus OA Pattern 2026 | goldman sachs campus oa | 6,500 | 32
12. JPMorgan Code for Good 2026 Past Questions | jpmorgan code for good questions | 4,800 | 28
13. Morgan Stanley CodeAthon Previous Year Questions | morgan stanley codeathon | 3,200 | 26
14. D.E. Shaw OA Pattern and Eligibility 2026 | de shaw oa pattern | 2,900 | 30
15. Microsoft Engage 2026 Application Tips | microsoft engage 2026 | 5,500 | 34
16. Google STEP Internship India Application Guide | google step internship india | 8,200 | 38
17. Amazon SDE Intern Hiring Process India 2026 | amazon sde intern india | 11,000 | 36
18. Atlassian Internship India Recruitment Process | atlassian internship india | 1,800 | 22
19. Adobe MDSR Off Campus Hiring Guide | adobe mdsr off campus | 2,100 | 24
20. Salesforce Futureforce India 2026 | salesforce futureforce india | 1,600 | 25
21. Walmart Global Tech India SDE Hiring | walmart global tech india | 2,800 | 26
22. Oracle OCI Off Campus Eligibility 2026 | oracle off campus 2026 | 3,400 | 21
23. SAP Labs India Internship Hiring Process | sap labs india internship | 2,200 | 20
24. Samsung PRISM 2026 Selection Process | samsung prism 2026 | 4,600 | 23
25. Qualcomm India Off Campus Drive Guide | qualcomm india off campus | 1,900 | 22
26. NVIDIA India Recruitment Process for Freshers | nvidia india freshers | 2,400 | 24
27. Texas Instruments India Eligibility 2026 | texas instruments india eligibility | 1,400 | 18
28. Cisco India Off Campus 2026 Pattern | cisco off campus 2026 | 2,100 | 21
29. VMware India Fresher Hiring Guide | vmware india freshers | 1,200 | 19
30. Razorpay Campus Hiring 2026 Process | razorpay campus hiring | 1,800 | 26
31. Zerodha Software Engineer Internship India | zerodha software internship | 1,400 | 24
32. CRED Engineering Hiring Process India | cred engineering hiring | 1,100 | 25
33. Swiggy Campus Recruitment 2026 | swiggy campus recruitment | 1,600 | 22
34. Zomato Hyperpure Tech Internship Guide | zomato tech internship | 900 | 19
35. Flipkart GRiD 6.0 Past Problems and Tips | flipkart grid past problems | 5,200 | 28
36. Myntra HackerRamp 2026 Guide for Women in Tech | myntra hackerramp 2026 | 2,800 | 23
37. PhonePe Campus Hiring SDE Process | phonepe campus hiring | 2,100 | 24
38. Paytm Build for India 2026 | paytm build for india | 1,700 | 22
39. Zoho Off Campus Drive 2026 Pattern | zoho off campus 2026 | 4,400 | 18
40. Freshworks Recruitment Process India | freshworks recruitment india | 1,300 | 20

**Cluster B: DSA + System Design + Core CS (30 articles, MOFU)**

41. Top 75 DSA Questions Asked in TCS Infosys Wipro 2026 | dsa questions tcs infosys wipro | 12,000 | 30
42. Striver SDE Sheet vs Love Babbar 450 — Which to Pick | striver sde sheet vs love babbar | 8,800 | 26
43. How to Solve Sliding Window Problems in 30 Minutes | sliding window dsa | 14,000 | 42
44. DSA Roadmap for 3rd Year B.Tech Students | dsa roadmap 3rd year | 6,500 | 28
45. Dynamic Programming Patterns for Indian Placements | dp patterns placements | 4,200 | 32
46. Graph Algorithms Cheatsheet for Campus Interviews | graph algorithms cheatsheet | 7,800 | 35
47. System Design Basics for Freshers India | system design freshers india | 9,200 | 30
48. Low Level Design Questions Asked at Indian Startups | lld questions startups india | 3,400 | 28
49. URL Shortener Design — Walkthrough for Beginners | url shortener system design | 6,600 | 38
50. Design a Rate Limiter — Step-by-Step Guide | rate limiter system design | 5,400 | 36
51. OS Interview Questions Asked in 2025-26 Drives | os interview questions | 8,400 | 30
52. DBMS Questions for TCS Infosys Cognizant | dbms questions tcs | 9,100 | 24
53. Computer Networks Interview Questions India | computer networks interview | 7,200 | 26
54. OOPS Concepts with Java Examples for Placements | oops java placements | 11,000 | 32
55. SQL Queries Asked in Campus Placements 2026 | sql queries campus placements | 6,800 | 25
56. Top 50 Aptitude Questions for TCS NQT 2026 | aptitude questions tcs nqt | 16,000 | 22
57. Verbal Ability Practice for Infosys SP | verbal ability infosys sp | 4,400 | 20
58. Logical Reasoning Patterns in Cognizant GenC | logical reasoning cognizant | 3,800 | 21
59. Quant Tricks for Wipro Elite Test | quant tricks wipro elite | 3,200 | 19
60. How to Use a Spaced Repetition System for DSA | spaced repetition dsa | 2,400 | 36
61. Mastery Tracking — How Top Coders Measure Progress | mastery tracking coding | 1,800 | 30
62. Pair Programming for Mock Interviews India | pair programming mock interviews | 1,400 | 28
63. Behavioral Interview STAR Method for Indian Students | star method indian students | 2,800 | 26
64. HR Round Questions for TCS Infosys 2026 | hr round questions tcs infosys | 14,000 | 24
65. Tell Me About Yourself — Engineering Fresher Sample | tell me about yourself fresher | 22,000 | 34
66. Why Should We Hire You — 10 Sample Answers | why should we hire you fresher | 18,000 | 32
67. Strengths and Weaknesses for B.Tech Interviews | strengths weaknesses btech | 9,400 | 28
68. Group Discussion Topics for Placements 2026 | gd topics placements 2026 | 12,000 | 30
69. How to Crack TCS NQT in 30 Days | crack tcs nqt 30 days | 8,800 | 25
70. Off-Campus Strategy When You Have 60% Aggregate | off campus low percentage | 4,200 | 22

**Cluster C: Off-Campus + Internship Strategy (15 articles, TOFU+MOFU)**

71. Best Internship Portals for B.Tech Students India 2026 | best internship portals india | 9,800 | 32
72. How to Get a Remote Internship in 3rd Year | remote internship 3rd year | 6,400 | 30
73. LinkedIn Strategy for Off-Campus Placements | linkedin off campus | 5,200 | 34
74. Cold Email Templates for Software Engineering Internships | cold email internship | 4,800 | 38
75. Open Source Contribution for Indian Students — GSoC Path | gsoc indian students | 7,200 | 36
76. How to Apply for FAANG Internships from India | faang internship india | 8,600 | 42
77. Hackathon Strategy for 2nd Year Students | hackathon strategy 2nd year | 3,400 | 28
78. SIH 2026 — Smart India Hackathon Complete Guide | sih 2026 guide | 11,000 | 26
79. Devfolio Hackathon Listings Worth Doing | devfolio hackathons | 2,800 | 22
80. Building a Portfolio Site That Recruiters Open | portfolio site recruiters | 4,400 | 38
81. GitHub Profile Optimization for Placements | github profile placements | 3,800 | 34
82. Should You Take a Bootcamp — Scaler vs AlmaBetter vs Self-Study | scaler vs almabetter | 5,600 | 30
83. Tier 3 College to Product MNC — Real Roadmap | tier 3 college product mnc | 3,200 | 24
84. PPO Conversion Rate at Top Indian Internships | ppo conversion rate india | 1,800 | 26
85. What to Do in Summer Break Before Final Year | summer break final year btech | 4,200 | 28

**Cluster D: Resume, HR, Aptitude, Meta (15 articles, TOFU)**

86. ATS-Friendly Resume Template for Engineering Freshers India | ats resume fresher india | 12,000 | 36
87. Resume Mistakes That Kill Your TCS Application | resume mistakes tcs | 4,400 | 26
88. How Many Projects Should a B.Tech Resume Have | projects btech resume | 5,800 | 30
89. Best Free Certifications for Placement Resume | free certifications placement | 7,200 | 32
90. NPTEL Courses That Recruiters Actually Care About | nptel courses recruiters | 4,800 | 28
91. AWS Certification Worth It for Freshers in India | aws certification freshers india | 8,400 | 34
92. Coursera Plus for Indian Students — Worth It | coursera plus india | 3,400 | 30
93. How to Negotiate Salary as a Fresher in India | negotiate salary fresher india | 6,200 | 32
94. Average Package vs Median Package — Reading Placement Stats | average vs median placement | 1,800 | 24
95. Bond Period at TCS Wipro Infosys — Should You Sign | bond period tcs wipro | 5,400 | 22
96. Notice Period and Joining Bonus Rules for Freshers | joining bonus rules freshers | 2,200 | 26
97. Service Bond Legality in India — What Students Should Know | service bond legality india | 3,600 | 28
98. How to Decline a Job Offer Politely After Accepting | decline job offer fresher | 2,800 | 30
99. Backup Plan if You Don't Get Placed in Final Year | not placed final year | 4,200 | 26
100. PrepNext vs PrepInsta vs GeeksforGeeks — Honest Comparison | prepnext vs prepinsta | 200 | 12

The last article is intentionally a low-volume brand-defense piece. It needs to exist so that when student WhatsApp groups ask "is PrepNext like PrepInsta?", a real, honest, ranking page answers them.

## 5. 30-Day Priorities

1. **Week 1 — Buy `prepnext.in`, fix `index.html` head copy, replace `og-image.svg` with a 1200×630 PNG, add `robots.txt` + `sitemap.xml` (statically generated for the 50 company slugs from Prisma).** Deliverable: live custom domain, GSC verified, correct OG unfurl tested on WhatsApp/LinkedIn/Slack.
2. **Week 1-2 — Add `react-helmet-async` and wire per-route `<Helmet>` to all 18 public routes in `App.tsx`.** Deliverable: every route has unique `<title>`, `<meta description>`, `<link rel="canonical">`.
3. **Week 2 — Implement an Express UA-sniffing prerender middleware that renders Companies/PYQ/DSA/Internships pages with full HTML for crawler bots.** Deliverable: Googlebot sees rendered content; `curl -A Googlebot https://prepnext.in/companies/tcs` returns full HTML.
4. **Week 2-3 — Programmatic SEO ship: rebuild `/companies/:slug` template with H1, FAQ JSON-LD, Organization JSON-LD, BreadcrumbList JSON-LD, and internal links to PYQs + DSA + Application Tracker.** Deliverable: 50 indexable, structured company pages.
5. **Week 3 — Build `/pyq/company/:slug` and `/pyq/company/:slug/:year` listing pages with SSR.** Deliverable: 50+ new PYQ cluster pages indexed.
6. **Week 3-4 — Set up `/blog` with MDX + `gray-matter` + `vite-plugin-mdx`. Publish first 8 articles from Cluster A (TCS NQT, Infosys SP, Wipro Elite, Accenture, Cognizant, Capgemini, Goldman Sachs, Google STEP).** Deliverable: 8 live posts, each ≥1800 words, each linking to relevant `/companies/:slug` and `/pyq/...` pages.
7. **Week 4 — Add `datePublished` + `dateModified` + `author` fields to PYQ submissions schema (`PYQ` Prisma model amend). Add Article JSON-LD to all blog posts. Submit XML sitemap to GSC and Bing.** Deliverable: Freshness signals live; first GSC impressions data starts flowing.

## 6. 90-Day Priorities

1. **Publish 24 blog posts (2/week cadence) covering all of Cluster A's top 16 and 8 from Cluster B.** Each post must screenshot a real PrepNext feature and CTA to signup. Deliverable: 24 indexed posts averaging 2000+ words each.
2. **Launch `/placement-guide` and `/off-campus` hub pages with internal-linking architecture across all 50 company spokes.** Deliverable: two new pillar pages targeting "campus placement guide india 2026" and "off campus drive 2026" head terms.
3. **Build a public PYQ contributor leaderboard with author profile pages (`/u/:displayName`).** Solves E-E-A-T problem — each PYQ has a real attributed author. Deliverable: 100+ author profile pages indexed, badge system for "Verified Contributor".
4. **Add OG card generation per certificate (`@vercel/og` or `satori`) so every `/verify-certificate?code=XXX` share unfurls with the student's name + course + score.** Drives viral LinkedIn loop. Deliverable: dynamic OG endpoint live; track shares with UTM.
5. **Launch a weekly "Placement Pulse" email newsletter — companies hiring this week, new PYQs added, application deadlines.** Use the existing `Companies` + `Notification` tables. Deliverable: 1000+ subscribers via in-app prompt + Landing capture.
6. **Backlink campaign: target 30 college TPO (Training & Placement Office) pages for backlinks by offering free college-branded PrepNext dashboards.** Tier 2/3 college TPO pages have surprisingly strong DA. Deliverable: 30 do-follow backlinks from `.edu.in` or `.ac.in` domains.
7. **Migration decision point at Day 90: review GSC data — if organic is >2000 sessions/month and growing, commit to Next.js migration in Q2 for proper SSR. If <500 sessions/month, keep prerender middleware and double down on content velocity instead of infra.** Deliverable: written go/no-go memo with data.

## 7. Metrics to Track

| Metric | Day 30 Target | Day 90 Target | Tool |
|---|---|---|---|
| Indexed pages (GSC) | 80+ | 250+ | Google Search Console |
| Organic sessions / month | 150 | 2,000 | GA4 + GSC |
| Branded "prepnext" queries / month | 50 | 500 | GSC Performance |
| Non-branded clicks / month | 100 | 1,500 | GSC Performance |
| Avg position for top-20 BOFU keywords | 35 | 18 | GSC + Ahrefs free |
| Referring domains | 5 | 35 | Ahrefs / Ubersuggest |
| `.edu.in` / `.ac.in` backlinks | 0 | 15 | Manual + Ahrefs |
| Blog posts published | 8 | 24 | Internal |
| Avg blog post word count | 1,800 | 2,200 | Internal |
| Avg time on `/companies/:slug` | 45s | 90s | GA4 |
| Signups attributable to organic (UTM) | 25 | 400 | GA4 + `User.createdAt` join |
| Signup → first PYQ submission rate | n/a | 8% | Prisma analytics on `PYQ` table |
| PYQ submissions / week | 5 | 50 | DB query on `PYQ.createdAt` |
| Newsletter subscribers | n/a | 1,000 | Resend / Buttondown |
| OG unfurl success rate (WhatsApp test) | 100% | 100% | Manual QA |
| Core Web Vitals — LCP on `/companies/:slug` | <2.5s | <2.0s | PageSpeed Insights |
| Time to first byte on prerendered routes | <600ms | <400ms | Vercel Analytics |

**North-star content metric: PYQ submissions per week.** This is the only metric that compounds — every PYQ submitted is a new long-tail page that ranks for "{company} {year} {round} questions". Blog posts decay; user-generated structured content compounds. If PYQ submissions are not growing week-over-week by Day 60, the content engine is not working regardless of what GSC says about blog traffic.
