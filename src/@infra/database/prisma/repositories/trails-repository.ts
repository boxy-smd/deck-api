import type { TrailsRepository } from '@/@core/domain/projects/application/repositories/trails-repository'
import type { Trail } from '@/@core/domain/projects/enterprise/entities/trail'
import { prisma } from '../client'
import { PrismaTrailMapper } from '../mappers/prisma-trail-mapper'

export class PrismaTrailsRepository implements TrailsRepository {
  async findById(id: string): Promise<Trail | null> {
    const trail = await prisma.trail.findUnique({ where: { id } })

    if (!trail) return null

    return PrismaTrailMapper.toEntity(trail)
  }

  async findByName(name: string): Promise<Trail | null> {
    const trail = await prisma.trail.findFirst({ where: { name } })

    if (!trail) return null

    return PrismaTrailMapper.toEntity(trail)
  }

  async findManyByName(name: string): Promise<Trail[]> {
    const trails = await prisma.trail.findMany({
      where: { name: { contains: name } },
    })

    return trails.map(PrismaTrailMapper.toEntity)
  }

  async findAll(): Promise<Trail[]> {
    const trails = await prisma.trail.findMany()
    return trails.map(PrismaTrailMapper.toEntity)
  }

  async existsById(id: string): Promise<boolean> {
    const count = await prisma.trail.count({
      where: { id },
    })

    return count > 0
  }

  async create(trail: Trail): Promise<void> {
    const data = PrismaTrailMapper.toPrisma(trail)
    await prisma.trail.create({ data })
  }

  async save(trail: Trail): Promise<void> {
    const data = PrismaTrailMapper.toPrisma(trail)

    await prisma.trail.update({
      where: { id: trail.id.toString() },
      data,
    })
  }

  async delete(trail: Trail): Promise<void> {
    await prisma.trail.delete({
      where: { id: trail.id.toString() },
    })
  }

  async deleteById(id: string): Promise<void> {
    await prisma.trail.delete({
      where: { id },
    })
  }
}
