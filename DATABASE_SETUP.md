# PrepNxt — Database Setup

This document describes the MySQL database that backs PrepNxt: its structure,
relationships, configuration, migrations, and backup/restore procedures.

> **Architecture note.** PrepNxt's React client currently persists everything in
> the browser's `localStorage`, and the Express server is a stateless proxy to the
> Groq AI API. This MySQL layer is a **backend foundation**: a fully-migrated,
> CRUD-tested relational database plus REST endpoints (`/api/db/*`), ready to be
> adopted screen-by-screen. The existing localStorage client continues to work
> unchanged. The schema introduces a `User` anchor so the data is multi-user ready.

---

## 1. Stack

| Layer        | Choice                                            |
| ------------ | ------------------------------------------------- |
| Database     | MySQL Community Server 9.7 (local, `/usr/local/mysql`) |
| ORM          | Prisma 7                                           |
| Driver       | `mariadb` via `@prisma/adapter-mariadb` (Prisma 7 driver-adapter; MySQL `caching_sha2_password` compatible) |
| Runtime      | Node 20+ / Express (ESM)                           |

Prisma 7 uses the Rust-free "client" engine, which connects through a **driver
adapter** rather than a bundled query engine. Connection URLs live in
[`server/prisma.config.ts`](server/prisma.config.ts), not in `schema.prisma`.

---

## 2. Databases & user

| Object              | Name              | Purpose                                  |
| ------------------- | ----------------- | ---------------------------------------- |
| Application DB      | `prepnext`        | All application tables                    |
| Shadow DB           | `prepnext_shadow` | Used only by `prisma migrate dev`        |
| Application user    | `prepnext_app`    | Least-privilege; `ALL` on the two DBs only |

The app never connects as `root`. `prepnext_app` has `caching_sha2_password` auth
(MySQL 9 removed `mysql_native_password`).

---

## 3. Environment variables

Stored in [`server/.env`](server/.env) (git-ignored). Template:
[`server/.env.example`](server/.env.example).

| Variable              | Example                                                      | Used by              |
| --------------------- | ----------------------------------------------------------- | -------------------- |
| `DB_HOST`             | `127.0.0.1`                                                  | reference / tooling  |
| `DB_PORT`             | `3306`                                                       | reference / tooling  |
| `DB_USER`             | `prepnext_app`                                               | reference / tooling  |
| `DB_PASSWORD`         | `********`                                                   | reference / tooling  |
| `DB_NAME`             | `prepnext`                                                   | reference / tooling  |
| `DATABASE_URL`        | `mysql://prepnext_app:PASSWORD@127.0.0.1:3306/prepnext`         | Prisma client + migrations |
| `SHADOW_DATABASE_URL` | `mysql://prepnext_app:PASSWORD@127.0.0.1:3306/prepnext_shadow`  | `prisma migrate dev` |
| `JWT_SECRET`          | (64-byte random hex)                                        | Signs login JWTs     |
| `JWT_EXPIRES_IN`      | `7d`                                                        | JWT lifetime         |

Generate a strong `JWT_SECRET`: `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`.

> URL-encode special characters in the password (`@` → `%40`, `:` → `%3A`, etc.).

---

## 4. Schema

Source of truth: [`server/prisma/schema.prisma`](server/prisma/schema.prisma).
The relational structure is normalized to 3NF; deeply-nested AI-generated payloads
(lesson explanations, roadmap stages) are stored in `JSON` columns rather than
over-normalized into dozens of tables.

### Tables (18)

| Table                     | Description                                              | Key relationships |
| ------------------------- | -------------------------------------------------------- | ----------------- |
| `User`                    | Account + learning profile (the anchor entity)          | parent of all     |
| `Course`                  | An AI-generated course                                   | → `User`; has `Chapter[]` |
| `Chapter`                 | Course section                                           | → `Course`; has `Lesson[]` |
| `Lesson`                  | Lesson; `explanations`/`checkQuestions` are JSON         | → `Chapter`       |
| `LessonProgress`          | Per-user lesson status, score, mastery, time            | → `User`          |
| `Roadmap`                 | AI learning roadmap; stages/tools/etc. are JSON         | → `User`          |
| `MasteryEntry`            | EWMA mastery score per topic                             | → `User`          |
| `SRSItem`                 | Spaced-repetition item (SM-2 lite)                      | → `User`          |
| `Certificate`            | Issued certificate with unique `verifyCode`             | → `User`          |
| `TutorThread`            | AI tutor conversation                                    | → `User`; has `TutorMessage[]` |
| `TutorMessage`           | One tutor message (`user`/`assistant`)                  | → `TutorThread`   |
| `EngagementDay`          | Per-day engagement (activeMs, routes JSON)             | → `User`          |
| `EngagementIntervention` | A logged adaptive intervention                          | → `User`          |
| `DsaProblemStatus`       | Per-user DSA problem status (`todo`/`attempted`/`solved`) | → `User`        |
| `DsaBookmark`            | Bookmarked DSA problem                                   | → `User`          |
| `DsaAttempt`             | DSA attempt stats (count, time, hints)                 | → `User`          |
| `Note`                   | Free-text note attached to a lesson/problem            | → `User`          |
| `Notification`           | In-app notification                                     | → `User`          |

### Keys, constraints, indexes

- **Primary keys:** every table has a `cuid()` string `id`.
- **Foreign keys:** all child rows reference their parent with `ON DELETE CASCADE`
  (deleting a `User` removes all their data; deleting a `Course` removes its
  chapters and lessons).
- **Unique constraints:** `User.email`; `Certificate.verifyCode`;
  composite uniques such as `Course(userId, externalId)`,
  `LessonProgress(userId, lessonExternalId)`, `MasteryEntry(userId, topic)`,
  `SRSItem(userId, itemId, kind)`, `EngagementDay(userId, date)`,
  `DsaProblemStatus(userId, problemId)`, etc.
- **Indexes:** every `userId` FK is indexed, plus targeted composites like
  `SRSItem(userId, dueAt)` (due-queue lookups) and `Notification(userId, readAt)`.
- **Enums:** `Style`, `Level`, `LessonStatus`, `SRSKind`, `TutorRole`, `DsaStatus`.

### Entity relationship (summary)

```
User 1───* Course 1───* Chapter 1───* Lesson
User 1───* LessonProgress
User 1───* Roadmap
User 1───* MasteryEntry / SRSItem / Certificate / Note / Notification
User 1───* TutorThread 1───* TutorMessage
User 1───* EngagementDay / EngagementIntervention
User 1───* DsaProblemStatus / DsaBookmark / DsaAttempt
```

---

## 5. API surface

### Authentication (`/api/auth`) — email + password

Backed by the `User` table; passwords are bcrypt-hashed (`passwordHash` column,
never returned to clients). Login issues a JWT (HS256, `JWT_SECRET`).

| Method | Path               | Body                              | Returns |
| ------ | ------------------ | --------------------------------- | ------- |
| POST   | `/api/auth/signup` | `{ email, password, displayName? }` | `201 { token, user }` |
| POST   | `/api/auth/login`  | `{ email, password }`             | `200 { token, user }` |
| GET    | `/api/auth/me`     | header `Authorization: Bearer <token>` | `200 { user }` |

Validation: email format checked; password ≥ 8 chars; duplicate email → `409`;
bad credentials → `401` (without revealing whether the email exists).

Client wiring: [`client/src/lib/auth.ts`](client/src/lib/auth.ts) +
[`client/src/hooks/useAuth.ts`](client/src/hooks/useAuth.ts); the login/signup
form lives on the homepage ([`client/src/routes/Landing.tsx`](client/src/routes/Landing.tsx)
via [`components/auth/AuthPanel.tsx`](client/src/components/auth/AuthPanel.tsx)).
The JWT + user are stored in `localStorage` (`prepnext.auth.token.v1` /
`prepnext.auth.user.v1`).

### Data CRUD (`/api/db`)

All mounted under `/api/db` (rate-limited, JSON, 1 MB body limit).

| Method | Path                          | Action                                  |
| ------ | ----------------------------- | --------------------------------------- |
| GET    | `/api/db/health`              | Round-trip query + per-table row counts |
| GET    | `/api/db/<resource>`          | List (`?limit`, `?offset`) → `{total,count,data}` |
| GET    | `/api/db/<resource>/:id`      | Get one                                 |
| POST   | `/api/db/<resource>`          | Create                                  |
| PUT/PATCH | `/api/db/<resource>/:id`   | Update                                  |
| DELETE | `/api/db/<resource>/:id`      | Delete                                  |
| POST   | `/api/db/courses/full`        | Deep create: course + chapters + lessons in one call |

`<resource>` ∈ `users`, `courses`, `chapters`, `lessons`, `lesson-progress`,
`roadmaps`, `mastery`, `srs`, `certificates`, `tutor-threads`, `tutor-messages`,
`engagement-days`, `engagement-interventions`, `dsa-status`, `dsa-bookmarks`,
`dsa-attempts`, `notes`, `notifications`.

Error mapping: `404` not found, `409` unique-constraint violation, `400` FK violation.

---

## 6. Commands

Run from `server/` (npm scripts) — Prisma reads `prisma.config.ts` automatically.

| Command                     | What it does                                            |
| --------------------------- | ------------------------------------------------------- |
| `npm run db:generate`       | Regenerate the Prisma client after schema edits        |
| `npm run db:migrate`        | Create + apply a dev migration (`prisma migrate dev`)   |
| `npm run db:deploy`         | Apply pending migrations in production (`migrate deploy`)|
| `npm run db:seed`           | Insert demo data (idempotent)                           |
| `npm run db:studio`         | Open Prisma Studio (visual data browser)                |
| `npm run db:reset`          | ⚠️ Drop, recreate, re-migrate, re-seed the dev DB       |

Migrations live in [`server/prisma/migrations/`](server/prisma/migrations/) and are
committed to git. A typical change:

```bash
cd server
# 1. edit prisma/schema.prisma
npm run db:migrate -- --name add_x   # creates a new timestamped migration
```

---

## 7. Backup & restore

The MySQL binaries live in `/usr/local/mysql/bin` (not on `PATH` by default).

**Backup (logical dump):**

```bash
/usr/local/mysql/bin/mysqldump \
  -u prepnext_app -p --protocol=tcp -h 127.0.0.1 -P 3306 \
  --single-transaction --routines --triggers \
  prepnext > prepnext_backup_$(date +%Y%m%d).sql
```

**Restore:**

```bash
/usr/local/mysql/bin/mysql \
  -u prepnext_app -p --protocol=tcp -h 127.0.0.1 -P 3306 \
  prepnext < prepnext_backup_YYYYMMDD.sql
```

**Schema-only / data-only:** add `--no-data` or `--no-create-info` to `mysqldump`.

> Tip: add `/usr/local/mysql/bin` to your `PATH` (in `~/.zshrc`) to drop the full
> path prefix: `export PATH="/usr/local/mysql/bin:$PATH"`.

---

## 8. Recreate from scratch (new machine)

```bash
# 1. As MySQL root, create databases + least-privilege user:
mysql -u root -p <<'SQL'
CREATE DATABASE IF NOT EXISTS prepnext        CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS prepnext_shadow CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'prepnext_app'@'%' IDENTIFIED BY 'CHOOSE_A_PASSWORD';
GRANT ALL PRIVILEGES ON prepnext.*        TO 'prepnext_app'@'%';
GRANT ALL PRIVILEGES ON prepnext_shadow.* TO 'prepnext_app'@'%';
FLUSH PRIVILEGES;
SQL

# 2. Configure env
cp server/.env.example server/.env   # then fill DATABASE_URL / SHADOW_DATABASE_URL

# 3. Install + migrate + seed
cd server
npm install
npm run db:deploy        # apply committed migrations
npm run db:seed          # optional demo data

# 4. Run the app
cd .. && npm run dev
```

---

## 9. Troubleshooting

| Symptom                                                        | Fix |
| ------------------------------------------------------------- | --- |
| `requires either "adapter" or "accelerateUrl"`                | Prisma 7 needs the driver adapter — see `server/db.js`. |
| `Access denied for user`                                       | Check `DATABASE_URL` password; recreate the user (§8). |
| `shadowDatabaseUrl is no longer supported in schema files`    | URLs belong in `prisma.config.ts`, not `schema.prisma`. |
| `P1001 Can't reach database server`                          | MySQL not running: `sudo /usr/local/mysql/support-files/mysql.server start`. |
| Caching-SHA2 public-key errors                                | `allowPublicKeyRetrieval: true` is set in `server/db.js`. |
