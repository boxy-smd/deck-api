import { EditProfileUseCase } from '@/domain/deck/application/use-cases/edit-profile.ts'
import { PrismaProjectsRepository } from '@/infra/database/prisma/repositories/projects-repository.ts'
import { PrismaStudentsRepository } from '@/infra/database/prisma/repositories/students-repository.ts'
import { PrismaTrailsRepository } from '@/infra/database/prisma/repositories/trails-repository.ts'

export function makeEditProfileUseCase() {
  const studentsRepository = new PrismaStudentsRepository()
  const trailsRepository = new PrismaTrailsRepository()
  const projectsRepository = new PrismaProjectsRepository()
  const editProfileUseCase = new EditProfileUseCase(
    studentsRepository,
    projectsRepository,
    trailsRepository,
  )

  return editProfileUseCase
}
