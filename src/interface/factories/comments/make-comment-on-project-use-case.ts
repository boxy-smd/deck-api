import { CommentOnProjectUseCase } from '@/domain/deck/application/use-cases/comment-on-project.ts'
import { PrismaCommentsRepository } from '@/infra/database/prisma/repositories/comments-repository.ts'
import { PrismaProjectsRepository } from '@/infra/database/prisma/repositories/projects-repository.ts'
import { PrismaReportsRepository } from '@/infra/database/prisma/repositories/reports-repository.ts'
import { PrismaStudentsRepository } from '@/infra/database/prisma/repositories/students-repository.ts'

export function makeCommentOnProjectUseCase() {
  const reportsRepository = new PrismaReportsRepository()
  const commentsRepository = new PrismaCommentsRepository(reportsRepository)
  const projectRepository = new PrismaProjectsRepository()
  const studentsRepository = new PrismaStudentsRepository(projectRepository)
  const commentOnProjectUseCase = new CommentOnProjectUseCase(
    commentsRepository,
    projectRepository,
    studentsRepository,
  )

  return commentOnProjectUseCase
}
