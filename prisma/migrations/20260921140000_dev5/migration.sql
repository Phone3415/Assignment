-- DropIndex
DROP INDEX "Assignment_createdAt_id_key";

-- DropIndex
DROP INDEX "AssignmentChecklist_createdAt_id_key";

-- DropIndex
DROP INDEX "Class_createdAt_id_key";

-- DropIndex
DROP INDEX "Login_createdAt_id_key";

-- DropIndex
DROP INDEX "PrivateNote_createdAt_id_key";

-- DropIndex
DROP INDEX "PublicNote_createdAt_id_key";

-- DropIndex
DROP INDEX "User_createdAt_id_key";

-- CreateIndex
CREATE UNIQUE INDEX "Assignment_id_createdAt_key" ON "Assignment"("id", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "AssignmentChecklist_id_createdAt_key" ON "AssignmentChecklist"("id", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Class_id_createdAt_key" ON "Class"("id", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Login_id_createdAt_key" ON "Login"("id", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "PrivateNote_id_createdAt_key" ON "PrivateNote"("id", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "PublicNote_id_createdAt_key" ON "PublicNote"("id", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "User_id_createdAt_key" ON "User"("id", "createdAt");
