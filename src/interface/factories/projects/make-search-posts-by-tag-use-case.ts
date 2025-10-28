import { SearchPostsByTagUseCase } from '@/domain/projects/application/use-cases/search-posts-by-tag.ts'
import { PrismaProjectsRepository } from '@/infra/database/prisma/repositories/projects-repository.ts'

export function makeSearchPostsByTagUseCase() {
  const projectsRepository = new PrismaProjectsRepository()
  const searchPostsByTagUseCase = new SearchPostsByTagUseCase(
    projectsRepository,
  )

  return searchPostsByTagUseCase
}
