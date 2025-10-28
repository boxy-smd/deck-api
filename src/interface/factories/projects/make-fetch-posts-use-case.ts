import { FetchPostsUseCase } from '@/domain/projects/application/use-cases/fetch-posts.ts'
import { PrismaProjectsRepository } from '@/infra/database/prisma/repositories/projects-repository.ts'

export function makeFetchPostsUseCase() {
  const projectsRepository = new PrismaProjectsRepository()
  const fetchPostsUseCase = new FetchPostsUseCase(projectsRepository)

  return fetchPostsUseCase
}
