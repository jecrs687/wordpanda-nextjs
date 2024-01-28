/*
  Warnings:

  - You are about to drop the column `meanings` on the `Translation` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Translation" DROP COLUMN "meanings",
ADD COLUMN     "meaning" VARCHAR(1024),
ADD COLUMN     "meaningTranslated" VARCHAR(1024);
