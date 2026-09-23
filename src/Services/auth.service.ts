import { prisma } from "../Library/prisma";

export class AuthService {
  static async login(studentId: string) {
    const user = await prisma.user.findUnique({
      where: {
        studentId,
      },
    });

    if (!user) return { cookie: null, user: null };

    await prisma.login.deleteMany({
      where: { userId: user.id },
    });

    const loginSession = await prisma.login.create({
      data: { userId: user.id },
    });
    const cookie = loginSession.cookie;

    return { cookie, user };
  }

  static async logout(cookie: string) {
    const isExist = await prisma.login.findUnique({
      where: { cookie },
      select: { id: true },
    });
    if (!isExist) return;

    await prisma.login.delete({
      where: { id: isExist.id },
    });
  }
}
