import { SearchPostsByTitleUseCase } from '@/domain/deck/application/use-cases/search-posts-by-title.ts'
import { PrismaProjectsRepository } from '@/infra/database/prisma/repositories/projects-repository.ts'

export function makeSearchPostsByTitleUseCase() {
  const projectsRepository = new PrismaProjectsRepository()
  const searchPostsByTitleUseCase = new SearchPostsByTitleUseCase(
    projectsRepository,
  )

  return searchPostsByTitleUseCase
}
