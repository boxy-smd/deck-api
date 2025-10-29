import { GetProfileUseCase } from '@/@core/domain/authentication/application/use-cases/get-profile'
import { PrismaProjectsRepository } from '@/@infra/database/prisma/repositories/projects-repository'
import { PrismaStudentsRepository } from '@/@infra/database/prisma/repositories/students-repository'

export function makeGetProfileUseCase() {
  const projectsRepository = new PrismaProjectsRepository()
  const studentsRepository = new PrismaStudentsRepository()
  const getProfileUseCase = new GetProfileUseCase(studentsRepository)

  return getProfileUseCase
}

