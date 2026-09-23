import { parseCursor } from ".";
import { Assignment, AssignmentType } from "../../generated/prisma/browser";
import { prisma } from "../Library/prisma";
import { AssignmentStatus } from "../Types/assignment.type";

export class AssignmentService {
  static async get(
    classId: number,
    id: number,
    userId: number,
  ): Promise<Assignment | null> {
    return prisma.assignment.findUnique({
      where: {
        classId,
        id,
      },
      include: {
        assignmentChecklists: {
          where: { userId, assignmentId: id },
        },
      },
    });
  }

  static async getAll(
    classId: number,
    filters: {
      cursor?: string;
      size?: number;
      groupSize?: number;
      type?: string;
      status?: AssignmentStatus;
    },
    userId: number,
  ): Promise<Assignment[]> {
    return prisma.assignment.findMany({
      where: {
        classId,
        ...(filters.groupSize ? { groupSize: filters.groupSize } : {}),
      },
      ...(filters.cursor ? { cursor: parseCursor(filters.cursor) } : {}),
      take: filters.size ?? 10,
      skip: filters.cursor ? 1 : 0,
      include: {
        assignmentChecklists: {
          where: {
            userId,
          },
        },
      },
      orderBy: [
        {
          createdAt: "asc",
        },
        {
          id: "asc",
        },
      ],
    });
  }

  static async create(
    classId: number,
    data: {
      name: string;
      description: string;
      assignedDate: Date;
      deadline?: Date;
      type: AssignmentType;
      groupSize?: number;
    },
  ) {
    return prisma.assignment.create({
      data: {
        name: data.name,
        description: data.description,
        deadline: data.deadline,
        type: data.type,
        groupSize: data.groupSize,
        assignedDate: data.assignedDate,
        classId,
      },
    });
  }

  static async update(
    id: number,
    data: {
      name?: string;
      description?: string;
      assignedDate?: Date;
      deadline?: Date;
      type?: AssignmentType;
      groupSize?: number;
    },
  ) {
    return prisma.assignment.update({
      where: {
        id,
      },
      data,
    });
  }

  static async delete(id: number) {
    return prisma.assignment.delete({
      where: {
        id,
      },
    });
  }
}
