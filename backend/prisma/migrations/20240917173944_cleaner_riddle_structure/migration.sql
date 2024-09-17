/*
  Warnings:

  - You are about to drop the column `riddle1Answer` on the `Image` table. All the data in the column will be lost.
  - You are about to drop the column `riddle1Targets` on the `Image` table. All the data in the column will be lost.
  - You are about to drop the column `riddle2Answer` on the `Image` table. All the data in the column will be lost.
  - You are about to drop the column `riddle2Targets` on the `Image` table. All the data in the column will be lost.
  - You are about to drop the column `riddle3Answer` on the `Image` table. All the data in the column will be lost.
  - You are about to drop the column `riddle3Targets` on the `Image` table. All the data in the column will be lost.
  - You are about to drop the column `riddle4Answer` on the `Image` table. All the data in the column will be lost.
  - You are about to drop the column `riddle4Targets` on the `Image` table. All the data in the column will be lost.
  - You are about to drop the column `riddle5Answer` on the `Image` table. All the data in the column will be lost.
  - You are about to drop the column `riddle5Targets` on the `Image` table. All the data in the column will be lost.
  - You are about to drop the column `riddle6Answer` on the `Image` table. All the data in the column will be lost.
  - You are about to drop the column `riddle6Targets` on the `Image` table. All the data in the column will be lost.
  - You are about to drop the column `riddle7Answer` on the `Image` table. All the data in the column will be lost.
  - You are about to drop the column `riddle7Targets` on the `Image` table. All the data in the column will be lost.
  - Changed the type of `riddle1` on the `Image` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `riddle2` on the `Image` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `riddle3` on the `Image` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `riddle4` on the `Image` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `riddle5` on the `Image` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `riddle6` on the `Image` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `riddle7` on the `Image` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Image" DROP COLUMN "riddle1Answer",
DROP COLUMN "riddle1Targets",
DROP COLUMN "riddle2Answer",
DROP COLUMN "riddle2Targets",
DROP COLUMN "riddle3Answer",
DROP COLUMN "riddle3Targets",
DROP COLUMN "riddle4Answer",
DROP COLUMN "riddle4Targets",
DROP COLUMN "riddle5Answer",
DROP COLUMN "riddle5Targets",
DROP COLUMN "riddle6Answer",
DROP COLUMN "riddle6Targets",
DROP COLUMN "riddle7Answer",
DROP COLUMN "riddle7Targets",
DROP COLUMN "riddle1",
ADD COLUMN     "riddle1" JSONB NOT NULL,
DROP COLUMN "riddle2",
ADD COLUMN     "riddle2" JSONB NOT NULL,
DROP COLUMN "riddle3",
ADD COLUMN     "riddle3" JSONB NOT NULL,
DROP COLUMN "riddle4",
ADD COLUMN     "riddle4" JSONB NOT NULL,
DROP COLUMN "riddle5",
ADD COLUMN     "riddle5" JSONB NOT NULL,
DROP COLUMN "riddle6",
ADD COLUMN     "riddle6" JSONB NOT NULL,
DROP COLUMN "riddle7",
ADD COLUMN     "riddle7" JSONB NOT NULL;

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sid" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Session_sid_key" ON "Session"("sid");
