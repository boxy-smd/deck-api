import type { TrailsRepository } from '@/domain/deck/application/repositories/trails-repository.ts'
import type { Trail } from '@/domain/deck/enterprise/entities/trail.ts'
import { prisma } from '../client.ts'
import { PrismaTrailMapper } from '../mappers/prisma-trail-mapper.ts'

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

  async findAll(): Promise<Trail[]> {
    const trails = await prisma.trail.findMany()
    return trails.map(PrismaTrailMapper.toEntity)
  }

  async findManyByName(name: string): Promise<Trail[]> {
    const trails = await prisma.trail.findMany({
      where: { name: { contains: name } },
    })

    return trails.map(PrismaTrailMapper.toEntity)
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
}
