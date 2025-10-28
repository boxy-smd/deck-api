import { SearchPostsByProfessorUseCase } from '@/domain/projects/application/use-cases/search-posts-by-professor-name.ts'
import { PrismaProjectsRepository } from '@/infra/database/prisma/repositories/projects-repository.ts'

export function makeSearchPostsByProfessorNameUseCase() {
  const projectsRepository = new PrismaProjectsRepository()
  const searchPostsByProfessorNameUseCase = new SearchPostsByProfessorUseCase(
    projectsRepository,
  )

  return searchPostsByProfessorNameUseCase
}
