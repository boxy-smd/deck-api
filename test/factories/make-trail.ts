import {
  Trail,
  type TrailProps,
} from '@/domain/projects/enterprise/entities/trail.ts'
import type { UniqueEntityID } from '@/shared/kernel/unique-entity-id.ts'

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
