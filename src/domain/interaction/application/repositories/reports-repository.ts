import type { Report } from '../../enterprise/entities/report.ts'

export interface ReportsRepository {
  findById(id: string): Promise<Report | null>
  findAll(): Promise<Report[]>
  create(report: Report): Promise<void>
  save(report: Report): Promise<void>
  delete(id: string): Promise<void>
  deleteManyByCommentId(commentId: string): Promise<void>
}
