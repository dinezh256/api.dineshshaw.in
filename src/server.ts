import "dotenv/config";
import app from "./app.js";
import { config } from "./config.js";
import connectDB from "./database.js";
import { logger } from "./logger.js";

let isShuttingDown = false;

const startServer = async () => {
  try {
    await connectDB();

    const server = app.listen(config.port, () => {
      logger.info("server_started", {
        env: config.env,
        port: config.port,
      });
    });

    const shutdown = (signal: string) => {
      if (isShuttingDown) return;
      isShuttingDown = true;

      logger.info("server_shutdown_started", { signal });
      server.close((error) => {
        if (error) {
          logger.error("server_shutdown_failed", { signal, error: error.message });
          process.exit(1);
          return;
        }

        logger.info("server_shutdown_completed", { signal });
        process.exit(0);
      });
    };

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));
  } catch (error) {
    logger.error("server_startup_failed", {
      error: error instanceof Error ? error.message : "Unknown error",
    });
    process.exit(1);
  }
};

void startServer();
