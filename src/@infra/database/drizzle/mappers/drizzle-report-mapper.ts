import { Report } from '@/@core/domain/interactions/entities/report'
import { UniqueEntityID } from '@/@shared/kernel/kernel/unique-entity-id'
import { InferSelectModel } from 'drizzle-orm'
import { reports } from '../schema'

type ReportRaw = InferSelectModel<typeof reports>

export class DrizzleReportMapper {
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
}
