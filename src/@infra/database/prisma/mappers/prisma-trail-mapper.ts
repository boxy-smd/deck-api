import type { Prisma, Trail as TrailRaw } from '@prisma/client'

import { Trail } from '@/@core/domain/projects/enterprise/entities/trail'
import { UniqueEntityID } from '@/@shared/kernel/kernel/unique-entity-id'

// biome-ignore lint/complexity/noStaticOnlyClass: This class is a mapper and should have only static methods
export class PrismaTrailMapper {
  static toEntity(raw: TrailRaw): Trail {
    return Trail.create(
      {
        name: raw.name,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
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
