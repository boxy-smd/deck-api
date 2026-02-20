import type { Trail } from '@/@core/domain/projects/entities/trail'

const NON_SELECTABLE_TRAIL_NAMES = new Set(['smd'])

export function isSelectableTrail(trail: Trail): boolean {
  const normalizedName = trail.name.trim().toLowerCase()
  return !NON_SELECTABLE_TRAIL_NAMES.has(normalizedName)
}
