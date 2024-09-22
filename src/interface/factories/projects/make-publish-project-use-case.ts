import { PublishProjectUseCase } from '@/domain/deck/application/use-cases/publish-project.ts'
import { PrismaDraftsRepository } from '@/infra/database/prisma/repositories/drafts-repository.ts'
import { PrismaProfessorsRepository } from '@/infra/database/prisma/repositories/professors-repository.ts'
import { PrismaProjectsRepository } from '@/infra/database/prisma/repositories/projects-repository.ts'
import { PrismaStudentsRepository } from '@/infra/database/prisma/repositories/students-repository.ts'
import { PrismaSubjectsRepository } from '@/infra/database/prisma/repositories/subjects-repository.ts'
import { PrismaTrailsRepository } from '@/infra/database/prisma/repositories/trails-repository.ts'

export function makePublishProjectUseCase() {
  const projectsRepository = new PrismaProjectsRepository()
  const draftsRepository = new PrismaDraftsRepository()
  const studentsRepository = new PrismaStudentsRepository(
    projectsRepository,
    draftsRepository,
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
    draftsRepository,
  )

  return publishProjectUseCase
}
