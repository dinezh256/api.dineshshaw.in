import crypto from "crypto";
import express from "express";
import { logger } from "../logger.js";

declare global {
  namespace Express {
    interface Request {
      requestId: string;
    }
  }
}

export const requestContext = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const requestId = req.header("x-request-id") || crypto.randomUUID();
  const startedAt = process.hrtime.bigint();

  req.requestId = requestId;
  res.setHeader("x-request-id", requestId);

  res.on("finish", () => {
    const durationMs = Number(process.hrtime.bigint() - startedAt) / 1_000_000;

    logger.info("request_completed", {
      requestId,
      method: req.method,
      path: req.originalUrl,
      statusCode: res.statusCode,
      durationMs: Number(durationMs.toFixed(2)),
      ip: req.ip,
    });
  });

  next();
};
