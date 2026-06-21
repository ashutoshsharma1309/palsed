# VIRALITY REPORT

## 1. Executive Summary

- **PrepPlace has zero virality surface area today.** No share buttons, no public artefacts, no referral loop, no UGC distribution — every feature (DSA tracker, Applications kanban, Mastery radar, Certificates with `verifyCode`) lives behind `RequireAuth` and dies inside the dashboard. Even the one public asset that exists — `/verify-certificate` — has no "share my cert" CTA generating inbound traffic.
- **The product is sitting on a goldmine of share-native artefacts and doesn't ship a single one of them.** Placement offer announcements, package reveals, "I cracked Google OA" moments, PYQ submissions, kanban-stage-changes, and 100-day-streak certificates are exactly the content that Indian campus Twitter/LinkedIn/WhatsApp groups already amplify organically. PrepPlace owns the data and ignores the loop.
- **Indian placement season is a 90-day blitz from August to December** — the entire growth window for FY26 closes by Dec 15. If virality systems aren't in production by **August 1**, you've missed peak season and have to wait until July 2027. Every week of delay in August costs ~5x the equivalent week in March.
- **WhatsApp + Telegram + college-specific groups beat Twitter/LinkedIn for this audience.** The "PrepPlace System" must optimize for *forwardable* artefacts (image cards, sharable URLs that unfurl, PDF cheatsheets) — not threads. The current SPA architecture with empty `<head>` shells on per-route URLs (no SSR/prerender, confirmed in gap #3 of recon) means *every share link unfurls as a generic "Adaptive AI Learning Universe" card*. This is catastrophic.
- **The fastest 10x lever is a per-company public landing page** (`/companies/:slug` made public + prerendered) that ranks for "[Company] campus placement 2026" queries — a search corpus with massive intent, weak SERP competition, and direct alignment with the 50-company recruiter vault you already have.

## 2. Current State

Honest read: PrepPlace is a closed loop. 18 signups in a hackathon-built MVP with no domain, no SEO, no share mechanic, and a Landing page whose `<title>` still says "Adaptive AI Learning Universe" — contradicting the actual positioning ("zero AI calls placement OS"). Even users who *want* to evangelize the product have nothing to forward except a `vercel.app` URL that screams "side project."

Concretely, what's missing across the codebase:

- **No share components.** `grep` across `client/src/components/` will find zero `Share`, `Copy`, `Tweet`, `WhatsApp`, or `Embed` components. The Certificates route (`/certificates`) renders `Certificate` rows with a `verifyCode` — the *exact* artefact that should generate a PNG/PDF + WhatsApp share link — but appears to terminate at the dashboard.
- **No referral primitive in the schema.** `User` has `id, authId, email, displayName, learningGoal, preferredStyle, dailyMinutes` — there is no `referredByUserId`, no `referralCode`, no `College` model, no `Cohort` model. There is no way for the product to know "Aditya from BITS Pilani invited 12 batchmates" — that signal is foundational to campus-by-campus growth.
- **No public artefact pages.** `/companies/:slug`, `/dsa/:slug`, `/pyq` are gated behind `RequireAuth`. `/verify-certificate` is public but exists only as a verification utility, not a marketing surface — the verified certificate has no shareable OG card, no "Get yours at prepnext.vercel.app" footer, no `?ref=` param.
- **No social proof on Landing.** No live counter ("3,142 problems solved this week"), no "Aditya from VIT placed at Atlassian using PrepPlace" testimonial cards, no logo wall of colleges, no recent-activity feed. The 18 real signups are invisible to the 19th visitor.
- **No content engine.** There is no `/blog`, no `/companies/google/oa-pattern-2024`, no `/pyq/google-pyq` SEO landing pages. Every PYQ submission is a unique long-tail keyword ("Google OA 2024 third question dynamic programming") that should be its own indexable page — instead they're locked behind auth and rendered client-side.
- **No share-unfurl quality.** Even if someone shares `prepnext.vercel.app/companies/google`, WhatsApp/LinkedIn fetch the static `index.html` `<head>` and get the wrong title and a generic `/og-image.svg`. There is no per-route OG generation (no `@vercel/og`, no edge function, no prerender pipeline).
- **No community surface.** No Discord/Telegram link in nav. No "join your college's PrepPlace group" CTA. No leaderboard. No "Aditya solved 12 problems today" feed.

The product is technically capable of virality (Supabase Auth means easy onboarding; the schema is rich; Vercel makes edge OG trivial) but ships none of it.

## 3. Critical Issues

| # | Issue | Impact | Effort | Priority |
|---|-------|--------|--------|----------|
| 1 | Per-route OG/unfurl is broken — every shared link shows the wrong title and a generic image. Kills all organic sharing before it starts. | 10/10 | M (3-5d, `@vercel/og` edge fn + per-route prerender) | P0 |
| 2 | No public `/companies/:slug` pages — biggest SEO + share surface is gated. The 50-company recruiter vault is the moat and it's invisible to Google. | 10/10 | M (auth gate split + prerender top 50) | P0 |
| 3 | Certificate (`verifyCode` model exists!) has no share artefact — biggest emotional-peak share moment is wasted. | 9/10 | S (2-3d, PNG generator + share modal) | P0 |
| 4 | No referral primitive in `User` schema — can't attribute, can't reward, can't build college-leaderboards. | 9/10 | S (Prisma migration + `?ref=code` capture in AuthCallback) | P0 |
| 5 | No `College` / `Cohort` model — can't build the campus-by-campus growth wedge that dominates this category (Unstop, PrepInsta both run college leaderboards). | 8/10 | M (model + onboarding college picker + leaderboard route) | P1 |
| 6 | Placement-offer share artefact missing — Applications kanban "Offer" column should auto-generate a "I just got placed at X" card. This is the *single most-shared* moment in a student's life. | 9/10 | S (kanban stage trigger + OG card) | P0 |
| 7 | No PYQ public pages — every PYQ is a long-tail keyword goldmine wasted behind auth. | 8/10 | M (split read/write auth, prerender top 200) | P1 |
| 8 | No content calendar / no posting cadence — even with great artefacts, no distribution flywheel exists. | 8/10 | L (founder-led, 90-day commitment) | P1 |
| 9 | Landing has no social proof — 18 signups invisible, no testimonials, no live counter. | 7/10 | S (1-2d, query + Framer Motion ticker) | P1 |
| 10 | Title/OG/Twitter meta contradicts the product positioning ("Adaptive AI Learning" vs "zero-AI placement OS"). Confuses SEO intent and share unfurls. | 7/10 | XS (15 min) | P0 |
| 11 | No Telegram/WhatsApp community link in nav — losing the *exact* channel this audience lives in. | 7/10 | XS (1 hr) | P0 |
| 12 | Engagement analytics (`EngagementDay`, `EngagementIntervention`) exist but no "weekly recap" email/share card — wasted retention + virality loop. | 8/10 | M (cron + email + share card) | P2 |
| 13 | DSA streak isn't visualized as a share artefact (LeetCode's daily-streak share is the gold standard). | 7/10 | S (calendar heatmap component + OG) | P2 |
| 14 | Mastery radar (`MasteryEntry` EWMA) is share-worthy and locked away. | 6/10 | S (radar PNG export + OG) | P2 |
| 15 | No `/blog` or content layer for SEO ("Google OA pattern 2024", "Atlassian campus interview"). | 9/10 | L (CMS choice + 30 articles in 90 days) | P1 |

## 4. Recommendations

### 4.1 Fix the unfurl pipeline FIRST (P0, week 1)

Nothing else matters if shared links unfurl wrong. Add `@vercel/og` edge function at `api/og/[type].ts` that renders per-artefact PNGs:

- `/api/og/company?slug=google` → "Google · 50 LPA · OA on HackerRank · 3 rounds · PrepPlace"
- `/api/og/certificate?code=ABC123` → "Aditya completed Google Prep Kit · 94% mastery · Verify at prepnext.vercel.app"
- `/api/og/offer?user=aditya&company=atlassian` → "Aditya cracked Atlassian · 32 LPA · Built with PrepPlace"
- `/api/og/streak?user=aditya&days=47` → "47-day DSA streak on PrepPlace"
- `/api/og/pyq?id=123` → "Google OA 2024 Q3 · DP · Submitted by Aditya"

Then, for SEO/unfurl, prerender the top 50 company pages and top 200 PYQ pages at build time. With Vite SPA you'll need either (a) migrate to Next.js (big lift, but solves this permanently and unblocks `/blog`), or (b) a `prerender.config.js` step using `@prerender/prerenderer` writing per-route `index.html` with proper `<head>`. **Recommendation: migrate `/companies/*`, `/pyq/*`, `/c/:certCode`, and `/blog/*` to Next.js App Router** in a separate Vercel project (subdomain `www.prepplace.in`) keeping the Vite SPA for the authed app at `app.prepplace.in`. This is the standard split for SaaS products with heavy marketing surface.

### 4.2 Ship the certificate share flow THIS WEEK (P0)

`Certificate` model already has `verifyCode unique`. Build:

1. `/c/:verifyCode` public route (3-line route add) — mobile-first, big visual, "Verify badge" + "Get yours" CTA.
2. Share modal on `/certificates`: WhatsApp / LinkedIn / X / Copy-link, each with `?ref=<userId>` appended.
3. PNG export via `html2canvas` (already in deps) — student downloads + posts to their feed.
4. LinkedIn-specific "Add to profile" deep link (LinkedIn supports `addToProfile` URL with cert name + issuer + URL).

This single feature, given the Indian student culture of LinkedIn certificate-posting, is your highest-ROI virality lever per hour of work.

### 4.3 Add referral primitive (P0, week 1)

```prisma
model User {
  // existing fields...
  referralCode      String?  @unique  // generated on signup, e.g. "aditya-7f3k"
  referredByUserId  String?
  college           String?
  graduationYear    Int?
}

model Referral {
  id            String   @id @default(cuid())
  inviterId     String
  inviteeId     String?
  inviteEmail   String?
  status        String   // sent | signed_up | activated
  createdAt     DateTime @default(now())
  activatedAt   DateTime?
}
```

In `AuthCallback.tsx`, read `?ref=` from URL/localStorage and persist to `referredByUserId` on first-user-sync. Add `/invite` page showing the student their personal link + share buttons + "5 friends → unlock Premium Prep Kit" reward (use existing Certificates as the unlockable).

### 4.4 Build the College leaderboard (P1, weeks 2-4)

The single most powerful campus-growth mechanic. Add `College` model, force selection during `/onboarding`, then ship `/leaderboard/:collegeSlug` showing:

- Top 10 problem solvers this week at IIT Roorkee
- Top placement offers this week
- "Your college rank: #3 of 47 active colleges"

This converts "I joined PrepPlace" into "my college is winning on PrepPlace" — a tribal signal that spreads through college WhatsApp groups in hours. PrepInsta and Unstop both run versions of this; PrepPlace can outflank them by making it *per-college and live* instead of static rankings.

### 4.5 Placement Offer share card (P0, week 2)

Wire the Applications kanban (`Applications.tsx`): when a card moves to "Offer" column, fire a modal — "Congrats! Share your win?" with a pre-generated card via `/api/og/offer`. Make the share copy template Indian-student-native:

> "Just got placed at Atlassian (32 LPA) — using PrepPlace's Applications kanban + DSA tracker + Google PYQs. Built by a 4th-year for 4th-years. Try free: prepplace.in/r/aditya"

Every offer share = inbound traffic from the most credible source possible (a placed senior).

### 4.6 Fix Landing page positioning + social proof (P0, week 1)

Edit `index.html` — replace "Adaptive AI Learning Universe" everywhere with "Placement Season OS for Indian Engineering Students". On `Landing.tsx`:

- Live counter row: "3,142 problems solved · 47 colleges · 184 offers tracked" (query Prisma, cache 5 min)
- Logo wall: 8-10 college logos (IIT/NIT/BITS/VIT — even if just "students from" without endorsement)
- Testimonial cards from your 18 signups (DM them, get 5 quotes)
- "As shared on" row: collect Twitter/LinkedIn screenshots once you ship and rotate them in

### 4.7 Add WhatsApp + Telegram + Discord links (P0, day 1)

Nav footer link to a college-specific WhatsApp Community (free, supports 5000) and a Telegram channel for placement alerts. Pin in the dashboard sidebar: "PrepPlace × Your College WhatsApp." The audience already lives there; meet them where they are.

### 4.8 Per-Company SEO landing pages (P0, weeks 2-4)

Make `/companies/:slug` public-readable (gate the interactive tracker, not the content). Per company, render:

- H1: "Google Campus Placement 2026 — Eligibility, Package, Rounds, Prep Kit"
- Eligibility / CGPA cutoff / package range (from your existing data)
- "Top 10 PYQs for Google" (preview 3 free, rest behind login)
- "Latest students placed" (with consent) → social proof loop with 4.5
- JSON-LD `Organization` + `FAQPage` (recon gap #2 flagged this already)
- CTA: "Track your Google application — Free"

This is the SEO play: "google campus placement 2026" + 49 other companies × multiple variants = ~500 long-tail keywords with low competition.

### 4.9 Content engine: PYQ pages (P1, weeks 4-8)

Each PYQ becomes a public page (`/pyq/google-2024-q3-dp-coins`) with question + crowd-verified solution + "Submitted by Aditya (VIT, placed at Google)". Long-tail SEO + social proof in one artefact. Submission bonus: the student gets the page credited to them + share card "I contributed Google's 2024 OA question to PrepPlace."

### 4.10 Streak + Mastery share cards (P2, weeks 6-10)

Once the above are live, add:
- DSA streak share on `/dsa` (calendar heatmap + "47-day streak" + share)
- Mastery radar export on `/mastery` (download radar PNG)
- Weekly recap email via Vercel Cron (Sunday 8pm IST) summarizing user's week with a shareable card

### 4.11 Founder-led content cadence (P1, ongoing)

Twitter/LinkedIn: 1 build-in-public post per day from founder, 3 product-tip threads per week, 1 "behind PrepPlace" video per week. Indian campus Twitter responds to: relatability ("4th-year built this for 4th-years"), specificity ("here's the exact Google OA pattern from 2024"), and outcomes ("Aditya placed using this kanban"). See the 90-day calendar below.

---

## 5. 30-Day Priorities

1. **Week 1 — Fix unfurl + positioning.** Replace all "Adaptive AI Learning" copy in `index.html`, build `/api/og/[type].ts` edge function for company / certificate / offer / streak / PYQ. Deliverable: shared link on WhatsApp shows correct title + dynamic image.
2. **Week 1 — Certificate share flow.** Public `/c/:verifyCode`, share modal on `/certificates`, LinkedIn "Add to Profile" deep link, PNG export. Deliverable: 5 cert shares posted by your existing 18 users.
3. **Week 1 — Referral primitive.** Prisma migration adding `referralCode`, `referredByUserId`, `college`, `graduationYear` to `User` + `Referral` model + `/invite` page with personal link + capture `?ref=` in `AuthCallback.tsx`. Deliverable: first referred signup attributed in DB.
4. **Week 2 — Placement Offer share card.** Modal triggered on kanban "Offer" stage in `Applications.tsx` + `/api/og/offer` + share copy template. Deliverable: 3 offer shares from real placements.
5. **Week 2 — Domain + Landing v2.** Buy `prepplace.in`. Ship Landing with live counter, college logo wall, 5 testimonials, WhatsApp/Telegram CTA. Deliverable: prepplace.in live with new positioning.
6. **Weeks 3-4 — Public `/companies/:slug`.** Split read/write auth so company pages are crawlable. Add JSON-LD, FAQPage, prerender top 50 at build time. Deliverable: 50 indexable company pages, sitemap.xml submitted to Google Search Console.
7. **Weeks 3-4 — Founder content cadence kickoff.** 30 LinkedIn posts + 30 Twitter posts in the month. Daily DSA tip, weekly "behind PrepPlace", 4 per-company "how to crack [X]" threads. Deliverable: 100 followers across LinkedIn + Twitter, 3 posts >10k impressions.

## 6. 90-Day Priorities

1. **Weeks 5-6 — College model + leaderboards.** `/leaderboard/:collegeSlug` live, onboarding forces college selection, "Your college rank" badge in dashboard. Deliverable: 25 colleges with 5+ active users, top college has 50+ users.
2. **Weeks 5-8 — PYQ public pages.** Split read/write auth on `/pyq`, prerender top 200 PYQs, structured data, "submitted by" attribution. Deliverable: 200 indexable PYQ pages, 5 ranking in Google top 10.
3. **Weeks 7-9 — `/blog` launch with 20 articles.** "Google Campus Placement 2026 Complete Guide", "Atlassian OA Pattern Analysis", "How [Real Student] Cracked [Company]". Use Next.js subdomain split if not done yet. Deliverable: 20 articles, 5 ranking on page 1 for target queries.
4. **Weeks 8-10 — Weekly recap email + share card.** Vercel Cron → user's weekly stats → `/api/og/recap` PNG → email + in-app modal "Share your week." Deliverable: 30% open rate, 5% share rate.
5. **Weeks 9-12 — College ambassador program.** Recruit 1 student per top 20 colleges, give them `prepplace.in/college/iit-roorkee` landing pages they control + WhatsApp Community admin + monthly stipend (or premium access). Deliverable: 20 ambassadors, 10 active WhatsApp communities.
6. **Weeks 10-12 — DSA streak + Mastery radar share.** Visual streak heatmap, radar PNG export, both with OG cards. Deliverable: 200 streak shares, 50 radar shares.
7. **Weeks 11-13 — Off-campus drive feed virality.** Real-time `/internships` Telegram channel + "Drive opening: Atlassian SDE intern (24 LPA)" share cards. Deliverable: 5k Telegram subscribers.

### 90-Day Content Calendar (week-by-week, peak Aug-Dec assumed for FY27; adjust dates accordingly)

| Week | Theme | Founder content (LinkedIn + Twitter) | Product launch / share artefact |
|------|-------|--------------------------------------|---------------------------------|
| 1 (Aug 1-7) | "Built for placement season" | Daily DSA tip; 1 "why I built PrepPlace" thread; 3 per-company OA pattern posts | Certificate share + new Landing |
| 2 (Aug 8-14) | "Track your applications" | Kanban demo videos; 5 "this is what placement-season chaos looks like" posts | Offer share card + referral page |
| 3 (Aug 15-21) | "Per-company prep" | 5 company deep-dives (Google/Atlassian/Microsoft/Goldman/Adobe) | Public `/companies/:slug` launch |
| 4 (Aug 22-28) | "Crowdsourced PYQs" | 3 "PYQ goldmine" threads with example questions | PYQ submission incentive program |
| 5 (Aug 29-Sep 4) | "Your college on PrepPlace" | 5 "which college is winning?" posts; tag college pages | College leaderboard launch |
| 6 (Sep 5-11) | "Cracking OA patterns" | Daily OA pattern breakdown | 10 blog articles published |
| 7 (Sep 12-18) | "Real students, real offers" | Founder posts every offer share with permission | Weekly recap email v1 |
| 8 (Sep 19-25) | "Internship season" | Tagged internship-drive alerts | `/internships` Telegram channel |
| 9 (Sep 26-Oct 2) | "Mid-season check-in" | "How are your DSA stats?" prompt | Streak heatmap share |
| 10 (Oct 3-9) | "Diwali sprint" | 7-day DSA challenge thread | Mastery radar share |
| 11 (Oct 10-16) | "Top 10 placements this week" | Weekly placement rollup post | Ambassador program launches |
| 12 (Oct 17-23) | "Behind PrepPlace" | 3 build-in-public videos | Ambassador WhatsApp communities live |
| 13 (Oct 24-30) | "Crack core CS" | System design + Core CS threads | `/system-design` + `/core-cs` SEO pages |
| 14 (Oct 31-Nov 6) | "Pre-final-year prep" | Target 2nd/3rd-year content | Roadmap-style guides published |
| 15 (Nov 7-13) | "Offers thread" | Weekly Twitter thread of placed PrepPlace users | LinkedIn certificate auto-share |
| 16 (Nov 14-20) | "Mock interview week" | Mock interview clips | Mock interview product launch |
| 17 (Nov 21-27) | "Last-mile sprint" | Tactical "what to do 48hrs before OA" | Cohort study groups feature |
| 18 (Nov 28-Dec 4) | "December drives" | Drive alerts hourly | Season-end recap cards |
| 19 (Dec 5-11) | "Year recap" | "PrepPlace 2026: X offers, Y colleges, Z PYQs" | Public annual report (sharable PDF) |
| 20+ (Dec 12+) | "Off-campus + Jan reset" | Pivot to off-campus drive content | Reset streaks campaign |

## 7. Metrics to Track

| Metric | 30-day target | 90-day target | Where to instrument |
|--------|---------------|---------------|---------------------|
| Total signups | 200 (10x baseline 18) | 5,000 | `User` count |
| K-factor (referred signups / inviter) | 0.3 | 0.8 | `Referral.status = signed_up` |
| Activation rate (signup → 1 problem solved or 1 application tracked in 24h) | 40% | 55% | `DsaProblemStatus` or `Application` created within 24h of `User.createdAt` |
| Cert shares per cert issued | 0 → 25% | 50% | Share button click events |
| Offer shares per Offer-stage kanban event | 0 → 30% | 60% | Modal CTA click events |
| Colleges with 5+ active users | 0 → 10 | 50 | `User.college` distinct count |
| Top college user count | 0 → 30 | 250 | `User.college` max group |
| Indexed pages in Google | ~5 → 100 | 1,000 | Search Console |
| Organic search clicks/month | 0 → 500 | 25,000 | Search Console |
| Top-10 ranking keywords | 0 → 5 | 100 | Search Console (target: "[company] campus placement 2026", "[company] OA 2024", "[topic] PYQ") |
| WhatsApp/Telegram community members | 0 → 500 | 10,000 | Group analytics |
| LinkedIn followers (founder + page) | 100 → 1,000 | 10,000 | LinkedIn analytics |
| Twitter followers | 100 → 1,000 | 8,000 | Twitter analytics |
| Twitter impressions / month | 50k | 1M | Twitter analytics |
| LinkedIn certificate "Add to profile" clicks | 0 → 30 | 500 | LinkedIn deep-link tracking |
| Founder-content engagement rate | 3% | 5% | Platform native |
| Share-link unfurl correctness | 0% → 100% | 100% | Manual QA on WhatsApp/LinkedIn/X |
| Sitemap submission + robots.txt | not present → live | live | `prepplace.in/sitemap.xml`, `/robots.txt` |
| OG image generation latency (p95) | n/a → <500ms | <300ms | Vercel edge metrics |
| Cost per referred signup | n/a | < ₹20 | Spend / Referral count |
| 7-day retention | unknown → 35% | 50% | `EngagementDay` distinct days within 7 days of signup |
| 30-day retention | unknown → 20% | 35% | `EngagementDay` |
| Placement offers tracked (Applications kanban Offer column) | 5 | 200 | `Application.stage = offer` |
| Public certificates verified per week | 0 → 20 | 500 | `/c/:verifyCode` page views |

**Single north-star metric: weekly active students from 5+ different colleges, with at least one referred signup and one share artefact created.** If this number is growing 20% week-over-week through October, the virality system is working.

**Anti-metrics (watch for):** vanity follower counts without DSA-problem-solving activity, share clicks without referred signups (means the share artefact converts poorly), and "top college" being dominated by founder's alma mater (means single-school distribution rather than category-wide adoption).
