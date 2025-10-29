import { UploadStudentProfileUseCase } from '@/@core/domain/authentication/application/use-cases/upload-student-profile'
import { FirebaseProfileUploader } from '@/@infra/database/firebase/profile-uploader'
import { PrismaProjectsRepository } from '@/@infra/database/prisma/repositories/projects-repository'
import { PrismaStudentsRepository } from '@/@infra/database/prisma/repositories/students-repository'

export function makeUploadProfileImageUseCase() {
  const firebaseBannerUploader = new FirebaseProfileUploader()
  const projectsRepository = new PrismaProjectsRepository()
  const studentsRepository = new PrismaStudentsRepository()
  const uploadStudentProfileUseCase = new UploadStudentProfileUseCase(
    studentsRepository,
    firebaseBannerUploader,
  )

  return uploadStudentProfileUseCase
}

