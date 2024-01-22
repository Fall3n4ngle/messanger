-- CreateTable
CREATE TABLE "_seenMessages" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_seenMessages_AB_unique" ON "_seenMessages"("A", "B");

-- CreateIndex
CREATE INDEX "_seenMessages_B_index" ON "_seenMessages"("B");

-- AddForeignKey
ALTER TABLE "_seenMessages" ADD CONSTRAINT "_seenMessages_A_fkey" FOREIGN KEY ("A") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_seenMessages" ADD CONSTRAINT "_seenMessages_B_fkey" FOREIGN KEY ("B") REFERENCES "Message"("id") ON DELETE CASCADE ON UPDATE CASCADE;
