/*
  Warnings:

  - A unique constraint covering the columns `[userId,assignmentId]` on the table `AssignmentChecklist` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `Login` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[assignmentId,userId]` on the table `PrivateNote` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "AssignmentChecklist_userId_assignmentId_idx";

-- DropIndex
DROP INDEX "Login_userId_idx";

-- CreateIndex
CREATE UNIQUE INDEX "AssignmentChecklist_userId_assignmentId_key" ON "AssignmentChecklist"("userId", "assignmentId");

-- CreateIndex
CREATE UNIQUE INDEX "Login_userId_key" ON "Login"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "PrivateNote_assignmentId_userId_key" ON "PrivateNote"("assignmentId", "userId");

-- CreateIndex
CREATE INDEX "PublicNote_assignmentId_idx" ON "PublicNote"("assignmentId");

-- CreateIndex
CREATE INDEX "PublicNote_userId_idx" ON "PublicNote"("userId");
