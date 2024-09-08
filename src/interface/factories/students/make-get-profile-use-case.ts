import { GetProfileUseCase } from '@/domain/deck/application/use-cases/get-profile.ts'
import { PrismaProjectsRepository } from '@/infra/database/prisma/repositories/projects-repository.ts'
import { PrismaStudentsRepository } from '@/infra/database/prisma/repositories/students-repository.ts'

export function makeGetProfileUseCase() {
  const studentsRepository = new PrismaStudentsRepository()
  const projectsRepository = new PrismaProjectsRepository()
  const getProfileUseCase = new GetProfileUseCase(studentsRepository, projectsRepository)

  return getProfileUseCase
}
