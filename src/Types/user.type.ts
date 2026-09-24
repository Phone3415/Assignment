import z from "zod";

export const USER_SCHEMA = {
  create: z.object({
    studentId: z.string().min(1, "Student ID is required"),
    name: z.string().min(1, "Name is required"),
    role: z.enum(["Student", "Admin"]).optional(),
  }),
  get: z.object({
    cursor: z.string().optional(),
    size: z.coerce.number().int().positive().optional().default(10),
    search: z.string().optional(),
    role: z.enum(["Student", "Admin"]).optional(),
  }),
  getById: z.object({
    id: z.coerce.number().int().positive("Invalid User ID"),
  }),
  updateParams: z.object({
    id: z.coerce.number().int().positive("Invalid User ID"),
  }),
  updateBody: z
    .object({
      studentId: z.string().min(1, "Student ID cannot be empty").optional(),
      name: z.string().min(1, "Name cannot be empty").optional(),
      role: z.enum(["Student", "Admin"]).optional(),
    })
    .refine(
      (data) =>
        data.studentId !== undefined ||
        data.name !== undefined ||
        data.role !== undefined,
      {
        message: "At least one field (studentId, name, role) must be provided",
      },
    ),
  delete: z.object({
    id: z.coerce.number().int().positive("Invalid User ID"),
  }),
  login: z.object({
    studentId: z.string().min(1, "Student ID is required"),
  }),
  authentication: z.object({
    authorization: z
      .string()
      .startsWith("Bearer ", "Invalid authorization format"),
  }),
  refreshToken: z.object({
    refreshToken: z.string().min(1, "Refresh token is required"),
  }),
};
