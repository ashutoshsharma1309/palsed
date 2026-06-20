# PM REPORT

## 1. Executive Summary

- **Positioning is fractured at the front door.** The product markets itself as a "Placement Season Operating System" on Landing, but `index.html` `<title>`, OG, and Twitter meta still read "Adaptive AI Learning Universe." Indian students Googling "Wipro NLT pattern 2024" or "Goldman Sachs OA questions" will never find PrepNext, and the ones who do land bounce because the meta promises something different from what they see. Fix this in week one.
- **18 signups in a hackathon-built product is not a retention problem yet — it is a distribution problem.** There is zero SEO surface (no sitemap, no JSON-LD, no per-route metas, SPA-only Suspense shell), no shareable artifacts (PYQ pages are not linkable for crawlers), and no growth loop. Building more features before fixing distribution is the wrong move.
- **The single highest-leverage retention feature is the Application Tracker Kanban + Placement Calendar, not DSA practice.** LeetCode/InterviewBit/Coding Ninjas/GFG already own DSA. PrepNext's defensible wedge is "I track *my* placement season here" — recruiter intel + applications + PYQs + calendar. Double down on this and demote DSA to a supporting feature.
- **Schema drift and dual auth are a tax on every future feature.** Tutor/Course/Roadmap Prisma models, legacy JWT alongside Supabase Auth, and stale `/routes` files (CourseDetail, RoadmapCreate, Tutor.tsx) are still shipped to clients. This bloats the bundle, confuses contributors, and makes the codebase look more "finished" than it is. Schedule a deprecation sprint.
- **PrepNext has no acquisition flywheel.** No domain, no SEO, no campus ambassadors, no Telegram/WhatsApp distribution. Unstop and PrepInsta own campus distribution because they have college reps and free-tier mock tests. Without at least *one* viral mechanic (shareable mock-interview report card, public PYQ contributions with credit, certificate verification page as social proof), the product will plateau at ~50 signups.

## 2. Current State

PrepNext is a thoughtfully-scoped product trapped in a hackathon shell. The thesis is genuinely sharp: Indian campus placements are a chaotic mess of WhatsApp leaks, rotting Google Docs, and PrepInsta's ad-laden "company pages." A "Placement Season OS" that consolidates 50 recruiters, PYQs, applications kanban, and per-company prep kits is exactly the right wedge against Unstop (event marketplace, not prep) and LeetCode (DSA-only, US-coded). The execution gaps, however, are severe enough that the product is not yet defensible.

**What's working:**
- The Recruiter Map (50 companies with eligibility, rounds, OA platforms) is genuinely the differentiator. No competitor has this in one curated, searchable place — PrepInsta has it but buried under ads and outdated.
- The Application Tracker Kanban (Wishlist → OA → Tech → HR → Offer) is the kind of artifact a 4th-year student opens *every day* during August–November. This is the daily-active-use hook.
- PYQ Vault with crowd voting + verification is a real moat if it reaches critical mass — but currently has no submission incentive.
- The data model is well-designed: `SRSItem` with SM-2, `MasteryEntry` with EWMA, `EngagementDay` with route-level breakdown. These are not hackathon-grade decisions; they are foundation for a serious product.
- Supabase Auth migration (commits `86b8c8f`, `6912d79`) was the right call — Email OTP + Google OAuth is table-stakes for Indian students who don't want to remember another password.

**What's broken or absent:**
- **Discovery is dead.** No domain, no sitemap.xml, no robots.txt, no JSON-LD, no per-route `<title>`. The SPA Suspense shell means Googlebot sees `<div id="root">` and the static (mismatched) head meta. Companies/PYQ/DSA pages — the exact long-tail queries students search — are invisible.
- **Messaging contradicts itself.** `index.html` says "Adaptive AI Learning Universe"; Landing.tsx pitches "zero AI calls" placement OS. A student who clicks a shared link sees one promise and lands on another.
- **No growth loop.** Certificate verification (`/verify-certificate`) is a public page, but no one is sharing certificates because there are no courses worth completing yet (Course/Roadmap models exist but routes redirect to Navigate). PYQ submitters get no credit, no leaderboard, no public profile. There is no reason for student A to bring student B.
- **DSA tracker competes head-on with LeetCode and loses.** ~150 problems with Monaco editor cannot beat LeetCode's 3000+ with community discussion. The DSA section currently absorbs engineering attention that should go to features competitors don't have.
- **Tech debt is shipping.** `routes/Courses.tsx`, `Tutor.tsx`, `Roadmaps.tsx` still in the client bundle behind Navigate redirects. Prisma models `Course`, `Chapter`, `Lesson`, `LessonProgress`, `Roadmap`, `TutorThread` still in schema. Legacy JWT auth still in `routes/auth.js`. Every new feature has to navigate this surface.
- **Mobile is unverified.** Vite + Tailwind v4 will render, but Monaco editor on mobile is unusable, and Indian campus students do 60%+ of their casual browsing on Android. No PWA install prompt is wired despite `manifest.webmanifest` being present.
- **No payment infrastructure.** Zero paid users is fine for hackathon, but there is no Razorpay/Stripe wiring, no pricing page, no `Subscription` model. The path to ₹1 of revenue is not built.

## 3. Critical Issues

| # | Issue | Impact | Effort | Priority |
|---|-------|--------|--------|----------|
| 1 | SEO mismatch + zero per-route metadata + SPA-only shell — long-tail placement queries don't reach PrepNext | Catastrophic (kills organic growth) | M (2 weeks: prerender + react-helmet + sitemap + JSON-LD) | P0 |
| 2 | No domain — `vercel.app` URL kills credibility, college students will not share | High (trust + sharing) | XS (1 day, ~₹800/yr) | P0 |
| 3 | Messaging contradiction (`index.html` vs `Landing.tsx`) confuses every visitor | High (bounce rate) | XS (1 hour) | P0 |
| 4 | PYQ Vault has no submission incentive — empty vault = no users = no submissions | High (kills moat) | M (leaderboard + credit + Telegram cross-post) | P0 |
| 5 | No growth loop — certificate sharing, PYQ contributor credit, referral code all absent | High (CAC stays infinite) | M (2-3 weeks) | P1 |
| 6 | DSA tracker absorbs engineering effort while losing to LeetCode | Medium (opportunity cost) | S (deprecate or pivot to "curated company-specific lists") | P1 |
| 7 | Dual auth (legacy JWT + Supabase) + nullable `passwordHash` + stale routes/auth.js | Medium (security + bug surface) | M (1 sprint to fully deprecate) | P1 |
| 8 | Stale Course/Roadmap/Tutor models + routes shipped in bundle | Medium (bundle bloat, contributor confusion) | S (deletion PR) | P1 |
| 9 | Mobile UX unverified — Monaco editor broken on Android, no PWA install prompt despite manifest present | High (60% of audience) | M (mobile audit + PWA wiring) | P1 |
| 10 | No Razorpay integration, no pricing page, no `Subscription` model — no path to revenue | Medium-High (delays validation) | M (2 weeks Razorpay + tier gating) | P1 |
| 11 | No campus ambassador / distribution playbook — Unstop and PrepInsta have college reps | High (distribution moat) | L (ongoing) | P2 |
| 12 | Application Tracker has no reminders/calendar sync — kanban without notifications is just a list | Medium (DAU driver) | S (email/push reminders via existing Notification model) | P1 |
| 13 | No "Compare with peers" or social proof — Indian students are intensely peer-comparative | Medium (engagement) | M (anonymized cohort dashboards) | P2 |
| 14 | No off-campus drives feed despite tagline mentioning it — Naukri Campus has this | Medium | M (scrape/curate + cron) | P2 |
| 15 | Engagement analytics exist (`EngagementDay`, `routes JSON`) but no admin dashboard to act on them | Low-Medium (you're flying blind on your own data) | S (internal admin page) | P2 |

## 4. Recommendations

### 4.1 Fix the front door in week one (P0, ~3 days)

The `<head>` in `index.html` is contradicting the product. Replace the title and meta to match Landing.tsx's actual positioning:

```html
<title>PrepNext — Your Placement Season, Organized | Indian Campus Placement Prep</title>
<meta name="description" content="Track applications, study PYQs from 50+ companies (Google, Microsoft, Goldman Sachs, Razorpay, Zerodha), and prep with curated DSA + system design. Built for Indian engineering students." />
<meta name="keywords" content="campus placement prep, PYQ previous year questions, placement tracker, Indian engineering placement, OA questions, off-campus drives" />
```

Buy `prepnext.in` (₹800/yr on GoDaddy or Cloudflare Registrar). The `.vercel.app` URL is killing every share. Update Supabase Auth redirect URLs accordingly.

Add `react-helmet-async` and set per-route `<title>` and `<meta>` on:
- `/companies/:slug` → "Goldman Sachs Placement Prep | Eligibility, PYQs, OA Pattern — PrepNext"
- `/pyq/:companySlug` → "Microsoft OA Questions 2024 (Verified) | PrepNext"
- `/dsa/:slug` → "Two Sum — Asked at Amazon, Google | PrepNext"

These long-tail queries are exactly what 3rd/4th-year students Google at 2am the night before an OA. Right now PrepNext is invisible for them.

### 4.2 Prerender or SSR the public routes (P0, ~1 week)

The SPA Suspense shell means Googlebot sees nothing. Two options:
- **Cheap**: Use `vite-plugin-prerender` or `react-snap` to statically prerender `/`, `/companies`, `/companies/:slug` (for all 50), and `/verify-certificate/*` at build time. This works because these are largely read-only.
- **Better**: Migrate the public surface to Next.js App Router (you're already on Vercel) and keep the authed app in the same repo. This is a bigger move; defer to 90-day.

Generate `sitemap.xml` at build time listing all 50 company slugs, all DSA problem slugs, and the static landing pages. Add `robots.txt`. Add `Organization` + `WebSite` + `FAQPage` (Landing has a real FAQ — use it) JSON-LD on the homepage.

### 4.3 Make PYQ Vault the moat (P0, ~2 weeks)

PYQ Vault is the only feature competitors cannot easily clone because it requires crowd contribution. Make it irresistible to contribute:

- **Contributor credit**: PYQ submitter's displayName + (optional) college shows on the question card. Indian students care intensely about credit.
- **Leaderboard**: Top contributors per college per month, surfaced on `/pyq` landing.
- **Quality bounty**: First 100 verified PYQs for any company gets the contributor a free Pro month (when paid tier ships) or a certificate.
- **Telegram cross-post**: When a PYQ is verified, auto-post to a public PrepNext Telegram channel. Telegram is where placement leaks already happen — meet students where they are.
- **Submission flow**: Currently `/pyq/submit` exists; add image OCR (cheap with Tesseract.js client-side) so students can screenshot OA questions on their phone and submit in 10 seconds.

Schema additions to `prisma/schema.prisma`:
```prisma
model PyqContribution {
  id          String   @id @default(cuid())
  userId      String
  pyqId       String
  pointsAwarded Int    @default(0)
  createdAt   DateTime @default(now())
}
```

### 4.4 Application Tracker is the DAU hook — invest there (P1, ~2 weeks)

Kanban without notifications is a TODO list. Add:
- **Round reminders**: Email + in-app notification 24h and 1h before any round on `PlacementCalendar`. Use existing `Notification` model. Vercel Cron Job hits an endpoint that scans applications with `nextRoundAt < now() + 24h`.
- **Quick-add from company page**: On `/companies/:slug`, an "Add to my Applications" button that creates an entry in Wishlist with one click.
- **Google Calendar export (.ics)**: One-click download of all upcoming rounds. Trivially shareable with parents/seniors.
- **Status transitions trigger PYQ surfacing**: When a student moves Razorpay from "Wishlist" to "OA", surface Razorpay PYQs and DSA list on the dashboard automatically.

This last point is the magic. The data is already there: `DsaProblemStatus`, `PYQ`, application stage. Stitch them together.

### 4.5 Demote DSA, do not compete with LeetCode (P1, ~1 week)

Currently `/dsa` ships ~150 problems with Monaco. This loses to LeetCode (3000+), GFG (5000+), and CodeChef. Reframe:

- Keep the problems but rebrand `/dsa` as **"Company-Specific Lists"** — "Top 30 Amazon DSA," "Goldman Sachs Patterns," etc. This is the use case students actually have.
- For each problem, show "Asked at: Amazon (2024 OA), Microsoft (2023 OA)" sourced from PYQ submissions.
- Replace Monaco-in-browser with a "Solve on LeetCode" deeplink — accept that students will solve on LeetCode and just track status here. Saves bundle weight, removes mobile pain.
- Repurpose engineering capacity to System Design and Behavioral, which competitors do worse.

### 4.6 Mobile + PWA (P1, ~1 week)

`manifest.webmanifest` exists but no install prompt, no service worker, no offline shell. Indian students will install a PWA if prompted; they will not bookmark a `.vercel.app` URL.

- Wire `vite-plugin-pwa` with workbox runtime caching for `/companies/*` and `/pyq/*`.
- Add an install banner on Landing and Dashboard (mobile only).
- Replace Monaco with a textarea on viewports < 768px, or hide the editor entirely (see 4.5).
- Audit `routes/Applications.tsx` kanban with DnD on mobile — likely broken.

### 4.7 Deprecate dead code in one sprint (P1, ~3 days)

Delete from client: `routes/Courses.tsx`, `CourseDetail.tsx`, `CourseLesson.tsx`, `CourseQuiz.tsx`, `CourseCreate.tsx`, `Roadmaps.tsx`, `RoadmapCreate.tsx`, `RoadmapDetail.tsx`, `Tutor.tsx`. Replace the `<Navigate>` redirects in `App.tsx` with a single 410 Gone route that explains the pivot.

Delete from `prisma/schema.prisma`: `Course`, `Chapter`, `Lesson`, `LessonProgress`, `Roadmap`, `TutorThread`, `TutorMessage`. Write a Prisma migration. Keep `Certificate` (still useful).

Auth cleanup: pick a date (e.g. 30 days from announcement), email all users with legacy `passwordHash`-only accounts, ask them to set a password via Supabase, then delete `routes/auth.js` and make `passwordHash` non-null in Supabase metadata only.

### 4.8 Revenue path (P1, ~2 weeks)

Indian students will pay ₹199–₹499/yr for a placement tool that visibly improves their odds. Build the rail:

- Integrate Razorpay (UPI + cards, default in India). Stripe is wrong here.
- Add `Subscription` model (userId, tier, expiresAt, razorpayPaymentId).
- Pricing tiers: Free (10 companies, 5 PYQs/day view, basic tracker) / Pro ₹299/year (all 50 companies, unlimited PYQ + submissions, calendar reminders, certificate verification badge).
- Gate behind `useSubscription()` hook. Do **not** gate the core PYQ vault — that needs to grow.
- Free Pro for top 100 PYQ contributors per month — fuels the moat in 4.3.

### 4.9 Distribution playbook (P2, ongoing)

- **College ambassadors**: Recruit 1 ambassador per top-50 engineering college (NITs, IIITs, BITS, top private). Give them a custom referral link tracked via a new `Referral` model. Top 3 ambassadors per month get a payout or LinkedIn recommendation.
- **Telegram channel + group**: "PrepNext Placement Leaks" channel for verified PYQs, a group for discussion. This is where the audience already lives.
- **LinkedIn**: Share weekly "What companies are hiring this week" posts. The data is already in the Internship feed.
- **Reddit `r/developersIndia` and `r/JEEAdvanced` (for incoming students)**: Don't spam; answer questions and reference PrepNext company pages.

## 5. 30-Day Priorities

1. **Day 1–2**: Buy `prepnext.in`, update Supabase Auth redirect URLs, deploy with new domain. Concrete deliverable: live at `prepnext.in` with valid HTTPS.
2. **Day 3–5**: Rewrite `index.html` `<head>` to match placement-OS positioning. Add `react-helmet-async`. Set per-route `<title>`+`<meta>`+canonical on `/`, `/companies`, `/companies/:slug`, `/pyq`, `/dsa`. Deliverable: PR merged, Lighthouse SEO score > 95.
3. **Day 6–10**: Add `vite-plugin-prerender` or `react-snap` to statically prerender all 50 `/companies/:slug` pages + `/`. Generate `sitemap.xml` and `robots.txt` at build. Submit to Google Search Console. Deliverable: 50+ pages indexed within 7 days of submission.
4. **Day 11–17**: PYQ contributor credit + Telegram cross-post bot. Schema migration for `PyqContribution`. Create `t.me/prepnext_pyq` channel. Deliverable: every verified PYQ shows submitter name and is auto-posted to Telegram.
5. **Day 18–22**: Application Tracker reminders. Vercel Cron Job at `/api/cron/round-reminders` that emails users with rounds in the next 24h. Use Supabase + existing `Notification` model. Deliverable: 100% of upcoming rounds trigger a reminder.
6. **Day 23–27**: Deprecate dead routes + schema. Delete 9 stale `routes/*.tsx` files, run Prisma migration dropping Course/Roadmap/Tutor models. Deliverable: bundle size reduction (target -15%), zero `<Navigate>` redirects.
7. **Day 28–30**: Razorpay integration spike. `Subscription` model, pricing page at `/pricing`, gated checkout flow. Deliverable: one paid test transaction end-to-end with a real ₹1 payment.

## 6. 90-Day Priorities

1. **Move public surface to Next.js App Router** for proper SSR/ISR. Keep authed app as a separate route group. This unlocks dynamic OG images per company and proper Core Web Vitals. Deliverable: `/` and `/companies/*` server-rendered, LCP < 2.0s.
2. **Campus ambassador program v1** in 25 colleges. `Referral` model, per-ambassador dashboard, monthly leaderboard with payout. Deliverable: 25 active ambassadors, 500+ signups attributed.
3. **Company-specific DSA lists replacing the generic `/dsa` tracker.** Source the "asked at" tags from PYQ submissions. Add "Solve on LeetCode" deeplink, remove Monaco from mobile. Deliverable: 50 company-specific lists live, Monaco removed from mobile bundle.
4. **Off-campus drives feed** — scrape Linkedin/Naukri/AngelList via a Vercel Cron Job into a new `OffCampusDrive` model. This is what students Google more than anything else after PYQs. Deliverable: 100+ active drives, updated daily.
5. **Mock interview module** with a shareable "report card" PDF. Use the existing jspdf dep. The PDF should be brag-worthy on LinkedIn (PrepNext logo, score, percentile vs cohort). Deliverable: 10% of users share their mock report on LinkedIn = built-in growth loop.
6. **Mobile PWA polish + Android install funnel.** Wire `vite-plugin-pwa`, install prompt on Dashboard, audit kanban DnD on mobile. Deliverable: 30% of mobile users install the PWA.
7. **Admin analytics dashboard** consuming the existing `EngagementDay.routes` JSON. You're sitting on real engagement data and have no UI to read it. Deliverable: internal `/admin` page showing DAU, route popularity, drop-off funnels.

## 7. Metrics to Track

**Acquisition**
- Organic search impressions (Google Search Console): **0 → 10,000/month by Day 90**
- Indexed pages: **~5 (current homepage shell) → 200+ by Day 60**
- Direct traffic from `prepnext.in` (post-domain): **track from Day 7**
- Referral signups from ambassador codes: **0 → 500 by Day 90**

**Activation**
- Signup → first application added: **target > 60%** (this is the real activation event, not signup)
- Signup → first PYQ viewed: **target > 80%**
- Onboarding completion rate (`/onboarding`): **target > 75%**

**Engagement (the EngagementDay model lets you measure all of these)**
- D1/D7/D30 retention: **D1 > 40%, D7 > 20%, D30 > 10%** (placement-prep is seasonal; D30 will spike Aug-Nov)
- Weekly active users / monthly active users (stickiness): **target > 0.3 by Day 90**
- Avg `activeMs` per session: **target > 8 minutes** (kanban check-ins are short and that's fine)
- Applications created per active user: **target avg 5+ by Day 90**

**Moat (PYQ Vault)**
- PYQ submissions per week: **0 → 100/week by Day 60**
- PYQ verified ratio: **> 70%**
- Unique submitters: **0 → 200 by Day 90**

**Revenue**
- Paid conversion rate (free → Pro): **target 2-4% by Day 90**
- Paying users: **0 → 50 by Day 90 (~₹15,000 MRR equivalent)**
- ARPU: **₹299/year baseline**

**Quality / Tech-debt**
- Lighthouse SEO score: **current ~70 → > 95**
- Lighthouse Performance (mobile): **measure baseline → > 80**
- Bundle size (gzipped main chunk): **measure → -20%** after dead-code deletion
- Auth migration: **legacy JWT users: current ~all → 0 by Day 90**

**Growth-loop signals**
- % of PYQs auto-posted to Telegram channel: **100%**
- Certificates shared on LinkedIn (track via `verifyCode` page referrer): **0 → 50/month**
- Mock report PDFs shared (90-day feature): **target 10% of mock-takers**

The single number to obsess over for the next 90 days: **weekly verified PYQ submissions**. If that compounds, the moat compounds, SEO compounds (each PYQ is an indexable long-tail page), and Telegram distribution compounds. Everything else is secondary.
