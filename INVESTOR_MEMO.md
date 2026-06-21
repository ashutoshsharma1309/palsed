# INVESTOR REPORT

*Partner memo — PrepNxt (Seed / Pre-Seed evaluation). Author posture: skeptical YC/Sequoia/a16z partner. This is a brutal read, not a cheerleading exercise.*

---

## 1. Executive Summary

- **Verdict at this stage: PASS, with an option to re-engage in 6 months.** PrepNxt is a credible "workflow product for placement season" idea wrapped in a hackathon shell — 18 signups, no revenue, no domain, no SEO, no distribution, and a dual-auth stack that screams "still in build mode." There is a real wedge here (placement workflow > content), but nothing in the current repo proves the founder can win against Unstop, PrepInsta, and GFG, all of whom have 7–8 figure user bases and SEO moats.
- **The product has an identity crisis baked into the codebase.** `index.html` still markets "Your Adaptive AI Learning Universe" while the Landing page pitches "zero AI calls placement OS." Prisma still ships `Course`, `Roadmap`, `Tutor*` models that the router (`App.tsx`) explicitly redirects away from. This is the single biggest tell that the founder hasn't decided what PrepNxt actually is. No investor will write a check until that's resolved.
- **The wedge ("Placement Season Operating System" — Companies vault + PYQ Vault + Applications kanban) is the only differentiated thing here.** DSA practice, mock interviews, system design, aptitude, AI tutor — all of that is commodity and directly overlaps with InterviewBit, LeetCode, Coding Ninjas. Strip 60% of the surface area and double down on the kanban + PYQ + recruiter-intel triad. That's where the moat candidate lives.
- **Distribution, not product, is the bottleneck.** Indian campus placement is a known-buyer, known-channel market: T&P cells, campus ambassadors, college WhatsApp groups, and r/Indian_Academia / r/developersIndia. With no domain, no SEO, no SSR, and 18 signups after a hackathon launch, the founder hasn't yet demonstrated they can acquire users at zero cost — which is the only viable GTM at this stage given there's no monetization.
- **The "why now" is weak but real.** 2024–2026 placement seasons in India have been historically bad (mass deferrals at Infosys/Wipro/TCS, hiring freezes at startups), and there is genuine student anxiety about prep workflow. PYQs are gated behind paid Telegram groups and college seniors. A free, crowd-sourced PYQ vault tied to a kanban tracker is a real opening — but only if it ships before someone at Unstop notices.

**Investment score (1–10 each):**

| Dimension | Score | One-line rationale |
|---|---|---|
| Product | 4/10 | Broad surface, no PMF signal, identity crisis in meta tags and schema |
| Market | 8/10 | ~1.5M engineering grads/yr in India, real pain, proven willingness to pay (PrepInsta, Scaler) |
| Moat / Defensibility | 2/10 | Nothing here a competitor couldn't ship in a sprint. PYQ network effect is the only candidate |
| Revenue Model | 1/10 | Doesn't exist. Zero paid users, no pricing page, no payment integration |
| Why Now | 6/10 | Placement crunch is real; AI tutor angle is overcrowded; workflow angle is fresh |
| Founder Fit | 5/10 | Can ship (impressive surface area for hackathon), but hasn't focused. No signal on distribution chops |
| **Overall** | **4.3/10** | **Not investable today. Promising-enough to track.** |

---

## 2. Current State

Let me be direct: this is a hackathon project with ambitions of being a company, and the gap between the two is exactly what the seed check would have to fund. That's fine — most pre-seed bets look like this — but the founder needs to internalize that they are at **Day 0**, not Day 90.

**What's actually true today:**

- **18 real signups.** That's not "early traction," that's friends-and-family + a hackathon demo. For comparison, Unstop reports 8M+ users; PrepInsta does 1M+ monthly organic visits.
- **No domain.** `prepnext.vercel.app` is a credibility killer in the Indian student market — students will literally not trust a `.vercel.app` URL with their college email. T&P cells won't link to it. This is a $12/yr fix being deferred for no reason.
- **No SEO surface.** The codebase confirms it in `8_GAPS`: no canonical URL, no robots meta, no JSON-LD, no sitemap, SPA-only with no SSR/prerender. Every route — `/companies/:slug`, `/dsa/:slug`, `/pyq` — is a giant SEO opportunity (these are exact-match long-tail queries like "TCS NQT previous year questions") and right now Google sees an empty shell.
- **No monetization path implemented.** No Stripe, no Razorpay, no pricing page, no paywall, no `Subscription` model in Prisma. The schema has `Certificate` (interesting — paid cert is a known Indian monetization lever, see PrepInsta/Scaler) but no payment hook.
- **Stack is solid but over-built for 18 users.** Prisma 7, Supabase Auth + legacy JWT, Groq SDK, Monaco editor, Mermaid, jspdf, html2canvas, qrcode, Framer Motion — the bundle is heavy and the surface is enormous. This is the classic hackathon trap: building features instead of users.
- **Auth is technical debt already.** `passwordHash` nullable, two auth systems coexisting (`routes/auth.js` legacy JWT + Supabase), `runtime-config.json` dance with random ports. None of this matters for users today but it will rot fast.
- **The "AI Tutor" feature is a strategic liability.** Groq SDK costs money per request, has no monetization, and competes directly with ChatGPT/Claude/Gemini which students already use for free. `TutorThread`/`TutorMessage` models exist; this should be on the chopping block in week 1.

**What's actually good:**

- Companies vault with 50 curated entries (eligibility, packages, rounds, OA platforms, tips) is genuinely useful and not trivially scraped. **This is the strongest asset in the product.**
- PYQ Vault with crowd-sourced submission + voting is the right primitive for a network-effect business in this space.
- Applications kanban is a smart wedge — it changes the relationship from "content consumer" to "workflow user," which is much stickier (Notion vs Wikipedia).
- Engagement analytics (`EngagementDay`, `EngagementIntervention`, `FocusMode`) suggest the founder thinks about retention, which is a positive signal.
- Spaced repetition (SM-2 lite in `SRSItem`) — fine implementation, but commodity.

---

## 3. Critical Issues

Ranked by impact on whether this company exists in 12 months.

| # | Issue | Impact | Effort | Priority |
|---|---|---|---|---|
| 1 | **Positioning incoherence.** `index.html` says "Adaptive AI Learning Universe," Landing says "zero AI calls placement OS." Until founder picks ONE narrative, no SEO, no PR, no investor pitch lands. | Existential | 1 day | P0 |
| 2 | **Zero distribution / no domain / no SEO.** Routes like `/companies/:slug` and `/pyq` are exact-match SEO goldmines, currently dark. `prepnext.vercel.app` is unshareable in the Indian college context. | Existential | 1 week | P0 |
| 3 | **Surface area is 3x too large for 18 users.** DSA tracker + System Design + Core CS + Aptitude + Mock Interviews + Mastery + SRS + Internship feed + Adaptive learning + AI Tutor. Kill 60%. | Severe | 1 week (deletion) | P0 |
| 4 | **No revenue model, no pricing experiment.** Indian students DO pay (PrepInsta paid courses, Scaler EMIs, Unstop premium). Zero pricing infrastructure means zero learning about WTP. | Severe | 2 weeks | P0 |
| 5 | **Schema/route drift.** Prisma still has `Course`, `Roadmap`, `TutorThread`, `TutorMessage`, `Lesson`, `Chapter`, `LessonProgress` for features the router actively redirects away from. Confusing for any new engineer and signals indecision to a technical investor. | High | 2 days | P1 |
| 6 | **Dual auth stack (legacy JWT + Supabase).** `passwordHash` nullable, two code paths, brittle `runtime-config.json` flow on Vercel. Pick Supabase, delete `routes/auth.js`, migrate or invalidate old sessions. | High | 3 days | P1 |
| 7 | **No moat candidate has been pressure-tested.** PYQ Vault is the only thing approaching a network effect. Needs aggressive seeding (1000+ PYQs across top 50 companies) before any competitor notices. | High | 4 weeks | P1 |
| 8 | **SPA-only, no SSR/prerender.** With React 19 + Vite, you should be using `vite-plugin-ssr` / Vike or migrating the SEO-critical routes (`/companies/*`, `/pyq`, `/`) to Next.js. Crawlers see an empty shell today. | High | 2 weeks | P1 |
| 9 | **Groq SDK is a cost time-bomb with no revenue offset.** AI Tutor competes with ChatGPT (free) and has no paywall. Either rip it out or paywall it day one. | Medium | 1 day to rip | P1 |
| 10 | **No defensibility narrative for investors.** "Workflow OS for placements" is the only honest answer. The pitch should not mention "adaptive AI" — that's a feature, not a moat. | High | 1 day | P0 |
| 11 | **Bundle bloat: Monaco + Mermaid + jspdf + html2canvas + qrcode + Framer Motion** all eagerly available. On Indian mobile (Jio 4G, mid-range Android), this is brutal. | Medium | 1 week | P2 |
| 12 | **Vercel-only deploy with serverless Express + Prisma 7 pg adapter.** Cold-starts will bite on `/api/pyq` once you have any volume. Plan migration to long-running server or edge runtime. | Medium | Later | P3 |

---

## 4. Recommendations

These are specific to PrepNxt's actual codebase and competitive position. No generic "do PMF interviews" platitudes.

### 4.1 Pick the narrative in `index.html` and the Landing page TODAY

The mismatch between `<title>PrepNxt — Your Adaptive AI Learning Universe</title>` and the Landing page's "zero AI runtime" pitch is the single most damaging thing in the repo. Every share, every Google result, every OG unfurl on WhatsApp/LinkedIn currently sells the wrong product.

**Concrete change:**
- `<title>PrepNxt — Placement Season OS for Indian Engineering Students</title>`
- `<meta name="description" content="Track applications, study previous-year questions from 50+ top recruiters, and crack campus placements. Free for students.">`
- Strip "adaptive AI learning" everywhere. It's not what you sell.
- Update OG image (`/og-image.svg`) to reflect "Companies Vault + PYQ + Kanban," not generic learning.

### 4.2 Kill features. Aggressively.

Looking at `4_FEATURES` against `9_COMPETITORS`:

- **DSA practice (~150 problems)** — LeetCode has 3000+, free. InterviewBit, Coding Ninjas, GFG have curated tracks. You will lose this fight. **Cut or de-emphasize.** Keep DSA tracking (status/bookmarks/attempts on external problems) but stop trying to be a code-execution platform with Monaco. Link out to LeetCode/GFG.
- **System Design hub, Core CS hub, Aptitude hub** — IndiaBix owns aptitude SEO. GFG owns Core CS. These are content-hub plays you cannot win without 5 years of SEO. **Cut or relegate to a single "Resources" page that links externally.**
- **AI Tutor (`Tutor.tsx`, `TutorThread`, `TutorMessage`, Groq SDK)** — Already legacy-redirected in router. Delete the models, delete the SDK, save the API costs. ChatGPT exists.
- **Course/Chapter/Lesson/LessonProgress/Roadmap models** — Already redirected. Delete from Prisma. The schema drift is a recruiting red flag.
- **Mastery + Mock Interviews + Adaptive learning** — Defer. Not what students convert on.

**Keep, with religious focus:**
- Companies Vault (`/companies`, `/companies/:slug`) — your strongest asset.
- PYQ Vault (`/pyq`, `/pyq/submit`) — your only network-effect candidate.
- Applications Kanban (`/applications`) — your stickiness mechanism.
- Internship Feed (`/internships`) — high-frequency hook.
- Placement Calendar — daily-active driver.
- Certificates (`/verify-certificate`) — your monetization wedge later (see 4.5).

### 4.3 Win SEO on the only routes that matter

The Indian student funnel is 90% Google. Concretely:

- **Migrate to Next.js App Router** OR adopt **Vike/vite-plugin-ssr** for `/`, `/companies`, `/companies/:slug`, `/pyq`. Nothing else needs SSR.
- **`/companies/:slug` should rank** for "TCS placement process," "Google India OA questions," "Goldman Sachs Bangalore eligibility." Each page needs: H1 with company name, dynamic `<title>`, JSON-LD `Organization` for the recruiter + `FAQPage` for the rounds.
- **`/pyq` and PYQ detail pages** should rank for "[Company] previous year questions." This is the cheapest SEO win in the entire Indian ed-tech space because the user intent is razor-specific.
- Ship `sitemap.xml` (auto-generated from `Company` and `Pyq` tables), `robots.txt`, canonical URLs everywhere.
- Add JSON-LD: `Organization` on `/`, `WebSite` with SearchAction, `FAQPage` on Landing (you already have an FAQ section per recon), `Article`/`QAPage` on PYQ detail.

### 4.4 Get a domain. This week.

`prepnxt.in` or `prepnxt.co.in`. Indian students do not trust subdomains. T&P cell coordinators do not link to subdomains. Cost: ₹800/yr. There is no defensible reason this is deferred.

### 4.5 Test monetization with one specific wedge: paid Certificates

You already have a `Certificate` model with `verifyCode` and a public verification page. This is the Indian ed-tech monetization playbook (PrepInsta charges ₹699–₹1499 for "certified prep"). 

- Ship a ₹299 "Verified Placement Prep" certificate tied to completing a company-specific prep kit.
- Razorpay integration (not Stripe — Indian students use UPI).
- Even 5 conversions in 30 days proves WTP and gives you a number to put in front of an investor.
- Do NOT paywall PYQs. Those need to be free to seed the network effect.

### 4.6 Seed the PYQ Vault before anyone notices

`Pyq` is your only defensible primitive. With 18 users you cannot crowd-source — you have to seed.

- Hire 2 interns / pay college campus ambassadors ₹50/PYQ to add 20 PYQs/day for 30 days = ~1200 PYQs across top 50 companies.
- Cross-promote on r/developersIndia, r/Indian_Academia, college subreddits, Telegram placement groups.
- Add a "Submit PYQ → unlock company prep kit" loop. Turn submission into the activation event.

### 4.7 Delete the dual auth stack

`routes/auth.js` (legacy JWT) and Supabase Auth coexisting is technical debt that compounds. Pick Supabase. Delete `routes/auth.js`, `bcryptjs`, `jsonwebtoken`. Force-migrate the existing 18 users to Supabase via password reset email. `passwordHash` should become non-nullable or be dropped.

### 4.8 Fix the runtime-config.json dance

`.ports.json` + `client/public/runtime-config.json` is a dev-mode hack that has no business on Vercel. Use Vite env vars (`VITE_SUPABASE_URL`, `VITE_API_BASE`) baked at build time. This is one of the first things any technical investor's diligence engineer will flag.

---

## 5. 30-Day Priorities

Each item has a concrete, measurable deliverable. No "explore" or "consider."

1. **Day 1–3: Buy `prepnxt.in`, point DNS to Vercel, update Supabase Auth redirect URLs and OAuth callback domains.** Deliverable: production live on `prepnxt.in` with green padlock.
2. **Day 3–5: Rewrite `index.html` head, OG image, all marketing copy to "Placement Season OS." Delete every reference to "Adaptive AI Learning Universe" across `Landing.tsx`, `<title>`, OG/Twitter tags.** Deliverable: single coherent positioning visible in `view-source:`.
3. **Day 5–10: Delete dead code.** Remove `Courses*`, `Roadmaps*`, `Tutor*` routes, components, Prisma models (`Course`, `Chapter`, `Lesson`, `LessonProgress`, `Roadmap`, `TutorThread`, `TutorMessage`), `groq-sdk` dependency, legacy `routes/auth.js`, `bcryptjs`, `jsonwebtoken`. Run `prisma migrate`. Deliverable: bundle size reduced by ≥30%, schema reduced by ≥6 models.
4. **Day 10–20: Migrate `/`, `/companies`, `/companies/:slug`, `/pyq` to SSR.** Easiest path: introduce Vike on the existing Vite setup, or fork to Next.js 15 App Router if the founder is willing. Ship `sitemap.xml`, `robots.txt`, JSON-LD on Companies pages. Deliverable: Google Search Console shows ≥50 pages indexed.
5. **Day 15–25: Seed 500 PYQs across top 20 companies** (paid ambassadors / Fiverr / interns at ₹50/PYQ). Deliverable: PYQ count visible on Landing page, ≥500 in `Pyq` table.
6. **Day 20–30: Ship Razorpay-powered ₹299 Verified Certificate flow** tied to one company prep kit. Deliverable: at least 1 paid transaction (even if it's the founder's friend) to validate end-to-end checkout.
7. **Day 25–30: Launch on r/developersIndia, r/Indian_Academia, Twitter (#PlacementSeason), and outreach to 20 T&P cells.** Deliverable: 500 signups (28x current), ≥100 PYQs submitted by real users.

---

## 6. 90-Day Priorities

1. **Reach 5,000 signups and 500 weekly active.** Without this, no seed conversation is real. Focus channels: SEO (PYQ long-tail), college ambassadors (CR / placement coordinator commission), Reddit, Twitter, LinkedIn (job-seeker posts).
2. **Hit 50 paid Certificate transactions** (~₹15,000 revenue). Trivial in absolute terms, but proves WTP and unlocks "paying users" in the deck.
3. **Build the Company Prep Kit as a productized SKU.** Right now it's a concept ("Per-Company Prep Kits bundling DSA + sysdesign + behavioral + PYQs"). Make it a real, packaged, shareable URL per company. This becomes the unit of virality and monetization.
4. **Ship a Chrome extension that auto-detects job postings on LinkedIn/Naukri/Unstop and one-clicks them into the Applications kanban.** This is the single most underrated wedge in the product. It turns PrepNxt into a daily-open tool, not a study site. Files involved: new `extension/` directory, reuses `Application` model.
5. **Hire / contract a campus ambassador program** — 50 ambassadors across 50 colleges, paid in cash + certificates. Deliverable: ambassador dashboard (reuses engagement analytics infra) + ≥10 PYQs/college/month.
6. **Get featured in 5 college placement-prep guides / T&P newsletters.** Outbound to college placement officers. They control the channel.
7. **Cut Supabase + Vercel costs to <₹5000/month and document unit economics** — CAC, activation rate, % returning weekly, average PYQs viewed per session. Deliverable: a one-page metrics dashboard in `/engagement` (admin view).

---

## 7. Metrics to Track

Specific numbers. If the founder can't hit these in 90 days, the thesis is wrong and they should know early.

| Metric | Today | 30-day target | 90-day target | Why it matters |
|---|---|---|---|---|
| Total signups | 18 | 500 | 5,000 | Funnel top — proves distribution works |
| Weekly active users (logged in, ≥1 route hit) | unknown, ~5? | 150 | 1,500 | Real engagement, not vanity |
| % WAU/Signups (stickiness proxy) | ~28% | ≥30% | ≥30% | Sub-30% means activation is broken |
| PYQs in database | unknown | 500 | 3,000 | Network-effect raw material |
| User-submitted PYQs (vs seeded) | ~0 | 50 | 800 | Real signal that crowd-sourcing works |
| Applications tracked / WAU | unknown | ≥3 | ≥8 | Workflow stickiness — the actual moat |
| Companies pages indexed by Google | 0 | 50 | 200+ | SEO traction |
| Organic search traffic / month | ~0 | 500 sessions | 10,000 sessions | Only sustainable channel for ed-tech in India |
| Paid Certificate transactions | 0 | 1 | 50 | WTP validation |
| Revenue (₹) | 0 | ₹299 | ₹15,000 | Real revenue, however small |
| AI Tutor cost (Groq) | unknown | ₹0 (deleted) | ₹0 | Killing the cost sink |
| Bundle size (gzipped, Landing) | unknown, likely 400KB+ | <250KB | <200KB | Indian mobile users on Jio 4G |
| Time-to-first-PYQ-view (new user) | unknown | <60s | <30s | Activation |
| % users with ≥1 application in kanban | unknown | 20% | 40% | The kanban is the moat — this metric IS the thesis |
| Domain | vercel.app | prepnxt.in | prepnxt.in | Credibility floor |

---

## Closing partner note

I want to be honest about what would change my mind. A 6-month re-engagement looks like this:

- **Coherent positioning** — one tagline, one OG image, one pitch.
- **Distribution proof** — 5,000+ signups acquired at <₹20 CAC blended, with ≥40% from organic search.
- **One stickiness metric that's elite** — e.g., 60% of WAU have ≥5 applications in their kanban, or 30% of WAU log in 5+ days/week during placement season.
- **A killed feature list longer than the shipped feature list.** Focus is the signal.
- **At least 50 paying users** for the Verified Certificate or company prep kit, even at ₹299. Revenue isn't the point — the *learning loop* is.

Right now, PrepNxt is a feature factory in search of a company. The Companies Vault + PYQ Vault + Applications Kanban triad is a real business idea. Everything else in the repo is noise that is actively hurting the pitch. The founder's job for the next 30 days is to delete more code than they write.

If they do that, this becomes interesting. If they keep adding features, I'll see the same deck in 12 months with 40 signups instead of 18, and the answer will still be no.

**Recommendation: Pass now. Track. Re-engage at 5K signups + ₹15K MRR or strong organic SEO signal, whichever comes first.**
