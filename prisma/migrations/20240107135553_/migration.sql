/*
  Warnings:

  - You are about to drop the `_UserWordToWord` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_UserWordToWord" DROP CONSTRAINT "_UserWordToWord_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserWordToWord" DROP CONSTRAINT "_UserWordToWord_B_fkey";

-- DropTable
DROP TABLE "_UserWordToWord";

-- CreateTable
CREATE TABLE "_UserWordsToWord" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_UserWordsToWord_AB_unique" ON "_UserWordsToWord"("A", "B");

-- CreateIndex
CREATE INDEX "_UserWordsToWord_B_index" ON "_UserWordsToWord"("B");

-- AddForeignKey
ALTER TABLE "_UserWordsToWord" ADD CONSTRAINT "_UserWordsToWord_A_fkey" FOREIGN KEY ("A") REFERENCES "user_word"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserWordsToWord" ADD CONSTRAINT "_UserWordsToWord_B_fkey" FOREIGN KEY ("B") REFERENCES "Word"("id") ON DELETE CASCADE ON UPDATE CASCADE;
