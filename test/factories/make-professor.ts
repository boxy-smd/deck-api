import {
  Professor,
  type ProfessorProps,
} from '@/domain/projects/enterprise/entities/professor.ts'
import type { UniqueEntityID } from '@/shared/kernel/unique-entity-id.ts'

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
