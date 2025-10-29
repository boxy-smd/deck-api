import { ReportCommentUseCase } from '@/@core/domain/interaction/application/use-cases/report-comment'
import { PrismaCommentsRepository } from '@/@infra/database/prisma/repositories/comments-repository'
import { PrismaProjectsRepository } from '@/@infra/database/prisma/repositories/projects-repository'
import { PrismaReportsRepository } from '@/@infra/database/prisma/repositories/reports-repository'
import { PrismaStudentsRepository } from '@/@infra/database/prisma/repositories/students-repository'

export function makeReportCommentUseCase() {
  const reportsRepository = new PrismaReportsRepository()
  const commentsRepository = new PrismaCommentsRepository(reportsRepository)
  const projectsRepository = new PrismaProjectsRepository()
  const studentsRepository = new PrismaStudentsRepository(
    projectsRepository,
  )
  const reportCommentUseCase = new ReportCommentUseCase(
    studentsRepository,
    commentsRepository,
    reportsRepository,
  )

  return reportCommentUseCase
}
