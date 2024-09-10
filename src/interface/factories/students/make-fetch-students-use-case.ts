import { FetchStudentsUseCase } from '@/domain/deck/application/use-cases/fetch-students.ts'
import { PrismaStudentsRepository } from '@/infra/database/prisma/repositories/students-repository.ts'

export function makeFetchStudentsUseCase() {
  const studentsRepository = new PrismaStudentsRepository()
  const fetchStudentsUseCase = new FetchStudentsUseCase(studentsRepository)

  return fetchStudentsUseCase
}
