import "dotenv/config";
import express, { type ErrorRequestHandler, type Request, type Response } from "express";
import cors from "cors";
import helmet from "helmet";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

import viewRoutes from "./routes/view.js";
import healthRoutes from "./routes/health.js";
import userRoutes from "./routes/users.js";
import authRoutes from "./routes/auth.js";
import { mongoSanitize } from "./middleware/sanitize.js";
import { config } from "./config.js";
import { requestContext } from "./middleware/requestContext.js";
import { logger } from "./logger.js";
import { AppError } from "./errors.js";
import { apiRateLimiter } from "./middleware/rateLimit.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const corsOptions: cors.CorsOptions = {
  origin: function (origin, callback) {
    if (!origin || config.corsOrigins.includes(origin) || config.isDevelopment) {
      callback(null, true);
    } else {
      callback(new Error("Request from unauthorized origin"));
    }
  },
};

export const createApp = () => {
  const app = express();
  app.disable("x-powered-by");
  app.set("trust proxy", config.trustProxyHops);

  // Middleware
  app.use(helmet());
  app.use(requestContext);
  app.use(mongoSanitize); // Prevent NoSQL Injection
  app.use(express.json({ limit: config.jsonBodyLimit }));
  app.use(cors(corsOptions));
  app.use(express.static(join(__dirname, "../public")));
  app.use("/api", apiRateLimiter);

  // Routes
  app.get("/", (_: Request, res: Response) => {
    res.sendFile(join(__dirname, "../index.html"));
  });

  if (config.auth.enabled) {
    app.use("/api/signup", userRoutes);
    app.use("/api/login", authRoutes);
  }

  app.use("/", healthRoutes);
  app.use("/api/views", viewRoutes);

  // Global error handler
  const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
    const statusCode = err instanceof AppError ? err.statusCode : 500;
    const message =
      err instanceof Error && config.isDevelopment ? err.message : "Internal Server Error";

    logger.error("request_failed", {
      requestId: req.requestId,
      method: req.method,
      path: req.originalUrl,
      statusCode,
      error: err instanceof Error ? err.message : "Unknown error",
    });

    res.status(statusCode).send({
      message,
      requestId: req.requestId,
    });
  };

  app.use(errorHandler);

  return app;
};

const app = createApp();

export default app;
