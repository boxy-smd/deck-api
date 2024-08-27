import { Entity } from '../core/interfaces/entity.ts'
import type { Replace } from '../core/logic/replace.ts'

export interface ProfessorProps {
  name: string
  createdAt: Date
  updatedAt: Date
  projectIds: string[]
}

export class Professor extends Entity<ProfessorProps> {
  get name(): string {
    return this.props.name
  }

  set name(name: string) {
    this.props.name = name
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  get updatedAt(): Date {
    return this.props.updatedAt
  }

  set updatedAt(updatedAt: Date) {
    this.props.updatedAt = updatedAt
  }

  static create(
    props: Replace<
      ProfessorProps,
      {
        createdAt?: Date
        updatedAt?: Date
        projectIds?: string[]
      }
    >,
    id?: string,
  ): Professor {
    return new Professor(
      {
        ...props,
        createdAt: props.createdAt || new Date(),
        updatedAt: props.updatedAt || new Date(),
        projectIds: props.projectIds || [],
      },
      id,
    )
  }
}
