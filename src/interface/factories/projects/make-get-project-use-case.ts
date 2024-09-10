import { GetProjectUseCase } from '@/domain/deck/application/use-cases/get-project.ts'
import { PrismaProjectsRepository } from '@/infra/database/prisma/repositories/projects-repository.ts'

export function makeGetProjectUseCase() {
  const projectsRepository = new PrismaProjectsRepository()
  const getProjectUseCase = new GetProjectUseCase(projectsRepository)

  return getProjectUseCase
}
