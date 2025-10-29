import { EditProfileUseCase } from '@/@core/domain/authentication/application/use-cases/edit-profile'
import { PrismaProjectsRepository } from '@/@infra/database/prisma/repositories/projects-repository'
import { PrismaStudentsRepository } from '@/@infra/database/prisma/repositories/students-repository'
import { PrismaTrailsRepository } from '@/@infra/database/prisma/repositories/trails-repository'

export function makeEditProfileUseCase() {
  const projectsRepository = new PrismaProjectsRepository()
  const studentsRepository = new PrismaStudentsRepository(
    projectsRepository,
  )
  const trailsRepository = new PrismaTrailsRepository()
  const editProfileUseCase = new EditProfileUseCase(
    studentsRepository,
    trailsRepository,
  )

  return editProfileUseCase
}
