import { Entity } from '@/@shared/kernel/kernel/entity'
import type { UniqueEntityID } from '@/@shared/kernel/kernel/unique-entity-id'

export interface ProfessorProps {
  name: string
}

export class Professor extends Entity<ProfessorProps> {
  // --- 1. Factory methods ---
  static create(props: ProfessorProps, id?: UniqueEntityID): Professor {
    return new Professor(props, id)
  }

  static reconstitute(
    props: ProfessorProps,
    id: UniqueEntityID,
    createdAt: Date,
    updatedAt: Date,
  ): Professor {
    const professor = Object.create(Professor.prototype)
    Object.assign(professor, {
      props,
      _id: id,
      _createdAt: createdAt,
      _updatedAt: updatedAt,
    })
    return professor
  }

  // --- 3. Getters ---
  get name() {
    return this.props.name
  }
}
