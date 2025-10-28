import { FetchStudentsUseCase } from '@/domain/authentication/application/use-cases/fetch-students.ts'
import { PrismaProjectsRepository } from '@/infra/database/prisma/repositories/projects-repository.ts'
import { PrismaStudentsRepository } from '@/infra/database/prisma/repositories/students-repository.ts'

export function makeFetchStudentsUseCase() {
  const projectsRepository = new PrismaProjectsRepository()
  const studentsRepository = new PrismaStudentsRepository(
    projectsRepository,
  )
  const fetchStudentsUseCase = new FetchStudentsUseCase(studentsRepository)

  return fetchStudentsUseCase
}
