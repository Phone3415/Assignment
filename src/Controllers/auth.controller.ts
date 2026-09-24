import { Request, Response } from "express";
import { AuthService } from "../Services/auth.service";
import { USER_SCHEMA } from "../Types/user.type";
import { asyncHandler } from "../Utils/async_handler.util";

export class AuthController {
  static login = asyncHandler(async (req: Request, res: Response) => {
    const parseResult = USER_SCHEMA.login.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        error: "Invalid body",
        details: parseResult.error.issues,
        timestamp: new Date().toISOString(),
      });
    }

    const data = parseResult.data;

    const { token, refreshToken, user } = await AuthService.login(
      data.studentId,
    );

    if (!token || !refreshToken || !user) {
      return res.status(401).json({
        success: false,
        error: "User might not existed",
        timestamp: new Date().toISOString(),
      });
    }

    res.status(200).json({
      success: true,
      data: {
        accessToken: token,
        refreshToken,
        user: {
          id: user.id,
          studentId: user.studentId,
          name: user.name,
          role: user.role,
        },
      },
      timestamp: new Date().toISOString(),
    });
  });

  static refreshToken = asyncHandler(async (req: Request, res: Response) => {
    const parseResult = USER_SCHEMA.refreshToken.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        error: "Invalid body",
        details: parseResult.error.issues,
        timestamp: new Date().toISOString(),
      });
    }

    const data = parseResult.data;

    const { token, refreshToken, user } = await AuthService.refreshToken(
      data.refreshToken,
    );

    if (!token || !refreshToken || !user) {
      return res.status(401).json({
        success: false,
        error: "User might not existed or refresh token might be invalid",
        timestamp: new Date().toISOString(),
      });
    }

    res.status(200).json({
      success: true,
      data: {
        accessToken: token,
        refreshToken,
        user: {
          id: user.id,
          studentId: user.studentId,
          name: user.name,
          role: user.role,
        },
      },
      timestamp: new Date().toISOString(),
    });
  });
}
