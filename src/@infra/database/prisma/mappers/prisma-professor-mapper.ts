import type { Prisma, Professor as ProfessorRaw } from '@prisma/client'

import { Professor } from '@/@core/domain/projects/enterprise/entities/professor'
import { UniqueEntityID } from '@/@shared/kernel/kernel/unique-entity-id'

// biome-ignore lint/complexity/noStaticOnlyClass: This class is a mapper and should have only static methods
export class PrismaProfessorMapper {
  static toEntity(raw: ProfessorRaw): Professor {
    return Professor.create(
      {
        name: raw.name,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
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
