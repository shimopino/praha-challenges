/*
  Warnings:

  - Made the column `postedAt` on table `post` required. This step will fail if there are existing NULL values in that column.
  - Made the column `reviewedAt` on table `review` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "post" ALTER COLUMN "postedAt" SET NOT NULL;

-- AlterTable
ALTER TABLE "review" ALTER COLUMN "reviewedAt" SET NOT NULL;
