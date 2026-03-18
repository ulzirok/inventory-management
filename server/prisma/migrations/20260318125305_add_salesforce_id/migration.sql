/*
  Warnings:

  - A unique constraint covering the columns `[salesforceId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "salesforceId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_salesforceId_key" ON "User"("salesforceId");
