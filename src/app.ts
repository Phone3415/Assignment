import cookieParser from "cookie-parser";
import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import { apiRoute } from "./Routes";
import { frontEnd, staticDir } from "./Utils/path.util";

import { prisma } from "./Library/prisma";
import { errorMiddleware } from "./Middleware/error.middleware";
import { userMiddleware } from "./Middleware/user.middleware";

export function createApp(): Application {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser(process.env.COOKIE_SECRET));
  app.use(express.static(staticDir));
  app.use(express.static(frontEnd("build")));

  app.use("/api", apiRoute);
  app.use("/api", (_req: Request, res: Response): void => {
    res.status(404).json({
      success: false,
      error: "API route not found",
      timestamp: new Date().toISOString(),
    });
  });

  app.get("/login", (_req: Request, res: Response) => {
    res.sendFile(frontEnd("build", "index.html"));
  });

  app.get(/(.*)/, userMiddleware, (_req: Request, res: Response) => {
    res.sendFile(frontEnd("build", "index.html"));
  });

  app.use(errorMiddleware);

  return app;
}
