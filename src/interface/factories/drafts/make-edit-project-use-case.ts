import { EditDraftUseCase } from '@/domain/projects/application/use-cases/edit-draft.ts'
import { PrismaDraftsRepository } from '@/infra/database/prisma/repositories/drafts-repository.ts'
import { PrismaProfessorsRepository } from '@/infra/database/prisma/repositories/professors-repository.ts'
import { PrismaProjectsRepository } from '@/infra/database/prisma/repositories/projects-repository.ts'
import { PrismaStudentsRepository } from '@/infra/database/prisma/repositories/students-repository.ts'
import { PrismaSubjectsRepository } from '@/infra/database/prisma/repositories/subjects-repository.ts'
import { PrismaTrailsRepository } from '@/infra/database/prisma/repositories/trails-repository.ts'

export function makeEditDraftUseCase() {
  const projectsRepository = new PrismaProjectsRepository()
  const draftsRepository = new PrismaDraftsRepository()
  const studentsRepository = new PrismaStudentsRepository(
    projectsRepository,
    draftsRepository,
  )
  const subjectsRepository = new PrismaSubjectsRepository()
  const trailsRepository = new PrismaTrailsRepository()
  const professorsRepository = new PrismaProfessorsRepository()
  const editDraftUseCase = new EditDraftUseCase(
    draftsRepository,
    studentsRepository,
    subjectsRepository,
    trailsRepository,
    professorsRepository,
  )

  return editDraftUseCase
}
