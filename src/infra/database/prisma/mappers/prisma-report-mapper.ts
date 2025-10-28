import type { Prisma, Report as ReportRaw } from '@prisma/client'

import { Report } from '@/domain/interaction/enterprise/entities/report.ts'
import { UniqueEntityID } from '@/shared/kernel/unique-entity-id.ts'

// biome-ignore lint/complexity/noStaticOnlyClass: This class is a mapper and should have only static methods
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
