-- CreateTable
CREATE TABLE "drafts" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "content" TEXT,
    "published_year" INTEGER,
    "semester" INTEGER,
    "allow_comments" BOOLEAN,
    "banner_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "author_id" TEXT NOT NULL,
    "subject_id" TEXT,

    CONSTRAINT "drafts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_DraftToTrail" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_DraftToProfessor" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_DraftToTrail_AB_unique" ON "_DraftToTrail"("A", "B");

-- CreateIndex
CREATE INDEX "_DraftToTrail_B_index" ON "_DraftToTrail"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_DraftToProfessor_AB_unique" ON "_DraftToProfessor"("A", "B");

-- CreateIndex
CREATE INDEX "_DraftToProfessor_B_index" ON "_DraftToProfessor"("B");

-- AddForeignKey
ALTER TABLE "drafts" ADD CONSTRAINT "drafts_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "drafts" ADD CONSTRAINT "drafts_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subjects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DraftToTrail" ADD CONSTRAINT "_DraftToTrail_A_fkey" FOREIGN KEY ("A") REFERENCES "drafts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DraftToTrail" ADD CONSTRAINT "_DraftToTrail_B_fkey" FOREIGN KEY ("B") REFERENCES "trails"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DraftToProfessor" ADD CONSTRAINT "_DraftToProfessor_A_fkey" FOREIGN KEY ("A") REFERENCES "drafts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DraftToProfessor" ADD CONSTRAINT "_DraftToProfessor_B_fkey" FOREIGN KEY ("B") REFERENCES "professors"("id") ON DELETE CASCADE ON UPDATE CASCADE;
