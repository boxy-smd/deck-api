import { GetProjectUseCase } from '@/@core/domain/projects/application/use-cases/get-project'
import { PrismaProjectsRepository } from '@/@infra/database/prisma/repositories/projects-repository'

export function makeGetProjectUseCase() {
  const projectsRepository = new PrismaProjectsRepository()
  const getProjectUseCase = new GetProjectUseCase(projectsRepository)

  return getProjectUseCase
}
