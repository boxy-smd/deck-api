import { GetStudentDetailsUseCase } from '@/domain/deck/application/use-cases/get-student-details.ts'
import { PrismaDraftsRepository } from '@/infra/database/prisma/repositories/drafts-repository.ts'
import { PrismaProjectsRepository } from '@/infra/database/prisma/repositories/projects-repository.ts'
import { PrismaStudentsRepository } from '@/infra/database/prisma/repositories/students-repository.ts'

export function makeGetStudentDetailsUseCase() {
  const projectsRepository = new PrismaProjectsRepository()
  const draftsRepository = new PrismaDraftsRepository()
  const studentsRepository = new PrismaStudentsRepository(
    projectsRepository,
    draftsRepository,
  )
  const getStudentDetailsUseCase = new GetStudentDetailsUseCase(
    studentsRepository,
  )

  return getStudentDetailsUseCase
}
