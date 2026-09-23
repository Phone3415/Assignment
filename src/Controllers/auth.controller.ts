import { Request, Response } from "express";
import { AuthService } from "../Services/auth.service";
import { asyncHandler } from "../Utils/async_handler.util";

import z from "zod";

const AUTH_SCHEMA = {
  login: z.object({
    studentId: z.string().min(1, "Student ID is required"),
  }),
};

export class AuthController {
  static COOKIE_KEY = "OHS-TOKEN";

  static login = asyncHandler(async (req: Request, res: Response) => {
    const parseResult = AUTH_SCHEMA.login.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        error: "Invalid body",
        details: parseResult.error.issues,
        timestamp: new Date().toISOString(),
      });
    }

    const data = parseResult.data;

    const { cookie, user } = await AuthService.login(data.studentId);
    if (!cookie || !user) {
      return res.status(401).json({
        success: false,
        error: "User might not existed",
        timestamp: new Date().toISOString(),
      });
    }

    res.cookie(AuthController.COOKIE_KEY, cookie, {
      signed: true,
      secure: true,
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 60,
      httpOnly: true,
    });

    res.status(201).json({
      success: true,
      data: {
        name: user.name,
        assignmentCount: 0,
        createdAt: user.createdAt.toISOString(),
      },
      timestamp: new Date().toISOString(),
    });
  });

  static logout = asyncHandler(async (req: Request, res: Response) => {
    const cookie = req.signedCookies[AuthController.COOKIE_KEY];
    if (!cookie) {
      return res.redirect("/");
    }

    res.clearCookie(AuthController.COOKIE_KEY);
    AuthService.logout(cookie);

    res.status(201).json({
      success: true,
      timestamp: new Date().toISOString(),
    });
  });
}
