import type { ReportsRepository } from '@/domain/deck/application/repositories/reports-repository.ts'
import type { Report } from '@/domain/deck/enterprise/entities/report.ts'
import { prisma } from '../client.ts'
import { PrismaReportMapper } from '../mappers/prisma-report-mapper.ts'

export class PrismaReportsRepository implements ReportsRepository {
  async findById(id: string): Promise<Report | null> {
    const data = await prisma.report.findUnique({
      where: {
        id,
      },
    })

    if (!data) return null

    return PrismaReportMapper.toEntity(data)
  }

  async findAll(): Promise<Report[]> {
    const data = await prisma.report.findMany()

    return data.map(PrismaReportMapper.toEntity)
  }

  async create(report: Report): Promise<void> {
    await prisma.report.create({
      data: PrismaReportMapper.toPrisma(report),
    })
  }

  async save(report: Report): Promise<void> {
    await prisma.report.upsert({
      where: {
        id: report.id.toString(),
      },
      update: PrismaReportMapper.toPrisma(report),
      create: PrismaReportMapper.toPrisma(report),
    })
  }

  async delete(id: string): Promise<void> {
    await prisma.report.delete({
      where: {
        id,
      },
    })
  }

  async deleteManyByCommentId(commentId: string): Promise<void> {
    await prisma.report.deleteMany({
      where: {
        commentId,
      },
    })
  }
}
