import { Role, User } from "../../generated/prisma/client";
import { prisma } from "../Library/prisma";
import { parseCursor } from "./index";

export class UserService {
  static async getAll(
    cursor?: string,
    size?: number,
    search?: string,
    role?: Role,
  ): Promise<User[]> {
    const take = size ?? 10;

    return prisma.user.findMany({
      take,
      skip: cursor ? 1 : 0,
      where: {
        AND: [
          search
            ? {
                OR: [
                  { name: { contains: search } },
                  { studentId: { contains: search } },
                ],
              }
            : {},
          role ? { role } : {},
        ],
      },
      ...(cursor ? { cursor: parseCursor(cursor) } : {}),
      orderBy: [{ createdAt: "asc" }, { id: "asc" }],
    });
  }

  static async getById(id: number): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  static async getByStudentId(studentId: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { studentId },
    });
  }

  static async create(
    studentId: string,
    name: string,
    role: Role = Role.Student,
  ): Promise<User> {
    return prisma.user.create({
      data: {
        studentId,
        name,
        role,
      },
    });
  }

  static async update(
    id: number,
    data: { studentId?: string; name?: string; role?: Role },
  ): Promise<User> {
    return prisma.user.update({
      where: { id },
      data,
    });
  }

  static async delete(id: number): Promise<User> {
    return prisma.user.delete({
      where: { id },
    });
  }
}
