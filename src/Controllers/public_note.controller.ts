import { Request, Response } from "express";
import { Role } from "../../generated/prisma/enums";
import { PublicNoteService } from "../Services/public_note.service";
import { PUBLIC_NOTE_SCHEMA } from "../Types/note.type";
import { asyncHandler } from "../Utils/async_handler.util";

export class PublicNoteController {
  static getByAssignmentId = asyncHandler(async (req: Request, res: Response) => {
    const { assignmentId } = PUBLIC_NOTE_SCHEMA.assignmentIdParam.parse(req.params);
    const filters = PUBLIC_NOTE_SCHEMA.getAllQuery.parse(req.query);

    const items = await PublicNoteService.getByAssignmentId(assignmentId, filters);

    let nextCursor: string | null = null;
    if (items.length > 0) {
      const lastItem = items[items.length - 1];
      nextCursor = `${lastItem.id}__$__${lastItem.createdAt.toISOString()}`;
    }

    res.json({
      success: true,
      data: {
        items,
        nextCursor,
      },
      timestamp: new Date().toISOString(),
    });
  });

  static getById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = PUBLIC_NOTE_SCHEMA.idParam.parse(req.params);
    const item = await PublicNoteService.getById(id);

    if (!item) {
      return res.status(404).json({
        success: false,
        error: "ไม่พบโน้ตสาธารณะ",
        timestamp: new Date().toISOString(),
      });
    }

    res.json({
      success: true,
      data: item,
      timestamp: new Date().toISOString(),
    });
  });

  static create = asyncHandler(async (req: Request, res: Response) => {
    const { assignmentId } = PUBLIC_NOTE_SCHEMA.assignmentIdParam.parse(req.params);
    const data = PUBLIC_NOTE_SCHEMA.create.parse(req.body);

    const item = await PublicNoteService.create(req.user.id, assignmentId, data);

    res.status(201).json({
      success: true,
      data: item,
      timestamp: new Date().toISOString(),
    });
  });

  static update = asyncHandler(async (req: Request, res: Response) => {
    const { id } = PUBLIC_NOTE_SCHEMA.idParam.parse(req.params);
    const data = PUBLIC_NOTE_SCHEMA.update.parse(req.body);

    const item = await PublicNoteService.update(id, req.user.id, data);

    res.json({
      success: true,
      data: item,
      timestamp: new Date().toISOString(),
    });
  });

  static delete = asyncHandler(async (req: Request, res: Response) => {
    const { id } = PUBLIC_NOTE_SCHEMA.idParam.parse(req.params);
    const isAdmin = req.user.role === Role.Admin;

    const item = await PublicNoteService.delete(id, req.user.id, isAdmin);

    res.json({
      success: true,
      data: item,
      timestamp: new Date().toISOString(),
    });
  });
}
