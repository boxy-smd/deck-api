import { ReportCommentUseCase } from '@/domain/deck/application/use-cases/report-comment.ts'
import { PrismaCommentsRepository } from '@/infra/database/prisma/repositories/comments-repository.ts'
import { PrismaProjectsRepository } from '@/infra/database/prisma/repositories/projects-repository.ts'
import { PrismaReportsRepository } from '@/infra/database/prisma/repositories/reports-repository.ts'
import { PrismaStudentsRepository } from '@/infra/database/prisma/repositories/students-repository.ts'

export function makeReportCommentUseCase() {
  const reportsRepository = new PrismaReportsRepository()
  const commentsRepository = new PrismaCommentsRepository(reportsRepository)
  const projectsRepository = new PrismaProjectsRepository()
  const studentsRepository = new PrismaStudentsRepository(projectsRepository)
  const reportCommentUseCase = new ReportCommentUseCase(
    reportsRepository,
    commentsRepository,
    studentsRepository,
  )

  return reportCommentUseCase
}
