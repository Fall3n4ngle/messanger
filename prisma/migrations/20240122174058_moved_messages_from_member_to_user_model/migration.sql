/*
  Warnings:

  - You are about to drop the column `memberId` on the `Message` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_memberId_fkey";

-- DropForeignKey
ALTER TABLE "_seenMessages" DROP CONSTRAINT "_seenMessages_A_fkey";

-- DropForeignKey
ALTER TABLE "_seenMessages" DROP CONSTRAINT "_seenMessages_B_fkey";

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "memberId",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_seenMessages" ADD CONSTRAINT "_seenMessages_A_fkey" FOREIGN KEY ("A") REFERENCES "Message"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_seenMessages" ADD CONSTRAINT "_seenMessages_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
