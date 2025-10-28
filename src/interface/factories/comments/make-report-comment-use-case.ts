import { ReportCommentUseCase } from '@/domain/interaction/application/use-cases/report-comment.ts'
import { PrismaDraftsRepository } from '@/infra/database/prisma/repositories/drafts-repository.ts'
import { PrismaProjectsRepository } from '@/infra/database/prisma/repositories/projects-repository.ts'
import { PrismaStudentsRepository } from '@/infra/database/prisma/repositories/students-repository.ts'

export function makeReportCommentUseCase() {
  const projectsRepository = new PrismaProjectsRepository()
  const draftsRepository = new PrismaDraftsRepository()
  const studentsRepository = new PrismaStudentsRepository(
    projectsRepository,
    draftsRepository,
  )
  const reportCommentUseCase = new ReportCommentUseCase(
    studentsRepository,
    projectsRepository,
  )

  return reportCommentUseCase
}
