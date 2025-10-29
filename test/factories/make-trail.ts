import {
  Trail,
  type TrailProps,
} from '@/@core/domain/projects/enterprise/entities/trail'
import type { UniqueEntityID } from '@/@shared/kernel/kernel/unique-entity-id'

export function makeTrail(
  override: Partial<TrailProps> = {},
  id?: UniqueEntityID,
) {
  const trail = Trail.create(
    {
      name: `Trail_${Math.random().toString(36).substring(7)}`,
      ...override,
    },
    id,
  )

  return trail
}
