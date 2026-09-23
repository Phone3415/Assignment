/*
  Warnings:

  - A unique constraint covering the columns `[createdAt,id]` on the table `Assignment` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[createdAt,id]` on the table `AssignmentChecklist` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[createdAt,id]` on the table `Class` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[createdAt,id]` on the table `Login` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[createdAt,id]` on the table `PrivateNote` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[createdAt,id]` on the table `PublicNote` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[createdAt,id]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Assignment_id_createdAt_key";

-- DropIndex
DROP INDEX "AssignmentChecklist_id_createdAt_key";

-- DropIndex
DROP INDEX "Class_id_createdAt_key";

-- DropIndex
DROP INDEX "Login_id_createdAt_key";

-- DropIndex
DROP INDEX "PrivateNote_id_createdAt_key";

-- DropIndex
DROP INDEX "PublicNote_id_createdAt_key";

-- DropIndex
DROP INDEX "User_id_createdAt_key";

-- CreateIndex
CREATE UNIQUE INDEX "Assignment_createdAt_id_key" ON "Assignment"("createdAt", "id");

-- CreateIndex
CREATE UNIQUE INDEX "AssignmentChecklist_createdAt_id_key" ON "AssignmentChecklist"("createdAt", "id");

-- CreateIndex
CREATE UNIQUE INDEX "Class_createdAt_id_key" ON "Class"("createdAt", "id");

-- CreateIndex
CREATE UNIQUE INDEX "Login_createdAt_id_key" ON "Login"("createdAt", "id");

-- CreateIndex
CREATE UNIQUE INDEX "PrivateNote_createdAt_id_key" ON "PrivateNote"("createdAt", "id");

-- CreateIndex
CREATE UNIQUE INDEX "PublicNote_createdAt_id_key" ON "PublicNote"("createdAt", "id");

-- CreateIndex
CREATE UNIQUE INDEX "User_createdAt_id_key" ON "User"("createdAt", "id");
