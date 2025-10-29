import { FetchStudentsUseCase } from '@/@core/domain/authentication/application/use-cases/fetch-students'
import { PrismaStudentsRepository } from '@/@infra/database/prisma/repositories/students-repository'

export function makeFetchStudentsUseCase() {
  const studentsRepository = new PrismaStudentsRepository()
  const fetchStudentsUseCase = new FetchStudentsUseCase(studentsRepository)

  return fetchStudentsUseCase
}
