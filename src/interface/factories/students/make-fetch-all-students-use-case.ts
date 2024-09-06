import { FetchAllStudentsUseCase } from '@/domain/deck/application/use-cases/fetch-all-students.ts'
import { PrismaStudentsRepository } from '@/infra/database/prisma/repositories/students-repository.ts'

export function makeFetchAllStudentsUseCase() {
  const studentsRepository = new PrismaStudentsRepository()
  const fetchStudentsUseCase = new FetchAllStudentsUseCase(studentsRepository)

  return fetchStudentsUseCase
}
