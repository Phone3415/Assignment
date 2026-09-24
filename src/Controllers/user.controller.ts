import { Request, Response } from "express";
import { Role } from "../../generated/prisma/client";
import { UserService } from "../Services/user.service";
import { USER_SCHEMA } from "../Types/user.type";
import { asyncHandler } from "../Utils/async_handler.util";

export class UserController {
  static getAll = asyncHandler(async (req: Request, res: Response) => {
    const data = USER_SCHEMA.get.parse(req.query);
    const users = await UserService.getAll(
      data.cursor,
      data.size,
      data.search,
      data.role as Role | undefined,
    );

    res.json({
      success: true,
      data: users,
      timestamp: new Date().toISOString(),
    });
  });

  static getById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = USER_SCHEMA.getById.parse(req.params);
    const user = await UserService.getById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
        timestamp: new Date().toISOString(),
      });
    }

    res.json({
      success: true,
      data: user,
      timestamp: new Date().toISOString(),
    });
  });

  static create = asyncHandler(async (req: Request, res: Response) => {
    const data = USER_SCHEMA.create.parse(req.body);

    const existingUser = await UserService.getByStudentId(data.studentId);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: "User with this Student ID already exists",
        timestamp: new Date().toISOString(),
      });
    }

    const user = await UserService.create(
      data.studentId,
      data.name,
      data.role as Role | undefined,
    );

    res.status(201).json({
      success: true,
      data: user,
      timestamp: new Date().toISOString(),
    });
  });

  static update = asyncHandler(async (req: Request, res: Response) => {
    const { id } = USER_SCHEMA.updateParams.parse(req.params);
    const data = USER_SCHEMA.updateBody.parse(req.body);

    const user = await UserService.getById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
        timestamp: new Date().toISOString(),
      });
    }

    if (data.studentId && data.studentId !== user.studentId) {
      const existingUser = await UserService.getByStudentId(data.studentId);
      if (existingUser) {
        return res.status(409).json({
          success: false,
          error: "User with this Student ID already exists",
          timestamp: new Date().toISOString(),
        });
      }
    }

    const updatedUser = await UserService.update(id, {
      studentId: data.studentId,
      name: data.name,
      role: data.role as Role | undefined,
    });

    res.json({
      success: true,
      data: updatedUser,
      timestamp: new Date().toISOString(),
    });
  });

  static delete = asyncHandler(async (req: Request, res: Response) => {
    const { id } = USER_SCHEMA.delete.parse(req.params);

    const user = await UserService.getById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
        timestamp: new Date().toISOString(),
      });
    }

    const deletedUser = await UserService.delete(id);

    res.json({
      success: true,
      data: deletedUser,
      timestamp: new Date().toISOString(),
    });
  });
}
