import { parseCursor } from ".";
import { Class } from "../../generated/prisma/client";
import { prisma } from "../Library/prisma";

export class ClassService {
  static async getAll(cursor?: string, size?: number, search?: string) {
    const take = size ?? 10;
    const where = search ? { name: { contains: search } } : undefined;
    
    const [items, total] = await prisma.$transaction([
      prisma.class.findMany({
        take,
        skip: cursor ? 1 : 0,
        where,
        ...(cursor ? { cursor: parseCursor(cursor) } : {}),
        orderBy: [
          { createdAt: "asc" },
          { id: "asc" }
        ]
      }),
      prisma.class.count({ where })
    ]);

    return { items, total };
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
