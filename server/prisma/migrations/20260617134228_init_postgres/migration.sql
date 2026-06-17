-- CreateEnum
CREATE TYPE "Style" AS ENUM ('visual', 'code_first', 'analogy', 'step_by_step');

-- CreateEnum
CREATE TYPE "Level" AS ENUM ('Beginner', 'Intermediate', 'Advanced');

-- CreateEnum
CREATE TYPE "LessonStatus" AS ENUM ('in_progress', 'complete');

-- CreateEnum
CREATE TYPE "SRSKind" AS ENUM ('concept', 'dsa', 'quiz');

-- CreateEnum
CREATE TYPE "TutorRole" AS ENUM ('user', 'assistant');

-- CreateEnum
CREATE TYPE "DsaStatus" AS ENUM ('todo', 'attempted', 'solved');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT,
    "displayName" TEXT NOT NULL DEFAULT 'Learner',
    "avatarSeed" TEXT NOT NULL DEFAULT '',
    "learningGoal" TEXT NOT NULL DEFAULT 'Master DSA',
    "preferredStyle" "Style" NOT NULL DEFAULT 'step_by_step',
    "dailyMinutes" INTEGER NOT NULL DEFAULT 30,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Course" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "level" "Level" NOT NULL DEFAULT 'Beginner',
    "estimatedHours" INTEGER NOT NULL DEFAULT 0,
    "prerequisites" JSONB NOT NULL,
    "finalQuizTopics" JSONB NOT NULL,
    "certificatePassingScore" DOUBLE PRECISION NOT NULL DEFAULT 0.7,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chapter" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "masteryTopics" JSONB NOT NULL,

    CONSTRAINT "Chapter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lesson" (
    "id" TEXT NOT NULL,
    "chapterId" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "difficulty" INTEGER NOT NULL DEFAULT 1,
    "estimatedMinutes" INTEGER NOT NULL DEFAULT 0,
    "position" INTEGER NOT NULL DEFAULT 0,
    "explanations" JSONB NOT NULL,
    "checkQuestions" JSONB NOT NULL,

    CONSTRAINT "Lesson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LessonProgress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "courseExternalId" TEXT NOT NULL,
    "lessonExternalId" TEXT NOT NULL,
    "status" "LessonStatus" NOT NULL DEFAULT 'in_progress',
    "score" DOUBLE PRECISION,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "masteryScore" DOUBLE PRECISION,
    "msSpent" INTEGER NOT NULL DEFAULT 0,
    "preferredStyle" "Style",
    "extraExplanations" JSONB,
    "lastAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LessonProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Roadmap" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "stages" JSONB NOT NULL,
    "tools" JSONB NOT NULL,
    "certifications" JSONB NOT NULL,
    "careerPath" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Roadmap_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MasteryEntry" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "samples" INTEGER NOT NULL DEFAULT 0,
    "lastUpdatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MasteryEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SRSItem" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "kind" "SRSKind" NOT NULL,
    "payload" JSONB,
    "dueAt" TIMESTAMP(3) NOT NULL,
    "easeFactor" DOUBLE PRECISION NOT NULL DEFAULT 2.5,
    "interval" INTEGER NOT NULL DEFAULT 1,
    "reps" INTEGER NOT NULL DEFAULT 0,
    "lastReviewedAt" TIMESTAMP(3),

    CONSTRAINT "SRSItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Certificate" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "courseExternalId" TEXT NOT NULL,
    "courseTitle" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "verifyCode" TEXT NOT NULL,
    "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Certificate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TutorThread" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT 'New chat',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TutorThread_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TutorMessage" (
    "id" TEXT NOT NULL,
    "threadId" TEXT NOT NULL,
    "role" "TutorRole" NOT NULL,
    "content" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TutorMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EngagementDay" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "activeMs" INTEGER NOT NULL DEFAULT 0,
    "interventions" INTEGER NOT NULL DEFAULT 0,
    "routes" JSONB NOT NULL,

    CONSTRAINT "EngagementDay_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EngagementIntervention" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "route" TEXT NOT NULL,
    "action" TEXT NOT NULL,

    CONSTRAINT "EngagementIntervention_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DsaProblemStatus" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "problemId" INTEGER NOT NULL,
    "status" "DsaStatus" NOT NULL DEFAULT 'todo',
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DsaProblemStatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DsaBookmark" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "problemId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DsaBookmark_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DsaAttempt" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "problemId" INTEGER NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "msSpent" INTEGER NOT NULL DEFAULT 0,
    "hintsUsed" INTEGER NOT NULL DEFAULT 0,
    "lastAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DsaAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Note" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "refKey" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Note_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'info',
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Course_userId_idx" ON "Course"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Course_userId_externalId_key" ON "Course"("userId", "externalId");

-- CreateIndex
CREATE INDEX "Chapter_courseId_idx" ON "Chapter"("courseId");

-- CreateIndex
CREATE INDEX "Lesson_chapterId_idx" ON "Lesson"("chapterId");

-- CreateIndex
CREATE INDEX "LessonProgress_userId_idx" ON "LessonProgress"("userId");

-- CreateIndex
CREATE INDEX "LessonProgress_userId_courseExternalId_idx" ON "LessonProgress"("userId", "courseExternalId");

-- CreateIndex
CREATE UNIQUE INDEX "LessonProgress_userId_lessonExternalId_key" ON "LessonProgress"("userId", "lessonExternalId");

-- CreateIndex
CREATE INDEX "Roadmap_userId_idx" ON "Roadmap"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Roadmap_userId_externalId_key" ON "Roadmap"("userId", "externalId");

-- CreateIndex
CREATE INDEX "MasteryEntry_userId_idx" ON "MasteryEntry"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "MasteryEntry_userId_topic_key" ON "MasteryEntry"("userId", "topic");

-- CreateIndex
CREATE INDEX "SRSItem_userId_idx" ON "SRSItem"("userId");

-- CreateIndex
CREATE INDEX "SRSItem_userId_dueAt_idx" ON "SRSItem"("userId", "dueAt");

-- CreateIndex
CREATE UNIQUE INDEX "SRSItem_userId_itemId_kind_key" ON "SRSItem"("userId", "itemId", "kind");

-- CreateIndex
CREATE UNIQUE INDEX "Certificate_verifyCode_key" ON "Certificate"("verifyCode");

-- CreateIndex
CREATE INDEX "Certificate_userId_idx" ON "Certificate"("userId");

-- CreateIndex
CREATE INDEX "TutorThread_userId_idx" ON "TutorThread"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "TutorThread_userId_externalId_key" ON "TutorThread"("userId", "externalId");

-- CreateIndex
CREATE INDEX "TutorMessage_threadId_idx" ON "TutorMessage"("threadId");

-- CreateIndex
CREATE INDEX "EngagementDay_userId_idx" ON "EngagementDay"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "EngagementDay_userId_date_key" ON "EngagementDay"("userId", "date");

-- CreateIndex
CREATE INDEX "EngagementIntervention_userId_idx" ON "EngagementIntervention"("userId");

-- CreateIndex
CREATE INDEX "DsaProblemStatus_userId_idx" ON "DsaProblemStatus"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "DsaProblemStatus_userId_problemId_key" ON "DsaProblemStatus"("userId", "problemId");

-- CreateIndex
CREATE INDEX "DsaBookmark_userId_idx" ON "DsaBookmark"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "DsaBookmark_userId_problemId_key" ON "DsaBookmark"("userId", "problemId");

-- CreateIndex
CREATE INDEX "DsaAttempt_userId_idx" ON "DsaAttempt"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "DsaAttempt_userId_problemId_key" ON "DsaAttempt"("userId", "problemId");

-- CreateIndex
CREATE INDEX "Note_userId_idx" ON "Note"("userId");

-- CreateIndex
CREATE INDEX "Note_userId_refKey_idx" ON "Note"("userId", "refKey");

-- CreateIndex
CREATE INDEX "Notification_userId_idx" ON "Notification"("userId");

-- CreateIndex
CREATE INDEX "Notification_userId_readAt_idx" ON "Notification"("userId", "readAt");

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chapter" ADD CONSTRAINT "Chapter_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "Chapter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonProgress" ADD CONSTRAINT "LessonProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Roadmap" ADD CONSTRAINT "Roadmap_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MasteryEntry" ADD CONSTRAINT "MasteryEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SRSItem" ADD CONSTRAINT "SRSItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Certificate" ADD CONSTRAINT "Certificate_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TutorThread" ADD CONSTRAINT "TutorThread_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TutorMessage" ADD CONSTRAINT "TutorMessage_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "TutorThread"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EngagementDay" ADD CONSTRAINT "EngagementDay_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EngagementIntervention" ADD CONSTRAINT "EngagementIntervention_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DsaProblemStatus" ADD CONSTRAINT "DsaProblemStatus_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DsaBookmark" ADD CONSTRAINT "DsaBookmark_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DsaAttempt" ADD CONSTRAINT "DsaAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
