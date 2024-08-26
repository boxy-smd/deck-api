import { Entity } from '../core/interfaces/entity.ts'
import type { Replace } from '../core/logic/replace.ts'

export interface TrailProps {
  name: string
  createdAt: Date
  updatedAt: Date
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

  get updatedAt(): Date {
    return this.props.updatedAt
  }

  set updatedAt(value: Date) {
    this.props.updatedAt = value
  }

  static create(
    props: Replace<
      TrailProps,
      {
        createdAt?: Date
        updatedAt?: Date
      }
    >,
    id?: string,
  ): Trail {
    return new Trail(
      {
        ...props,
        createdAt: props.createdAt || new Date(),
        updatedAt: props.updatedAt || new Date(),
      },
      id,
    )
  }
}
