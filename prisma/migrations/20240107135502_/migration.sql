/*
  Warnings:

  - You are about to drop the column `word_id` on the `user_word` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id,language_id]` on the table `user_word` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `language_id` to the `user_word` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "user_word" DROP CONSTRAINT "user_word_word_id_fkey";

-- DropIndex
DROP INDEX "user_word_user_id_word_id_key";

-- AlterTable
ALTER TABLE "user_word" DROP COLUMN "word_id",
ADD COLUMN     "language_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "_UserWordToWord" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_UserWordToWord_AB_unique" ON "_UserWordToWord"("A", "B");

-- CreateIndex
CREATE INDEX "_UserWordToWord_B_index" ON "_UserWordToWord"("B");

-- CreateIndex
CREATE UNIQUE INDEX "user_word_user_id_language_id_key" ON "user_word"("user_id", "language_id");

-- AddForeignKey
ALTER TABLE "user_word" ADD CONSTRAINT "user_word_language_id_fkey" FOREIGN KEY ("language_id") REFERENCES "Language"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserWordToWord" ADD CONSTRAINT "_UserWordToWord_A_fkey" FOREIGN KEY ("A") REFERENCES "user_word"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserWordToWord" ADD CONSTRAINT "_UserWordToWord_B_fkey" FOREIGN KEY ("B") REFERENCES "Word"("id") ON DELETE CASCADE ON UPDATE CASCADE;
