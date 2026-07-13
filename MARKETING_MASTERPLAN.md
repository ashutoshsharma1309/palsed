# MARKETING REPORT

> **Audit note (June 2026):** The `index.html` `<title>` / OG / Twitter "Adaptive AI Learning Universe" identity mismatch flagged in this report has since been **resolved** — the document head now ships the PrepNext placement-prep positioning. Treat references to that specific mismatch below as historical; other findings may still be open.

## 1. Executive Summary

- **Your positioning is fighting itself.** The `index.html` head tag still markets PrepNext as an "Adaptive AI Learning Universe," but the Landing route, Companies vault, PYQ Vault, and Applications kanban explicitly sell a "Placement Season OS." Every paid click and SEO impression is currently confusing two different ICPs (general learners vs. placement-season engineering students). Fix copy alignment before spending a single rupee on Google Ads.
- **You are unindexable today.** SPA-only Vite build + no SSR/prerender + no sitemap + no robots.txt + `prepnext.vercel.app` (subdomain, no E-A-T) means Googlebot sees an empty shell on `/companies/:slug`, `/dsa/:slug`, `/pyq`. Competitors like PrepInsta, GeeksforGeeks, and IndiaBix dominate exactly these long-tail queries ("TCS NQT previous year questions," "Accenture OA pattern 2026") because they ship static HTML. This is the single highest-leverage fix.
- **In the ₹0/month bootstrap scenario,** the only viable channels are: (a) programmatic SEO on company-specific PYQ pages (you already have the data model — `Company`, `PYQ`, `DsaProblemStatus`), (b) Reddit (r/developersIndia, r/JEEAdv, r/Btechtards, r/csMajors) with founder-led posts, (c) college WhatsApp/Telegram seeding via campus ambassadors, and (d) shipping the Certificate flow with a public `/verify-certificate` page as a viral hook. Forget Meta/Google Ads at zero budget.
- **In the ₹5L/month seed scenario,** the winning mix is roughly 40% Google Search Ads on bottom-funnel placement intent, 25% YouTube pre-roll on placement-prep creators (Striver, Apna College, CodeHelp), 15% Instagram Reels with founder-led content, 10% campus ambassador program (200 colleges), 5% LinkedIn (TPO/placement-cell B2B2C play), 5% Reddit/X content amplification. Avoid Meta cold prospecting — Indian student CPMs are cheap but intent is poor.
- **Your real moat is workflow, not content.** Unstop has events, GFG has tutorials, LeetCode has problems. Nobody owns the "applications kanban + per-company prep kit + PYQ vault" workflow. Marketing must lead with that — not with "AI tutor" (Groq is a commodity) and not with "DSA practice" (you have ~150 problems vs. LeetCode's 3000+).

## 2. Current State

Honest read: PrepNext is a hackathon project with 18 signups, zero paid users, no domain, no SEO surface, no analytics instrumentation visible in the recon, and a head tag that contradicts the landing page. The product is genuinely differentiated (the Companies vault + Applications kanban + PYQ Vault workflow is a real wedge), but **nothing about your current marketing surface communicates that**.

The brand is invisible. "PrepNext" as a search term returns nothing useful on Google India. The site lives on `prepnext.vercel.app` which (a) signals "not a real company" to students and parents, (b) tanks E-A-T for SEO, (c) prevents you from running Google Ads with sitelinks/structured snippets properly, and (d) cannot host a corporate email for outreach.

Product-marketing fit is also off. The `<title>` says "Adaptive AI Learning Universe." The OG description says "AI-powered adaptive learning and placement-prep platform." But the actual landing copy (per your recon) says "zero AI calls" placement OS. If a journalist, TPO, or student lands on the site after seeing an ad, they get whiplash. This kills every funnel before it starts.

There is no content engine. No blog, no YouTube channel, no Twitter presence (X), no LinkedIn page, no Reddit footprint. The 18 signups likely came from direct WhatsApp shares — that's not a channel, that's a favor. The Certificate feature with `verifyCode` and a public verification page (`/verify-certificate`) is the single most viral feature in the schema and it is not being marketed at all.

Competitively, you are entering a saturated category. PrepInsta owns "TCS NQT prep" SEO. GeeksforGeeks owns "DSA practice." Unstop owns "campus hiring events." LeetCode owns "coding interviews." Scaler/Coding Ninjas own paid "placement bootcamps." Your ONLY positioning gap is **workflow / OS** — the kanban tracker, the per-company prep kit bundling, the SRS review queue tying it all together. That's what you sell.

## 3. Critical Issues

| # | Issue | Impact | Effort | Priority |
|---|-------|--------|--------|----------|
| 1 | `index.html` `<title>` and OG/Twitter meta sell "Adaptive AI Learning Universe" while Landing markets placement-OS — every ad click lands on contradictory copy | Catastrophic | 1 hour | P0 |
| 2 | No SSR/prerender on Vite SPA — `/companies/:slug`, `/dsa/:slug`, `/pyq` are empty shells to Googlebot; programmatic SEO is impossible today | Catastrophic | 1-2 weeks | P0 |
| 3 | No custom domain (`prepnext.vercel.app`) — kills E-A-T, ad trust, and outbound email deliverability | Critical | 1 day + ₹800/yr | P0 |
| 4 | No `sitemap.xml`, no `robots.txt`, no JSON-LD (Organization/WebSite/FAQPage despite real FAQ on Landing), no canonical URLs | Critical | 2-3 days | P0 |
| 5 | No analytics — no PostHog/Plausible/GA4, no Meta Pixel, no Google Tag, no conversion tracking. You cannot run paid ads without this | Critical | 1 day | P0 |
| 6 | Dead routes (`/courses`, `/roadmaps`, `/tutor`) and unused Prisma models (Course/Roadmap/Tutor) bloat bundle and confuse positioning | High | 1 day | P1 |
| 7 | Certificate verification (`/verify-certificate`) is the most shareable feature in the app and has zero marketing scaffolding (no LinkedIn share button, no auto-generated OG image per cert) | High | 3-5 days | P1 |
| 8 | No founder presence on X / LinkedIn / r/developersIndia — Indian student-tool category is won by founder-led content (cf. Anuj Kumar Sharma / TUF, Striver, Kunal Kushwaha) | High | Ongoing | P1 |
| 9 | No college ambassador / TPO outreach playbook — placement cells are the single highest-LTV B2B2C channel and you have zero motion here | High | 2 weeks | P1 |
| 10 | No email lifecycle (welcome, OA reminders from Placement Calendar, weekly digest of new PYQs) — the SRS + Calendar models are perfect for retention emails and you're sending zero | High | 1 week | P2 |
| 11 | Only ~150 DSA problems vs. LeetCode 3000+ / GFG ~5000 — you cannot win SEO on "DSA problem" head terms; must pivot SEO strategy to PYQ + company-specific long-tail | High | Strategic | P1 |
| 12 | No social proof on Landing (no testimonials, no "X students from IIIT/NIT/VIT use PrepNext," no Product Hunt badge, no GitHub stars if open-source) | Medium | 1 week | P2 |

## 4. Recommendations

### 4.1 Fix the positioning collision in `index.html` TODAY

Open `client/index.html` and rewrite the head. The current copy ("Adaptive AI Learning Universe," "AI-powered adaptive learning") is actively hurting you. Replace with:

```html
<title>PrepNext — Your Placement Season Operating System</title>
<meta name="description" content="Track 50+ company drives, crowd-sourced PYQs, DSA practice, and your full application pipeline in one workspace. Built for Indian engineering students chasing campus placements, internships, and off-campus offers." />
<meta name="keywords" content="campus placement preparation, PYQ vault, placement tracker, TCS NQT, Infosys, Accenture OA, Wipro placement, DSA practice, engineering placement, internship tracker India" />
```

Update OG + Twitter cards to match. Generate a new `og-image.png` (not SVG — LinkedIn and WhatsApp don't reliably render SVG previews) showing the Applications kanban screenshot with the tagline. This is a 1-hour fix that immediately improves every link share.

### 4.2 Solve the SSR problem — use Vercel's `@vercel/og` + a prerender layer

Your `App.tsx` lazy-loads everything behind Suspense — Googlebot sees nothing on `/companies/Razorpay` or `/pyq`. Three options, ranked:

1. **Migrate to Next.js 15 App Router** (correct long-term answer). The codebase is already React 19 + Vercel + Supabase + Prisma — Next.js is the natural home. The `routes/Companies.tsx`, `CompanyDetail.tsx`, `Pyq.tsx`, `DsaProblem.tsx` files map cleanly to `app/companies/page.tsx`, `app/companies/[slug]/page.tsx`, etc. Use `generateMetadata()` per route. This is a 2-3 week migration but unblocks all SEO.
2. **Add `react-snap` or `vite-plugin-ssr` for static prerendering** of public routes only (`/`, `/companies`, `/companies/:slug`, `/pyq`, `/verify-certificate`, `/dsa`). Faster (3-5 days) but a tech-debt detour.
3. **Build a parallel server-rendered `/blog/*` and `/companies/*` surface in Express** that serves static HTML with the same data, and let the SPA handle authed routes. Pragmatic for a hackathon team.

Pick option 1 if you raise. Option 2 if bootstrapped.

### 4.3 Programmatic SEO is your ONLY scalable SEO play

You cannot out-content GeeksforGeeks. You can out-structure them. Your `Company` model + `PYQ` model + `DsaProblem` model are a programmatic SEO goldmine:

- `/companies/tcs/pyq` — "TCS NQT Previous Year Questions 2026 | PrepNext"
- `/companies/accenture/oa-pattern` — "Accenture OA Pattern 2026 | PrepNext"
- `/companies/razorpay/dsa-questions` — "Razorpay DSA Interview Questions | PrepNext"
- `/pyq/{company}/{year}/{round}` — long-tail PYQ pages
- `/colleges/iiit-hyderabad/placement-stats` — if you can scrape/seed college-level data

Target keywords: "[company] previous year questions," "[company] OA pattern," "[company] interview experience [year]." These have low competition (PrepInsta is the only serious competitor) and high commercial intent — every student searching this is 4-12 weeks from a placement decision.

Generate 500-2000 of these pages from your existing data. Add FAQPage JSON-LD per page (you already have an FAQ on Landing — extend that schema).

### 4.4 Buy `prepnext.in` or `prepnext.app` THIS WEEK

`.in` is ₹800/year on GoDaddy/Namecheap and signals "Indian product" to your ICP. Set it up with Vercel custom domain (5 minutes), point email via Google Workspace (₹125/user/month) or Zoho Mail (free for one user). Without this, you cannot:
- Run Google Ads with brand trust
- Send cold outreach to TPOs (`founder@prepnext.in` not `prepnext@gmail.com`)
- Apply to Product Hunt / YC / Sequoia Surge / Antler

### 4.5 Ship analytics on day 1 of paid spend

Install: PostHog (free up to 1M events) for product analytics, Plausible or Vercel Analytics for privacy-friendly traffic, Google Tag Manager → GA4 + Google Ads conversion + Meta Pixel. Define and instrument 5 events: `signup_complete`, `pyq_view`, `company_view`, `application_created`, `dsa_problem_attempted`. Without these, every ad rupee is blind.

### 4.6 Channel strategy — Bootstrap (₹0/month)

**Reddit (highest ROI, 6-8 hours/week):** Don't post links. Write genuine long-form posts in r/developersIndia, r/Btechtards, r/csMajors, r/Indian_Academia. Examples: "I scraped 50 company hiring patterns from 2024 placements — here's what I found" → embed PrepNext screenshots → soft CTA in comments. Founder account, transparent about being the maker. Aim for 1 quality post/week. The Indian dev Reddit is starved for genuine resources.

**Twitter/X (founder-led):** Post daily for 90 days. Format: screenshots of the Applications kanban, "how I tracked 47 applications this season," company-specific PYQ threads ("TCS NQT 2025 pattern, decoded"). Tag @striver_79, @Anuj_kumar_Sha2, @kunalstwt for engagement. Building in public works in this niche.

**LinkedIn (TPO + student dual play):** Student posts = certificate flexes ("Just hit 100-day DSA streak on PrepNext — verify here"). TPO posts = case studies ("How VIT Vellore placement cell tracked 2,400 students through PrepNext"). The Certificate `/verify-certificate` route IS your LinkedIn growth loop — every issued cert is a recruiter-visible backlink.

**Reddit + Telegram + Discord seeding via campus ambassadors:** Recruit 1 ambassador per college from your 18 signups. Give them a Notion playbook + free Pro tier (if/when you have one) + ₹500/month gift card if they hit 50 referrals. Target 25 colleges in 90 days.

**Content engine — YouTube Shorts (60-90s, 3x/week):** Topics: "TCS NQT 2026 — what changed," "How to crack Razorpay in 2026," "5 Indian startups hiring 3rd-years right now." Founder face on camera. The placement-prep YouTube audience is enormous and underserved by founder content.

**Email — Resend free tier (3k/month) + React Email:** Welcome email, weekly "5 new PYQs added" digest, OA reminder 24h before company deadline (you have `Placement Calendar` data). Retention is free, do it.

### 4.7 Channel strategy — Seed-funded (₹5L/month)

| Channel | Monthly Spend | Rationale |
|---------|---------------|-----------|
| Google Search Ads | ₹2,00,000 | Bottom-funnel keywords: "TCS NQT prep," "Accenture OA," "campus placement tracker." Expect ₹8-15 CPC, target ₹25-50 CPS (cost per signup) given Tier-1 student intent |
| YouTube pre-roll | ₹1,25,000 | Skippable pre-roll on Striver / Apna College / CodeHelp / take U forward / Aman Dhattarwal channels via Google Ads placement targeting. Indian student CPM is ₹15-40 |
| Instagram Reels (paid + organic) | ₹75,000 | Reels ads targeted to 18-23 yr-olds in engineering college pincodes. Creative: kanban screen recordings, "POV: you're tracking 30 placement drives" |
| Campus ambassador program | ₹50,000 | 200 colleges × ₹250/mo retainer for verified ambassadors. ROI is brutal but compounding |
| LinkedIn (TPO outreach + content) | ₹25,000 | LinkedIn Sales Navigator + Lemlist for TPO/placement-cell outbound. The B2B2C play |
| Reddit Promoted Posts + X Ads | ₹15,000 | r/developersIndia (small but high-intent), X campaign targeting Indian tech audience |
| Tools/MarTech (PostHog Cloud, Customer.io, Ahrefs, Resend Pro) | ₹10,000 | Required infrastructure |

Total: ~₹5L. Reserve 20% for creative production (video editor on retainer, designer for OG images/college landing pages).

### 4.8 The two campaigns to run first

1. **"Placement Season 2026" launch** — coincide with the August-October on-campus season. Landing page `/placement-season-2026`, Google Ads on every top-50 company name, founder-led X/LinkedIn thread, Reddit AMA in r/developersIndia.
2. **"Verify on PrepNext" certificate viral loop** — every completed prep kit issues a signed certificate with public verification. Auto-generate a LinkedIn-share-optimized OG image per certificate using `@vercel/og` reading the `Certificate` model's `verifyCode`. Each shared cert = 50-200 LinkedIn impressions from the issuer's network. This is your single best free-distribution mechanism and it's already 80% built.

## 5. 30-Day Priorities

1. **Day 1-2: Fix `index.html` head + buy `prepnext.in` + point Vercel custom domain + set up `founder@prepnext.in` on Google Workspace.** Deliverable: live custom domain, corrected meta tags, working corporate email.
2. **Day 3-5: Install PostHog + GA4 + Meta Pixel + Google Tag Manager. Instrument 5 core events.** Deliverable: PostHog dashboard with signup funnel from landing → auth → onboarding → first-action.
3. **Day 6-10: Generate `sitemap.xml`, `robots.txt`, add JSON-LD (Organization, WebSite with SearchAction, FAQPage on Landing). Add canonical tags via a `<Helmet>` provider (`react-helmet-async`) per route.** Deliverable: Google Search Console verified, sitemap submitted, 0 indexing errors.
4. **Day 11-20: Decide SSR strategy (Next.js migration vs. prerender plugin) and ship public-route prerendering for `/`, `/companies`, `/companies/:slug`, `/pyq`, `/verify-certificate`.** Deliverable: View-source on `/companies/razorpay` shows rendered HTML, not empty `<div id="root">`.
5. **Day 15-25: Launch programmatic SEO — generate 50 pilot pages of `/companies/[slug]/pyq` and `/companies/[slug]/oa-pattern` from existing data. Add FAQPage schema per page.** Deliverable: 100 indexed pages in GSC by day 30.
6. **Day 5-30: Founder content engine — daily X post, 2 LinkedIn posts/week, 1 Reddit long-form/week in r/developersIndia. Topic: placement-prep insights, behind-the-scenes building.** Deliverable: 1000 X followers, 500 LinkedIn followers, 1 viral Reddit post (>500 upvotes).
7. **Day 20-30: Ship Certificate LinkedIn share flow — `@vercel/og` dynamic OG image per `verifyCode`, "Share to LinkedIn" button in `/certificates`, polished `/verify-certificate` page.** Deliverable: 50 certificates issued + shared by day 60.

## 6. 90-Day Priorities

1. **Scale programmatic SEO to 1000+ pages** across `/companies/[slug]/{pyq,oa-pattern,dsa,interview-questions}`, `/pyq/[company]/[year]`, `/internships/[company]`. Target: 50k organic impressions/month by day 90 per Google Search Console.
2. **Launch college ambassador program** — recruit 25 ambassadors across IIITs, NITs, VITs, and Tier-2 engineering colleges. Notion playbook, weekly stand-up call, gamified leaderboard. Target: 2,500 referred signups by day 90.
3. **Ship the "Placement Season 2026" campaign landing page + ads** (only if funded). Google Search Ads on top-50 company brand+prep keywords, YouTube pre-roll on top-10 placement-prep creators. Target: 5,000 paid signups at <₹100 CPS.
4. **Build retention email lifecycle** using your `Placement Calendar` + `SRSItem` + `Notification` models — welcome series (3 emails), weekly digest of new PYQs, 24h-before-OA reminder, dormant-user reactivation at day 14. Target: 35% D7 retention, 20% D30 retention.
5. **Founder-led YouTube channel — 12 long-form videos in 90 days.** Format: "How I'd crack [Company] in 2026," "Placement season teardown — [Year]," "Indian startup hiring decoded." Target: 5,000 subscribers, 100k watch hours (qualifies for monetization but more importantly drives qualified signups).
6. **TPO outbound to 200 colleges** via LinkedIn Sales Navigator + Lemlist sequences from `founder@prepnext.in`. Pitch: free placement-cell dashboard in exchange for student rollout. Target: 10 paid college contracts at ₹50k-2L/year (this is your real revenue path).
7. **Clean up dead routes and Prisma models** (`/courses`, `/roadmaps`, `/tutor`, Course/Roadmap/Tutor schema). This isn't marketing per se — but every kilobyte of bundle bloat hurts LCP, which hurts SEO, which hurts paid ad Quality Score. Delete it.

## 7. Metrics to Track

| Category | Metric | 30-Day Target | 90-Day Target |
|----------|--------|---------------|---------------|
| SEO | Indexed pages (GSC) | 100 | 1,500 |
| SEO | Organic clicks/mo | 200 | 8,000 |
| SEO | Avg position for "[company] PYQ" terms | <40 | <10 |
| SEO | Domain Rating (Ahrefs) | 5 | 15 |
| Acquisition | Total signups | 200 | 5,000 (bootstrap: 800) |
| Acquisition | Signup → activation rate (first PYQ view OR first kanban card) | 40% | 60% |
| Acquisition | CPS (paid scenario) | ₹150 | ₹60 |
| Activation | Day-1 retention | 30% | 50% |
| Retention | Day-7 retention | 18% | 35% |
| Retention | Day-30 retention | 8% | 20% |
| Engagement | DAU/MAU ratio | 12% | 25% |
| Engagement | PYQs viewed per session | 2 | 5 |
| Engagement | Avg applications tracked per active user | 3 | 12 |
| Virality | Certificates issued | 50 | 800 |
| Virality | Certificates shared to LinkedIn | 10 | 250 |
| Virality | K-factor (referred signups / total signups) | 0.05 | 0.20 |
| Content | X followers | 500 | 3,000 |
| Content | LinkedIn page followers | 300 | 2,000 |
| Content | YouTube subscribers | 100 | 5,000 |
| Content | Reddit karma (founder account) | 1,000 | 10,000 |
| B2B2C | TPO conversations started | 10 | 200 |
| B2B2C | College contracts signed | 0 | 10 |
| Revenue (if monetized) | Paying users | 0 | 200 at ₹299/mo |
| Revenue | MRR | ₹0 | ₹60,000 |

**One metric to rule them all:** *Weekly Active Application Trackers* — the count of users who created or updated an `Application` row in the past 7 days. This is the single best proxy for "did PrepNext become this student's placement-season home." If this number is growing 10% week-over-week by day 90, the product is winning. If it's flat, no amount of marketing spend will save it.
