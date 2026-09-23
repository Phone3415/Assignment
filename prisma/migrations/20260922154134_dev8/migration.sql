/*
  Warnings:

  - Added the required column `title` to the `PublicNote` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PublicNote" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "assignmentId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    CONSTRAINT "PublicNote_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "Assignment" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PublicNote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_PublicNote" ("assignmentId", "content", "createdAt", "id", "updatedAt", "userId") SELECT "assignmentId", "content", "createdAt", "id", "updatedAt", "userId" FROM "PublicNote";
DROP TABLE "PublicNote";
ALTER TABLE "new_PublicNote" RENAME TO "PublicNote";
CREATE INDEX "PublicNote_assignmentId_idx" ON "PublicNote"("assignmentId");
CREATE INDEX "PublicNote_userId_idx" ON "PublicNote"("userId");
CREATE UNIQUE INDEX "PublicNote_createdAt_id_key" ON "PublicNote"("createdAt", "id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
