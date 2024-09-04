import type { UniqueEntityID } from '@/core/entities/unique-entity-id.ts'
import {
  Trail,
  type TrailProps,
} from '@/domain/deck/enterprise/entities/trail.ts'

export function makeTrail(
  override: Partial<TrailProps> = {},
  id?: UniqueEntityID,
) {
  const trail = Trail.create(
    {
      name: 'Sistemas',
      ...override,
    },
    id,
  )

  return trail
}
