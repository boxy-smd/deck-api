import { EditProfileUseCase } from '@/domain/deck/application/use-cases/edit-profile.ts'
import { PrismaStudentsRepository } from '@/infra/database/prisma/repositories/students-repository.ts'
import { PrismaTrailsRepository } from '@/infra/database/prisma/repositories/trails-repository.ts'

export function makeEditProfileUseCase() {
  const studentsRepository = new PrismaStudentsRepository()
  const trailsRepository = new PrismaTrailsRepository()
  const editProfileUseCase = new EditProfileUseCase(
    studentsRepository,
    trailsRepository,
  )

  return editProfileUseCase
}
