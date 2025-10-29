import { ListProjectCommentsUseCase } from '@/@core/domain/interaction/application/use-cases/list-project-comments'
import { PrismaCommentsRepository } from '@/@infra/database/prisma/repositories/comments-repository'
import { PrismaProjectsRepository } from '@/@infra/database/prisma/repositories/projects-repository'
import { PrismaReportsRepository } from '@/@infra/database/prisma/repositories/reports-repository'

export function makeListProjectCommentsUseCase() {
  const reportsRepository = new PrismaReportsRepository()
  const commentsRepository = new PrismaCommentsRepository(reportsRepository)
  const projectsRepository = new PrismaProjectsRepository()

  return new ListProjectCommentsUseCase(
    projectsRepository,
    commentsRepository,
  )
}
