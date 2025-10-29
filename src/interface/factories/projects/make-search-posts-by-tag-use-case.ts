import { SearchPostsByTagUseCase } from '@/domain/projects/application/use-cases/search-posts-by-tag'
import { PrismaProjectsRepository } from '@/infra/database/prisma/repositories/projects-repository'

export function makeSearchPostsByTagUseCase() {
  const projectsRepository = new PrismaProjectsRepository()
  const searchPostsByTagUseCase = new SearchPostsByTagUseCase(
    projectsRepository,
  )

  return searchPostsByTagUseCase
}
