import { PublishProjectUseCase } from '@/domain/deck/application/use-cases/publish-project.ts'
import { PrismaProfessorsRepository } from '@/infra/database/prisma/repositories/professors-repository.ts'
import { PrismaProjectsRepository } from '@/infra/database/prisma/repositories/projects-repository.ts'
import { PrismaStudentsRepository } from '@/infra/database/prisma/repositories/students-repository.ts'
import { PrismaSubjectsRepository } from '@/infra/database/prisma/repositories/subjects-repository.ts'
import { PrismaTrailsRepository } from '@/infra/database/prisma/repositories/trails-repository.ts'

export function makePublishProjectUseCase() {
  const projectRepository = new PrismaProjectsRepository()
  const studentsRepository = new PrismaStudentsRepository()
  const professorsRepository = new PrismaProfessorsRepository()
  const trailsRepository = new PrismaTrailsRepository()
  const subjectsRepository = new PrismaSubjectsRepository()

  const publishProjectUseCase = new PublishProjectUseCase(
    projectRepository,
    studentsRepository,
    subjectsRepository,
    trailsRepository,
    professorsRepository,
  )

  return publishProjectUseCase
}
