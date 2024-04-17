/*
  Warnings:

  - A unique constraint covering the columns `[number]` on the table `collections` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "collections" ADD COLUMN     "description" TEXT NOT NULL DEFAULT '';

-- CreateTable
CREATE TABLE "character" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT[],
    "image" TEXT NOT NULL,
    "collection_id" TEXT NOT NULL,

    CONSTRAINT "character_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "collections_number_key" ON "collections"("number");
