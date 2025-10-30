import { Entity } from '@/@shared/kernel/kernel/entity'
import type { UniqueEntityID } from '@/@shared/kernel/kernel/unique-entity-id'

export interface TrailProps {
  name: string
}

export class Trail extends Entity<TrailProps> {
  // --- 1. Factory methods ---
  static create(props: TrailProps, id?: UniqueEntityID): Trail {
    return new Trail(props, id)
  }

  static reconstitute(
    props: TrailProps,
    id: UniqueEntityID,
    createdAt: Date,
    updatedAt: Date,
  ): Trail {
    const trail = Object.create(Trail.prototype)
    Object.assign(trail, {
      props,
      _id: id,
      _createdAt: createdAt,
      _updatedAt: updatedAt,
    })
    return trail
  }

  // --- 3. Getters ---
  get name() {
    return this.props.name
  }
}
