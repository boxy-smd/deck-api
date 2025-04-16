/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `subjects` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `subjects` table without a default value. This is not possible if the table is not empty.
  - Added the required column `semester` to the `subjects` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `subjects` table without a default value. This is not possible if the table is not empty.
  - Added the required column `workload` to the `subjects` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SubjectType" AS ENUM ('obligatory', 'elective', 'optional');

-- AlterTable
ALTER TABLE "subjects" ADD COLUMN     "code" TEXT NOT NULL,
ADD COLUMN     "semester" INTEGER NOT NULL,
ADD COLUMN     "type" "SubjectType" NOT NULL,
ADD COLUMN     "workload" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "subjects_code_key" ON "subjects"("code");
