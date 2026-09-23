import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import "dotenv/config";
import { PrismaClient } from "../../generated/prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var __dbInstance: PrismaClient | undefined;
}

const createPrismaClient = (): PrismaClient => {
  const dbUrl = process.env.DATABASE_URL || "file:./dev.db";
  const adapter = new PrismaBetterSqlite3({ url: dbUrl });
  return new PrismaClient({ adapter });
};

export const prisma: PrismaClient =
  globalThis.__dbInstance ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.__dbInstance = prisma;
}
