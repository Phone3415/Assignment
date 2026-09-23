/*
  Warnings:

  - A unique constraint covering the columns `[classId,assignmentId,userId]` on the table `AssignmentChecklist` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "AssignmentChecklist_classId_assignmentId_userId_key" ON "AssignmentChecklist"("classId", "assignmentId", "userId");
