import { PublishProjectUseCase } from '@/@core/domain/projects/application/use-cases/publish-project'
import { PrismaProfessorsRepository } from '@/@infra/database/prisma/repositories/professors-repository'
import { PrismaProjectsRepository } from '@/@infra/database/prisma/repositories/projects-repository'
import { PrismaStudentsRepository } from '@/@infra/database/prisma/repositories/students-repository'
import { PrismaSubjectsRepository } from '@/@infra/database/prisma/repositories/subjects-repository'
import { PrismaTrailsRepository } from '@/@infra/database/prisma/repositories/trails-repository'

export function makePublishProjectUseCase() {
  const projectsRepository = new PrismaProjectsRepository()
  const studentsRepository = new PrismaStudentsRepository(
    projectsRepository,
  )
  const professorsRepository = new PrismaProfessorsRepository()
  const trailsRepository = new PrismaTrailsRepository()
  const subjectsRepository = new PrismaSubjectsRepository()

  const publishProjectUseCase = new PublishProjectUseCase(
    projectsRepository,
    studentsRepository,
    subjectsRepository,
    trailsRepository,
    professorsRepository,
  )

  return publishProjectUseCase
}
