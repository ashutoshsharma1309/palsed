import { Router } from "express";

const r = Router();
r.get("/", (_req, res) => {
  res.json({
    ok: true,
    service: "prepnxt",
    version: "2.0.0",
    features: ["companies", "pyq-vault", "applications", "dsa", "placement-hub"],
  });
});
export default r;
