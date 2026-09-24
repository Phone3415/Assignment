import { parseCursor } from ".";
import { Class } from "../../generated/prisma/client";
import { prisma } from "../Library/prisma";

export class ClassService {
  static async getAll(cursor?: string, size?: number, search?: string): Promise<Class[]> {
    const take = size ?? 10;
    
    return prisma.class.findMany({
      take,
      skip: cursor ? 1 : 0,
      where: search ? { name: { contains: search } } : undefined,
      ...(cursor ? { cursor: parseCursor(cursor) } : {}),
      orderBy: [
        { createdAt: "asc" },
        { id: "asc" }
      ]
    });
  }

  static async create(name: string) {
    return prisma.class.create({
      data: {
        name,
      },
    });
  }

  static async update(id: number, name: string) {
    return prisma.class.update({
      where: {
        id,
      },
      data: {
        name,
      },
    });
  }

  static async delete(id: number) {
    return prisma.class.delete({
      where: {
        id,
      },
    });
  }
}
