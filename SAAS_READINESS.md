# PrepPlace — SaaS Readiness & College-Adoption Roadmap (Task 6)

> Question: *What would it take for a college (placement cell / TPO) to officially adopt PrepPlace as the primary placement-prep destination for its students?*

This evaluates the product **as if selling to colleges (B2B2C)** and produces a roadmap. Per the brief, enterprise functionality is **not implemented** here — this is the assessment + plan.

---

## 1. Current architecture (as-is)

| Layer | Stack | Notes |
|---|---|---|
| Frontend | React 19 + Vite + TS + Tailwind v4 | SPA, lazy-routed, clean component system |
| Backend | Node + Express | REST API, modular routes |
| ORM/DB | Prisma 7 + PostgreSQL (Supabase) | Rich schema: User, Lesson, Progress, SRS, Certificate, Engagement, DsaProblemStatus, Notes, Notification |
| Auth | Supabase Auth (Google OAuth + email OTP) | JWT, session refresh, RLS-capable |
| AI | Groq SDK | Legacy tutor; mostly retired in the pivot |
| Hosting | Vercel (client) + Render/Railway (server) | Procfile/railway.json/render.yaml present |
| Content | Static TS data modules | DSA roadmap, patterns, projects, companies, PYQs — versioned in-repo |

**Key observation:** much **learning progress is stored client-side in `localStorage`** (`useLearningProgress`, checklist/solved/projects-built), while the backend has *Prisma models* for similar data. This split is the single biggest SaaS gap: progress is **not reliably multi-device or analyzable server-side**.

---

## 2. Readiness scorecard (sell-to-colleges lens)

| Dimension | Score /10 | Assessment |
|---|---|---|
| **Multi-user support** | 7 | Supabase auth handles many users well; no org/cohort grouping yet. |
| **Scalability** | 7 | Stateless Express + Postgres + CDN-hosted SPA scale fine to tens of thousands; static content is free to serve. |
| **Authentication** | 8 | Supabase OAuth + OTP is solid; needs SSO (Google Workspace/SAML) for institutions. |
| **Persistence** | 5 | Hybrid localStorage + Prisma; progress not consistently server-synced. **Top fix.** |
| **Progress tracking** | 6 | Rich per-student locally; not centralized/queryable for admins. |
| **Analytics** | 4 | Vercel Analytics for web vitals; no learning/cohort analytics. |
| **Notifications** | 4 | Notification model exists; no email/push pipeline wired. |
| **Reporting** | 2 | No admin/cohort reports — a hard requirement for TPOs. |
| **Admin capabilities** | 2 | No admin role, no college dashboard. |
| **Architecture** | 7 | Clean separation, lazy routes, typed; minor coupling to localStorage. |
| **Database** | 7 | Well-modeled Prisma schema; needs Org/Cohort/Membership tables. |
| **Performance** | 7 | Good; large vendor bundles (pdf, markdown) could be trimmed/route-split. |
| **Security** | 6 | JWT + RLS-capable; needs audit (rate limits, RLS policies, PII handling, GDPR/India DPDP). |
| **Business readiness** | 5 | Free B2C; no billing, licensing, or org provisioning. |
| **Production readiness** | 6 | Ships and runs; needs tests, monitoring, error tracking, backups. |

**Overall SaaS readiness: ~5.5/10** — an excellent B2C product that is **not yet** a B2B2C platform. The gap is org/admin/analytics/persistence, not core engineering quality.

---

## 3. What colleges actually require (acceptance criteria)

A TPO will ask for these before officially recommending PrepPlace:

1. **Bulk onboarding** — import a batch by CSV / college-domain SSO; students auto-grouped into a cohort.
2. **Cohort dashboard** — see batch-wide progress, weak areas, top performers, at-risk students.
3. **Placement readiness signal** — a per-student score the cell can act on.
4. **Reporting/export** — downloadable progress + readiness reports (PDF/CSV) for reviews.
5. **Reliable persistence** — a student logs in from lab/phone/home and sees the same state.
6. **Data privacy & security** — India DPDP/GDPR posture, data ownership clarity, deletion.
7. **Support & SLA** — someone to call; uptime guarantees.
8. **Affordability** — per-student/year pricing that beats buying Scaler/CN seats.

---

## 4. College-adoption roadmap (phased)

### Phase A — Foundation (make B2C bulletproof) · 2–4 weeks
*Prereq for everything; also improves the B2C product.*
- **Server-sync the learning store.** Persist `useLearningProgress` to the existing Prisma models via a `/api/progress` endpoint; localStorage becomes a cache. → fixes Persistence + unlocks Analytics.
- **Error tracking + uptime monitoring** (Sentry + a health-check monitor).
- **Automated DB backups** (Supabase PITR) + a basic test suite on critical flows.
- **Security pass:** rate limiting on auth/API, verify Supabase RLS policies, PII minimization.

### Phase B — Readiness & retention (B2C value, B2B foundation) · 3–5 weeks
- **Placement Readiness Score** (aggregate DSA + patterns + aptitude + projects + OA). Single number the student *and* a future admin care about.
- **Notifications pipeline** (email digests: streak nudges, weekly progress) using the existing Notification model.
- **Gamification** (XP/streak/rank ladder across the whole journey) — retention moat vs InterviewBit.

### Phase C — Org layer (the B2B product) · 5–8 weeks
- **Data model:** `Organization`, `Cohort`, `Membership(role: student|tpo|admin)`.
- **College SSO** (Google Workspace domain / SAML) + CSV bulk-invite.
- **TPO/Admin dashboard:** cohort progress, readiness distribution, at-risk list, topic heatmap.
- **Reporting/export:** per-cohort and per-student PDF/CSV reports.

### Phase D — Commercial · 3–4 weeks
- **Licensing/seats** (per-student/year) + simple billing (Razorpay/Stripe) — only if selling directly.
- **Admin provisioning, audit log, role management.**
- **SLA, status page, docs, onboarding playbook for placement cells.**

**Critical path:** A → C are mandatory for college adoption. B is high-ROI for both audiences. D only when there's a paying pilot.

---

## 5. Recommendation

Do **not** build enterprise features speculatively. The sequence that maximizes value:
1. **Phase A now** (it fixes a real B2C defect: progress that doesn't follow the student).
2. **Phase B** to win retention and create the Readiness Score (sales centerpiece).
3. **Pitch a pilot to 1–2 colleges**; build **Phase C** against that real design partner so the admin layer matches how TPOs actually work.
4. **Phase D** only once a pilot wants to pay.

The engineering foundation is strong; the work is **org modeling, analytics, and reliable persistence — not a rewrite.**
