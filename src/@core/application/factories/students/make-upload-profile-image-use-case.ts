import { UploadStudentProfileUseCase } from '@/@core/domain/authentication/application/use-cases/upload-student-profile'
import { FirebaseProfileUploader } from '@/@infra/database/firebase/profile-uploader'
import { PrismaStudentsRepository } from '@/@infra/database/prisma/repositories/students-repository'

export function makeUploadProfileImageUseCase() {
  const firebaseBannerUploader = new FirebaseProfileUploader()
  const studentsRepository = new PrismaStudentsRepository()
  const uploadStudentProfileUseCase = new UploadStudentProfileUseCase(
    studentsRepository,
    firebaseBannerUploader,
  )

  return uploadStudentProfileUseCase
}
