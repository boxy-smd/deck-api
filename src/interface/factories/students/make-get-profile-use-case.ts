import { GetProfileUseCase } from '@/domain/deck/application/use-cases/get-profile.ts'
import { PrismaStudentsRepository } from '@/infra/database/prisma/repositories/students-repository.ts'

export function makeGetProfileUseCase() {
  const studentsRepository = new PrismaStudentsRepository()
  const getProfileUseCase = new GetProfileUseCase(studentsRepository)

  return getProfileUseCase
}
