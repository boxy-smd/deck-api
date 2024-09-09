import { CommentOnProjectUseCase } from '@/domain/deck/application/use-cases/comment-on-project.ts'
import { PrismaCommentsRepository } from '@/infra/database/prisma/repositories/comments-repository.ts'
import { PrismaProjectsRepository } from '@/infra/database/prisma/repositories/projects-repository.ts'
import { PrismaStudentsRepository } from '@/infra/database/prisma/repositories/students-repository.ts'

export function makeCommentOnProjectUseCase() {
  const commentsRepository = new PrismaCommentsRepository()
  const projectRepository = new PrismaProjectsRepository()
  const studentsRepository = new PrismaStudentsRepository()
  const commentOnProjectUseCase = new CommentOnProjectUseCase(
    commentsRepository,
    projectRepository,
    studentsRepository,
  )

  return commentOnProjectUseCase
}
