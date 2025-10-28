import type { UniqueEntityID } from './unique-entity-id.ts'

export interface DomainRepository<T> {
  findById(id: UniqueEntityID): Promise<T | null>

  findAll(): Promise<T[]>

  create(entity: T): Promise<void>

  save(entity: T): Promise<void>

  delete(entity: T): Promise<void>

  deleteById(id: UniqueEntityID): Promise<void>

  existsById(id: UniqueEntityID): Promise<boolean>
}
