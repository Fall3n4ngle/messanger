-- DropForeignKey
ALTER TABLE "Member" DROP CONSTRAINT "Member_conversationId_fkey";

-- AlterTable
ALTER TABLE "Member" ALTER COLUMN "conversationId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Member" ADD CONSTRAINT "Member_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
