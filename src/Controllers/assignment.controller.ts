import { Request, Response } from "express";
import z from "zod";
import { AssignmentType } from "../../generated/prisma/enums";
import { AssignmentService } from "../Services";
import { AssignmentCheckListService } from "../Services/assignment_checklist.service";
import { AssignmentStatus } from "../Types/assignment.type";
import { asyncHandler } from "../Utils/async_handler.util";

const ASSIGNMENT_TYPES = [
  AssignmentType.Solo,
  AssignmentType.Group,
  AssignmentType.Major,
];

const ASSIGNMENT_STATUSES = [
  AssignmentStatus.Unchecked,
  AssignmentStatus.Submitted,
  AssignmentStatus.Overdue,
  AssignmentStatus.Urgent,
];

const ASSIGNMENT_SCHEMA = {
  idParam: z.object({
    id: z.coerce.number().int().positive(),
  }),
  classIdParam: z.object({
    classId: z.coerce.number().int().positive(),
  }),
  compositeParam: z.object({
    id: z.coerce.number().int().positive(),
    classId: z.coerce.number().int().positive(),
  }),

  create: z.object({
    name: z.string().min(1, "Assignment name is required"),
    description: z
      .string()
      .min(10, "Assignment description must be at least 10 characters"),
    assignedDate: z.coerce.date(),
    deadline: z.coerce.date().optional(),
    type: z.enum(ASSIGNMENT_TYPES, {
      error: "Invalid assignment type",
    }),
    groupSize: z.int().positive().optional(),
  }),

  getAllQuery: z.object({
    cursor: z.string().optional(),
    size: z.coerce.number().int().positive().optional().default(10),
    groupSize: z.coerce.number().int().positive().optional(),
    type: z.enum(ASSIGNMENT_TYPES).optional(),
    status: z.enum(ASSIGNMENT_STATUSES).optional(),
  }),
  updateBody: z.object({
    name: z
      .string()
      .min(1, "Assignment name must be at least 1 characters")
      .optional(),
    description: z
      .string()
      .min(10, "Assignment description must be at least 10 characters")
      .optional(),
    assignedDate: z.coerce.date().optional(),
    deadline: z.coerce.date().optional(),
    type: z
      .enum(ASSIGNMENT_TYPES, {
        error: "Invalid assignment type",
      })
      .optional(),
    groupSize: z.int().positive().optional(),
  }),
};

export class AssignmentController {
  static get = asyncHandler(async (req: Request, res: Response) => {
    const { id, classId } = ASSIGNMENT_SCHEMA.compositeParam.parse(req.params);
    const item = await AssignmentService.get(classId, id, req.user.id);

    res.json({
      success: true,
      data: item,
      timestamp: new Date().toISOString(),
    });
  });

  static getAll = asyncHandler(async (req: Request, res: Response) => {
    const { classId } = ASSIGNMENT_SCHEMA.classIdParam.parse(req.params);
    const filters = ASSIGNMENT_SCHEMA.getAllQuery.parse(req.query);
    const items = await AssignmentService.getAll(classId, filters, req.user.id);

    res.json({
      success: true,
      data: items,
      timestamp: new Date().toISOString(),
    });
  });

  static create = asyncHandler(async (req: Request, res: Response) => {
    const { classId } = ASSIGNMENT_SCHEMA.classIdParam.parse(req.params);
    const data = ASSIGNMENT_SCHEMA.create.parse(req.body);
    const createdAssignment = await AssignmentService.create(classId, data);

    res.json({
      success: true,
      data: createdAssignment,
      timestamp: new Date().toISOString(),
    });
  });

  static update = asyncHandler(async (req: Request, res: Response) => {
    const { id } = ASSIGNMENT_SCHEMA.idParam.parse(req.params);
    const data = ASSIGNMENT_SCHEMA.updateBody.parse(req.body);
    const updatedAssignment = await AssignmentService.update(id, data);

    res.json({
      success: true,
      data: updatedAssignment,
      timestamp: new Date().toISOString(),
    });
  });

  static delete = asyncHandler(async (req: Request, res: Response) => {
    const { id } = ASSIGNMENT_SCHEMA.idParam.parse(req.params);
    const deletedAssignment = await AssignmentService.delete(id);

    res.json({
      success: true,
      data: deletedAssignment,
      timestamp: new Date().toISOString(),
    });
  });

  static submit = asyncHandler(async (req: Request, res: Response) => {
    const { classId, id } = ASSIGNMENT_SCHEMA.compositeParam.parse(req.params);
    const submit = await AssignmentCheckListService.check(classId, id, req.user.id);

    res.json({
      success: true,
      data: submit,
      timestamp: new Date().toISOString(),
    });
  });

  static unsubmit = asyncHandler(async (req: Request, res: Response) => {
    const { classId, id } = ASSIGNMENT_SCHEMA.compositeParam.parse(req.params);
    const unsubmit = await AssignmentCheckListService.uncheck(classId, id, req.user.id);

    res.json({
      success: true,
      data: unsubmit,
      timestamp: new Date().toISOString(),
    });
  });
}
