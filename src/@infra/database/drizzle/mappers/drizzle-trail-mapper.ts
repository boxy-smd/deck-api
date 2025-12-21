import { Trail } from '@/@core/domain/projects/entities/trail'
import { UniqueEntityID } from '@/@shared/kernel/kernel/unique-entity-id'
import { InferSelectModel } from 'drizzle-orm'
import { trails } from '../schema'

type TrailRaw = InferSelectModel<typeof trails>

export class DrizzleTrailMapper {
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
}
