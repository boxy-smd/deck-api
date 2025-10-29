import { DeleteProjectUseCase } from '@/@core/domain/projects/application/use-cases/delete-project'
import { PrismaProjectsRepository } from '@/@infra/database/prisma/repositories/projects-repository'

export function makeDeleteProjectUseCase() {
  const projectsRepository = new PrismaProjectsRepository()
  const deleteProjectUseCase = new DeleteProjectUseCase(projectsRepository)

  return deleteProjectUseCase
}
