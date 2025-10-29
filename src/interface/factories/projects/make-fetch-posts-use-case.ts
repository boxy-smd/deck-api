import { FetchPostsUseCase } from '@/domain/projects/application/use-cases/fetch-posts'
import { PrismaProjectsRepository } from '@/infra/database/prisma/repositories/projects-repository'

export function makeFetchPostsUseCase() {
  const projectsRepository = new PrismaProjectsRepository()
  const fetchPostsUseCase = new FetchPostsUseCase(projectsRepository)

  return fetchPostsUseCase
}
