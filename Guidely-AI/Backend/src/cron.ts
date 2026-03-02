import cron from "node-cron";
import { logger } from "./utils/logger";

export function startCronJobs(): void {
  cron.schedule("*/10 * * * *", async () => {
    try {
      const url = `https://almigo-ai-mentor-backend.onrender.com/health`;
      const res = await fetch(url, { method: "GET", signal: AbortSignal.timeout(10_000) });
      logger.info(`⏰ Health ping: ${res.status} ${res.statusText}`);
    } catch (error) {
      logger.warn(`⏰ Health ping failed: ${(error as Error).message}`);
    }
  });

  logger.info("⏰ Cron jobs started (health ping every 10 min)");
}
