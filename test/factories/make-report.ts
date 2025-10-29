import {
  Report,
  type ReportProps,
} from '@/domain/interaction/enterprise/entities/report'
import { UniqueEntityID } from '@/shared/kernel/unique-entity-id'

export function makeReport(
  override: Partial<ReportProps> = {},
  id?: UniqueEntityID,
) {
  const report = Report.create(
    {
      content: 'Esse comentário é inadequado.',
      isResolved: false,
      authorId: new UniqueEntityID(),
      commentId: new UniqueEntityID(),
      ...override,
    },
    id,
  )

  return report
}
