# STARTUP_PLAN.md

> **Audit note (June 2026):** The `index.html` `<title>` / OG / Twitter "Adaptive AI Learning Universe" identity mismatch flagged in this report has since been **resolved** — the document head now ships the PrepPlace placement-prep positioning. Treat references to that specific mismatch below as historical; other findings may still be open.

*PrepPlace — Master Execution Document*
*Author posture: COO synthesizing 12 specialist reports into one accountable plan.*
*Last updated: 2026-06-20*

---

## 1. Executive Summary

### The 5 highest-impact priorities (across all 12 reports)

1. **Fix the identity crisis at the HTML layer + ship a real domain.** `index.html` still markets "Adaptive AI Learning Universe" while Landing pitches "Placement Season OS." Every CTO/UX/PM/CRO/Marketing/SEO/Growth/Investor report flagged this as the #1 unforced error. Cost: 1 hour of code + ₹800/yr for `prepplace.in`. Impact: every share preview, every Google result, every WhatsApp unfurl currently sells the wrong product.

2. **Migrate all UGC features from `localStorage` to Postgres + prerender the SEO surface.** Applications kanban, PYQ vault, SRS, Mastery, Placement Hub all live in `localStorage` today — that means cross-device usage, demos, and analytics are impossible. Simultaneously, `/companies/:slug` and PYQ pages are SPA-only — invisible to Google. These two fixes unlock both retention and acquisition.

3. **Lock the data plane: kill the legacy auth stack, gate `/api/db/*`, enable RLS, switch Prisma to Supavisor pooler.** `/api/db/*` is an unauthenticated god-mode CRUD endpoint today; dual auth (JWT + Supabase) creates support load and audit risk; serverless cold starts will exhaust Supabase's 60-connection cap at ~500 concurrent users. All P0 security/infra work.

4. **Build the PYQ contribute-to-read flywheel as the moat.** PYQ Vault is the only feature competitors can't easily clone (it requires crowd contribution). Make each verified PYQ a public, indexable page with submitter credit, OG card, Telegram auto-post, and contributor leaderboard. Every PYQ submitted = a new long-tail SEO page + a viral share moment.

5. **Ship the placement-OS workflow trinity end-to-end: Applications Kanban + Per-company Prep Kits + Calendar reminders.** This is the only differentiated wedge (vs. LeetCode/GFG/Unstop/PrepInsta). Quick-add applications from company pages, status transitions surface PYQs/DSA automatically, email reminders 24h before any round. This is the daily-open habit.

### The 5 distractions to deprioritize

1. **DSA practice as a head-on competitor to LeetCode.** ~150 problems vs. LeetCode's 3000+. Reframe `/dsa` as "Company-specific lists" with a "Solve on LeetCode" deeplink. Stop trying to be a code-execution platform.
2. **Monaco editor on mobile + AI Tutor (Groq).** Both are cost/complexity sinks with no monetization. Mobile Monaco is unusable; Groq competes with free ChatGPT.
3. **System Design / Core CS / Aptitude content hubs.** IndiaBix owns aptitude SEO; GFG owns Core CS. Defer to a single "Resources" page that links externally.
4. **Building a Next.js migration as a 6-week project.** Use `vite-plugin-prerender` or `react-snap` for the 100 SEO-critical pages this month. Defer Next.js to Q1 2027 only if needed.
5. **Generic blog content (long listicles).** GFG/InterviewBit win that. Lead with structured programmatic SEO (50 companies × 4 templates = 200 pages) — blog is supporting cast, not the lead.

### The ONE thing that matters most this quarter

**Ship a public, prerendered, programmatically-SEO-optimized `/companies/:slug` template (×50 companies) tied to a crowd-sourced PYQ flywheel that auto-publishes new pages and pings IndexNow on every verified submission.**

Concretely: by Sep 1, 2026, `view-source: prepplace.in/companies/razorpay` must return a fully rendered HTML page with unique `<title>`, JSON-LD (Organization + FAQPage + BreadcrumbList), 10+ verified PYQs visible, "Track this company" CTA wired to the Applications kanban, and dynamic `@vercel/og` image. Plus a verified PYQ submission must trigger a sitemap rebuild + IndexNow ping within 60 seconds. **This is the only loop that compounds — every PYQ submitted creates a new long-tail SEO asset AND a new share-able artefact AND a new reason to come back tomorrow.** Without this, no marketing spend will work.

---

## 2. SWOT Analysis

| | **Helpful** | **Harmful** |
|---|---|---|
| **Internal** | **Strengths** — Sharp wedge ("Placement Season OS" vs. content). 50 curated companies (eligibility, rounds, OA platforms) — defensible content. Well-designed data model (SRS SM-2, mastery EWMA, EngagementDay). Solid stack (Vite + React 19 + Prisma + Supabase). Distinctive design language (neon-on-black, mono labels). Founder ships fast. Certificate `verifyCode` + public verify route already exists. | **Weaknesses** — Identity crisis (HTML head ≠ Landing copy). UGC features in `localStorage` only. `/api/db/*` unauthenticated god-mode. Dual auth stack. No domain. SPA-only — zero SEO surface. 13-item flat nav. No empty states. No analytics. No payment integration. No referral primitive. 9 dead routes + 7 dead Prisma models shipped. Monaco/mermaid/jspdf eagerly bundled. |
| **External** | **Opportunities** — Indian placement season is a 90-day blitz with massive search intent ("TCS NQT PYQ", "Razorpay OA"). PrepInsta's UX is 2015-era and ad-laden. Unstop owns events, not prep workflow. LeetCode is US-coded. Long-tail SEO is wide open. WhatsApp/Telegram virality is native to this audience. Crowd-sourced PYQ vault is a textbook UGC SEO flywheel. College WhatsApp groups are pre-formed distribution channels. Razorpay/UPI ready for ₹199-₹499 tier. | **Threats** — Unstop could ship Applications kanban in a sprint. PrepInsta could prerender and own long-tail. Hiring freezes could reduce placement-prep urgency. Google's Helpful Content Update penalizes unattributed UGC. Supabase free tier caps at 60 connections — connection storm risk. Groq cost runaway (no rate limiting today). Indian campus mail filters reject `vercel.app` magic links. Seasonal demand (Aug–Dec spike, Jan–Jul crash). |

---

## 3. Competitor Matrix

### Feature comparison

| Feature | Who has it | PrepPlace status |
|---|---|---|
| DSA practice (3000+ problems) | LeetCode, GFG, Coding Ninjas, InterviewBit | Has ~150 problems — losing this fight |
| Per-company prep pages (eligibility, rounds) | PrepInsta (ad-laden, 2015 UX), GFG, InterviewBit | Has data for 50, not prerendered — invisible to Google |
| Crowd-sourced PYQ vault with voting | PrepInsta (partial), InterviewBit (experiences), Telegram groups (paid) | Has submit flow + verify model — gated behind auth |
| Applications tracker / kanban | **Nobody** in this category | Has it — but localStorage only, no reminders |
| Mock interview platform | InterviewBit, Pramp, Coding Ninjas | Stub only |
| SRS / spaced repetition for DSA | Anki (general), nobody placement-specific | Has SM-2 implementation — not wired to DB |
| Mastery / skill analytics | LeetCode (basic), Codeforces (rating) | Has EWMA radar — locked in localStorage |
| Campus events / drives | Unstop (dominant), Naukri Campus | None (internship feed is stub) |
| Off-campus drives feed | Naukri Campus, LinkedIn | None |
| Resume builder / ATS check | Zety, Novoresume, Enhancv | None |
| Certificate verification | Coursera, LinkedIn Learning, PrepInsta | Has it (`verifyCode`) — no OG, no share button |
| College leaderboard / cohort | Unstop (limited), Codeforces (per-team) | None — no `Campus` model |
| Coding interview content | LeetCode discuss, GFG, InterviewBit | Weak — competes head-on |
| System Design hub | educative.io, ByteByteGo | Stub |
| Aptitude practice | IndiaBix (dominant), PrepInsta | Stub |
| Per-company DSA tagging ("Asked at X") | LeetCode (paid), GFG (partial) | Possible from PYQ submissions — not wired |
| Free-tier email reminders | None in placement space | Could ship — has Notification model |
| Telegram channel for verified PYQs | Paid Telegram groups | **Not built — huge gap** |
| WhatsApp shareable artefacts | Nobody intentional | Not built |
| Public student profile (LeetCode-style) | LeetCode, Codeforces | Not built |
| Ambassador / campus rep program | Unstop (light), AlmaBetter, Scaler | Not built |

### 10 unique features PrepPlace could build (ranked by Impact ÷ Effort)

| # | Feature | Moat potential | Impact ÷ Effort |
|---|---|---|---|
| 1 | **Company-specific PYQ public pages with submitter credit + Telegram cross-post** | UGC SEO flywheel + virality | Highest — uses existing data |
| 2 | **Campus + cohort leaderboard (`/campus/nit-trichy/2026`)** | Tribal virality, pre-formed WhatsApp groups | Very high — schema + one route |
| 3 | **Applications kanban with calendar sync + 24h-before-round email** | Daily-active habit, no competitor has it | Very high — model exists |
| 4 | **"Offer Card" public page on kanban Offer-stage move** | Social proof + LinkedIn virality | High — single OG endpoint |
| 5 | **Resume Roast tool (public, no signup, watermarked)** | Top-of-funnel viral tool | High — Levels.fyi playbook |
| 6 | **Per-company "Asked at" DSA tagging sourced from PYQ submissions** | Real differentiator vs. LeetCode | High — join existing tables |
| 7 | **Verified senior / ambassador profile with cohort admin** | Distribution moat per campus | Medium-High — requires recruiting |
| 8 | **Chrome extension: one-click "Add to PrepPlace" from LinkedIn/Naukri/Unstop** | Workflow stickiness | Medium-High — new repo |
| 9 | **Weekly placement-pulse digest email (per cohort)** | Retention loop | Medium — Resend + cron |
| 10 | **Public mastery radar profile (`/u/:handle`) for LinkedIn share** | LeetCode-profile-style brand impressions | Medium — opt-in flag + OG |

---

## 4. Product Differentiation — 50 Startup-Grade Ideas

Sorted by overall priority. Revenue ranges assume 10k users, blended 3% Pro conversion at ₹99/mo unless otherwise noted.

| # | Name | User benefit | Business impact | Tech complexity | Revenue potential (₹/mo at 10k users) | Rank rationale |
|---|---|---|---|---|---|---|
| 1 | **PYQ Contribute-to-Read Wall** | Submit 1 verified PYQ → unlock 7 days of Pro vault | High | Med | ₹40k–80k | Moat + SEO + virality compounding |
| 2 | **Public PYQ pages with submitter credit + OG** | Brag-worthy contribution; Google ranks each | High | Med | ₹30k–70k (indirect via signups) | Stack Overflow playbook for placements |
| 3 | **Company-page prerender (×50) with JSON-LD** | Google ranks "Razorpay OA pattern" | High | Med | ₹50k–120k (organic-driven Pro) | Only realistic CAC channel |
| 4 | **Applications kanban Postgres + reminders** | Cross-device + 24h email before rounds | High | Low | ₹40k (Pro feature: unlimited apps) | Daily-active habit |
| 5 | **Calendar (.ics) export + Google Cal sync** | Share with parents/seniors; one-click add | Med | Low | ₹20k | Free-tier hook → Pro upgrade |
| 6 | **Campus leaderboard `/campus/:slug/:year`** | "I'm #3 in DSA at NIT Trichy" → WhatsApp share | High | Med | ₹50k (campus tier ₹99/yr × 500 campuses?) | Tribal virality unlock |
| 7 | **Offer card public page (`/offers/:slug`)** | Anonymous "I cracked Zomato" LinkedIn-ready card | High | Low | ₹15k indirect | AmbitionBox playbook |
| 8 | **Per-company "Asked at" DSA tagging** | "Two Sum — asked at Amazon 2024 OA" | High | Med | ₹30k | Real differentiation vs. LeetCode |
| 9 | **Razorpay-powered Pro ₹99/mo tier** | Unlimited PYQs, calendar reminders, all 50 companies | Critical | Med | ₹2.97L (at 3% conv × 10k) | Revenue ignition |
| 10 | **Resume Roast public tool** | Free, no-signup, watermarked share URL | High | Med | ₹20k indirect | Top-of-funnel viral bait |
| 11 | **Certificate LinkedIn share flow + per-cert OG** | Recruiter-visible flex; "Get yours" CTA | High | Low | ₹15k indirect | Existing model — just needs share |
| 12 | **Telegram channel auto-post on verified PYQ** | Meet audience where they live | High | Low | ₹10k indirect | Distribution unlock |
| 13 | **Status-transition surfacing (move "Razorpay → OA" → see PYQs)** | Magic moment, contextual | Med | Low | ₹15k | Cross-feature glue |
| 14 | **Email digest "5 PYQs from your batch this week"** | Retention loop, replaces WhatsApp leak culture | Med | Low | ₹20k | Solves D7 retention |
| 15 | **Chrome extension: "Add to PrepPlace" from LinkedIn/Naukri** | Workflow becomes daily-open habit | High | High | ₹30k | Unique workflow moat |
| 16 | **Mock interview report card PDF (LinkedIn-ready)** | Brag artefact + virality loop | Med | Med | ₹20k | Uses existing jspdf |
| 17 | **Off-campus drives feed (Vercel Cron scraping)** | Daily content — solves "what's hiring this week" | High | Med | ₹25k | Search-heavy intent |
| 18 | **Public mastery radar profile `/u/:handle`** | LeetCode-profile-style brand surface | Med | Low | ₹10k indirect | Opt-in flag |
| 19 | **Sitemap auto-generate + IndexNow ping on PYQ submit** | TTFI < 24h on new pages | High | Low | ₹40k (SEO acceleration) | Compounds with content |
| 20 | **Two-sided referral with streak shield** | 1 month Pro for 3 invites; 7 days for invitee | Med | Low | ₹20k (Pro conv lift) | Schema migration is small |
| 21 | **WhatsApp Drop Kit (pre-formatted 4-line copy + OG)** | One-tap share to college group | Med | Low | ₹10k indirect | India-native channel |
| 22 | **PWA install prompt + offline DSA shell** | 30% mobile users install vs. forget URL | Med | Med | ₹15k | Re-engagement |
| 23 | **Onboarding rewrite: year + companies + role** | Activation: see seeded kanban immediately | High | Low | ₹20k (activation lift) | Linear "create first issue" |
| 24 | **Empty-state design across all dashboards** | New-user first impression isn't "0 / undefined" | Med | Low | ₹10k | Activation lift |
| 25 | **Dashboard rebuilt as "This week" urgency card** | "3 companies in next 14 days" | High | Med | ₹15k (engagement → retention) | First-run magic |
| 26 | **Year-of-study CTA segmentation on Landing** | 2nd/3rd/4th year different funnels | Med | Low | ₹15k (conv lift) | HubSpot-style ICP |
| 27 | **Founder-led X/LinkedIn content engine (daily for 90d)** | Building-in-public credibility | High | Low | ₹30k (CAC reduction) | Category proven (Striver/Kunal) |
| 28 | **Programmatic SEO: `/companies/:slug/{pyq,process,prep-kit}`** | 200 indexable URLs, near-zero competition | High | Med | ₹70k (organic-driven) | Long-tail wedge |
| 29 | **Verified-senior ambassador program (50 colleges)** | Per-campus distribution + content seeding | High | Med | ₹50k (campus saturation) | LTV per campus huge |
| 30 | **Group invite + cohort study rooms** | "Join your CSE 2026 group" — social study | Med | Med | ₹20k (retention) | Tribal hook |
| 31 | **`@vercel/og` per-route dynamic OG images** | WhatsApp/LinkedIn unfurl works correctly | High | Low | ₹20k (share CTR ×2-4) | Foundation for virality |
| 32 | **Sentry + Vercel Speed Insights + RUM** | Find/fix prod errors before users notice | Med | Low | ₹10k (reliability → trust) | Required infra |
| 33 | **TanStack Query + edge caching for read APIs** | Tab-switch feels instant | Med | Low | ₹10k (perf → conv) | Removes duplicate fetches |
| 34 | **Razorpay integration + `/pricing` page** | First ₹ of revenue collected | Critical | Med | (covered in #9) | Without it, no revenue learning |
| 35 | **5-item nav restructure (Home/Companies/Pipeline/Practice/Me)** | Orientation; Miller's 7±2 | Med | Low | ₹15k (activation lift) | Notion/Linear model |
| 36 | **Mobile bottom-tab + kanban vertical list** | 60% audience is mobile-first | High | Med | ₹25k (mobile activation) | Tier-2 colleges = mobile |
| 37 | **Live stats on Landing ("3,142 PYQs verified")** | Social proof above the fold | Med | Low | ₹10k (conv lift) | Unstop playbook |
| 38 | **Per-college brand pages (`/college/:slug`)** | Targeted SEO + ambassador handoff | Med | Med | ₹20k | Bottom-up land-and-expand |
| 39 | **Weekly "Placement Pulse" newsletter (Resend)** | Re-engagement + sponsorship lane | Med | Low | ₹15k (sponsorship later) | Free distribution |
| 40 | **`Share` event table + K-factor dashboard** | Measure virality, optimize loops | Med | Low | ₹5k (operational lever) | Can't improve what you don't measure |
| 41 | **Founder DM bot: 1-on-1 with new signups (manual)** | Activation calls, learn the user | Med | Low | ₹10k (qualitative) | Y Combinator playbook |
| 42 | **PYQ image OCR (Tesseract.js client-side)** | Screenshot OA on phone → submit in 10s | Med | Med | ₹15k (PYQ volume lift) | Submission friction killer |
| 43 | **Bookmarklet: "Add company from Unstop/LinkedIn"** | Cheap MVP of the Chrome extension | Med | Low | ₹10k (workflow stickiness) | Validates before extension |
| 44 | **Service worker offline PWA** | Use on flaky 3G / offline | Low | Med | ₹5k | Tier-2/3 college reality |
| 45 | **Anonymized cohort dashboards ("Median solver: 32 problems")** | Peer comparison drives engagement | Med | Med | ₹15k | Indian students are comparative |
| 46 | **AI-free interview question generator (template-based)** | "10 likely HR questions for SDE Goldman" | Low | Low | ₹10k | No Groq cost |
| 47 | **Team tier ₹499/mo per 5 users (study groups)** | Group buy economics | Med | Low | ₹50k (team adoption) | New SKU |
| 48 | **College TPO admin dashboard (B2B2C)** | Free for colleges → 10 paid college contracts | High | High | ₹85k (₹50k–2L/yr × 10) | Real revenue path |
| 49 | **Annual recap card (`/recap/2026`)** | Year-end LinkedIn flex moment | Low | Low | ₹5k | Spotify Wrapped for placements |
| 50 | **Open-source the Companies Vault on GitHub** | DA backlinks, dev community goodwill | Low | Low | ₹10k (brand + SEO) | Free brand play |

---

## 5. Revenue System

### Tier definitions

| Tier | Price | Audience | What's included |
|---|---|---|---|
| **Free** | ₹0 | Default for all signups | Top 20 of 50 companies, 5 PYQ views/day, 1 application board (10 apps), basic DSA tracker, mastery radar, public profile, certificate verification |
| **Pro** | ₹99/mo or ₹999/yr | Serious placement-season students (3rd/4th year) | All 50 companies, unlimited PYQs + submissions, unlimited applications, calendar reminders (email + WhatsApp), Telegram digest, Resume Roast Pro (unlimited), DSA "Asked at X" filter, mock interview report PDFs, per-cert OG card, priority moderation, ad-free |
| **Team** | ₹499/mo per 5-user pack | College study groups, batch cohorts | Everything in Pro for 5 users + private cohort dashboard + shared kanban board + group leaderboard + 5 mock interview credits/mo + Discord/WhatsApp integration |
| **Enterprise (College / TPO)** | Custom (₹50k–₹2L/yr) | College Training & Placement cells | All Pro features for all college students (verified via `.ac.in` / `.edu.in`) + TPO admin dashboard + branded `/college/:slug` page + cohort analytics + bulk certificate issuance + dedicated CSM + custom SLAs |

### Conversion projections at scale

| Users | Free retained | Pro (3%) | Team (0.2% of users → 0.04% of accounts) | Enterprise (colleges) |
|---|---|---|---|---|
| 1k | 970 | 30 | 0 | 0 |
| 10k | 9,700 | 300 | 4 packs | 1 college |
| 100k | 96,500 | 3,500 | 50 packs | 8 colleges |
| 1M | 950,000 | 50,000 | 800 packs | 50 colleges |

### Realistic MRR projections per tier

| Users | Pro MRR | Team MRR | Enterprise MRR | **Total MRR** | **Total ARR** |
|---|---|---|---|---|---|
| 1k | ₹2,970 | ₹0 | ₹0 | **₹2,970** | **₹35.6k** |
| 10k | ₹29,700 | ₹1,996 | ₹4,166 (₹50k/yr ÷ 12) | **₹35,862** | **₹4.3L** |
| 100k | ₹3.47L | ₹24,950 | ₹66,667 (avg ₹1L/yr × 8) | **₹4.39L** | **₹52.6L** |
| 1M | ₹49.5L | ₹3.99L | ₹6.25L (₹1.5L/yr × 50) | **₹59.7L** | **₹7.2 Cr** |

### Annual revenue forecast at each user milestone

- **1k users (Q3 2026)**: ₹35k ARR — proves WTP, not a business.
- **10k users (Q1 2027)**: ₹4.3L ARR (~$5,200) — seed-stage signal, raise possible.
- **100k users (Q3 2027)**: ₹52L ARR (~$62k) — Series A conversation if K-factor > 0.5.
- **1M users (Q3 2028)**: ₹7.2 Cr ARR (~$870k) — Series B-shaped, or strong cash flow.

Assumptions: ₹99/mo Pro at 3% conversion is conservative for Indian campus market (Scaler/PrepInsta data suggests 1–5% blended). Enterprise ramps slowest because sales cycles are long. Team tier is a bonus, not the lead.

---

## 6. Million-User Roadmap

### Stage 1: 0 → 1k users (Months 0–4)

**Estimated duration:** 4 months (Jul–Oct 2026, hits placement-season peak)

**Product priorities (top 3)**
1. Migrate Applications + PYQ + SRS + Mastery from localStorage to Postgres (existing schema).
2. Prerender `/`, `/companies`, `/companies/:slug` ×50 via `vite-plugin-prerender`; per-route metadata via `react-helmet-async`.
3. Ship Razorpay-powered ₹99/mo Pro tier and `/pricing` route.

**Marketing priorities (top 3)**
1. Founder-led content: daily X post + 2 LinkedIn posts/wk + 1 long-form Reddit post/wk in r/developersIndia.
2. WhatsApp/Telegram seeding via existing 18 users' college groups; launch Telegram channel `t.me/prepplace_pyq` with auto-post on verified PYQ.
3. Build PrepPlace Certificate LinkedIn share flow (per-cert OG via `@vercel/og`).

**SEO priorities (top 3)**
1. Rewrite `index.html` head + buy `prepplace.in` + add `sitemap.xml`/`robots.txt`/JSON-LD (Organization, WebSite, FAQPage).
2. Submit GSC + Bing Webmaster; verify domain; trigger IndexNow on every PYQ verification.
3. 12 long-form blog posts (Cluster A from CONTENT_ENGINE.md): TCS NQT, Infosys SP, Wipro Elite, Accenture, Cognizant, Capgemini, Goldman Sachs, Google STEP, Razorpay, Zomato, Flipkart GRiD, Microsoft Engage.

**Hiring priorities**
- **Month 0**: Founder + 1 part-time engineer (existing).
- **Month 2**: Hire 1 content/SEO contractor at ₹30k/mo for blog production + GSC management.
- **Month 3**: 2 college-ambassador interns at ₹5k/mo stipend (seed PYQs + campus distribution).

**Revenue targets**
- 1,000 signups, 10 Pro conversions (₹990 MRR ≈ ₹11.9k ARR).
- 1 paid Enterprise pilot (free, but contracted) with one college TPO.

---

### Stage 2: 1k → 10k users (Months 4–10)

**Estimated duration:** 6 months (Nov 2026 – Apr 2027, off-season for placements but build runway)

**Product priorities (top 3)**
1. Wire Calendar reminders (email + WhatsApp via Twilio) for round deadlines from Applications kanban.
2. Ship Resume Roast public tool (`/tools/resume-roast`) — top-of-funnel viral bait.
3. Public PYQ pages (`/pyq/:company/:round/:slug`) with submitter credit + per-page OG cards; campus leaderboard (`/campus/:slug/:year`).

**Marketing priorities (top 3)**
1. Campus ambassador program v1: 30 colleges, ₹500/mo retainer + ₹1000 per 50 verified signups.
2. Founder YouTube channel: 12 long-form videos (Cluster A topics), targeting Striver/Apna College co-watch audience.
3. Paid trial: ₹50k/mo on Google Search Ads targeting top-30 company prep keywords.

**SEO priorities (top 3)**
1. Ship 200 programmatic pages (`/companies/:slug/{pyq,process,prep-kit}` ×50).
2. Backlink campaign: outreach to 30 college TPO pages + coding-club blogs offering free PrepPlace-branded dashboards in exchange for footer links.
3. 24 more blog posts (Cluster A+B mix); cumulative 36 posts averaging 2,000 words.

**Hiring priorities**
- **Month 5**: 1 full-time growth/SEO hire (₹60k/mo).
- **Month 6**: 1 backend engineer (₹80k/mo) for kanban/reminders/cron.
- **Month 8**: 1 community manager (₹40k/mo) for Discord/Telegram + ambassador ops.

**Revenue targets**
- 10,000 signups, 300 Pro (₹29.7k MRR), 4 Team packs (₹2k MRR), 1 Enterprise college (₹50k/yr ≈ ₹4.1k MRR).
- **Total ≈ ₹36k MRR / ₹4.3L ARR.**

---

### Stage 3: 10k → 100k users (Months 10–22)

**Estimated duration:** 12 months (May 2027 – Apr 2028, spans next two placement seasons)

**Product priorities (top 3)**
1. Migrate to Next.js 15 App Router for SSR + ISR + edge OG; PWA + offline DSA shell.
2. Chrome extension v1: one-click "Add to PrepPlace" from LinkedIn/Naukri/Unstop.
3. Team tier rollout + College TPO admin dashboard (B2B2C); per-college branded pages.

**Marketing priorities (top 3)**
1. Scale Google + YouTube ad spend to ₹3–5L/mo against bottom-funnel queries (after positive unit economics).
2. Sponsor 5 placement-prep YouTube creators (₹50k–₹2L per campaign) — Striver, Apna College tier.
3. TPO outbound to 200 colleges via Lemlist sequences; convert 10 paid Enterprise contracts.

**SEO priorities (top 3)**
1. Build PYQ vault to 5,000+ verified questions across 50 companies (Stack Overflow scale).
2. Domain Rating target 25+ via guest posts on Indian dev blogs + IIT/NIT campus newsletters.
3. Launch hub pages `/placement-guide` and `/off-campus` with topic-cluster internal linking.

**Hiring priorities**
- **Month 11**: 2 senior engineers (₹1.2L/mo each); 1 designer (₹70k/mo).
- **Month 14**: 1 sales lead for TPO/Enterprise (₹1L/mo + commission).
- **Month 16**: 1 data/RUM engineer; 1 content writer; 1 ambassador coordinator.
- **Total team: ~12 people by Month 22.**

**Revenue targets**
- 100,000 signups, 3,500 Pro (₹3.47L MRR), 50 Team (₹25k MRR), 8 Enterprise (₹66k MRR avg).
- **Total ≈ ₹4.4L MRR / ₹52L ARR.**

---

### Stage 4: 100k → 1M users (Months 22–48)

**Estimated duration:** 26 months (May 2028 – Jun 2030)

**Product priorities (top 3)**
1. Multi-language (Hindi, Tamil, Telugu, Bengali) for Tier-3 college expansion.
2. AI-powered mock interview (pluggable model — Groq/Anthropic with rate limits + cost controls).
3. Mobile-native apps (iOS + Android) via Capacitor or React Native; PWA stays as fallback.

**Marketing priorities (top 3)**
1. National brand campaign: TV + OTT (Hotstar, Jio) around July placement-season launch (₹50L–₹1Cr).
2. Annual flagship event: "PrepPlace Placement Summit" — 10k attendees, recruiter sponsors, free for students.
3. Partnerships: AICTE/UGC formal partnership for the National Placement Readiness Index.

**SEO priorities (top 3)**
1. Maintain top-3 for 500+ long-tail keywords; build moat against Unstop SEO ramp.
2. International expansion (Pakistan, Bangladesh, Nigeria — similar campus placement dynamics).
3. Brand search dominance: "prepplace" branded queries > 100k/mo per GSC.

**Hiring priorities**
- VP Engineering, VP Marketing, VP Sales, Head of Content, Head of College Partnerships.
- Scale engineering to 25, design to 4, content/SEO to 8, sales to 10, ops to 5.
- **Total team: ~60 by Month 48.**

**Revenue targets**
- 1,000,000 signups, 50,000 Pro (₹49.5L MRR), 800 Team (₹4L MRR), 50 Enterprise (₹6.25L MRR avg).
- **Total ≈ ₹60L MRR / ₹7.2 Cr ARR.**

---

## 7. Market Gap Analysis — White Space PrepPlace Can Own

1. **The Applications kanban + per-company prep workflow.** Every competitor is a content library (LeetCode = problems, GFG = tutorials, PrepInsta = company pages, Unstop = events). Nobody owns "your placement season, organized." A daily-open kanban tied to PYQs, DSA filters, and calendar reminders is genuinely empty white space.

2. **Crowd-sourced, dated, verified PYQ vault tied to public submitter credit.** PrepInsta has PYQs but they're stale, unattributed, and ad-laden. Telegram leak culture is paid and gated. A public, verified, dated, attributed PYQ corpus with contributor leaderboards is the textbook Stack Overflow / Glassdoor / AmbitionBox playbook applied to Indian placements — and nobody has executed it well.

3. **Campus-cohort virality unit (`/campus/:slug/:year`).** WhatsApp groups already segment by college + batch + branch. No competitor maps to that pre-existing graph. A live, per-campus leaderboard + cohort study group + weekly digest is a tribal hook nobody owns.

4. **Free, no-signup top-of-funnel tools (Resume Roast, OA pattern decoder).** Levels.fyi's salary cards, Vercel's image optimization tool — viral free utilities that bridge to a logged-in product. The Indian placement space has zero such tools today; everything is either gated content or paid bootcamps.

5. **B2B2C TPO (Training & Placement Office) dashboard.** Colleges have placement cells that desperately need workflow tools (currently Google Sheets + WhatsApp). Free for colleges = built-in student rollout = ambassador-grade distribution. Unstop dabbles here but is event-focused, not workflow-focused. Real white space and a real revenue path (₹50k–₹2L/yr × 1000+ engineering colleges in India).

---

## 8. Launch Readiness Scorecard

### Product — **42 / 100**
The placement-OS thesis is sharp and the data model is well-designed (SRS SM-2, mastery EWMA, EngagementDay). But the headline features — Applications kanban, PYQ vault, SRS queue, Mastery — all persist to `localStorage` only, which means cross-device usage is impossible and the product is fundamentally undemoable beyond a single browser. Dead routes (Courses/Roadmaps/Tutor) and dead Prisma models still ship. No payment, no pricing page, no `Subscription` model. The kanban itself is desktop-only (8 columns). Score reflects: strong wedge, but the product as built doesn't yet do what it markets.

### UX — **48 / 100**
Distinctive visual language (neon-on-black, mono labels, oversized display headlines) and a working component system — that's rare and worth preserving. But the 13-item flat nav violates Miller's 7±2, the Dashboard opens with learning-app analytics instead of placement urgency, mobile experience is an afterthought (kanban unusable, no bottom-tab), and empty states render as walls of zeros. Onboarding asks for "learning goal" and "preferred style" — irrelevant to a placement OS. Accessibility hasn't been audited (contrast on micro-copy, no focus-visible). Distinctive but not yet coherent.

### SEO — **18 / 100**
Catastrophic. SPA-only with no SSR/prerender means `/companies/:slug` (×50), `/dsa/:slug` (×150), and PYQ pages all collapse into one indexable surface as far as Google is concerned. No `sitemap.xml`, no `robots.txt`, no canonical, no JSON-LD anywhere. `index.html` markets a different product than the Landing page sells, so even branded queries land on contradictory copy. `og-image.svg` (SVG) fails to unfurl on WhatsApp/LinkedIn. Running on `vercel.app` subdomain — Google deprioritizes; no domain authority accrual possible. This is the single biggest growth blocker.

### Marketing — **22 / 100**
Zero brand presence. No founder X/LinkedIn cadence, no Reddit footprint, no YouTube, no Telegram, no Discord. No analytics (no PostHog, GA4, Meta Pixel, GTM) — so no paid ad campaign can run. No campus ambassador playbook despite the audience being trivially graph-mapped (college WhatsApp groups). The Certificate `verifyCode` + public verify page is a viral loop already 80% built and entirely unexploited (no OG, no LinkedIn share button, no "Get yours" CTA). 18 signups from friends-and-family is the marketing baseline.

### Security — **30 / 100**
`/api/db/*` is an unauthenticated god-mode CRUD endpoint with zero `requireAuth` and zero per-row userId scoping — anyone with `curl` can read/modify any user row. This is a P0 breach surface, not a hackathon shortcut. Dual auth stack (legacy JWT + Supabase) with `passwordHash` nullable means two parallel session-issuing systems exist, one of which isn't actively maintained. No RLS on Supabase (Prisma uses service-role) — all authz in Express middleware, single bug = full data leak. No rate limiting on `/pyq/submit`, Groq tutor, or auth endpoints. No CSP/HSTS/Permissions-Policy. No Sentry, no structured logging. At 18 users this is harmless; at 10k it's a Hacker News post.

### Performance — **38 / 100**
The 670 KB index chunk is a lie that's also wrong — Landing eagerly imports `companies.ts` (1,854 LOC) just to render `.length`. `framer-motion`, `react-hot-toast`, `lucide-react`, COMPANIES array, PYQ_SEED all ship to first paint. `refreshApiUrl()` does a `cache: "no-store"` fetch before every first API call in prod where it does nothing — adds 80–300ms to TTFB. No client-side data cache (no SWR/TanStack Query), so every route re-fetches on mount. No Prisma pooling for Vercel serverless — cold-start connection storms at ~500 concurrent users will hard-fail Supabase. No web vitals telemetry. Lighthouse mobile LCP almost certainly >3.5s.

### Overall verdict: **Not ready for serious user acquisition. Score ≈ 33 / 100.**

**What to fix first (in strict order):**

1. **Week 1 (P0 hard blockers):** Rewrite `index.html` head to match Landing positioning; buy `prepplace.in`; gate or delete `/api/db/*`; rip `localStorage` source-of-truth out of Applications/PYQ/SRS/Mastery (move to Postgres). Without these, every other investment is wasted spend.

2. **Week 2–3 (foundation for acquisition):** Ship `sitemap.xml`, `robots.txt`, JSON-LD; add `react-helmet-async` for per-route metadata; deploy `vite-plugin-prerender` for top 50 company pages + Landing; replace `og-image.svg` with `@vercel/og` dynamic PNG per route; install PostHog + Sentry + Vercel Speed Insights.

3. **Week 4 (revenue + virality ignition):** Razorpay + `/pricing` (even with stub checkout); Certificate LinkedIn share flow; per-PYQ public pages with submitter credit; Telegram channel + auto-post bot.

Only after these are in production should marketing dollars be deployed. Until then, every signup is a leak — they land on contradictory positioning, hit empty states, and bounce.

---

## 9. The 30-Day Execution Plan

### Week 1 (Jun 22 – Jun 28): Fix the front door + lock the data plane

**Ship**
- Rewrite `client/index.html` head: title, description, OG, Twitter, canonical, `lang="en-IN"`. Strip every "Adaptive AI Learning" reference.
- Buy `prepplace.in` (Cloudflare Registrar / GoDaddy). Point DNS to Vercel. Update Supabase Auth redirect URLs + CORS allow-list.
- Gate `/api/db/*` with `requireAuth` + per-row `userId` scoping (or delete the generic router entirely — preferred).
- Delete 9 dead route files (`Courses*`, `Roadmaps*`, `Tutor.tsx`) and drop 7 dead Prisma models in a single migration.
- Switch `DATABASE_URL` to Supavisor transaction pooler (port 6543, `?pgbouncer=true&connection_limit=1`).

**Publish**
- 3 founder X posts: "we pivoted, here's what we're building," "PrepPlace positioning manifesto," screenshot of new domain.
- 1 LinkedIn long-form post: "Why we deleted 60% of our hackathon code."
- Submit homepage to Google Search Console + Bing Webmaster (even pre-prerender — to register domain).

**Track**
- Bundle-size delta after dead-code purge (target ≥15% Landing JS shrink).
- `view-source: prepplace.in` shows correct positioning.
- `curl /api/db/users` returns 401, not user list.
- Domain is live with valid HTTPS; magic-link emails delivering from `noreply@prepplace.in`.

---

### Week 2 (Jun 29 – Jul 5): SEO foundation + observability

**Ship**
- Add `react-helmet-async`; wire per-route `<Helmet>` for Landing, `/companies`, `/companies/:slug` ×50, `/pyq`, `/dsa`, `/verify-certificate`.
- Ship `robots.txt` (static) + dynamic `sitemap.xml` Express route reading Prisma `Company` + verified `PYQ`.
- Add JSON-LD: `Organization` + `WebSite` (with `SearchAction`) site-wide; `FAQPage` on Landing; `ItemList` on `/companies`; `BreadcrumbList` everywhere.
- Replace `og-image.svg` with a 1200×630 PNG via `@vercel/og` edge route accepting `?title=&subtitle=`.
- Install Sentry (client + server), Vercel Speed Insights, PostHog (5 core events: signup_complete, pyq_view, company_view, application_created, dsa_problem_attempted).
- Migrate `useApplications.ts` from `localStorage` to Postgres (add `Application` Prisma model + `/api/applications` routes).

**Publish**
- 4 X posts: daily DSA tip + per-company OA pattern thread (TCS NQT, Razorpay).
- First blog post: "TCS NQT 2026 Previous Year Questions" (Cluster A #1 from CONTENT_ENGINE.md) — 2,000 words, linking to `/companies/tcs`.
- Submit `sitemap.xml` to GSC + Bing.

**Track**
- Lighthouse SEO score on `/` and `/companies/:slug` (target ≥90).
- Rich Results Test passes for FAQPage and ItemList.
- 50+ unique URLs in GSC sitemap report.
- Sentry receives first events; PostHog funnel dashboard live with baseline numbers.

---

### Week 3 (Jul 6 – Jul 12): Prerender + PYQ public pages + Razorpay spike

**Ship**
- Configure `vite-plugin-prerender` (or `react-snap`) to statically prerender `/`, `/companies`, `/companies/:slug` ×50, `/dsa` top 30 problems, `/verify-certificate`.
- Ship public PYQ pages (`/pyq/:company/:round/:slug`) — read-only public, submission still auth-gated. Per-page OG via `@vercel/og`.
- Add submitter credit + verified badge + vote count to public PYQ pages.
- Razorpay integration spike: `Subscription` Prisma model, `/pricing` route (Free / Pro ₹99 / Team ₹499), checkout end-to-end with a ₹1 test transaction.
- Migrate SRS + Mastery hooks from `localStorage` to existing `SRSItem` + `MasteryEntry` models.

**Publish**
- 5 X posts + 2 LinkedIn posts (founder content cadence).
- Reddit long-form post in r/developersIndia: "I scraped 50 company hiring patterns from 2024 — here's what I found" with PrepPlace screenshots.
- Launch Telegram channel `t.me/prepplace_pyq`; auto-post bot when a PYQ is verified.
- 2 more blog posts: "Infosys SP Eligibility 2026" + "Wipro Elite NTH Syllabus."

**Track**
- `view-source: prepplace.in/companies/razorpay` returns full rendered HTML (not `<div id="root">`).
- 50+ company pages indexed by Google (check GSC daily).
- First paid transaction completes (even if it's the founder).
- 100+ verified PYQs in the public corpus.

---

### Week 4 (Jul 13 – Jul 19): Virality loops + activation lift + analytics close

**Ship**
- Certificate LinkedIn share flow: per-cert OG image via `@vercel/og` reading `verifyCode`, one-tap "Share on LinkedIn" with pre-filled copy, "Get your own" CTA on `/verify-certificate` with `?ref=` attribution.
- Onboarding rewrite: replace "learning goal" / "preferred style" with year + target companies (multi-select) + target role. Seed the kanban and "This week" Dashboard card from those answers.
- Add `referralCode` + `referredBy` + `college` + `graduationYear` to `User` schema. Capture `?ref=` in `AuthCallback.tsx`.
- Ship `/admin/growth` dashboard reading PostHog + a new `Share` event table.
- Applications kanban: reminder cron (Vercel Cron) at `/api/cron/round-reminders` — emails users with rounds in next 24h via Resend.
- Replace 13-item flat nav with 5 grouped categories (Home / Companies / Pipeline / Practice / Me).

**Publish**
- Daily X posts (5 this week); 2 LinkedIn posts; 1 Reddit AMA-style post.
- Launch blog posts: "Accenture Off Campus Drive 2026" + "Goldman Sachs Engineering OA Pattern."
- Email all 18 existing users: announce new positioning + ask for 5 testimonials + invite to Telegram channel.
- Recruit first 5 campus ambassadors from existing 18 users (one per college).

**Track**
- D7 retention for the week-1 signup cohort (target ≥20%).
- Pro conversion: at least 1 real paying user.
- 200+ signups attributable to organic / Reddit (track via UTM + GSC).
- `Share` event count > 50 across LinkedIn / WhatsApp / Telegram surfaces.
- K-factor first measurement on record (target Day-30: 0.15).
- First Telegram channel members > 100; first 10 PYQs auto-posted.

---

*End of STARTUP_PLAN.md*

**Single number to obsess over for the next 30 days: weekly verified PYQ submissions.** If that compounds, the moat compounds, SEO compounds (each PYQ is an indexable long-tail page), and Telegram distribution compounds. Everything else is secondary.
