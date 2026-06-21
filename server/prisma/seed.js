// Idempotent seed: a demo learner with one nested course, mastery, an SRS item,
// and a tutor thread. Safe to run repeatedly (keyed on stable unique fields).
import { prisma } from "../db.js";

async function main() {
  const user = await prisma.user.upsert({
    where: { email: "demo@prepnxt.local" },
    update: {},
    create: {
      email: "demo@prepnxt.local",
      displayName: "Demo Learner",
      avatarSeed: "demo123",
      learningGoal: "Crack MAANG SDE",
      preferredStyle: "step_by_step",
      dailyMinutes: 45,
    },
  });

  const courseKey = { userId_externalId: { userId: user.id, externalId: "course_demo_trees" } };
  if (!(await prisma.course.findUnique({ where: courseKey }))) {
    await prisma.course.create({
      data: {
        userId: user.id,
        externalId: "course_demo_trees",
        title: "Fundamentals of Tree Data Structures",
        description: "A beginner-friendly course on trees, traversal, and balancing.",
        level: "Beginner",
        estimatedHours: 5,
        prerequisites: ["Basic programming"],
        finalQuizTopics: ["Traversal", "Balancing", "Applications"],
        certificatePassingScore: 0.7,
        chapters: {
          create: [
            {
              externalId: "ch1",
              title: "Introduction to Trees",
              summary: "What trees are and core terminology.",
              position: 0,
              masteryTopics: ["Tree terminology", "Tree types"],
              lessons: {
                create: [
                  {
                    externalId: "l1",
                    title: "What is a Tree?",
                    difficulty: 1,
                    estimatedMinutes: 20,
                    position: 0,
                    explanations: {
                      visual: { markdown: "A tree is a hierarchical structure of nodes connected by edges." },
                      step_by_step: {
                        markdown: "Build a tree step by step.",
                        steps: [{ title: "Create root", detail: "Start with the root node." }],
                      },
                    },
                    checkQuestions: [
                      {
                        question: "What is the topmost node called?",
                        options: ["Leaf", "Root", "Branch", "Sibling"],
                        answerIndex: 1,
                        explanation: "The topmost node with no parent is the root.",
                      },
                    ],
                  },
                ],
              },
            },
          ],
        },
      },
    });
  }

  await prisma.masteryEntry.upsert({
    where: { userId_topic: { userId: user.id, topic: "Trees" } },
    update: { score: 0.42, samples: 3 },
    create: { userId: user.id, topic: "Trees", score: 0.42, samples: 3 },
  });

  await prisma.sRSItem.upsert({
    where: { userId_itemId_kind: { userId: user.id, itemId: "trees-intro", kind: "concept" } },
    update: {},
    create: {
      userId: user.id,
      itemId: "trees-intro",
      kind: "concept",
      dueAt: new Date(Date.now() + 86_400_000),
    },
  });

  await prisma.tutorThread.upsert({
    where: { userId_externalId: { userId: user.id, externalId: "thread_demo" } },
    update: {},
    create: {
      userId: user.id,
      externalId: "thread_demo",
      title: "Help with trees",
      messages: {
        create: [
          { role: "user", content: "What is a binary tree?", position: 0 },
          { role: "assistant", content: "A binary tree is a tree where each node has at most two children.", position: 1 },
        ],
      },
    },
  });

  const counts = {
    users: await prisma.user.count(),
    courses: await prisma.course.count(),
    lessons: await prisma.lesson.count(),
    mastery: await prisma.masteryEntry.count(),
    srs: await prisma.sRSItem.count(),
    tutorThreads: await prisma.tutorThread.count(),
    tutorMessages: await prisma.tutorMessage.count(),
  };
  console.log("Seed complete. Demo user:", user.email);
  console.log("Row counts:", counts);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error("Seed failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
