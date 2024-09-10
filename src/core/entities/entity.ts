import { UniqueEntityID } from './unique-entity-id.ts'

export abstract class Entity<Props> {
  protected readonly _id: UniqueEntityID
  public readonly props: Props

  get id() {
    return this._id
  }

  protected constructor(props: Props, id?: UniqueEntityID) {
    this._id = id ?? new UniqueEntityID()
    this.props = props
  }

  public equals(entity: Entity<Props>): boolean {
    if (entity === this) {
      return true
    }

    if (entity.id === this._id) {
      return true
    }

    return false
  }
}
