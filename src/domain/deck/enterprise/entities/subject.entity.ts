import { Entity } from '@/core/entities/entity.ts'
import type { UniqueEntityID } from '@/core/entities/unique-entity-id.ts'
import type { Optional } from '@/core/types/optional.ts'

export interface SubjectProps {
  name: string
  createdAt: Date
  updatedAt?: Date
}

export class Subject extends Entity<SubjectProps> {
  get name() {
    return this.props.name
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  set name(value: string) {
    this.props.name = value
    this.touch()
  }

  static create(
    props: Optional<SubjectProps, 'createdAt'>,
    id?: UniqueEntityID,
  ): Subject {
    return new Subject(
      {
        ...props,
        createdAt: new Date(),
      },
      id,
    )
  }
}
