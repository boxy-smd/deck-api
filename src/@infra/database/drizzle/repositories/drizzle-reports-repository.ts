import { Inject, Injectable } from '@nestjs/common'
import { eq } from 'drizzle-orm'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { ReportsRepository } from '@/@core/application/interactions/repositories/reports-repository'
import { Report } from '@/@core/domain/interactions/entities/report'
import { DRIZZLE } from '../drizzle.provider'
import { DrizzleReportMapper } from '../mappers/drizzle-report-mapper'
import * as schema from '../schema'
import { reports } from '../schema'

@Injectable()
export class DrizzleReportsRepository implements ReportsRepository {
  constructor(
    @Inject(DRIZZLE) private drizzle: NodePgDatabase<typeof schema>,
  ) {}

  async findById(id: string): Promise<Report | null> {
    const results = await this.drizzle
      .select()
      .from(reports)
      .where(eq(reports.id, id))
      .limit(1)

    if (results.length === 0) return null

    return DrizzleReportMapper.toEntity(results[0])
  }

  async findAll(): Promise<Report[]> {
    const results = await this.drizzle.select().from(reports)

    return results.map(DrizzleReportMapper.toEntity)
  }

  async deleteManyByCommentId(commentId: string): Promise<void> {
    await this.drizzle.delete(reports).where(eq(reports.commentId, commentId))
  }

  async create(entity: Report): Promise<void> {
    await this.drizzle.insert(reports).values({
      id: entity.id.toString(),
      content: entity.content,
      isResolved: entity.isResolved,
      resolvedAt: null,
      resolvedBy: null,
      authorId: entity.authorId.toString(),
      commentId: entity.commentId.toString(),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt ?? null,
    })
  }

  async save(entity: Report): Promise<void> {
    await this.drizzle
      .update(reports)
      .set({
        content: entity.content,
        isResolved: entity.isResolved,
        updatedAt: new Date(),
      })
      .where(eq(reports.id, entity.id.toString()))
  }

  async delete(id: string): Promise<void> {
    await this.drizzle.delete(reports).where(eq(reports.id, id))
  }
}
