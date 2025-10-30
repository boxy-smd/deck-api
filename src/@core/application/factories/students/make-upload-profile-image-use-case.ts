import { UploadStudentProfileUseCase } from '@/@core/domain/authentication/application/use-cases/upload-student-profile'
import { FirebaseProfileUploader } from '@/@infra/database/firebase/profile-uploader'
import { FirebaseService } from '@/@infra/database/firebase/firebase.service'
import { PrismaStudentsRepository } from '@/@infra/database/prisma/repositories/students-repository'

export function makeUploadProfileImageUseCase() {
  const firebaseService = new FirebaseService()
  const firebaseProfileUploader = new FirebaseProfileUploader(firebaseService)
  const studentsRepository = new PrismaStudentsRepository()
  const uploadStudentProfileUseCase = new UploadStudentProfileUseCase(
    studentsRepository,
    firebaseProfileUploader,
  )

  return uploadStudentProfileUseCase
}
