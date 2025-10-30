import type { ReportsRepository } from '@/@core/domain/interaction/application/repositories/reports-repository'
import type { Report } from '@/@core/domain/interaction/enterprise/entities/report'
import { Injectable } from '@nestjs/common'
import { PrismaReportMapper } from '../mappers/prisma-report-mapper'
import type { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaReportsRepository implements ReportsRepository {
  constructor(private readonly prisma: PrismaService) {}
  async findById(id: string): Promise<Report | null> {
    const data = await this.prisma.report.findUnique({
      where: {
        id,
      },
    })

    if (!data) return null

    return PrismaReportMapper.toEntity(data)
  }

  async findAll(): Promise<Report[]> {
    const data = await this.prisma.report.findMany()

    return data.map(PrismaReportMapper.toEntity)
  }

  async create(report: Report): Promise<void> {
    await this.prisma.report.create({
      data: PrismaReportMapper.toPrisma(report),
    })
  }

  async save(report: Report): Promise<void> {
    await this.prisma.report.upsert({
      where: {
        id: report.id.toString(),
      },
      update: PrismaReportMapper.toPrisma(report),
      create: PrismaReportMapper.toPrisma(report),
    })
  }

  async delete(id: string): Promise<void> {
    await this.prisma.report.delete({
      where: {
        id,
      },
    })
  }

  async deleteManyByCommentId(commentId: string): Promise<void> {
    await this.prisma.report.deleteMany({
      where: {
        commentId,
      },
    })
  }
}
