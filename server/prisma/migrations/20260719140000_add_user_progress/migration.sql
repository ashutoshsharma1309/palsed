-- Vision 3.0: durable server-side mirror of the client's per-user localStorage
-- progress (DSA checklist/solved/streak, lesson checklist, quiz results,
-- mastery, SRS, notes, etc). One JSON blob per user — see the model comment in
-- schema.prisma for why this is a single flexible table rather than several
-- typed ones. Purely additive: no existing table/column is touched.

-- CreateTable
CREATE TABLE "UserProgress" (
    "userId" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserProgress_pkey" PRIMARY KEY ("userId")
);

-- AddForeignKey
ALTER TABLE "UserProgress" ADD CONSTRAINT "UserProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
