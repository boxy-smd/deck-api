/*
  Warnings:

  - You are about to drop the column `related_links` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the `banners` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "banners" DROP CONSTRAINT "banners_user_id_fkey";

-- DropForeignKey
ALTER TABLE "projects" DROP CONSTRAINT "projects_banner_url_fkey";

-- AlterTable
ALTER TABLE "projects" DROP COLUMN "related_links";

-- DropTable
DROP TABLE "banners";
