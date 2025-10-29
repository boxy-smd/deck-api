import { FetchStudentsUseCase } from '@/domain/authentication/application/use-cases/fetch-students'
import { PrismaProjectsRepository } from '@/infra/database/prisma/repositories/projects-repository'
import { PrismaStudentsRepository } from '@/infra/database/prisma/repositories/students-repository'

export function makeFetchStudentsUseCase() {
  const projectsRepository = new PrismaProjectsRepository()
  const studentsRepository = new PrismaStudentsRepository(
    projectsRepository,
  )
  const fetchStudentsUseCase = new FetchStudentsUseCase(studentsRepository)

  return fetchStudentsUseCase
}
