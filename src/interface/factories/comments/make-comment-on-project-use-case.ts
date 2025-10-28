import { CommentOnProjectUseCase } from '@/domain/interaction/application/use-cases/comment-on-project.ts'
import { PrismaCommentsRepository } from '@/infra/database/prisma/repositories/comments-repository.ts'
import { PrismaDraftsRepository } from '@/infra/database/prisma/repositories/drafts-repository.ts'
import { PrismaProjectsRepository } from '@/infra/database/prisma/repositories/projects-repository.ts'
import { PrismaReportsRepository } from '@/infra/database/prisma/repositories/reports-repository.ts'
import { PrismaStudentsRepository } from '@/infra/database/prisma/repositories/students-repository.ts'

export function makeCommentOnProjectUseCase() {
  const reportsRepository = new PrismaReportsRepository()
  const commentsRepository = new PrismaCommentsRepository(reportsRepository)
  const projectsRepository = new PrismaProjectsRepository()
  const draftsRepository = new PrismaDraftsRepository()
  const studentsRepository = new PrismaStudentsRepository(
    projectsRepository,
    draftsRepository,
  )
  const commentOnProjectUseCase = new CommentOnProjectUseCase(
    commentsRepository,
    projectsRepository,
    studentsRepository,
  )

  return commentOnProjectUseCase
}
