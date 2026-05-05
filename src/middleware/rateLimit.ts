import rateLimit from "express-rate-limit";
import { config } from "../config.js";

const buildRateLimiter = (windowMs: number, max: number, message: string) =>
  rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message },
    validate: {
      trustProxy: false,
      xForwardedForHeader: false,
    },
  });

export const apiRateLimiter = buildRateLimiter(
  config.rateLimit.apiWindowMs,
  config.rateLimit.apiMax,
  "Too many requests, please try again later."
);

export const authRateLimiter = buildRateLimiter(
  config.rateLimit.authWindowMs,
  config.rateLimit.authMax,
  "Too many authentication attempts, please try again later."
);

export const viewsRateLimiter = buildRateLimiter(
  config.rateLimit.viewsWindowMs,
  config.rateLimit.viewsMax,
  "Too many requests, please try again later."
);
