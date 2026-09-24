import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../../generated/prisma/client";
import { prisma } from "../Library/prisma";
import { AuthService } from "../Services";
import { USER_SCHEMA } from "../Types/user.type";

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
    const isApi = req.originalUrl.startsWith("/api");
    const api401Response = () =>
      res.status(401).json({
        success: false,
        error: "Unauthorized",
        timestamp: new Date().toISOString(),
      });

    const redirectOrResponse = () => {
      if (isApi) return api401Response();
      return res.redirect("/login");
    };

    const authentication = USER_SCHEMA.authentication.safeParse(req.headers);
    if (!authentication.success) {
      return redirectOrResponse();
    }

    const { authorization } = authentication.data;
    const token = authorization.slice(7);

    let decoded: any;
    try {
      decoded = jwt.verify(token, AuthService.jwtSecret);
    } catch {
      return redirectOrResponse();
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      return redirectOrResponse();
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("User middleware error:", error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      timestamp: new Date().toISOString(),
    });
  }
};
