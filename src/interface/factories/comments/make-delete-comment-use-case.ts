import { DeleteCommentUseCase } from '@/domain/interaction/application/use-cases/delete-comment'
import { PrismaCommentsRepository } from '@/infra/database/prisma/repositories/comments-repository'
import { PrismaProjectsRepository } from '@/infra/database/prisma/repositories/projects-repository'
import { PrismaReportsRepository } from '@/infra/database/prisma/repositories/reports-repository'
import { PrismaStudentsRepository } from '@/infra/database/prisma/repositories/students-repository'

export function makeDeleteCommentUseCase() {
  const reportsRepository = new PrismaReportsRepository()
  const commentsRepository = new PrismaCommentsRepository(reportsRepository)
  const projectsRepository = new PrismaProjectsRepository()
  const studentsRepository = new PrismaStudentsRepository(
    projectsRepository,
  )
  const deleteCommentUseCase = new DeleteCommentUseCase(
    commentsRepository,
    studentsRepository,
  )

  return deleteCommentUseCase
}
