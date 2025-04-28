/*
  Warnings:

  - Made the column `role` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'GUESS';

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "role" SET NOT NULL;
