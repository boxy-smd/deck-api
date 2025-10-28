-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_project_id_fkey";

-- DropForeignKey
ALTER TABLE "project_professors" DROP CONSTRAINT "project_professors_project_id_fkey";

-- DropForeignKey
ALTER TABLE "project_trails" DROP CONSTRAINT "project_trails_project_id_fkey";

-- AddForeignKey
ALTER TABLE "project_professors" ADD CONSTRAINT "project_professors_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_trails" ADD CONSTRAINT "project_trails_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
