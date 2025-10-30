import type { Prisma, Professor as ProfessorRaw } from '@prisma/client'

import { Professor } from '@/@core/domain/projects/entities/professor'
import { UniqueEntityID } from '@/@shared/kernel/kernel/unique-entity-id'

export class PrismaProfessorMapper {
  static toEntity(raw: ProfessorRaw): Professor {
    return Professor.reconstitute(
      {
        name: raw.name,
      },
      new UniqueEntityID(raw.id),
      raw.createdAt,
      raw.updatedAt,
    )
  }

  static toPrisma(professor: Professor): Prisma.ProfessorUncheckedCreateInput {
    return {
      id: professor.id.toString(),
      name: professor.name,
      createdAt: professor.createdAt,
      updatedAt: professor.updatedAt ?? undefined,
    }
  }
}
