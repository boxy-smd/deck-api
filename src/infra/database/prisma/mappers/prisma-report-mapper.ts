import type { Prisma, Report as ReportRaw } from '@prisma/client'

import { UniqueEntityID } from '@/core/entities/unique-entity-id.ts'
import { Report } from '@/domain/deck/enterprise/entities/report.ts'

// biome-ignore lint/complexity/noStaticOnlyClass: This class is a mapper and should have only static methods
export class PrismaReportMapper {
  static toEntity(raw: ReportRaw): Report {
    return Report.create(
      {
        content: raw.content,
        isResolved: raw.isResolved,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
        authorId: new UniqueEntityID(raw.authorId),
        commentId: new UniqueEntityID(raw.commentId),
      },
      new UniqueEntityID(raw.id),
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
