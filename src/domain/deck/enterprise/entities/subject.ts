import { Entity } from '@/core/entities/entity.ts'
import type { UniqueEntityID } from '@/core/entities/unique-entity-id.ts'
import type { Optional } from '@/core/types/optional.ts'
import type { SubjectType } from './enums/subject-type.ts'

export interface SubjectProps {
  code: string
  name: string
  workload: number
  semester: number
  type: SubjectType
  createdAt: Date
  updatedAt?: Date
}

export class Subject extends Entity<SubjectProps> {
  get name() {
    return this.props.name
  }

  get code() {
    return this.props.code
  }

  get workload() {
    return this.props.workload
  }

  get semester() {
    return this.props.semester
  }

  get type() {
    return this.props.type
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
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )
  }
}
