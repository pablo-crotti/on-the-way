/*
  Warnings:

  - Added the required column `category` to the `messages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `object` to the `messages` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Category" AS ENUM ('COMMENT', 'QUESTION', 'PARTNERSHIP', 'LOCATION', 'OTHER');

-- AlterTable
ALTER TABLE "messages" ADD COLUMN     "category" "Category" NOT NULL,
ADD COLUMN     "object" TEXT NOT NULL;
