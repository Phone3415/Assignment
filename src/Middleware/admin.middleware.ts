import { NextFunction, Request, Response } from "express";
import { Role } from "../../generated/prisma/enums";

export const adminMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (req.user.role !== Role.Admin) {
      return res.status(403).json({
        success: false,
        error: "Forbidden",
        timestamp: new Date().toISOString(),
      });
    }

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      timestamp: new Date().toISOString(),
    });
  }
};
