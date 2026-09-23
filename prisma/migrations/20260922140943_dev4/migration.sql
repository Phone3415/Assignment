/*
  Warnings:

  - Added the required column `classId` to the `AssignmentChecklist` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AssignmentChecklist" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "assignmentId" INTEGER NOT NULL,
    "classId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    CONSTRAINT "AssignmentChecklist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "AssignmentChecklist_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "AssignmentChecklist_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "Assignment" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_AssignmentChecklist" ("assignmentId", "createdAt", "id", "updatedAt", "userId") SELECT "assignmentId", "createdAt", "id", "updatedAt", "userId" FROM "AssignmentChecklist";
DROP TABLE "AssignmentChecklist";
ALTER TABLE "new_AssignmentChecklist" RENAME TO "AssignmentChecklist";
CREATE UNIQUE INDEX "AssignmentChecklist_userId_assignmentId_key" ON "AssignmentChecklist"("userId", "assignmentId");
CREATE UNIQUE INDEX "AssignmentChecklist_createdAt_id_key" ON "AssignmentChecklist"("createdAt", "id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
