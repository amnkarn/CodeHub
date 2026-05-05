/*
  Warnings:

  - The `visibility` column on the `Repository` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "VISIBILITY" AS ENUM ('public', 'private');

-- AlterTable
ALTER TABLE "Repository" DROP COLUMN "visibility",
ADD COLUMN     "visibility" "VISIBILITY" NOT NULL DEFAULT 'public';
