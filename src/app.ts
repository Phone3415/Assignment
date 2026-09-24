import cookieParser from "cookie-parser";
import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import { apiRoute } from "./Routes";
import { staticDir } from "./Utils/path.util";

import { prisma } from "./Library/prisma";
import { errorMiddleware } from "./Middleware/error.middleware";
import { ONE_HOUR_MS, SEVEN_DAYS_MS } from "./Utils";

export function createApp(): Application {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser(process.env.COOKIE_SECRET));
  app.use(express.static(staticDir));

  app.use("/api", apiRoute);
  app.use("/api", (_req: Request, res: Response): void => {
    res.status(404).json({
      success: false,
      error: "API route not found",
      timestamp: new Date().toISOString(),
    });
  });

  app.use(errorMiddleware);

  setInterval(async () => {
    try {
      const sevenDaysAgo = new Date(Date.now() - SEVEN_DAYS_MS);

      await prisma.login.deleteMany({
        where: { createdAt: { lt: sevenDaysAgo } },
      });

      await prisma.$executeRawUnsafe(`PRAGMA optimize;`);
      await prisma.$executeRawUnsafe(`VACUUM;`);

      console.log(
        "Cleanup task: Removed expired sessions & optimized SQLite database",
      );
    } catch (err) {
      console.error("Cleanup task failed:", err);
    }
  }, ONE_HOUR_MS);

  return app;
}
