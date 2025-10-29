import { GetProfileUseCase } from '@/domain/authentication/application/use-cases/get-profile'
import { PrismaProjectsRepository } from '@/infra/database/prisma/repositories/projects-repository'
import { PrismaStudentsRepository } from '@/infra/database/prisma/repositories/students-repository'

export function makeGetStudentDetailsUseCase() {
  const projectsRepository = new PrismaProjectsRepository()
  const studentsRepository = new PrismaStudentsRepository(
    projectsRepository,
  )
  const getProfileUseCase = new GetProfileUseCase(studentsRepository)

  return getProfileUseCase
}
