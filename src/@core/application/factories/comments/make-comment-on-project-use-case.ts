import { CommentOnProjectUseCase } from '@/@core/domain/interaction/application/use-cases/comment-on-project'
import { PrismaCommentsRepository } from '@/@infra/database/prisma/repositories/comments-repository'
import { PrismaProjectsRepository } from '@/@infra/database/prisma/repositories/projects-repository'
import { PrismaReportsRepository } from '@/@infra/database/prisma/repositories/reports-repository'
import { PrismaStudentsRepository } from '@/@infra/database/prisma/repositories/students-repository'

export function makeCommentOnProjectUseCase() {
  const reportsRepository = new PrismaReportsRepository()
  const commentsRepository = new PrismaCommentsRepository(reportsRepository)
  const projectsRepository = new PrismaProjectsRepository()
  const studentsRepository = new PrismaStudentsRepository()
  const commentOnProjectUseCase = new CommentOnProjectUseCase(
    projectsRepository,
    studentsRepository,
    commentsRepository,
  )

  return commentOnProjectUseCase
}
