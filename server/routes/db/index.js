// Mounts generic CRUD routers for every PrepNext entity under /api/db/*.
// Also exposes a deep "create full course" endpoint that proves nested
// relational inserts (course -> chapters -> lessons) work end-to-end.
import { Router } from "express";
import { crudRouter } from "./crud.js";
import { prisma } from "../../db.js";

// route segment -> Prisma delegate name
const RESOURCES = {
  users: "user",
  courses: "course",
  chapters: "chapter",
  lessons: "lesson",
  "lesson-progress": "lessonProgress",
  roadmaps: "roadmap",
  mastery: "masteryEntry",
  srs: "sRSItem",
  certificates: "certificate",
  "tutor-threads": "tutorThread",
  "tutor-messages": "tutorMessage",
  "engagement-days": "engagementDay",
  "engagement-interventions": "engagementIntervention",
  "dsa-status": "dsaProblemStatus",
  "dsa-bookmarks": "dsaBookmark",
  "dsa-attempts": "dsaAttempt",
  notes: "note",
  notifications: "notification",
};

const router = Router();

// DB-layer health: round-trip a query + report row counts per table.
router.get("/health", async (_req, res, next) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    const counts = {};
    for (const [seg, delegate] of Object.entries(RESOURCES)) {
      counts[seg] = await prisma[delegate].count();
    }
    res.json({ ok: true, db: "prepnext", tables: Object.keys(RESOURCES).length, counts });
  } catch (e) {
    next(e);
  }
});

// Deep create: POST /api/db/courses/full  { userId, externalId, title, ..., chapters:[{ ..., lessons:[...] }] }
router.post("/courses/full", async (req, res, next) => {
  try {
    const { chapters = [], ...course } = req.body || {};
    const created = await prisma.course.create({
      data: {
        ...course,
        chapters: {
          create: chapters.map((ch, ci) => {
            const { lessons = [], ...chapter } = ch;
            return {
              ...chapter,
              position: chapter.position ?? ci,
              lessons: {
                create: lessons.map((ls, li) => ({ ...ls, position: ls.position ?? li })),
              },
            };
          }),
        },
      },
      include: { chapters: { include: { lessons: true } } },
    });
    res.status(201).json(created);
  } catch (e) {
    next(e);
  }
});

for (const [segment, delegate] of Object.entries(RESOURCES)) {
  router.use(`/${segment}`, crudRouter(delegate));
}

export default router;
