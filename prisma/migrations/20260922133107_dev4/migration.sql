-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Assignment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "deadline" DATETIME,
    "assignedDate" DATETIME NOT NULL,
    "type" TEXT NOT NULL,
    "groupSize" INTEGER NOT NULL DEFAULT 0,
    "classId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    CONSTRAINT "Assignment_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Assignment" ("assignedDate", "classId", "createdAt", "deadline", "description", "groupSize", "id", "name", "type", "updatedAt") SELECT "assignedDate", "classId", "createdAt", "deadline", "description", "groupSize", "id", "name", "type", "updatedAt" FROM "Assignment";
DROP TABLE "Assignment";
ALTER TABLE "new_Assignment" RENAME TO "Assignment";
CREATE UNIQUE INDEX "Assignment_createdAt_id_key" ON "Assignment"("createdAt", "id");
CREATE TABLE "new_AssignmentChecklist" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "assignmentId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    CONSTRAINT "AssignmentChecklist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "AssignmentChecklist_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "Assignment" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_AssignmentChecklist" ("assignmentId", "createdAt", "id", "updatedAt", "userId") SELECT "assignmentId", "createdAt", "id", "updatedAt", "userId" FROM "AssignmentChecklist";
DROP TABLE "AssignmentChecklist";
ALTER TABLE "new_AssignmentChecklist" RENAME TO "AssignmentChecklist";
CREATE UNIQUE INDEX "AssignmentChecklist_userId_assignmentId_key" ON "AssignmentChecklist"("userId", "assignmentId");
CREATE UNIQUE INDEX "AssignmentChecklist_createdAt_id_key" ON "AssignmentChecklist"("createdAt", "id");
CREATE TABLE "new_Login" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "cookie" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    CONSTRAINT "Login_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Login" ("cookie", "createdAt", "id", "updatedAt", "userId") SELECT "cookie", "createdAt", "id", "updatedAt", "userId" FROM "Login";
DROP TABLE "Login";
ALTER TABLE "new_Login" RENAME TO "Login";
CREATE UNIQUE INDEX "Login_cookie_key" ON "Login"("cookie");
CREATE UNIQUE INDEX "Login_userId_key" ON "Login"("userId");
CREATE UNIQUE INDEX "Login_createdAt_id_key" ON "Login"("createdAt", "id");
CREATE TABLE "new_PrivateNote" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "assignmentId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "content" JSONB NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    CONSTRAINT "PrivateNote_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "Assignment" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PrivateNote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_PrivateNote" ("assignmentId", "content", "createdAt", "id", "updatedAt", "userId") SELECT "assignmentId", "content", "createdAt", "id", "updatedAt", "userId" FROM "PrivateNote";
DROP TABLE "PrivateNote";
ALTER TABLE "new_PrivateNote" RENAME TO "PrivateNote";
CREATE UNIQUE INDEX "PrivateNote_assignmentId_userId_key" ON "PrivateNote"("assignmentId", "userId");
CREATE UNIQUE INDEX "PrivateNote_createdAt_id_key" ON "PrivateNote"("createdAt", "id");
CREATE TABLE "new_PublicNote" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "assignmentId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
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
