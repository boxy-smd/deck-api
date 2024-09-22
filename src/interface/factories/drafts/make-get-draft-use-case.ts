import { GetDraftUseCase } from '@/domain/deck/application/use-cases/get-draft.ts'
import { PrismaDraftsRepository } from '@/infra/database/prisma/repositories/drafts-repository.ts'
import { PrismaProjectsRepository } from '@/infra/database/prisma/repositories/projects-repository.ts'
import { PrismaStudentsRepository } from '@/infra/database/prisma/repositories/students-repository.ts'

export function makeGetDraftUseCase() {
  const draftsRepository = new PrismaDraftsRepository()
  const projectsRepository = new PrismaProjectsRepository()
  const studentsRepository = new PrismaStudentsRepository(
    projectsRepository,
    draftsRepository,
  )
  const getDraftUseCase = new GetDraftUseCase(
    draftsRepository,
    studentsRepository,
  )

  return getDraftUseCase
}
