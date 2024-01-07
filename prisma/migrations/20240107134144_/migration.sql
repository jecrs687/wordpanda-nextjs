/*
  Warnings:

  - You are about to drop the `_LanguageToMedia` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_MediaToWord` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_LanguageToMedia" DROP CONSTRAINT "_LanguageToMedia_A_fkey";

-- DropForeignKey
ALTER TABLE "_LanguageToMedia" DROP CONSTRAINT "_LanguageToMedia_B_fkey";

-- DropForeignKey
ALTER TABLE "_MediaToWord" DROP CONSTRAINT "_MediaToWord_A_fkey";

-- DropForeignKey
ALTER TABLE "_MediaToWord" DROP CONSTRAINT "_MediaToWord_B_fkey";

-- AlterTable
ALTER TABLE "Media" ADD COLUMN     "languageId" INTEGER;

-- DropTable
DROP TABLE "_LanguageToMedia";

-- DropTable
DROP TABLE "_MediaToWord";

-- CreateTable
CREATE TABLE "MediaWords" (
    "id" SERIAL NOT NULL,
    "media_id" INTEGER NOT NULL,
    "language_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "MediaWords_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_MediaWordsToWord" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_MediaWordsToWord_AB_unique" ON "_MediaWordsToWord"("A", "B");

-- CreateIndex
CREATE INDEX "_MediaWordsToWord_B_index" ON "_MediaWordsToWord"("B");

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MediaWords" ADD CONSTRAINT "MediaWords_media_id_fkey" FOREIGN KEY ("media_id") REFERENCES "Media"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MediaWords" ADD CONSTRAINT "MediaWords_language_id_fkey" FOREIGN KEY ("language_id") REFERENCES "Language"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MediaWordsToWord" ADD CONSTRAINT "_MediaWordsToWord_A_fkey" FOREIGN KEY ("A") REFERENCES "MediaWords"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MediaWordsToWord" ADD CONSTRAINT "_MediaWordsToWord_B_fkey" FOREIGN KEY ("B") REFERENCES "Word"("id") ON DELETE CASCADE ON UPDATE CASCADE;
