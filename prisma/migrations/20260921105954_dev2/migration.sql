/*
  Warnings:

  - A unique constraint covering the columns `[cookie]` on the table `Login` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Login_cookie_key" ON "Login"("cookie");

-- CreateIndex
CREATE INDEX "Login_userId_idx" ON "Login"("userId");
