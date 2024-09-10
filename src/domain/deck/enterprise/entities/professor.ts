import { Entity } from '@/core/entities/entity.ts'
import type { UniqueEntityID } from '@/core/entities/unique-entity-id.ts'
import type { Optional } from '@/core/types/optional.ts'
import type { Project } from './project.ts'

export interface ProfessorProps {
  name: string
  createdAt: Date
  updatedAt?: Date
  projects?: Project[]
}

export class Professor extends Entity<ProfessorProps> {
  get name(): string {
    return this.props.name
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  get updatedAt(): Date | undefined {
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
    props: Optional<ProfessorProps, 'createdAt'>,
    id?: UniqueEntityID,
  ): Professor {
    return new Professor(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )
  }
}
