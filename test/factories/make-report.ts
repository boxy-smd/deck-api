import { UniqueEntityID } from '@/core/entities/unique-entity-id.ts'
import {
  Report,
  type ReportProps,
} from '@/domain/deck/enterprise/entities/report.ts'

export function makeReport(
  override: Partial<ReportProps> = {},
  id?: UniqueEntityID,
) {
  const report = Report.create(
    {
      content: 'This comment is inappropriate.',
      isResolved: false,
      authorId: new UniqueEntityID(),
      commentId: new UniqueEntityID(),
      ...override,
    },
    id,
  )

  return report
}
