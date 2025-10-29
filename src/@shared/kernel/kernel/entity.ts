import { UniqueEntityID } from './unique-entity-id'

export abstract class Entity<Props> {
  protected readonly _id: UniqueEntityID
  public readonly props: Props
  protected _createdAt: Date
  protected _updatedAt: Date

  get id() {
    return this._id
  }

  get createdAt() {
    return this._createdAt
  }

  set createdAt(value: Date) {
    this._createdAt = value
  }

  get updatedAt() {
    return this._updatedAt
  }

  set updatedAt(value: Date) {
    this._updatedAt = value
  }

  protected constructor(
    props: Props,
    id?: UniqueEntityID,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    this._id = id ?? new UniqueEntityID()
    this.props = props
    this._createdAt = createdAt ?? new Date()
    this._updatedAt = updatedAt ?? new Date()
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

  protected touch() {
    this._updatedAt = new Date()
  }
}
