import { SearchPostsByProfessorUseCase } from '@/@core/domain/projects/application/use-cases/search-posts-by-professor-name'
import { PrismaProjectsRepository } from '@/@infra/database/prisma/repositories/projects-repository'

export function makeSearchPostsByProfessorNameUseCase() {
  const projectsRepository = new PrismaProjectsRepository()
  const searchPostsByProfessorNameUseCase = new SearchPostsByProfessorUseCase(
    projectsRepository,
  )

  return searchPostsByProfessorNameUseCase
}
