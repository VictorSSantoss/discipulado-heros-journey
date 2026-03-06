-- CreateEnum
CREATE TYPE "Role" AS ENUM ('MASTER', 'GERENTE', 'DISCIPULADOR');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'DISCIPULADOR',
    "reportsToId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Valente" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT,
    "totalXP" INTEGER NOT NULL DEFAULT 0,
    "structure" TEXT NOT NULL,
    "description" TEXT,
    "userId" TEXT NOT NULL,
    "friendIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Valente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attributes" (
    "id" TEXT NOT NULL,
    "forca" INTEGER NOT NULL DEFAULT 0,
    "destreza" INTEGER NOT NULL DEFAULT 0,
    "constituicao" INTEGER NOT NULL DEFAULT 0,
    "inteligencia" INTEGER NOT NULL DEFAULT 0,
    "sabedoria" INTEGER NOT NULL DEFAULT 0,
    "carisma" INTEGER NOT NULL DEFAULT 0,
    "valenteId" TEXT NOT NULL,

    CONSTRAINT "Attributes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LoveLanguages" (
    "id" TEXT NOT NULL,
    "palavras" INTEGER NOT NULL DEFAULT 0,
    "servico" INTEGER NOT NULL DEFAULT 0,
    "presentes" INTEGER NOT NULL DEFAULT 0,
    "tempo" INTEGER NOT NULL DEFAULT 0,
    "toque" INTEGER NOT NULL DEFAULT 0,
    "valenteId" TEXT NOT NULL,

    CONSTRAINT "LoveLanguages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HolyPower" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "current" INTEGER NOT NULL DEFAULT 0,
    "goal" INTEGER NOT NULL DEFAULT 30,
    "streak" INTEGER NOT NULL DEFAULT 0,
    "valenteId" TEXT NOT NULL,

    CONSTRAINT "HolyPower_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Medal" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "rarity" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "requirement" INTEGER NOT NULL,

    CONSTRAINT "Medal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ValenteMedal" (
    "valenteId" TEXT NOT NULL,
    "medalId" TEXT NOT NULL,
    "awardedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ValenteMedal_pkey" PRIMARY KEY ("valenteId","medalId")
);

-- CreateTable
CREATE TABLE "Mission" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "xpReward" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Mission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ValenteMission" (
    "id" TEXT NOT NULL,
    "valenteId" TEXT NOT NULL,
    "missionId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "ValenteMission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "XpLog" (
    "id" TEXT NOT NULL,
    "valenteId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "XpLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Attributes_valenteId_key" ON "Attributes"("valenteId");

-- CreateIndex
CREATE UNIQUE INDEX "LoveLanguages_valenteId_key" ON "LoveLanguages"("valenteId");

-- CreateIndex
CREATE UNIQUE INDEX "ValenteMission_valenteId_missionId_key" ON "ValenteMission"("valenteId", "missionId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_reportsToId_fkey" FOREIGN KEY ("reportsToId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Valente" ADD CONSTRAINT "Valente_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attributes" ADD CONSTRAINT "Attributes_valenteId_fkey" FOREIGN KEY ("valenteId") REFERENCES "Valente"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoveLanguages" ADD CONSTRAINT "LoveLanguages_valenteId_fkey" FOREIGN KEY ("valenteId") REFERENCES "Valente"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HolyPower" ADD CONSTRAINT "HolyPower_valenteId_fkey" FOREIGN KEY ("valenteId") REFERENCES "Valente"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ValenteMedal" ADD CONSTRAINT "ValenteMedal_valenteId_fkey" FOREIGN KEY ("valenteId") REFERENCES "Valente"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ValenteMedal" ADD CONSTRAINT "ValenteMedal_medalId_fkey" FOREIGN KEY ("medalId") REFERENCES "Medal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ValenteMission" ADD CONSTRAINT "ValenteMission_valenteId_fkey" FOREIGN KEY ("valenteId") REFERENCES "Valente"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ValenteMission" ADD CONSTRAINT "ValenteMission_missionId_fkey" FOREIGN KEY ("missionId") REFERENCES "Mission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "XpLog" ADD CONSTRAINT "XpLog_valenteId_fkey" FOREIGN KEY ("valenteId") REFERENCES "Valente"("id") ON DELETE CASCADE ON UPDATE CASCADE;
