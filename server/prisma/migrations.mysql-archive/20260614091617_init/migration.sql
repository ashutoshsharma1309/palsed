-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `displayName` VARCHAR(191) NOT NULL DEFAULT 'Learner',
    `avatarSeed` VARCHAR(191) NOT NULL DEFAULT '',
    `learningGoal` VARCHAR(191) NOT NULL DEFAULT 'Master DSA',
    `preferredStyle` ENUM('visual', 'code_first', 'analogy', 'step_by_step') NOT NULL DEFAULT 'step_by_step',
    `dailyMinutes` INTEGER NOT NULL DEFAULT 30,
    `joinedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Course` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `externalId` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `level` ENUM('Beginner', 'Intermediate', 'Advanced') NOT NULL DEFAULT 'Beginner',
    `estimatedHours` INTEGER NOT NULL DEFAULT 0,
    `prerequisites` JSON NOT NULL,
    `finalQuizTopics` JSON NOT NULL,
    `certificatePassingScore` DOUBLE NOT NULL DEFAULT 0.7,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Course_userId_idx`(`userId`),
    UNIQUE INDEX `Course_userId_externalId_key`(`userId`, `externalId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Chapter` (
    `id` VARCHAR(191) NOT NULL,
    `courseId` VARCHAR(191) NOT NULL,
    `externalId` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `summary` TEXT NOT NULL,
    `position` INTEGER NOT NULL DEFAULT 0,
    `masteryTopics` JSON NOT NULL,

    INDEX `Chapter_courseId_idx`(`courseId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Lesson` (
    `id` VARCHAR(191) NOT NULL,
    `chapterId` VARCHAR(191) NOT NULL,
    `externalId` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `difficulty` INTEGER NOT NULL DEFAULT 1,
    `estimatedMinutes` INTEGER NOT NULL DEFAULT 0,
    `position` INTEGER NOT NULL DEFAULT 0,
    `explanations` JSON NOT NULL,
    `checkQuestions` JSON NOT NULL,

    INDEX `Lesson_chapterId_idx`(`chapterId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LessonProgress` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `courseExternalId` VARCHAR(191) NOT NULL,
    `lessonExternalId` VARCHAR(191) NOT NULL,
    `status` ENUM('in_progress', 'complete') NOT NULL DEFAULT 'in_progress',
    `score` DOUBLE NULL,
    `attempts` INTEGER NOT NULL DEFAULT 0,
    `masteryScore` DOUBLE NULL,
    `msSpent` INTEGER NOT NULL DEFAULT 0,
    `preferredStyle` ENUM('visual', 'code_first', 'analogy', 'step_by_step') NULL,
    `extraExplanations` JSON NULL,
    `lastAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `LessonProgress_userId_idx`(`userId`),
    INDEX `LessonProgress_userId_courseExternalId_idx`(`userId`, `courseExternalId`),
    UNIQUE INDEX `LessonProgress_userId_lessonExternalId_key`(`userId`, `lessonExternalId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Roadmap` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `externalId` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `stages` JSON NOT NULL,
    `tools` JSON NOT NULL,
    `certifications` JSON NOT NULL,
    `careerPath` JSON NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Roadmap_userId_idx`(`userId`),
    UNIQUE INDEX `Roadmap_userId_externalId_key`(`userId`, `externalId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MasteryEntry` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `topic` VARCHAR(191) NOT NULL,
    `score` DOUBLE NOT NULL DEFAULT 0,
    `samples` INTEGER NOT NULL DEFAULT 0,
    `lastUpdatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `MasteryEntry_userId_idx`(`userId`),
    UNIQUE INDEX `MasteryEntry_userId_topic_key`(`userId`, `topic`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SRSItem` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `itemId` VARCHAR(191) NOT NULL,
    `kind` ENUM('concept', 'dsa', 'quiz') NOT NULL,
    `payload` JSON NULL,
    `dueAt` DATETIME(3) NOT NULL,
    `easeFactor` DOUBLE NOT NULL DEFAULT 2.5,
    `interval` INTEGER NOT NULL DEFAULT 1,
    `reps` INTEGER NOT NULL DEFAULT 0,
    `lastReviewedAt` DATETIME(3) NULL,

    INDEX `SRSItem_userId_idx`(`userId`),
    INDEX `SRSItem_userId_dueAt_idx`(`userId`, `dueAt`),
    UNIQUE INDEX `SRSItem_userId_itemId_kind_key`(`userId`, `itemId`, `kind`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Certificate` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `externalId` VARCHAR(191) NOT NULL,
    `courseExternalId` VARCHAR(191) NOT NULL,
    `courseTitle` VARCHAR(191) NOT NULL,
    `displayName` VARCHAR(191) NOT NULL,
    `score` DOUBLE NOT NULL,
    `verifyCode` VARCHAR(191) NOT NULL,
    `issuedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Certificate_verifyCode_key`(`verifyCode`),
    INDEX `Certificate_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TutorThread` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `externalId` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL DEFAULT 'New chat',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `TutorThread_userId_idx`(`userId`),
    UNIQUE INDEX `TutorThread_userId_externalId_key`(`userId`, `externalId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TutorMessage` (
    `id` VARCHAR(191) NOT NULL,
    `threadId` VARCHAR(191) NOT NULL,
    `role` ENUM('user', 'assistant') NOT NULL,
    `content` TEXT NOT NULL,
    `position` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `TutorMessage_threadId_idx`(`threadId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EngagementDay` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `date` VARCHAR(191) NOT NULL,
    `activeMs` INTEGER NOT NULL DEFAULT 0,
    `interventions` INTEGER NOT NULL DEFAULT 0,
    `routes` JSON NOT NULL,

    INDEX `EngagementDay_userId_idx`(`userId`),
    UNIQUE INDEX `EngagementDay_userId_date_key`(`userId`, `date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EngagementIntervention` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `route` VARCHAR(191) NOT NULL,
    `action` VARCHAR(191) NOT NULL,

    INDEX `EngagementIntervention_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DsaProblemStatus` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `problemId` INTEGER NOT NULL,
    `status` ENUM('todo', 'attempted', 'solved') NOT NULL DEFAULT 'todo',
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `DsaProblemStatus_userId_idx`(`userId`),
    UNIQUE INDEX `DsaProblemStatus_userId_problemId_key`(`userId`, `problemId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DsaBookmark` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `problemId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `DsaBookmark_userId_idx`(`userId`),
    UNIQUE INDEX `DsaBookmark_userId_problemId_key`(`userId`, `problemId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DsaAttempt` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `problemId` INTEGER NOT NULL,
    `count` INTEGER NOT NULL DEFAULT 0,
    `msSpent` INTEGER NOT NULL DEFAULT 0,
    `hintsUsed` INTEGER NOT NULL DEFAULT 0,
    `lastAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `DsaAttempt_userId_idx`(`userId`),
    UNIQUE INDEX `DsaAttempt_userId_problemId_key`(`userId`, `problemId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Note` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `refKey` VARCHAR(191) NOT NULL,
    `body` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Note_userId_idx`(`userId`),
    INDEX `Note_userId_refKey_idx`(`userId`, `refKey`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Notification` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `body` TEXT NOT NULL,
    `type` VARCHAR(191) NOT NULL DEFAULT 'info',
    `readAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Notification_userId_idx`(`userId`),
    INDEX `Notification_userId_readAt_idx`(`userId`, `readAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Course` ADD CONSTRAINT `Course_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Chapter` ADD CONSTRAINT `Chapter_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `Course`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Lesson` ADD CONSTRAINT `Lesson_chapterId_fkey` FOREIGN KEY (`chapterId`) REFERENCES `Chapter`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LessonProgress` ADD CONSTRAINT `LessonProgress_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Roadmap` ADD CONSTRAINT `Roadmap_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MasteryEntry` ADD CONSTRAINT `MasteryEntry_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SRSItem` ADD CONSTRAINT `SRSItem_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Certificate` ADD CONSTRAINT `Certificate_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TutorThread` ADD CONSTRAINT `TutorThread_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TutorMessage` ADD CONSTRAINT `TutorMessage_threadId_fkey` FOREIGN KEY (`threadId`) REFERENCES `TutorThread`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EngagementDay` ADD CONSTRAINT `EngagementDay_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EngagementIntervention` ADD CONSTRAINT `EngagementIntervention_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DsaProblemStatus` ADD CONSTRAINT `DsaProblemStatus_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DsaBookmark` ADD CONSTRAINT `DsaBookmark_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DsaAttempt` ADD CONSTRAINT `DsaAttempt_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Note` ADD CONSTRAINT `Note_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
