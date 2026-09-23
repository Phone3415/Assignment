import { AssignmentChecklist } from "../../generated/prisma/browser";
import { prisma } from "../Library/prisma";

export class AssignmentCheckListService {
  static async getAll(
    assignmentId: number,
    userId: number,
  ): Promise<AssignmentChecklist[]> {
    return prisma.assignmentChecklist.findMany({
      where: {
        assignmentId,
        userId,
      },
    });
  }

  static async check(classId: number, assignmentId: number, userId: number) {
    return prisma.assignmentChecklist.create({
      data: {
        classId,
        assignmentId,
        userId,
      },
    });
  }

  static async uncheck(classId: number, assignmentId: number, userId: number) {
    return prisma.assignmentChecklist.delete({
      where: {
        classId_assignmentId_userId: {
          classId,
          assignmentId,
          userId,
        },
      },
    });
  }
}
