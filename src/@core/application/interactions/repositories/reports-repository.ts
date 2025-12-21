import type { Report } from '@/@core/domain/interactions/entities/report'

export abstract class ReportsRepository {
  abstract findById(id: string): Promise<Report | null>

  abstract findAll(): Promise<Report[]>

  abstract create(report: Report): Promise<void>

  abstract save(report: Report): Promise<void>

  abstract delete(id: string): Promise<void>

  abstract deleteManyByCommentId(commentId: string): Promise<void>
}
