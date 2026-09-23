import { Prisma, PrivateNote } from "../../generated/prisma/browser";
import { prisma } from "../Library/prisma";

export class PrivateNoteService {
  static async getMine(
    userId: number,
    assignmentId: number,
  ): Promise<PrivateNote | null> {
    return prisma.privateNote.findUnique({
      where: {
        assignmentId_userId: {
          assignmentId,
          userId,
        },
      },
    });
  }

  static async upsert(
    userId: number,
    assignmentId: number,
    content: Prisma.InputJsonValue,
  ): Promise<PrivateNote> {
    return prisma.privateNote.upsert({
      where: {
        assignmentId_userId: {
          assignmentId,
          userId,
        },
      },
      update: {
        content,
      },
      create: {
        assignmentId,
        userId,
        content,
      },
    });
  }
}
