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
