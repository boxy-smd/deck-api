import { FilterPostsByQueryUseCase } from '@/domain/deck/application/use-cases/filter-posts-by-query.ts'
import { PrismaProjectsRepository } from '@/infra/database/prisma/repositories/projects-repository.ts'

export function makeFilterPostsByQueryUseCase() {
  const projectsRepository = new PrismaProjectsRepository()
  const filterPostsByQueryUseCase = new FilterPostsByQueryUseCase(
    projectsRepository,
  )

  return filterPostsByQueryUseCase
}
