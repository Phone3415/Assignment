import { Request, Response } from "express";
import { PrivateNoteService } from "../Services/private_note.service";
import { PRIVATE_NOTE_SCHEMA } from "../Types/note.type";
import { asyncHandler } from "../Utils/async_handler.util";

export class PrivateNoteController {
  static getMine = asyncHandler(async (req: Request, res: Response) => {
    const { assignmentId } = PRIVATE_NOTE_SCHEMA.assignmentIdParam.parse(req.params);

    const item = await PrivateNoteService.getMine(req.user.id, assignmentId);

    if (!item) {
      return res.status(404).json({
        success: false,
        error: "Private note not found",
        timestamp: new Date().toISOString(),
      });
    }

    res.json({
      success: true,
      data: item,
      timestamp: new Date().toISOString(),
    });
  });

  static upsert = asyncHandler(async (req: Request, res: Response) => {
    const { assignmentId } = PRIVATE_NOTE_SCHEMA.assignmentIdParam.parse(req.params);
    const { content } = PRIVATE_NOTE_SCHEMA.upsert.parse(req.body);

    const item = await PrivateNoteService.upsert(req.user.id, assignmentId, content as any);

    res.json({
      success: true,
      data: item,
      timestamp: new Date().toISOString(),
    });
  });
}
