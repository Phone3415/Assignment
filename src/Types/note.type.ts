import z from "zod";

export const PUBLIC_NOTE_SCHEMA = {
  idParam: z.object({
    id: z.coerce.number().int().positive(),
  }),
  assignmentIdParam: z.object({
    assignmentId: z.coerce.number().int().positive(),
  }),
  create: z.object({
    title: z.string().min(1, "Title is required"),
    content: z.string().min(1, "Content is required"),
  }),
  update: z.object({
    title: z.string().min(1).optional(),
    content: z.string().min(1).optional(),
  }),
  getAllQuery: z.object({
    cursor: z.string().optional(),
    size: z.coerce.number().int().positive().optional().default(10),
  }),
};

export const PRIVATE_NOTE_SCHEMA = {
  assignmentIdParam: z.object({
    assignmentId: z.coerce.number().int().positive(),
  }),
  upsert: z.object({
    content: z.unknown().refine((val) => val !== undefined, {
      message: "Content is required for private note",
    }),
  }),
};

export interface PublicNoteUser {
  id: number;
  studentId: string;
  name: string;
}

export interface PublicNoteItem {
  id: number;
  assignmentId: number;
  userId: number;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date | null;
  user: PublicNoteUser;
}

export interface PrivateNoteItem {
  id: number;
  assignmentId: number;
  userId: number;
  content: unknown;
  createdAt: Date;
  updatedAt: Date | null;
}

import { PublicNote } from "../../generated/prisma/client";

export interface PublicNoteWithUser extends PublicNote {
  user: {
    id: number;
    studentId: string;
    name: string;
  };
}
