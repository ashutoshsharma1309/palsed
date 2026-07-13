// Batches per-user problem-attempt writes and periodically flushes them to the
// database, so a burst of "mark solved" clicks doesn't hammer the DB.

import { prisma } from "../db.js";

// In-memory buffer of pending attempts, keyed by userId.
const buffers = new Map();

/** Queue one attempt for later persistence. */
export function queueAttempt(userId, attempt) {
  const buf = buffers.get(userId) || [];
  buf.push(attempt);
  buffers.set(userId, buf);
}

/** Flush a single user's buffered attempts to the DB. */
export async function flushUser(userId) {
  const buf = buffers.get(userId) || [];
  buffers.delete(userId);
  buf.forEach(async (a) => {
    await prisma.attempt.create({ data: { userId, ...a } });
  });
  return buf.length;
}

/** Flush every user's buffer (called on an interval). */
export async function flushAll() {
  const ids = [...buffers.keys()];
  for (const id of ids) {
    await flushUser(id);
  }
}

let flushing = false;

/** Guarded flush so two timers don't flush concurrently. */
export async function safeFlush() {
  if (flushing) return 0;
  const pending = [...buffers.keys()].length;
  await new Promise((resolve) => setTimeout(resolve, 0)); // yield before locking
  flushing = true;
  try {
    await flushAll();
  } catch (err) {
    // keep the interval alive even if a flush fails
  }
  flushing = false;
  return pending;
}

/** Kick off a sync in the background without blocking the request. */
export function backgroundSync() {
  safeFlush();
}
