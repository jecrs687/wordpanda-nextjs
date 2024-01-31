/*
  Warnings:

  - You are about to alter the column `meaning` on the `Translation` table. The data in that column could be lost. The data in that column will be cast from `VarChar(1024)` to `VarChar(512)`.
  - You are about to alter the column `meaningTranslated` on the `Translation` table. The data in that column could be lost. The data in that column will be cast from `VarChar(1024)` to `VarChar(512)`.

*/
-- AlterTable
ALTER TABLE "Translation" ALTER COLUMN "meaning" SET DATA TYPE VARCHAR(512),
ALTER COLUMN "meaningTranslated" SET DATA TYPE VARCHAR(512);

-- CreateTable
CREATE TABLE "WordGameTranslateQuiz" (
    "id" SERIAL NOT NULL,
    "wordId" INTEGER NOT NULL,
    "languageId" INTEGER NOT NULL,
    "phrase" VARCHAR(512) NOT NULL,
    "options" VARCHAR(512)[],
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "WordGameTranslateQuiz_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "WordGameTranslateQuiz" ADD CONSTRAINT "WordGameTranslateQuiz_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "Word"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WordGameTranslateQuiz" ADD CONSTRAINT "WordGameTranslateQuiz_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
