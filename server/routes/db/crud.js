// Generic REST CRUD factory over a Prisma model delegate.
// Gives list / get / create / update / delete for any table with a string `id` PK.
import { Router } from "express";
import { prisma } from "../../db.js";

// Map common Prisma error codes to sensible HTTP statuses.
function mapPrismaError(e) {
  switch (e?.code) {
    case "P2025":
      return { status: 404, message: "Record not found" };
    case "P2002":
      return { status: 409, message: `Unique constraint failed on: ${(e.meta?.target || []).toString()}` };
    case "P2003":
      return { status: 400, message: "Foreign key constraint failed" };
    default:
      return null;
  }
}

function handle(res, next, fn) {
  return Promise.resolve()
    .then(fn)
    .catch((e) => {
      const mapped = mapPrismaError(e);
      if (mapped) return res.status(mapped.status).json({ error: mapped.message });
      next(e);
    });
}

export function crudRouter(delegateName) {
  const r = Router();
  const model = () => prisma[delegateName];

  // LIST  (?limit, ?offset)
  r.get("/", (req, res, next) =>
    handle(res, next, async () => {
      const take = Math.min(Number(req.query.limit) || 100, 500);
      const skip = Math.max(Number(req.query.offset) || 0, 0);
      const [rows, total] = await Promise.all([
        model().findMany({ take, skip }),
        model().count(),
      ]);
      res.json({ total, count: rows.length, data: rows });
    })
  );

  // GET one
  r.get("/:id", (req, res, next) =>
    handle(res, next, async () => {
      const row = await model().findUnique({ where: { id: req.params.id } });
      if (!row) return res.status(404).json({ error: "Record not found" });
      res.json(row);
    })
  );

  // CREATE
  r.post("/", (req, res, next) =>
    handle(res, next, async () => {
      const row = await model().create({ data: req.body });
      res.status(201).json(row);
    })
  );

  // UPDATE (full or partial)
  const update = (req, res, next) =>
    handle(res, next, async () => {
      const row = await model().update({ where: { id: req.params.id }, data: req.body });
      res.json(row);
    });
  r.put("/:id", update);
  r.patch("/:id", update);

  // DELETE
  r.delete("/:id", (req, res, next) =>
    handle(res, next, async () => {
      await model().delete({ where: { id: req.params.id } });
      res.status(204).end();
    })
  );

  return r;
}
