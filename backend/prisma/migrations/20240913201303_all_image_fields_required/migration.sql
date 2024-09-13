/*
  Warnings:

  - Added the required column `riddle1Answer` to the `Image` table without a default value. This is not possible if the table is not empty.
  - Added the required column `riddle2Answer` to the `Image` table without a default value. This is not possible if the table is not empty.
  - Added the required column `riddle3Answer` to the `Image` table without a default value. This is not possible if the table is not empty.
  - Added the required column `riddle4Answer` to the `Image` table without a default value. This is not possible if the table is not empty.
  - Added the required column `riddle5Answer` to the `Image` table without a default value. This is not possible if the table is not empty.
  - Added the required column `riddle6Answer` to the `Image` table without a default value. This is not possible if the table is not empty.
  - Added the required column `riddle7Answer` to the `Image` table without a default value. This is not possible if the table is not empty.
  - Made the column `riddle1` on table `Image` required. This step will fail if there are existing NULL values in that column.
  - Made the column `riddle1Targets` on table `Image` required. This step will fail if there are existing NULL values in that column.
  - Made the column `riddle2` on table `Image` required. This step will fail if there are existing NULL values in that column.
  - Made the column `riddle2Targets` on table `Image` required. This step will fail if there are existing NULL values in that column.
  - Made the column `riddle3` on table `Image` required. This step will fail if there are existing NULL values in that column.
  - Made the column `riddle3Targets` on table `Image` required. This step will fail if there are existing NULL values in that column.
  - Made the column `riddle4` on table `Image` required. This step will fail if there are existing NULL values in that column.
  - Made the column `riddle4Targets` on table `Image` required. This step will fail if there are existing NULL values in that column.
  - Made the column `riddle5` on table `Image` required. This step will fail if there are existing NULL values in that column.
  - Made the column `riddle5Targets` on table `Image` required. This step will fail if there are existing NULL values in that column.
  - Made the column `riddle6` on table `Image` required. This step will fail if there are existing NULL values in that column.
  - Made the column `riddle6Targets` on table `Image` required. This step will fail if there are existing NULL values in that column.
  - Made the column `riddle7` on table `Image` required. This step will fail if there are existing NULL values in that column.
  - Made the column `riddle7Targets` on table `Image` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Image" ADD COLUMN     "riddle1Answer" TEXT NOT NULL,
ADD COLUMN     "riddle2Answer" TEXT NOT NULL,
ADD COLUMN     "riddle3Answer" TEXT NOT NULL,
ADD COLUMN     "riddle4Answer" TEXT NOT NULL,
ADD COLUMN     "riddle5Answer" TEXT NOT NULL,
ADD COLUMN     "riddle6Answer" TEXT NOT NULL,
ADD COLUMN     "riddle7Answer" TEXT NOT NULL,
ALTER COLUMN "riddle1" SET NOT NULL,
ALTER COLUMN "riddle1Targets" SET NOT NULL,
ALTER COLUMN "riddle2" SET NOT NULL,
ALTER COLUMN "riddle2Targets" SET NOT NULL,
ALTER COLUMN "riddle3" SET NOT NULL,
ALTER COLUMN "riddle3Targets" SET NOT NULL,
ALTER COLUMN "riddle4" SET NOT NULL,
ALTER COLUMN "riddle4Targets" SET NOT NULL,
ALTER COLUMN "riddle5" SET NOT NULL,
ALTER COLUMN "riddle5Targets" SET NOT NULL,
ALTER COLUMN "riddle6" SET NOT NULL,
ALTER COLUMN "riddle6Targets" SET NOT NULL,
ALTER COLUMN "riddle7" SET NOT NULL,
ALTER COLUMN "riddle7Targets" SET NOT NULL;
