-- AlterTable
ALTER TABLE "Media" ADD COLUMN     "description" VARCHAR(1024);

-- AlterTable
ALTER TABLE "MediaLanguages" ADD COLUMN     "categories" TEXT[],
ADD COLUMN     "description" VARCHAR(1024),
ADD COLUMN     "title" TEXT;
