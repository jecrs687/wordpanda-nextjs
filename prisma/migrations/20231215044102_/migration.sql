/*
  Warnings:

  - Made the column `last_login_at` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "last_login_at" SET NOT NULL;
