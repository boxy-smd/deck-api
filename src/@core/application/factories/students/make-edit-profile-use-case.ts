import { EditProfileUseCase } from '@/@core/domain/authentication/application/use-cases/edit-profile'
import { PrismaStudentsRepository } from '@/@infra/database/prisma/repositories/students-repository'
import { PrismaTrailsRepository } from '@/@infra/database/prisma/repositories/trails-repository'

export function makeEditProfileUseCase() {
  const studentsRepository = new PrismaStudentsRepository()
  const trailsRepository = new PrismaTrailsRepository()
  const editProfileUseCase = new EditProfileUseCase(
    studentsRepository,
    trailsRepository,
  )

  return editProfileUseCase
}
