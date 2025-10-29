import { GetProfileUseCase } from '@/@core/domain/authentication/application/use-cases/get-profile'
import { PrismaStudentsRepository } from '@/@infra/database/prisma/repositories/students-repository'

export function makeGetStudentDetailsUseCase() {
  const studentsRepository = new PrismaStudentsRepository()
  const getProfileUseCase = new GetProfileUseCase(studentsRepository)

  return getProfileUseCase
}
