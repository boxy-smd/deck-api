import { Entity } from '@/core/entities/entity.ts'
import type { UniqueEntityID } from '@/core/entities/unique-entity-id.ts'
import type { Optional } from '@/core/types/optional.ts'

export interface TrailProps {
  name: string
  createdAt: Date
  updatedAt?: Date
}

export class Trail extends Entity<TrailProps> {
  get name(): string {
    return this.props.name
  }

  set name(value: string) {
    this.props.name = value
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  get updatedAt(): Date | undefined {
    return this.props.updatedAt
  }

  set updatedAt(value: Date) {
    this.props.updatedAt = value
  }

  static create(
    props: Optional<TrailProps, 'createdAt'>,
    id?: UniqueEntityID,
  ): Trail {
    return new Trail(
      {
        ...props,
        createdAt: new Date(),
      },
      id,
    )
  }
}
