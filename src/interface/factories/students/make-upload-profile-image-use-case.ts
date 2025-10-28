import { UploadStudentProfileUseCase } from '@/domain/authentication/application/use-cases/upload-student-profile.ts'
import { FirebaseProfileUploader } from '@/infra/database/firebase/profile-uploader.ts'
import { PrismaProjectsRepository } from '@/infra/database/prisma/repositories/projects-repository.ts'
import { PrismaStudentsRepository } from '@/infra/database/prisma/repositories/students-repository.ts'

export function makeUploadProfileImageUseCase() {
  const firebaseBannerUploader = new FirebaseProfileUploader()
  const projectsRepository = new PrismaProjectsRepository()
  const studentsRepository = new PrismaStudentsRepository(
    projectsRepository,
  )
  const uploadStudentProfileUseCase = new UploadStudentProfileUseCase(
    studentsRepository,
    firebaseBannerUploader,
  )

  return uploadStudentProfileUseCase
}
