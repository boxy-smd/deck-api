import type { ReportsRepository } from '@/domain/deck/application/repositories/reports-repository.ts'
import type { Report } from '@/domain/deck/enterprise/entities/report.ts'

export class InMemoryReportsRepository implements ReportsRepository {
  private items: Report[] = []

  async findById(id: string): Promise<Report | null> {
    return Promise.resolve(
      this.items.find(report => report.id.toString() === id) || null,
    )
  }

  async findAll(): Promise<Report[]> {
    return await Promise.resolve(this.items)
  }

  async create(report: Report): Promise<void> {
    await Promise.resolve(this.items.push(report))
  }

  async save(report: Report): Promise<void> {
    const index = this.items.findIndex(item => item.id === report.id)

    this.items[index] = report

    await Promise.resolve()
  }

  async delete(id: string): Promise<void> {
    const index = this.items.findIndex(item => item.id.toString() === id)

    this.items.splice(index, 1)

    await Promise.resolve()
  }
}
