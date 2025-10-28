import { Entity } from '@/shared/kernel/entity.ts'
import type { UniqueEntityID } from '@/shared/kernel/unique-entity-id.ts'

export interface TrailProps {
  name: string
}

export class Trail extends Entity<TrailProps> {
  // --- 1. Factory methods ---
  static create(props: TrailProps, id?: UniqueEntityID): Trail {
    return new Trail(props, id)
  }

  public reconstitute(
    props: TrailProps,
    id: UniqueEntityID,
    createdAt: Date,
    updatedAt: Date,
  ): Trail {
    return new Trail(props, id, createdAt, updatedAt)
  }

  // --- 3. Getters ---
  get name() {
    return this.props.name
  }
}
