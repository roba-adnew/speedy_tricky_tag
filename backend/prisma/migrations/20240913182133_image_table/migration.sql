/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "Image" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "riddle1" TEXT,
    "riddle1Targets" JSONB,
    "riddle2" TEXT,
    "riddle2Targets" JSONB,
    "riddle3" TEXT,
    "riddle3Targets" JSONB,
    "riddle4" TEXT,
    "riddle4Targets" JSONB,
    "riddle5" TEXT,
    "riddle5Targets" JSONB,
    "riddle6" TEXT,
    "riddle6Targets" JSONB,
    "riddle7" TEXT,
    "riddle7Targets" JSONB,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Scoreboard" (
    "userId" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "imageId" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "timeSeconds" DOUBLE PRECISION NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Scoreboard_pkey" PRIMARY KEY ("userId")
);

-- AddForeignKey
ALTER TABLE "Scoreboard" ADD CONSTRAINT "Scoreboard_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
