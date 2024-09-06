import { FetchStudentsByQueryUseCase } from '@/domain/deck/application/use-cases/fetch-students-by-query.ts'
import { PrismaStudentsRepository } from '@/infra/database/prisma/repositories/students-repository.ts'

export function makeFetchStudentsByQueryUseCase() {
  const studentsRepository = new PrismaStudentsRepository()
  const fetchStudentsUseCase = new FetchStudentsByQueryUseCase(
    studentsRepository,
  )

  return fetchStudentsUseCase
}
