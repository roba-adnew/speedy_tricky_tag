/*
  Warnings:

  - The primary key for the `Score` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `imageId` on the `Score` table. All the data in the column will be lost.
  - You are about to drop the column `startTime` on the `Score` table. All the data in the column will be lost.
  - You are about to drop the column `timeSeconds` on the `Score` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Score` table. All the data in the column will be lost.
  - You are about to drop the column `userName` on the `Score` table. All the data in the column will be lost.
  - Added the required column `busyBeachTime` to the `Score` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fleaMarketTime` to the `Score` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gamerTag` to the `Score` table without a default value. This is not possible if the table is not empty.
  - Added the required column `interscetionTime` to the `Score` table without a default value. This is not possible if the table is not empty.
  - The required column `scoreId` was added to the `Score` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `scoreTs` to the `Score` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sessionId` to the `Score` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalTime` to the `Score` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Score" DROP CONSTRAINT "Score_imageId_fkey";

-- AlterTable
ALTER TABLE "Score" DROP CONSTRAINT "Score_pkey",
DROP COLUMN "imageId",
DROP COLUMN "startTime",
DROP COLUMN "timeSeconds",
DROP COLUMN "userId",
DROP COLUMN "userName",
ADD COLUMN     "busyBeachTime" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "fleaMarketTime" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "gamerTag" TEXT NOT NULL,
ADD COLUMN     "interscetionTime" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "scoreId" TEXT NOT NULL,
ADD COLUMN     "scoreTs" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "sessionId" TEXT NOT NULL,
ADD COLUMN     "totalTime" DOUBLE PRECISION NOT NULL,
ADD CONSTRAINT "Score_pkey" PRIMARY KEY ("scoreId");

-- AddForeignKey
ALTER TABLE "Score" ADD CONSTRAINT "Score_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
