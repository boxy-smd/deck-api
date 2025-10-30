import type { Prisma, Trail as TrailRaw } from '@prisma/client'

import { Trail } from '@/@core/domain/projects/entities/trail'
import { UniqueEntityID } from '@/@shared/kernel/kernel/unique-entity-id'

export class PrismaTrailMapper {
  static toEntity(raw: TrailRaw): Trail {
    return Trail.reconstitute(
      {
        name: raw.name,
      },
      new UniqueEntityID(raw.id),
      raw.createdAt,
      raw.updatedAt,
    )
  }

  static toPrisma(trail: Trail): Prisma.TrailUncheckedCreateInput {
    return {
      id: trail.id.toString(),
      name: trail.name,
      createdAt: trail.createdAt,
      updatedAt: trail.updatedAt ?? undefined,
    }
  }
}
