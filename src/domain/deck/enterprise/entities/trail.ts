import { Entity } from '@/core/entities/entity.ts'
import type { UniqueEntityID } from '@/core/entities/unique-entity-id.ts'
import type { Optional } from '@/core/types/optional.ts'
import type { Project } from './project.ts'
import type { Student } from './student.ts'

export interface TrailProps {
  name: string
  createdAt: Date
  updatedAt?: Date
  users?: Student[]
  projects?: Project[]
}

export class Trail extends Entity<TrailProps> {
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
    props: Optional<TrailProps, 'createdAt'>,
    id?: UniqueEntityID,
  ): Trail {
    return new Trail(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )
  }
}
