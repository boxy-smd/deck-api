import { Professor } from '@/@core/domain/projects/entities/professor'
import { UniqueEntityID } from '@/@shared/kernel/kernel/unique-entity-id'
import { InferSelectModel } from 'drizzle-orm'
import { professors } from '../schema'

type ProfessorRaw = InferSelectModel<typeof professors>

export class DrizzleProfessorMapper {
  static toEntity(raw: ProfessorRaw): Professor {
    return Professor.create(
      {
        name: raw.name,
      },
      new UniqueEntityID(raw.id),
    )
  }
}
