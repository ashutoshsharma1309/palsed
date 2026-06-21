-- ──────────────────────────────────────────────────────────────────────────
--  PrepPlace — Postgres baseline schema for Supabase
--  Equivalent to what `prisma migrate dev --name init_postgres` will create.
--  Safe to paste into Supabase SQL Editor (Project → SQL → New query).
-- ──────────────────────────────────────────────────────────────────────────

-- ENUMS ────────────────────────────────────────────────────────────────────
CREATE TYPE "Style" AS ENUM ('visual','code_first','analogy','step_by_step');
CREATE TYPE "Level" AS ENUM ('Beginner','Intermediate','Advanced');
CREATE TYPE "LessonStatus" AS ENUM ('in_progress','complete');
CREATE TYPE "SRSKind" AS ENUM ('concept','dsa','quiz');
CREATE TYPE "TutorRole" AS ENUM ('user','assistant');
CREATE TYPE "DsaStatus" AS ENUM ('todo','attempted','solved');

-- TABLES ───────────────────────────────────────────────────────────────────

CREATE TABLE "User" (
  "id"             TEXT PRIMARY KEY,
  "email"          TEXT NOT NULL UNIQUE,
  "passwordHash"   TEXT,
  "displayName"    TEXT NOT NULL DEFAULT 'Learner',
  "avatarSeed"     TEXT NOT NULL DEFAULT '',
  "learningGoal"   TEXT NOT NULL DEFAULT 'Master DSA',
  "preferredStyle" "Style" NOT NULL DEFAULT 'step_by_step',
  "dailyMinutes"   INTEGER NOT NULL DEFAULT 30,
  "joinedAt"       TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "createdAt"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"      TIMESTAMP(3) NOT NULL
);

CREATE TABLE "Course" (
  "id"                      TEXT PRIMARY KEY,
  "userId"                  TEXT NOT NULL,
  "externalId"              TEXT NOT NULL,
  "title"                   TEXT NOT NULL,
  "description"             TEXT NOT NULL,
  "level"                   "Level" NOT NULL DEFAULT 'Beginner',
  "estimatedHours"          INTEGER NOT NULL DEFAULT 0,
  "prerequisites"           JSONB NOT NULL,
  "finalQuizTopics"         JSONB NOT NULL,
  "certificatePassingScore" DOUBLE PRECISION NOT NULL DEFAULT 0.7,
  "createdAt"               TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"               TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Course_user_fk" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "Course_userId_externalId_key" ON "Course"("userId","externalId");
CREATE INDEX        "Course_userId_idx"            ON "Course"("userId");

CREATE TABLE "Chapter" (
  "id"            TEXT PRIMARY KEY,
  "courseId"      TEXT NOT NULL,
  "externalId"    TEXT NOT NULL,
  "title"         TEXT NOT NULL,
  "summary"       TEXT NOT NULL,
  "position"      INTEGER NOT NULL DEFAULT 0,
  "masteryTopics" JSONB NOT NULL,
  CONSTRAINT "Chapter_course_fk" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "Chapter_courseId_idx" ON "Chapter"("courseId");

CREATE TABLE "Lesson" (
  "id"               TEXT PRIMARY KEY,
  "chapterId"        TEXT NOT NULL,
  "externalId"       TEXT NOT NULL,
  "title"            TEXT NOT NULL,
  "difficulty"       INTEGER NOT NULL DEFAULT 1,
  "estimatedMinutes" INTEGER NOT NULL DEFAULT 0,
  "position"         INTEGER NOT NULL DEFAULT 0,
  "explanations"     JSONB NOT NULL,
  "checkQuestions"   JSONB NOT NULL,
  CONSTRAINT "Lesson_chapter_fk" FOREIGN KEY ("chapterId") REFERENCES "Chapter"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "Lesson_chapterId_idx" ON "Lesson"("chapterId");

CREATE TABLE "LessonProgress" (
  "id"                TEXT PRIMARY KEY,
  "userId"            TEXT NOT NULL,
  "courseExternalId"  TEXT NOT NULL,
  "lessonExternalId"  TEXT NOT NULL,
  "status"            "LessonStatus" NOT NULL DEFAULT 'in_progress',
  "score"             DOUBLE PRECISION,
  "attempts"          INTEGER NOT NULL DEFAULT 0,
  "masteryScore"      DOUBLE PRECISION,
  "msSpent"           INTEGER NOT NULL DEFAULT 0,
  "preferredStyle"    "Style",
  "extraExplanations" JSONB,
  "lastAt"            TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "LessonProgress_user_fk" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "LessonProgress_userId_lessonExternalId_key" ON "LessonProgress"("userId","lessonExternalId");
CREATE INDEX        "LessonProgress_userId_idx"                  ON "LessonProgress"("userId");
CREATE INDEX        "LessonProgress_userId_courseExternalId_idx" ON "LessonProgress"("userId","courseExternalId");

CREATE TABLE "Roadmap" (
  "id"             TEXT PRIMARY KEY,
  "userId"         TEXT NOT NULL,
  "externalId"     TEXT NOT NULL,
  "title"          TEXT NOT NULL,
  "description"    TEXT NOT NULL,
  "stages"         JSONB NOT NULL,
  "tools"          JSONB NOT NULL,
  "certifications" JSONB NOT NULL,
  "careerPath"     JSONB NOT NULL,
  "createdAt"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Roadmap_user_fk" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "Roadmap_userId_externalId_key" ON "Roadmap"("userId","externalId");
CREATE INDEX        "Roadmap_userId_idx"            ON "Roadmap"("userId");

CREATE TABLE "MasteryEntry" (
  "id"            TEXT PRIMARY KEY,
  "userId"        TEXT NOT NULL,
  "topic"         TEXT NOT NULL,
  "score"         DOUBLE PRECISION NOT NULL DEFAULT 0,
  "samples"       INTEGER NOT NULL DEFAULT 0,
  "lastUpdatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "MasteryEntry_user_fk" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "MasteryEntry_userId_topic_key" ON "MasteryEntry"("userId","topic");
CREATE INDEX        "MasteryEntry_userId_idx"       ON "MasteryEntry"("userId");

CREATE TABLE "SRSItem" (
  "id"             TEXT PRIMARY KEY,
  "userId"         TEXT NOT NULL,
  "itemId"         TEXT NOT NULL,
  "kind"           "SRSKind" NOT NULL,
  "payload"        JSONB,
  "dueAt"          TIMESTAMP(3) NOT NULL,
  "easeFactor"     DOUBLE PRECISION NOT NULL DEFAULT 2.5,
  "interval"       INTEGER NOT NULL DEFAULT 1,
  "reps"           INTEGER NOT NULL DEFAULT 0,
  "lastReviewedAt" TIMESTAMP(3),
  CONSTRAINT "SRSItem_user_fk" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "SRSItem_userId_itemId_kind_key" ON "SRSItem"("userId","itemId","kind");
CREATE INDEX        "SRSItem_userId_idx"             ON "SRSItem"("userId");
CREATE INDEX        "SRSItem_userId_dueAt_idx"       ON "SRSItem"("userId","dueAt");

CREATE TABLE "Certificate" (
  "id"               TEXT PRIMARY KEY,
  "userId"           TEXT NOT NULL,
  "externalId"       TEXT NOT NULL,
  "courseExternalId" TEXT NOT NULL,
  "courseTitle"      TEXT NOT NULL,
  "displayName"      TEXT NOT NULL,
  "score"            DOUBLE PRECISION NOT NULL,
  "verifyCode"       TEXT NOT NULL UNIQUE,
  "issuedAt"         TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Certificate_user_fk" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "Certificate_userId_idx" ON "Certificate"("userId");

CREATE TABLE "TutorThread" (
  "id"         TEXT PRIMARY KEY,
  "userId"     TEXT NOT NULL,
  "externalId" TEXT NOT NULL,
  "title"      TEXT NOT NULL DEFAULT 'New chat',
  "createdAt"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"  TIMESTAMP(3) NOT NULL,
  CONSTRAINT "TutorThread_user_fk" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "TutorThread_userId_externalId_key" ON "TutorThread"("userId","externalId");
CREATE INDEX        "TutorThread_userId_idx"            ON "TutorThread"("userId");

CREATE TABLE "TutorMessage" (
  "id"        TEXT PRIMARY KEY,
  "threadId"  TEXT NOT NULL,
  "role"      "TutorRole" NOT NULL,
  "content"   TEXT NOT NULL,
  "position"  INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "TutorMessage_thread_fk" FOREIGN KEY ("threadId") REFERENCES "TutorThread"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "TutorMessage_threadId_idx" ON "TutorMessage"("threadId");

CREATE TABLE "EngagementDay" (
  "id"            TEXT PRIMARY KEY,
  "userId"        TEXT NOT NULL,
  "date"          TEXT NOT NULL,
  "activeMs"      INTEGER NOT NULL DEFAULT 0,
  "interventions" INTEGER NOT NULL DEFAULT 0,
  "routes"        JSONB NOT NULL,
  CONSTRAINT "EngagementDay_user_fk" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "EngagementDay_userId_date_key" ON "EngagementDay"("userId","date");
CREATE INDEX        "EngagementDay_userId_idx"      ON "EngagementDay"("userId");

CREATE TABLE "EngagementIntervention" (
  "id"     TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "at"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "route"  TEXT NOT NULL,
  "action" TEXT NOT NULL,
  CONSTRAINT "EngagementIntervention_user_fk" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "EngagementIntervention_userId_idx" ON "EngagementIntervention"("userId");

CREATE TABLE "DsaProblemStatus" (
  "id"        TEXT PRIMARY KEY,
  "userId"    TEXT NOT NULL,
  "problemId" INTEGER NOT NULL,
  "status"    "DsaStatus" NOT NULL DEFAULT 'todo',
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "DsaProblemStatus_user_fk" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "DsaProblemStatus_userId_problemId_key" ON "DsaProblemStatus"("userId","problemId");
CREATE INDEX        "DsaProblemStatus_userId_idx"           ON "DsaProblemStatus"("userId");

CREATE TABLE "DsaBookmark" (
  "id"        TEXT PRIMARY KEY,
  "userId"    TEXT NOT NULL,
  "problemId" INTEGER NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "DsaBookmark_user_fk" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "DsaBookmark_userId_problemId_key" ON "DsaBookmark"("userId","problemId");
CREATE INDEX        "DsaBookmark_userId_idx"           ON "DsaBookmark"("userId");

CREATE TABLE "DsaAttempt" (
  "id"        TEXT PRIMARY KEY,
  "userId"    TEXT NOT NULL,
  "problemId" INTEGER NOT NULL,
  "count"     INTEGER NOT NULL DEFAULT 0,
  "msSpent"   INTEGER NOT NULL DEFAULT 0,
  "hintsUsed" INTEGER NOT NULL DEFAULT 0,
  "lastAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "DsaAttempt_user_fk" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "DsaAttempt_userId_problemId_key" ON "DsaAttempt"("userId","problemId");
CREATE INDEX        "DsaAttempt_userId_idx"           ON "DsaAttempt"("userId");

CREATE TABLE "Note" (
  "id"        TEXT PRIMARY KEY,
  "userId"    TEXT NOT NULL,
  "refKey"    TEXT NOT NULL,
  "body"      TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Note_user_fk" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "Note_userId_idx"        ON "Note"("userId");
CREATE INDEX "Note_userId_refKey_idx" ON "Note"("userId","refKey");

CREATE TABLE "Notification" (
  "id"        TEXT PRIMARY KEY,
  "userId"    TEXT NOT NULL,
  "title"     TEXT NOT NULL,
  "body"      TEXT NOT NULL,
  "type"      TEXT NOT NULL DEFAULT 'info',
  "readAt"    TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Notification_user_fk" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "Notification_userId_idx"        ON "Notification"("userId");
CREATE INDEX "Notification_userId_readAt_idx" ON "Notification"("userId","readAt");
