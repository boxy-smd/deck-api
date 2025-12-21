import { randomUUID } from 'node:crypto'

export class UniqueEntityID<T = unknown> {
  private value: string

  toString() {
    return this.value
  }

  toValue() {
    return this.value
  }

  constructor(value?: string) {
    this.value = value ?? randomUUID()
  }

  static create(value?: string) {
    return new UniqueEntityID(value)
  }

  public equals(id: UniqueEntityID<T>) {
    return id.toValue() === this.value
  }
}
