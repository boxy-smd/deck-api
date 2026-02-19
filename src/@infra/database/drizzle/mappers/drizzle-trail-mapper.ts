import { InferSelectModel } from 'drizzle-orm'
import { Trail } from '@/@core/domain/projects/entities/trail'
import { UniqueEntityID } from '@/@shared/kernel/kernel/unique-entity-id'
import { trails } from '../schema'

type TrailRaw = InferSelectModel<typeof trails>

export class DrizzleTrailMapper {
  static toEntity(raw: TrailRaw): Trail {
    return Trail.reconstitute(
      {
        name: raw.name,
        color: raw.color,
        lightColor: raw.lightColor,
        darkColor: raw.darkColor,
        icon: raw.icon,
      },
      new UniqueEntityID(raw.id),
      raw.createdAt,
      raw.updatedAt,
    )
  }
}
