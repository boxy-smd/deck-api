import { EditProfileUseCase } from '@/domain/authentication/application/use-cases/edit-profile.ts'
import { PrismaDraftsRepository } from '@/infra/database/prisma/repositories/drafts-repository.ts'
import { PrismaProjectsRepository } from '@/infra/database/prisma/repositories/projects-repository.ts'
import { PrismaStudentsRepository } from '@/infra/database/prisma/repositories/students-repository.ts'
import { PrismaTrailsRepository } from '@/infra/database/prisma/repositories/trails-repository.ts'

export function makeEditProfileUseCase() {
  const projectsRepository = new PrismaProjectsRepository()
  const draftsRepository = new PrismaDraftsRepository()
  const studentsRepository = new PrismaStudentsRepository(
    projectsRepository,
    draftsRepository,
  )
  const trailsRepository = new PrismaTrailsRepository()
  const editProfileUseCase = new EditProfileUseCase(
    studentsRepository,
    trailsRepository,
  )

  return editProfileUseCase
}
