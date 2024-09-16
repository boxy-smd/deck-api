import type { UniqueEntityID } from '@/core/entities/unique-entity-id.ts'
import {
  Professor,
  type ProfessorProps,
} from '@/domain/deck/enterprise/entities/professor.ts'

export function makeProfessor(
  override: Partial<ProfessorProps> = {},
  id?: UniqueEntityID,
) {
  const professor = Professor.create(
    {
      name: 'Ticianne Darin',
      ...override,
    },
    id,
  )

  return professor
}
