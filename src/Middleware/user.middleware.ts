import { NextFunction, Request, Response } from "express";
import { User } from "../../generated/prisma/client";
import { AuthController } from "../Controllers/auth.controller";
import { prisma } from "../Library/prisma";

declare global {
  namespace Express {
    interface Request {
      user: User;
    }
  }
}

export const userMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const cookie = req.signedCookies[AuthController.COOKIE_KEY];

    if (!cookie) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
        timestamp: new Date().toISOString(),
      });
    }

    const login = await prisma.login.findUnique({
      where: { cookie },
      include: { user: true },
    });

    if (!login || !login.user) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
        timestamp: new Date().toISOString(),
      });
    }

    req.user = login.user;
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      timestamp: new Date().toISOString(),
    });
  }
};
