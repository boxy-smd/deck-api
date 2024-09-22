import { FetchStudentsUseCase } from '@/domain/deck/application/use-cases/fetch-students.ts'
import { PrismaDraftsRepository } from '@/infra/database/prisma/repositories/drafts-repository.ts'
import { PrismaProjectsRepository } from '@/infra/database/prisma/repositories/projects-repository.ts'
import { PrismaStudentsRepository } from '@/infra/database/prisma/repositories/students-repository.ts'

export function makeFetchStudentsUseCase() {
  const projectsRepository = new PrismaProjectsRepository()
  const draftsRepository = new PrismaDraftsRepository()
  const studentsRepository = new PrismaStudentsRepository(
    projectsRepository,
    draftsRepository,
  )
  const fetchStudentsUseCase = new FetchStudentsUseCase(studentsRepository)

  return fetchStudentsUseCase
}
