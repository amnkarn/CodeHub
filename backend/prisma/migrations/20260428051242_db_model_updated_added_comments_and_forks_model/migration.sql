/*
  Warnings:

  - The primary key for the `Issue` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Repository` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `content` on the `Repository` table. All the data in the column will be lost.
  - The primary key for the `_UserStarredRepos` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[name,ownerId]` on the table `Repository` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `authorId` to the `Issue` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Issue" DROP CONSTRAINT "Issue_repoId_fkey";

-- DropForeignKey
ALTER TABLE "_UserStarredRepos" DROP CONSTRAINT "_UserStarredRepos_A_fkey";

-- DropIndex
DROP INDEX "Repository_name_key";

-- AlterTable
ALTER TABLE "Issue" DROP CONSTRAINT "Issue_pkey",
ADD COLUMN     "authorId" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "repoId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Issue_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Issue_id_seq";

-- AlterTable
ALTER TABLE "Repository" DROP CONSTRAINT "Repository_pkey",
DROP COLUMN "content",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Repository_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Repository_id_seq";

-- AlterTable
ALTER TABLE "_UserStarredRepos" DROP CONSTRAINT "_UserStarredRepos_AB_pkey",
ALTER COLUMN "A" SET DATA TYPE TEXT,
ADD CONSTRAINT "_UserStarredRepos_AB_pkey" PRIMARY KEY ("A", "B");

-- CreateTable
CREATE TABLE "Comments" (
    "id" TEXT NOT NULL,
    "comment" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "issueId" TEXT NOT NULL,
    "repoId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Fork" (
    "id" SERIAL NOT NULL,
    "sourceCodeRepoId" TEXT NOT NULL,
    "forkedById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Fork_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Fork_sourceCodeRepoId_forkedById_key" ON "Fork"("sourceCodeRepoId", "forkedById");

-- CreateIndex
CREATE UNIQUE INDEX "Repository_name_ownerId_key" ON "Repository"("name", "ownerId");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- AddForeignKey
ALTER TABLE "Issue" ADD CONSTRAINT "Issue_repoId_fkey" FOREIGN KEY ("repoId") REFERENCES "Repository"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Issue" ADD CONSTRAINT "Issue_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comments" ADD CONSTRAINT "Comments_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comments" ADD CONSTRAINT "Comments_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "Issue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comments" ADD CONSTRAINT "Comments_repoId_fkey" FOREIGN KEY ("repoId") REFERENCES "Repository"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fork" ADD CONSTRAINT "Fork_sourceCodeRepoId_fkey" FOREIGN KEY ("sourceCodeRepoId") REFERENCES "Repository"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fork" ADD CONSTRAINT "Fork_forkedById_fkey" FOREIGN KEY ("forkedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserStarredRepos" ADD CONSTRAINT "_UserStarredRepos_A_fkey" FOREIGN KEY ("A") REFERENCES "Repository"("id") ON DELETE CASCADE ON UPDATE CASCADE;
