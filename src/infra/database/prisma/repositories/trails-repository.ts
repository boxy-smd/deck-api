import type { TrailsRepository } from '@/domain/deck/application/repositories/trails-repository.ts'
import type { Trail } from '@/domain/deck/enterprise/entities/trail.ts'
import type { PrismaClient } from '@prisma/client'
import { PrismaTrailMapper } from '../mappers/prisma-trail-mapper.ts'

export class PrismaTrailsRepository implements TrailsRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<Trail | null> {
    const trail = await this.prisma.trail.findUnique({ where: { id } })

    if (!trail) return null

    return PrismaTrailMapper.toEntity(trail)
  }

  async findByName(name: string): Promise<Trail | null> {
    const trail = await this.prisma.trail.findFirst({ where: { name } })

    if (!trail) return null

    return PrismaTrailMapper.toEntity(trail)
  }

  async fetchAll(): Promise<Trail[]> {
    const trails = await this.prisma.trail.findMany()
    return trails.map(PrismaTrailMapper.toEntity)
  }

  async fetchByName(name: string): Promise<Trail[]> {
    const trails = await this.prisma.trail.findMany({
      where: { name: { contains: name } },
    })

    return trails.map(PrismaTrailMapper.toEntity)
  }

  async create(trail: Trail): Promise<void> {
    const data = PrismaTrailMapper.toPrisma(trail)
    await this.prisma.trail.create({ data })
  }

  async save(trail: Trail): Promise<void> {
    const data = PrismaTrailMapper.toPrisma(trail)

    await this.prisma.trail.update({
      where: { id: trail.id.toString() },
      data,
    })
  }

  async delete(trail: Trail): Promise<void> {
    await this.prisma.trail.delete({
      where: { id: trail.id.toString() },
    })
  }
}
