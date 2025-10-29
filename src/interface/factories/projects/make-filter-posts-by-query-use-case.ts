import { FilterPostsByQueryUseCase } from '@/domain/projects/application/use-cases/filter-posts-by-query'
import { PrismaProjectsRepository } from '@/infra/database/prisma/repositories/projects-repository'

export function makeFilterPostsByQueryUseCase() {
  const projectsRepository = new PrismaProjectsRepository()
  const filterPostsByQueryUseCase = new FilterPostsByQueryUseCase(
    projectsRepository,
  )

  return filterPostsByQueryUseCase
}
