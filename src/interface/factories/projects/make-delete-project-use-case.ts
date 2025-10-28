import { DeleteProjectUseCase } from '@/domain/projects/application/use-cases/delete-project.ts'
import { PrismaProjectsRepository } from '@/infra/database/prisma/repositories/projects-repository.ts'

export function makeDeleteProjectUseCase() {
  const projectsRepository = new PrismaProjectsRepository()
  const deleteProjectUseCase = new DeleteProjectUseCase(projectsRepository)

  return deleteProjectUseCase
}
