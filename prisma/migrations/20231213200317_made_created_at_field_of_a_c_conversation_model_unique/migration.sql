/*
  Warnings:

  - A unique constraint covering the columns `[createdAt]` on the table `Conversation` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Conversation_createdAt_key" ON "Conversation"("createdAt");
