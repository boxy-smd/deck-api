/*
  Warnings:

  - You are about to drop the column `project_id` on the `banners` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `profile_images` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[banner_url]` on the table `projects` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[profile_url]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `banner_url` to the `projects` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "banners" DROP CONSTRAINT "banners_project_id_fkey";

-- DropForeignKey
ALTER TABLE "profile_images" DROP CONSTRAINT "profile_images_user_id_fkey";

-- DropIndex
DROP INDEX "banners_project_id_key";

-- DropIndex
DROP INDEX "profile_images_user_id_key";

-- AlterTable
ALTER TABLE "banners" DROP COLUMN "project_id";

-- AlterTable
ALTER TABLE "profile_images" DROP COLUMN "user_id";

-- AlterTable
ALTER TABLE "projects" ADD COLUMN     "banner_url" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "profile_url" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "projects_banner_url_key" ON "projects"("banner_url");

-- CreateIndex
CREATE UNIQUE INDEX "users_profile_url_key" ON "users"("profile_url");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_profile_url_fkey" FOREIGN KEY ("profile_url") REFERENCES "profile_images"("url") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_banner_url_fkey" FOREIGN KEY ("banner_url") REFERENCES "banners"("url") ON DELETE RESTRICT ON UPDATE CASCADE;
