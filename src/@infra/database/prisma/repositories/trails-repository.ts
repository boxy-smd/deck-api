import type { TrailsRepository } from '@/@core/domain/projects/application/repositories/trails-repository'
import type { Trail } from '@/@core/domain/projects/enterprise/entities/trail'
import { Injectable } from '@nestjs/common'
import { PrismaTrailMapper } from '../mappers/prisma-trail-mapper'
import type { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaTrailsRepository implements TrailsRepository {
  constructor(private readonly prisma: PrismaService) {}
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

  async findManyByName(name: string): Promise<Trail[]> {
    const trails = await this.prisma.trail.findMany({
      where: { name: { contains: name } },
    })

    return trails.map(PrismaTrailMapper.toEntity)
  }

  async findAll(): Promise<Trail[]> {
    const trails = await this.prisma.trail.findMany()
    return trails.map(PrismaTrailMapper.toEntity)
  }

  async existsById(id: string): Promise<boolean> {
    const count = await this.prisma.trail.count({
      where: { id },
    })

    return count > 0
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

  async deleteById(id: string): Promise<void> {
    await this.prisma.trail.delete({
      where: { id },
    })
  }
}
