import { CreateDraftUseCase } from '@/domain/deck/application/use-cases/create-draft.ts'
import { PrismaDraftsRepository } from '@/infra/database/prisma/repositories/drafts-repository.ts'
import { PrismaProfessorsRepository } from '@/infra/database/prisma/repositories/professors-repository.ts'
import { PrismaProjectsRepository } from '@/infra/database/prisma/repositories/projects-repository.ts'
import { PrismaStudentsRepository } from '@/infra/database/prisma/repositories/students-repository.ts'
import { PrismaSubjectsRepository } from '@/infra/database/prisma/repositories/subjects-repository.ts'
import { PrismaTrailsRepository } from '@/infra/database/prisma/repositories/trails-repository.ts'

export function makeCreateDraftUseCase() {
  const draftsRepository = new PrismaDraftsRepository()
  const projectsRepository = new PrismaProjectsRepository()
  const studentsRepository = new PrismaStudentsRepository(
    projectsRepository,
    draftsRepository,
  )
  const subjectsRepository = new PrismaSubjectsRepository()
  const trailsRepository = new PrismaTrailsRepository()
  const professorsRepository = new PrismaProfessorsRepository()
  const createDraftUseCase = new CreateDraftUseCase(
    draftsRepository,
    studentsRepository,
    subjectsRepository,
    trailsRepository,
    professorsRepository,
  )

  return createDraftUseCase
}
