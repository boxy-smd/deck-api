import { ListProjectCommentsUseCase } from '@/@core/domain/interaction/application/use-cases/list-project-comments'
import { PrismaCommentsRepository } from '@/@infra/database/prisma/repositories/comments-repository'
import { PrismaProjectsRepository } from '@/@infra/database/prisma/repositories/projects-repository'

export function makeListProjectCommentsUseCase() {
  const commentsRepository = new PrismaCommentsRepository()
  const projectsRepository = new PrismaProjectsRepository()

  return new ListProjectCommentsUseCase(
    projectsRepository,
    commentsRepository,
  )
}
