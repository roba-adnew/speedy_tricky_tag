/*
  Warnings:

  - You are about to drop the `Scoreboard` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Scoreboard" DROP CONSTRAINT "Scoreboard_imageId_fkey";

-- DropTable
DROP TABLE "Scoreboard";

-- CreateTable
CREATE TABLE "Score" (
    "userId" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "imageId" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "timeSeconds" DOUBLE PRECISION NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Score_pkey" PRIMARY KEY ("userId")
);

-- AddForeignKey
ALTER TABLE "Score" ADD CONSTRAINT "Score_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
