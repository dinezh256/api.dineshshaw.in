import express, { type Request, type Response } from "express";
import { getDatabaseStatus } from "../database.js";

const router = express.Router();

router.get("/health", (_req: Request, res: Response) => {
  res.status(200).send({
    status: "ok",
    uptimeSeconds: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

router.get("/ready", (_req: Request, res: Response) => {
  const database = getDatabaseStatus();
  const isReady = database.readyState === "connected";

  res.status(isReady ? 200 : 503).send({
    status: isReady ? "ready" : "degraded",
    checks: {
      database,
    },
  });
});

export default router;
