import { PublishProjectUseCase } from '@/application/use-cases/projects/publish.ts'
import { PrismaProfessorsRepository } from '@/infra/database/prisma/repositories/professors-repository.ts'
import { PrismaProjectsRepository } from '@/infra/database/prisma/repositories/projects-repository.ts'
import { PrismaSubjectsRepository } from '@/infra/database/prisma/repositories/subjects-repository.ts'
import { PrismaTrailsRepository } from '@/infra/database/prisma/repositories/trails-repository.ts'
import { PrismaUsersRepository } from '@/infra/database/prisma/repositories/users-repository.ts'

export function makePublishProjectUseCase() {
  const projectRepository = new PrismaProjectsRepository()
  const trailsRepository = new PrismaTrailsRepository()
  const professorsRepository = new PrismaProfessorsRepository()
  const subjectsRepository = new PrismaSubjectsRepository()
  const usersRepository = new PrismaUsersRepository()
  const publishProjectUseCase = new PublishProjectUseCase(
    projectRepository,
    trailsRepository,
    professorsRepository,
    subjectsRepository,
    usersRepository,
  )

  return publishProjectUseCase
}
