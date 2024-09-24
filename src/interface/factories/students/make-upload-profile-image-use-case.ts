import { UploadStudentProfileUseCase } from '@/domain/deck/application/use-cases/upload-student-profile.ts'
import { FirebaseProfileUploader } from '@/infra/database/firebase/profile-uploader.ts'
import { PrismaDraftsRepository } from '@/infra/database/prisma/repositories/drafts-repository.ts'
import { PrismaProjectsRepository } from '@/infra/database/prisma/repositories/projects-repository.ts'
import { PrismaStudentsRepository } from '@/infra/database/prisma/repositories/students-repository.ts'

export function makeUploadProfileImageUseCase() {
  const firebaseBannerUploader = new FirebaseProfileUploader()
  const projectsRepository = new PrismaProjectsRepository()
  const draftsRepository = new PrismaDraftsRepository()
  const studentsRepository = new PrismaStudentsRepository(
    projectsRepository,
    draftsRepository,
  )
  const uploadStudentProfileUseCase = new UploadStudentProfileUseCase(
    studentsRepository,
    firebaseBannerUploader,
  )

  return uploadStudentProfileUseCase
}
