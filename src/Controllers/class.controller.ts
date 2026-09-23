import { Request, Response } from "express";
import z from "zod";
import { ClassService } from "../Services/class.service";
import { asyncHandler } from "../Utils/async_handler.util";

const CLASS_SCHEMA = {
  create: z.object({
    name: z.string().min(1, "Class name is required"),
  }),
  get: z.object({
    cursor: z.string().optional(),
    size: z.coerce.number().int().positive().optional().default(10),
  }),
  updateBody: z.object({
    name: z.string().min(1, "Class name is required"),
  }),
  updateParams: z.object({
    id: z.coerce.number().int().positive(),
  }),
  delete: z.object({
    id: z.coerce.number().int().positive(),
  }),
};

export class ClassController {
  static get = asyncHandler(async (req: Request, res: Response) => {
    const data = CLASS_SCHEMA.get.parse(req.query);
    const items = await ClassService.getAll(data.cursor, data.size);

    res.json({
      success: true,
      data: items,
      timestamp: new Date().toISOString(),
    });
  });

  static create = asyncHandler(async (req: Request, res: Response) => {
    const data = CLASS_SCHEMA.create.parse(req.body);
    const newClass = await ClassService.create(data.name);

    res.json({
      success: true,
      data: newClass,
      timestamp: new Date().toISOString(),
    });
  });

  static update = asyncHandler(async (req: Request, res: Response) => {
    const { id } = CLASS_SCHEMA.updateParams.parse(req.params);
    const data = CLASS_SCHEMA.updateBody.parse(req.body);
    const updatedClass = await ClassService.update(id, data.name);

    res.json({
      success: true,
      data: updatedClass,
      timestamp: new Date().toISOString(),
    });
  });

  static delete = asyncHandler(async (req: Request, res: Response) => {
    const data = CLASS_SCHEMA.delete.parse(req.params);
    const count = await ClassService.delete(data.id);

    res.json({
      success: true,
      data: { count },
      timestamp: new Date().toISOString(),
    });
  });
}
