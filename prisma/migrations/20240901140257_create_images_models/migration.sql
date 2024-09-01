/*
  Warnings:

  - You are about to drop the column `banner_url` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `profile_url` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "projects" DROP COLUMN "banner_url";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "profile_url";

-- CreateTable
CREATE TABLE "profile_images" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT,

    CONSTRAINT "profile_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "banners" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "project_id" TEXT NOT NULL,

    CONSTRAINT "banners_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "profile_images_url_key" ON "profile_images"("url");

-- CreateIndex
CREATE UNIQUE INDEX "profile_images_user_id_key" ON "profile_images"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "banners_url_key" ON "banners"("url");

-- CreateIndex
CREATE UNIQUE INDEX "banners_project_id_key" ON "banners"("project_id");

-- AddForeignKey
ALTER TABLE "profile_images" ADD CONSTRAINT "profile_images_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "banners" ADD CONSTRAINT "banners_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
