/*
  Warnings:

  - You are about to drop the `_MediaToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_MediaToUser" DROP CONSTRAINT "_MediaToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_MediaToUser" DROP CONSTRAINT "_MediaToUser_B_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "mediaId" INTEGER;

-- DropTable
DROP TABLE "_MediaToUser";

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;
