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
      name: `Trail_${Math.random().toString(36).substring(7)}`,
      ...override,
    },
    id,
  )

  return trail
}
