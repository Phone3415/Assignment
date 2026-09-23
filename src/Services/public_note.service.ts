import { parseCursor } from ".";
import { PublicNote } from "../../generated/prisma/client";
import { prisma } from "../Library/prisma";
import { PublicNoteWithUser } from "../Types/note.type";

export class PublicNoteService {
  static async getByAssignmentId(
    assignmentId: number,
    filters: {
      cursor?: string;
      size?: number;
    },
  ): Promise<PublicNoteWithUser[]> {
    return prisma.publicNote.findMany({
      where: { assignmentId },
      ...(filters.cursor ? { cursor: parseCursor(filters.cursor) } : {}),
      take: filters.size ?? 10,
      skip: filters.cursor ? 1 : 0,
      include: {
        user: {
          select: {
            id: true,
            studentId: true,
            name: true,
          },
        },
      },
      orderBy: [
        { createdAt: "desc" },
        { id: "desc" },
      ],
    });
  }

  static async getById(id: number): Promise<PublicNoteWithUser | null> {
    return prisma.publicNote.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            studentId: true,
            name: true,
          },
        },
      },
    });
  }

  static async create(
    userId: number,
    assignmentId: number,
    data: { title: string; content: string },
  ): Promise<PublicNoteWithUser> {
    return prisma.publicNote.create({
      data: {
        assignmentId,
        userId,
        title: data.title,
        content: data.content,
      },
      include: {
        user: {
          select: {
            id: true,
            studentId: true,
            name: true,
          },
        },
      },
    });
  }

  static async update(
    id: number,
    userId: number,
    data: { title?: string; content?: string },
  ): Promise<PublicNoteWithUser> {
    const note = await prisma.publicNote.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!note) {
      throw new Error("Public note not found");
    }

    if (note.userId !== userId) {
      throw new Error("Forbidden: You can only edit your own notes");
    }

    return prisma.publicNote.update({
      where: { id },
      data,
      include: {
        user: {
          select: {
            id: true,
            studentId: true,
            name: true,
          },
        },
      },
    });
  }

  static async delete(id: number, userId: number, isAdmin: boolean): Promise<PublicNote> {
    const note = await prisma.publicNote.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!note) {
      throw new Error("Public note not found");
    }

    if (!isAdmin && note.userId !== userId) {
      throw new Error("Forbidden: You can only delete your own notes");
    }

    return prisma.publicNote.delete({
      where: { id },
    });
  }
}
