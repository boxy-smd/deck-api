/*
  Warnings:

  - The values [obligatory,elective,optional] on the enum `SubjectType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `workload` on the `subjects` table. All the data in the column will be lost.
  - You are about to drop the column `semester` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `_DraftToProfessor` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_DraftToTrail` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ProfessorToProject` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ProjectToTrail` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_TrailToUser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `drafts` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('STUDENT', 'CURATOR', 'MODERATOR', 'ADMIN');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'BANNED');

-- AlterEnum
ALTER TYPE "ProjectStatus" ADD VALUE 'ARCHIVED';

-- AlterEnum
BEGIN;
CREATE TYPE "SubjectType_new" AS ENUM ('OBLIGATORY', 'ELECTIVE', 'OPTIONAL');
ALTER TABLE "subjects" ALTER COLUMN "type" TYPE "SubjectType_new" USING ("type"::text::"SubjectType_new");
ALTER TYPE "SubjectType" RENAME TO "SubjectType_old";
ALTER TYPE "SubjectType_new" RENAME TO "SubjectType";
DROP TYPE "SubjectType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "_DraftToProfessor" DROP CONSTRAINT "_DraftToProfessor_A_fkey";

-- DropForeignKey
ALTER TABLE "_DraftToProfessor" DROP CONSTRAINT "_DraftToProfessor_B_fkey";

-- DropForeignKey
ALTER TABLE "_DraftToTrail" DROP CONSTRAINT "_DraftToTrail_A_fkey";

-- DropForeignKey
ALTER TABLE "_DraftToTrail" DROP CONSTRAINT "_DraftToTrail_B_fkey";

-- DropForeignKey
ALTER TABLE "_ProfessorToProject" DROP CONSTRAINT "_ProfessorToProject_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProfessorToProject" DROP CONSTRAINT "_ProfessorToProject_B_fkey";

-- DropForeignKey
ALTER TABLE "_ProjectToTrail" DROP CONSTRAINT "_ProjectToTrail_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProjectToTrail" DROP CONSTRAINT "_ProjectToTrail_B_fkey";

-- DropForeignKey
ALTER TABLE "_TrailToUser" DROP CONSTRAINT "_TrailToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_TrailToUser" DROP CONSTRAINT "_TrailToUser_B_fkey";

-- DropForeignKey
ALTER TABLE "drafts" DROP CONSTRAINT "drafts_author_id_fkey";

-- DropForeignKey
ALTER TABLE "drafts" DROP CONSTRAINT "drafts_subject_id_fkey";

-- AlterTable
ALTER TABLE "projects" ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "published_year" DROP NOT NULL,
ALTER COLUMN "semester" DROP NOT NULL,
ALTER COLUMN "allow_comments" SET DEFAULT false,
ALTER COLUMN "updated_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "reports" ADD COLUMN     "resolved_at" TIMESTAMP(3),
ADD COLUMN     "resolved_by" TEXT;

-- AlterTable
ALTER TABLE "subjects" DROP COLUMN "workload";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "semester",
ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'STUDENT',
ADD COLUMN     "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE';

-- DropTable
DROP TABLE "_DraftToProfessor";

-- DropTable
DROP TABLE "_DraftToTrail";

-- DropTable
DROP TABLE "_ProfessorToProject";

-- DropTable
DROP TABLE "_ProjectToTrail";

-- DropTable
DROP TABLE "_TrailToUser";

-- DropTable
DROP TABLE "drafts";

-- CreateTable
CREATE TABLE "student_profiles" (
    "student_id" TEXT NOT NULL,
    "semester" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "student_profiles_pkey" PRIMARY KEY ("student_id")
);

-- CreateTable
CREATE TABLE "student_has_trail" (
    "student_id" TEXT NOT NULL,
    "trail_id" TEXT NOT NULL,

    CONSTRAINT "student_has_trail_pkey" PRIMARY KEY ("student_id","trail_id")
);

-- CreateTable
CREATE TABLE "project_professors" (
    "project_id" TEXT NOT NULL,
    "professor_id" TEXT NOT NULL,

    CONSTRAINT "project_professors_pkey" PRIMARY KEY ("project_id","professor_id")
);

-- CreateTable
CREATE TABLE "project_trails" (
    "project_id" TEXT NOT NULL,
    "trail_id" TEXT NOT NULL,

    CONSTRAINT "project_trails_pkey" PRIMARY KEY ("project_id","trail_id")
);

-- AddForeignKey
ALTER TABLE "student_profiles" ADD CONSTRAINT "student_profiles_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_has_trail" ADD CONSTRAINT "student_has_trail_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_has_trail" ADD CONSTRAINT "student_has_trail_trail_id_fkey" FOREIGN KEY ("trail_id") REFERENCES "trails"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_professors" ADD CONSTRAINT "project_professors_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_professors" ADD CONSTRAINT "project_professors_professor_id_fkey" FOREIGN KEY ("professor_id") REFERENCES "professors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_trails" ADD CONSTRAINT "project_trails_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_trails" ADD CONSTRAINT "project_trails_trail_id_fkey" FOREIGN KEY ("trail_id") REFERENCES "trails"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_resolved_by_fkey" FOREIGN KEY ("resolved_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
