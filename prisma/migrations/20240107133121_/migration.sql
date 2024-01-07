/*
  Warnings:

  - You are about to drop the column `typeTemp` on the `Media` table. All the data in the column will be lost.
  - The `type` column on the `Media` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterEnum
ALTER TYPE "MediaType" ADD VALUE 'MOVIE';

-- AlterTable
ALTER TABLE "Media" DROP COLUMN "typeTemp",
DROP COLUMN "type",
ADD COLUMN     "type" "MediaType" NOT NULL DEFAULT 'VIDEO';
