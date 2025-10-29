import {
  Professor,
  type ProfessorProps,
} from '@/@core/domain/projects/enterprise/entities/professor'
import type { UniqueEntityID } from '@/@shared/kernel/kernel/unique-entity-id'

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
