import { GetProfileUseCase } from '@/domain/deck/application/use-cases/get-profile.ts'
import { PrismaProjectsRepository } from '@/infra/database/prisma/repositories/projects-repository.ts'
import { PrismaStudentsRepository } from '@/infra/database/prisma/repositories/students-repository.ts'

export function makeGetProfileUseCase() {
  const projectsRepository = new PrismaProjectsRepository()
  const studentsRepository = new PrismaStudentsRepository(projectsRepository)
  const getProfileUseCase = new GetProfileUseCase(studentsRepository)

  return getProfileUseCase
}
