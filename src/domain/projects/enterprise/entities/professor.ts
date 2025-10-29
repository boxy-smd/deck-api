import { Entity } from '@/shared/kernel/entity'
import type { UniqueEntityID } from '@/shared/kernel/unique-entity-id'

export interface ProfessorProps {
  name: string
}

export class Professor extends Entity<ProfessorProps> {
  // --- 1. Factory methods ---
  static create(props: ProfessorProps, id?: UniqueEntityID): Professor {
    return new Professor(props, id)
  }

  public reconstitute(
    props: ProfessorProps,
    id: UniqueEntityID,
    createdAt: Date,
    updatedAt: Date,
  ): Professor {
    return new Professor(props, id, createdAt, updatedAt)
  }

  // --- 3. Getters ---
  get name() {
    return this.props.name
  }
}
