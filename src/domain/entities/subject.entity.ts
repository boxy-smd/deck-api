import { Entity } from '../core/interfaces/entity.ts'
import type { Replace } from '../core/logic/replace.ts'

export interface SubjectProps {
  name: string
  code: string
  createdAt: Date
  updatedAt: Date
}

export class Subject extends Entity<SubjectProps> {
  get name(): string {
    return this.props.name
  }

  set name(value: string) {
    this.props.name = value
  }

  get code(): string {
    return this.props.code
  }

  set code(value: string) {
    this.props.code = value
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  get updatedAt(): Date {
    return this.props.updatedAt
  }

  set updatedAt(value: Date) {
    this.props.updatedAt = value
  }

  static create(
    props: Replace<
      SubjectProps,
      {
        createdAt?: Date
        updatedAt?: Date
      }
    >,
    id?: string,
  ): Subject {
    return new Subject(
      {
        ...props,
        createdAt: props.createdAt || new Date(),
        updatedAt: props.updatedAt || new Date(),
      },
      id,
    )
  }
}
