import { createApp } from "./app";
import { env } from "./config/env";
import { disconnectPrisma } from "./config/prisma";
import { disconnectRedis } from "./config/redis";
import { startCronJobs } from "./cron";
import { logger } from "./utils/logger";

async function main(): Promise<void> {
  const app = createApp();

  const server = app.listen(env.PORT, () => {
    logger.info(`🚀 Almigo Backend running on port ${env.PORT}`);
    logger.info(`   Environment: ${env.NODE_ENV}`);
    logger.info(`   Health check: http://localhost:${env.PORT}/health`);
    startCronJobs();
  });

  const shutdown = async (signal: string): Promise<void> => {
    logger.info(`${signal} received — shutting down gracefully...`);

    server.close(async () => {
      try {
        await disconnectPrisma();
        await disconnectRedis();
        logger.info("All connections closed. Goodbye!");
        process.exit(0);
      } catch (error) {
        logger.error("Error during shutdown:", error);
        process.exit(1);
      }
    });

    // Force shutdown after 10 seconds
    setTimeout(() => {
      logger.error("Forced shutdown after 10s timeout");
      process.exit(1);
    }, 10_000);
  };

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));

  process.on("unhandledRejection", (reason: unknown) => {
    logger.error("Unhandled Rejection:", reason);
  });

  process.on("uncaughtException", (error: Error) => {
    logger.error("Uncaught Exception:", error);
    process.exit(1);
  });
}

main().catch((error) => {
  logger.error("Failed to start server:", error);
  process.exit(1);
});
