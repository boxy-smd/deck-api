import type { Trail } from '@/domain/entities/trail.entity.ts'
import type {
  TrailsRepository,
  UpdateTrailRequest,
} from '@/domain/repositories/trails-repository.ts'
import { prisma } from '../client.ts'
import { TrailMapper } from '../mappers/trail-mapper.ts'

export class PrismaTrailsRepository implements TrailsRepository {
  async create(trail: Trail): Promise<Trail> {
    const raw = TrailMapper.toPersistence(trail)
    const createdRaw = await prisma.trail.create({ data: raw })
    return TrailMapper.toDomain(createdRaw)
  }

  async findById(id: string): Promise<Trail | null> {
    const raw = await prisma.trail.findUnique({ where: { id } })
    return raw ? TrailMapper.toDomain(raw) : null
  }

  async findByName(name: string): Promise<Trail | null> {
    const raw = await prisma.trail.findFirst({
      where: {
        name: {
          contains: name,
          mode: 'insensitive',
        },
      },
    })
    return raw ? TrailMapper.toDomain(raw) : null
  }

  async fetch(): Promise<Trail[]> {
    const trails = await prisma.trail.findMany()
    return trails.map(trail => TrailMapper.toDomain(trail))
  }

  async update(id: string, request: UpdateTrailRequest): Promise<Trail | null> {
    const raw = TrailMapper.toPersistenceUpdate(request)
    const updatedTrail = await prisma.trail.update({ where: { id }, data: raw })
    return TrailMapper.toDomain(updatedTrail)
  }

  async delete(id: string): Promise<void> {
    await prisma.trail.delete({ where: { id } })
  }
}
