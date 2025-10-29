import { SearchProjectsUseCase } from '@/@core/domain/projects/application/use-cases/search-projects'
import { PrismaProjectsRepository } from '@/@infra/database/prisma/repositories/projects-repository'

export function makeSearchProjectsUseCase() {
  const projectsRepository = new PrismaProjectsRepository()
  const searchProjectsUseCase = new SearchProjectsUseCase(projectsRepository)

  return searchProjectsUseCase
}
