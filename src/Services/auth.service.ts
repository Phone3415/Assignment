import jwt from "jsonwebtoken";
import { prisma } from "../Library/prisma";
import { JWTData } from "../Types/auth.types";

const JWT_SECRET =
  process.env.JWT_SECRET ||
  "Tv7aJo+fl/B773k2o/dw9zK0mVo79FDQfvaattC3MLMvNz4fD/FRLLI6aG6m+kj0";
const REFRESH_TOKEN_SECRET =
  process.env.REFRESH_TOKEN_SECRET ||
  "xfmDy23B4mTjmidY90/dIlnsEuRcLfdVjJsBfKSBHN/mEWOJlBDB4jhv2WgKU+WO";

export class AuthService {
  static jwtSecret = JWT_SECRET;
  static refreshTokenSecret = REFRESH_TOKEN_SECRET;

  static async login(studentId: string) {
    const user = await prisma.user.findUnique({
      where: {
        studentId,
      },
    });

    if (!user) return { cookie: null, user: null };

    const jwtData: JWTData = {
      id: user.id,
      studentId: user.studentId,
      name: user.name,
      role: user.role,
    };

    const token = jwt.sign(jwtData, this.jwtSecret, { expiresIn: "30min" });
    const refreshToken = jwt.sign(jwtData, this.refreshTokenSecret, {
      expiresIn: "1d",
    });

    await prisma.login.upsert({
      where: { userId: user.id },
      update: { jwtHash: refreshToken },
      create: { jwtHash: refreshToken, userId: user.id },
    });

    return { token, refreshToken, user };
  }

  static async refreshToken(refreshToken: string) {
    const login = await prisma.login.findUnique({
      where: { jwtHash: refreshToken },
    });

    if (!login) return { token: null, refreshToken: null, user: null };

    const decodedUser = jwt.verify(
      login.jwtHash,
      REFRESH_TOKEN_SECRET,
    ) as JWTData;
    const user = await prisma.user.findUnique({
      where: {
        id: decodedUser.id,
      },
    });

    if (!user) return { token: null, refreshToken: null, user: null };

    const jwtData: JWTData = {
      id: user.id,
      studentId: user.studentId,
      name: user.name,
      role: user.role,
    };
    const token = jwt.sign(jwtData, this.jwtSecret, { expiresIn: "30min" });
    const newRefreshToken = jwt.sign(jwtData, this.refreshTokenSecret, {
      expiresIn: "1d",
    });

    await prisma.login.update({
      where: { userId: user.id },
      data: { jwtHash: newRefreshToken },
    });

    return { token, refreshToken: newRefreshToken, user };
  }
}
