import type { ReportsRepository } from '@/@core/application/interactions/repositories/reports-repository'
import type { Report } from '@/@core/domain/interactions/entities/report'

export class InMemoryReportsRepository implements ReportsRepository {
  public items: Report[] = []

  async findById(id: string): Promise<Report | null> {
    return Promise.resolve(
      this.items.find(item => item.id.toString() === id) || null,
    )
  }

  async findAll(): Promise<Report[]> {
    return await Promise.resolve(this.items)
  }

  async create(report: Report): Promise<void> {
    await Promise.resolve(this.items.push(report))
  }

  async save(report: Report): Promise<void> {
    const index = this.items.findIndex(item => item.id.equals(report.id))

    if (index === -1) {
      throw new Error('Report not found.')
    }

    this.items[index] = report
  }

  async delete(id: string): Promise<void> {
    const index = this.items.findIndex(item => item.id.toString() === id)

    if (index === -1) {
      throw new Error('Report not found.')
    }

    this.items.splice(index, 1)
  }

  async deleteManyByCommentId(commentId: string): Promise<void> {
    this.items = this.items.filter(
      item => item.commentId.toString() !== commentId,
    )
  }
}
