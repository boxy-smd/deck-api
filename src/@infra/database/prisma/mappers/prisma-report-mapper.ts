import type { Prisma, Report as ReportRaw } from '@prisma/client'

import { Report } from '@/@core/domain/interaction/enterprise/entities/report'
import { UniqueEntityID } from '@/@shared/kernel/kernel/unique-entity-id'

export class PrismaReportMapper {
  static toEntity(raw: ReportRaw): Report {
    return Report.create(
      {
        content: raw.content,
        isResolved: raw.isResolved,
        authorId: UniqueEntityID.create(raw.authorId),
        commentId: UniqueEntityID.create(raw.commentId),
      },
      UniqueEntityID.create(raw.id),
    )
  }

  static toPrisma(report: Report): Prisma.ReportUncheckedCreateInput {
    return {
      id: report.id.toString(),
      content: report.content,
      isResolved: report.isResolved,
      createdAt: report.createdAt,
      updatedAt: report.updatedAt ?? undefined,
      authorId: report.authorId.toString(),
      commentId: report.commentId.toString(),
    }
  }
}
