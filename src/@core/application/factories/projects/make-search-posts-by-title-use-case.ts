import { SearchPostsByTitleUseCase } from '@/@core/domain/projects/application/use-cases/search-posts-by-title'
import { PrismaProjectsRepository } from '@/@infra/database/prisma/repositories/projects-repository'

export function makeSearchPostsByTitleUseCase() {
  const projectsRepository = new PrismaProjectsRepository()
  const searchPostsByTitleUseCase = new SearchPostsByTitleUseCase(
    projectsRepository,
  )

  return searchPostsByTitleUseCase
}
